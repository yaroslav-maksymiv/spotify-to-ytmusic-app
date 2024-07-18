from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)


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
    app.run()
