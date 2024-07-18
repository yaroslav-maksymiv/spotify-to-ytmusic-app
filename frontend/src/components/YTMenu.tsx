import {useGoogleLogin, googleLogout} from '@react-oauth/google';
import axios from 'axios';
import React, {useEffect} from 'react';
import {useUser} from "../hoc/UserProvider";


export const YTMenu: React.FC = () => {
    const accessToken = localStorage.getItem('google_access_token')
    const {ytMusicData: userData, setYtMusicData: setUserData} = useUser()

    const login = useGoogleLogin({
        onSuccess: async tokenResponse => {
            const token = tokenResponse.access_token
            localStorage.setItem('google_access_token', token)
            await getUserProfile(token)
        },
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    })

    const logout = () => {
        setUserData(null)
        localStorage.removeItem('google_access_token')
        localStorage.removeItem('google_logged_in')
        googleLogout()
    }

    const getUserProfile = async (token: string) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
            const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {headers})
            setUserData(response.data)
        } catch (error) {
            console.error('Error fetching user profile', error)
        }
    }

    useEffect(() => {
        if (userData) {
            localStorage.setItem('google_logged_in', 'yes')
        } else {
            localStorage.removeItem('google_logged_in')
        }
    }, [userData])

    useEffect(() => {
        if (accessToken) {
            getUserProfile(accessToken)
        }
    }, [accessToken])

    return (
        <div className="h-full text-white p-4 rounded-md border-2 border-red-500 bg-gray-950">
            {userData ? (
                <div>
                    <div className="flex gap-4">
                        <img className="rounded-full w-12 h-12 mt-6"
                             src={`${userData.picture ? userData.picture : 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}`}
                             alt=""/>
                        <div>
                            <div className="text-red-500 text-sm">Logged in with Google as</div>
                            <div className="text-2xl font-bold">{userData.name}</div>
                            <div className="">{userData.email}</div>
                            <button onClick={() => logout()} className="mt-5">Logout</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="text-lg mb-3">Login to YT Music to transfer your playlists</div>
                    <button onClick={() => login()}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Login with
                        Google
                    </button>
                </div>
            )}
        </div>
    )
}