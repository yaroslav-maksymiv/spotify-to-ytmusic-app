import React from "react"
import {BrowserRouter, Route, Router, Routes} from "react-router-dom"
import {Home} from "./screens/Home"
import {SpotifyLoginCallback} from "./screens/SpotifyLoginCallback"
import {YTMusicToSpotify} from "./screens/YTMusicToSpotify";
import {SpotifyPlaylists} from "./screens/SpotifyPlaylists";
import {UserProvider} from "./hoc/UserProvider";
import {SpotifyTransfer} from "./screens/SpotifyTransfer";

export const App: React.FC = () => {

    return (
        <body className="min-h-screen bg-gray-700 ">
        <div className="px-1 max-w-screen-lg mx-auto">
            <UserProvider>
                <BrowserRouter>
                    <div>
                        <Routes>
                            <Route path='/' element={<Home/>}/>
                            <Route path='/callback' element={<SpotifyLoginCallback/>}/>

                            <Route path='/ytmusic-to-spotify' element={<YTMusicToSpotify/>}/>

                            <Route path='/spotify-to-ytmusic' element={<SpotifyPlaylists/>}/>
                            <Route path='/spotify/transfer/:plId' element={<SpotifyTransfer/>}/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </UserProvider>
        </div>
        </body>
    )
}