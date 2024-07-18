import React, {createContext, useContext, useState, ReactNode} from "react";

interface SpotifyUserData {
    id: string
    name: string
    email: string
    link: string
    country: string
    followers: number
    image: string | null
}

interface YTMusicUserData {
    email: string
    family_name: string
    given_name: string
    id: string
    name: string
    picture: string | null
    verified_email: boolean
}

interface UserContextType {
    spotifyData: SpotifyUserData | null
    setSpotifyData: React.Dispatch<React.SetStateAction<SpotifyUserData | null>>
    ytMusicData: YTMusicUserData | null
    setYtMusicData: React.Dispatch<React.SetStateAction<YTMusicUserData | null>>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface Props {
    children: ReactNode
}

export const UserProvider: React.FC<Props> = ({children}) => {
    const [spotifyData, setSpotifyData] = useState<SpotifyUserData | null>(null)
    const [ytMusicData, setYtMusicData] = useState<YTMusicUserData | null>(null)

    return (
        <UserContext.Provider value={{spotifyData, setSpotifyData, ytMusicData, setYtMusicData}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = (): UserContextType => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}