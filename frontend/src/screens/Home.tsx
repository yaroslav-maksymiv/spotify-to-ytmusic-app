import {SpotifyMenu} from "../components/SpotifyMenu"
import {YTMenu} from "../components/YTMenu"
import React from "react";
import {Link} from "react-router-dom";

export const Home: React.FC = () => {

    return (
        <div className="pt-12">
            <div className="flex gap-4 h-full mb-10">
                <div className="w-1/2 min-h-full">
                    <SpotifyMenu/>
                </div>
                <div className="w-1/2 min-h-full">
                    <YTMenu/>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Link to={'/spotify-to-ytmusic'}>
                    <div className="w-full p-3 bg-gray-900 hover:bg-gray-950 text-white rounded-md text-lg flex gap-10">
                        <div className="flex gap-3 items-center">
                            <img className="w-7 h-7" src={require('../assets/spotify.png')} alt=""/>
                            <div className="text-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                                </svg>
                            </div>
                            <img className="w-7 h-7" src={require('../assets/music.png')} alt=""/>
                        </div>
                        Spotify to YouTube Music: convert your playlists and favourites
                    </div>
                </Link>
                <Link to={'/ytmusic-to-spotify'}>
                    <div className="w-full p-3 bg-gray-900 hover:bg-gray-950 text-white rounded-md text-lg flex gap-10">
                        <div className="flex gap-3 items-center">
                            <img className="w-7 h-7" src={require('../assets/music.png')} alt=""/>
                            <div className="text-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"/>
                                </svg>
                            </div>
                            <img className="w-7 h-7" src={require('../assets/spotify.png')} alt=""/>
                        </div>
                        YouTube Music to Spotify: convert your playlists and favourites
                    </div>
                </Link>
            </div>
        </div>
    )
}