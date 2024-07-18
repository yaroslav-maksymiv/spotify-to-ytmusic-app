import React from "react";

interface Props {
    name: string
    image: string
}

export const PlaylistItem: React.FC<Props> = ({name, image}) => {
    return (
        <div className="rounded-md p-5 bg-gray-300 text-gray-900 hover:shadow-gray-600 hover:shadow-lg  cursor-pointer">
            <img className="mb-2 rounded-md" src={image} alt=""/>
            <div className="text-xl text-bold">{name}</div>
        </div>
    )
}