import React, {useEffect, useState} from "react";
import axios from "axios";
import {PlaylistItem} from "../components/PlaylistItem";
import {LoginRequiredMessage} from "../components/LoginRequiredMessage";
import {Loader} from "../components/Loader";
import {Link} from "react-router-dom";

interface PlaylistsData {
    next: string | null
    items: []
}

export const SpotifyPlaylists: React.FC = () => {
    const isLoggedIn = localStorage.getItem('google_logged_in') === 'yes' && localStorage.getItem('spotify_logged_in') === 'yes'
    const token = localStorage.getItem('access_token')

    const [loading, setLoading] = useState<boolean>(false)
    const [playlistsData, setPlaylistsData] = useState<PlaylistsData>()

    const getPlaylists = async (token: string, nextPageUrl?: string | null) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const url = nextPageUrl ? nextPageUrl : `https://api.spotify.com/v1/me/playlists`
            const response = await axios.get(url, {headers})
            return response.data
        } catch (err: any) {
            console.log('Error getting playlists', err.response)
        }
    }

    const handlePlaylists = (token: string, nextPageUrl?: string | null) => {
        setLoading(true)
        getPlaylists(token, nextPageUrl).then(data => {
            if (data) {
                setPlaylistsData({
                    next: data.next,
                    items: data.items
                })
            }
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (token) {
            handlePlaylists(token)
        }
    }, [])

    useEffect(() => {
        if (playlistsData?.next && token) {
            handlePlaylists(token, playlistsData.next)
        }
    }, [playlistsData?.next])

    const loadMorePlaylists = (nextLink: string, token: string) => {
        handlePlaylists(token, nextLink)
    }

    if (!isLoggedIn) {
        return <LoginRequiredMessage/>
    }

    return (
        <div className="py-12 min-h-screen">
            <div className="text-4xl text-white text-bold mb-8">Select Playlist</div>
            <div className="grid grid-cols-5 gap-4">
                {!loading &&
                    (<Link to={'/spotify/transfer/liked'}>
                        <PlaylistItem name={'Liked Songs'}
                                      image={'https://misc.scdn.co/liked-songs/liked-songs-300.png'}/>
                    </Link>)}
                {playlistsData?.items && playlistsData.items.map((item: any) => (
                    <Link to={`/spotify/transfer/${item.id}`} key={item.id}>
                        <PlaylistItem name={item.name} image={item.images ? item.images[0].url : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'}/>
                    </Link>
                ))}
            </div>
            {loading && (
                <div className="w-full flex items-center justify-center">
                    <Loader/>
                </div>
            )}
            {playlistsData?.next && token && !loading && (
                <button onClick={() => loadMorePlaylists(playlistsData?.next as string, token)}
                        className="btn text-white text-lg py-5">Load more</button>
            )}
        </div>
    )
}