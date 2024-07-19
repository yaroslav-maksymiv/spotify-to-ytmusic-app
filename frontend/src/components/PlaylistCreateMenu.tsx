import React from "react";
import {CreatePlaylistData} from "../screens/SpotifyTransfer";

interface Props {
    createPlaylistData: CreatePlaylistData,
    setCreatePlaylistData: React.Dispatch<React.SetStateAction<CreatePlaylistData>>
}

export const PlaylistCreateMenu: React.FC<Props> = ({createPlaylistData, setCreatePlaylistData}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setCreatePlaylistData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = e.target
        setCreatePlaylistData(prevData => ({
            ...prevData,
            [name]: checked
        }))
    }

    return (
        <div>
            <div className="text-2xl font-bold mb-8">Playlist To Transfer To</div>
            <div className="mb-3">
                <label htmlFor="title" className="block font-medium leading-6">Title</label>
                <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                        <input type="text" name="title" id="title" autoComplete="title"
                               className="block border-0 bg-transparent py-1.5 px-3 outline-none placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                               placeholder="Title for your playlist"
                               value={createPlaylistData.title}
                               onChange={handleChange}/>
                    </div>
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="block font-medium leading-6">Description*</label>
                <div className="mt-2">
                    <textarea id="description" name="description" rows={3}
                              className="block w-full rounded-md border-0 bg-transparent py-1.5 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                              value={createPlaylistData.description}
                              onChange={handleChange}></textarea>
                </div>
            </div>
            <div className="mb-5">
                <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                        <input id="isPublic" name="isPublic" type="checkbox"
                               className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                               checked={createPlaylistData.isPublic}
                               onChange={handleCheckboxChange}/>
                    </div>
                    <div className="text-sm leading-6">
                        <label htmlFor="isPublic" className="font-medium">Public*</label>
                        <p className="text-gray-200">Would you like everyone to be able to see your playlist?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}