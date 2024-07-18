import axios from "axios";
import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Base64} from 'js-base64';
import {spotifyLoginCallbackUri} from "../miscellaneous";

export const SpotifyLoginCallback: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const code = searchParams.get('code')
    const error = searchParams.get('error')

    const getAccessToken = async (code: string) => {
        try {
            const data_to_base64 = Base64.encode(`${process.env.REACT_APP_CLIENT_ID_SPOTIFY}:${process.env.REACT_APP_CLIENT_SECRET_SPOTIFY}`)
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + data_to_base64
            }
            const data = {
                code: code,
                redirect_uri: spotifyLoginCallbackUri,
                grant_type: 'authorization_code'
            }
            const response = await axios.post('https://accounts.spotify.com/api/token', data, {headers})

            if (response && response.data) {
                localStorage.setItem('access_token', response.data.access_token)
                localStorage.setItem('refresh_token', response.data.refresh_token)
            } else {
                console.error('Invalid response structure', response)
            }
        } catch (err: any) {
            console.error('Error during token exchange', err.response)
        } finally {
            navigate('/')
        }
    }

    if (code && !error) {
        getAccessToken(code)
    } else if (error) {
        console.error('Error in authorization', error)
    }

    return (
        <div>You will be redirected in a second</div>
    )
}