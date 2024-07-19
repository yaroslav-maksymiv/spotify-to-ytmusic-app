import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {PlaylistCreateMenu} from "../components/PlaylistCreateMenu";
import axios from "axios";

interface PlaylistData {
    id: string
    image: string | null
    name: string
}

export interface CreatePlaylistData {
    title: string
    description: string
    isPublic: boolean
}

export const SpotifyTransfer: React.FC = () => {
    let {plId} = useParams()

    const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null)
    const [createPlaylistData, setCreatePlaylistData] = useState<CreatePlaylistData>({
        title: '',
        description: '',
        isPublic: false
    })
    const [transferSection, setTransferSection] = useState<'playlist' | 'liked'>('playlist')

    const getPlaylist = async (id: string) => {
        try {
            const headers = {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
            const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {headers})
            return response.data
        } catch (err: any) {
            console.log('Error getting playlist', err.response)
        }
    }

    useEffect(() => {
        if (plId === 'liked') {
            setPlaylistData({
                id: 'liked',
                image: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
                name: 'Liked Songs'
            })
        } else if (plId) {
            getPlaylist(plId).then(data => {
                setPlaylistData({
                    id: data.id,
                    image: data.images && data.images[0].url,
                    name: data.name
                })
            })
        }
    }, [plId])

    const handleTransfer = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json'
            }
            const data = JSON.stringify({
                spotify_token: localStorage.getItem('access_token'),
                google_token: localStorage.getItem('google_access_token'),
                type: transferSection,
                id: plId,
                new_playlist_data: createPlaylistData
            })
            console.log(data)
            const response = await axios.post(`http://127.0.0.1:5000/spotify/transfer`, data, {headers})
            console.log(response, 'response')
            return response.data
        } catch (err) {
            console.log('Error transferring')
        }
    }

    return (
        <div className="py-12 min-h-screen grid grid-cols-2 gap-5 text-white">
            <div>
                <div className="text-2xl font-bold mb-8">Playlist To Transfer From</div>
                {playlistData && (
                    <div>
                        <div
                            className="rounded-md p-10 bg-gray-300 text-gray-900 hover:shadow-gray-600 hover:shadow-lg  cursor-pointer flex flex-col items-center">
                            <img className="mb-8 rounded-md w-full h-full"
                                 src={playlistData.image ? playlistData.image : 'https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2'}
                                 alt=""/>
                            <div className="text-4xl text-bold">{playlistData.name}</div>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div className="mb-8 w-full grid grid-cols-2 gap-1">
                    <button onClick={() => setTransferSection('playlist')}
                            className={`btn text-white py-2 px-8 rounded-md ${transferSection === 'playlist' ? 'bg-gray-800' : 'bg-gray-600'}`}>Playlist
                    </button>
                    <button onClick={() => setTransferSection('liked')}
                            className={`btn text-white py-2 px-8 rounded-md ${transferSection === 'liked' ? 'bg-gray-800' : 'bg-gray-600'}`}>Liked
                    </button>
                </div>
                {transferSection === 'playlist' ? (
                    <PlaylistCreateMenu createPlaylistData={createPlaylistData}
                                        setCreatePlaylistData={setCreatePlaylistData}/>
                ) : (
                    <div className="mb-8">
                        <div className="text-2xl font-bold mb-2">Add To Liked Songs</div>
                        <div className="text-lg">Every song will be liked</div>
                    </div>
                )}

                <button onClick={() => handleTransfer()}
                        className="btn bg-gray-900 text-white text-lg py-2 px-8 rounded-md w-full">Transfer
                </button>
            </div>
        </div>
    )
}