import axios from "axios"
import queryString from "query-string"
import React, {useEffect} from "react"
import {spotifyLoginCallbackUri} from "../miscellaneous"
import {useUser} from "../hoc/UserProvider";


export const SpotifyMenu: React.FC = () => {
    const {spotifyData: userData, setSpotifyData: setUserData} = useUser()

    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')

    const getUserProfile = async (token: string) => {
        try {
            const headers = {'Authorization': `Bearer ${token}`}
            const response = await axios.get('https://api.spotify.com/v1/me', {headers})
            return response.data
        } catch (error) {
            throw new Error('Failed to fetch user profile')
        }
    }

    const refreshAccessToken = async (token: string) => {
        try {
            const headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            const body = queryString.stringify({
                grant_type: 'refresh_token',
                refresh_token: token,
                client_id: process.env.REACT_APP_CLIENT_ID_SPOTIFY,
                client_secret: process.env.REACT_APP_CLIENT_SECRET_SPOTIFY
            })

            const response = await axios.post('https://accounts.spotify.com/api/token', body, {headers})

            const {access_token, refresh_token} = response.data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            return true
        } catch (error) {
            console.error('Error refreshing access token', error)
            return false
        }
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (!accessToken) return

            try {
                const data = await getUserProfile(accessToken)
                setUserData({
                    id: data.id,
                    email: data.email,
                    country: data.country,
                    name: data.display_name,
                    link: data.href,
                    followers: data.followers.total,
                    image: data.images.length > 0 ? data.images[0].url : null
                })
            } catch (error) {
                if (refreshToken) {
                    const result = await refreshAccessToken(refreshToken)
                    if (result) {
                        const newAccessToken = localStorage.getItem('access_token')
                        if (newAccessToken) {
                            const data = await getUserProfile(newAccessToken)
                            setUserData({
                                id: data.id,
                                email: data.email,
                                country: data.country,
                                name: data.display_name,
                                link: data.href,
                                followers: data.followers.total,
                                image: data.images.length > 0 ? data.images[0].url : null
                            })
                        }
                    } else {
                        localStorage.removeItem('access_token')
                        localStorage.removeItem('refresh_token')
                    }
                }
            }
        }

        fetchUserData()
    }, [accessToken])

    useEffect(() => {
        if (userData) {
            localStorage.setItem('spotify_logged_in', 'yes')
        } else {
            localStorage.removeItem('spotify_logged_in')
        }
    }, [userData])

    const handleRedirect = () => {
        const params = queryString.stringify({
            response_type: 'code',
            client_id: process.env.REACT_APP_CLIENT_ID_SPOTIFY,
            scope: 'user-read-private user-read-email user-library-read playlist-read-private\n ' +
                'playlist-read-collaborative playlist-modify-public\n ' +
                'playlist-modify-private',
            redirect_uri: spotifyLoginCallbackUri,
            show_dialog: true
        })
        window.location.href = 'https://accounts.spotify.com/authorize?' + params
    }

    return (
        <div className="h-full text-white p-4 rounded-md border-2 border-green-600 bg-gray-950">
            {userData ? (
                <div>
                    <div className="flex items-center gap-4">
                        <img className="rounded-full w-12 h-12"
                             src={`${userData.image ? userData.image : 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}`}
                             alt=""/>
                        <div>
                            <div className="text-green-600 text-sm">Logged in with Spotify as</div>
                            <div className="text-2xl font-bold">{userData.name}</div>
                            <div className="">{userData.email}</div>
                            <button onClick={() => handleRedirect()} className="mt-5">Change Account</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="text-lg mb-3">Login to Spotify to transfer your playlists</div>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleRedirect}>Login to Spotify
                    </button>
                </div>
            )}
        </div>
    )
}