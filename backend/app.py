from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)


def make_request(url, headers, params=None):
    """Function to handle make requests and handle errors"""
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Connection error occurred: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred: {req_err}")
    return None


def spotify_liked_songs(token, next_url=None):
    """Returns user's saved tracks data"""

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    params = {'limit': 50}
    url = next_url if next_url else 'https://api.spotify.com/v1/me/tracks'
    return make_request(url, headers, params)


def spotify_playlist_songs(token, playlist_id, next_url=None):
    """Returns playlist's songs data"""

    headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    params = {'limit': 50}
    url = next_url if next_url else f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks'
    return make_request(url, headers, params)


def spotify_fetch_songs(fetch_function, token, playlist_id=None):
    """Returns list of all songs from selected endpoint"""

    songs = []
    data = fetch_function(token) if playlist_id is None else fetch_function(token, playlist_id)

    if data and data.get('total') < 10000:
        songs.extend(data.get('items', []))
        next_items = data.get('next')
        while next_items:
            time.sleep(0.01)
            data = fetch_function(token) if playlist_id is None else fetch_function(token, playlist_id)
            if data:
                songs.extend(data.get('items', []))
                next_items = data.get('next')
            else:
                break

    return songs


@app.route('/spotify/transfer', methods=['POST'])
def transfer_spotify():
    data = request.get_json()
    playlist_id = data.get('id')
    operation_type = data.get('type')
    spotify_token = data.get('spotify_token')
    google_token = data.get('google_token')
    new_playlist_data = data.get('new_playlist_data')

    if playlist_id == 'liked':
        songs = spotify_fetch_songs(spotify_liked_songs, spotify_token)
    else:
        songs = spotify_fetch_songs(spotify_playlist_songs, spotify_token, playlist_id)

    if len(songs) < 1:
        return {'messages': 'Couldn\'t get songs. Your playlist is either empty or error occurred.'}, 400

    if operation_type == 'liked':
        pass

    return {}, 200


@app.route('/youtube/playlists', methods=['GET'])
def get_playlists():
    token = request.args.get('token')
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'part': 'snippet',
        'mine': 'true',
        'maxResults': 10
    }
    response = requests.get('https://www.googleapis.com/youtube/v3/playlists', headers=headers, params=params)
    return jsonify(response.json())


@app.route('/youtube/channels', methods=['GET'])
def get_channels():
    token = request.args.get('token')
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'part': 'contentDetails',
        'mine': 'true'
    }
    response = requests.get('https://www.googleapis.com/youtube/v3/channels', headers=headers, params=params)
    return jsonify(response.json())


if __name__ == '__main__':
    app.run(debug=True)
