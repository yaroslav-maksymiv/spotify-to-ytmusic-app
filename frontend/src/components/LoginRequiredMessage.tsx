import React from "react";
import {Link} from "react-router-dom";


export const LoginRequiredMessage = () => {
    return (
        <div className="pt-12 h-screen flex flex-col justify-center items-center text-white text-bold">
            <div className="text-3xl mb-5">First you should login to YouTube Music and Spotify</div>
            <Link className="text-xl px-5 py-2 bg-gray-900 rounded-md w-fit" to={'/'}>Main page</Link>
        </div>
    )
}