import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import {LoginRequiredMessage} from "../components/LoginRequiredMessage";

export const YTMusicToSpotify: React.FC = () => {
    const isLoggedIn = localStorage.getItem('google_logged_in') === 'yes' && localStorage.getItem('spotify_logged_in') === 'yes'

    const getPlaylists = async (token: string) => {
        try {
            const response = await axios.get('http://localhost:5000/youtube/playlists', {
                params: {token}
            })
            console.log(response.data)
        } catch (err: any) {
            console.log('Error getting playlists', err.response)
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('google_access_token')
        if (token) {
            getPlaylists(token)
        }
    }, [])

    if (!isLoggedIn) {
        return <LoginRequiredMessage />
    }

    return (
        <div>

        </div>
    )
}