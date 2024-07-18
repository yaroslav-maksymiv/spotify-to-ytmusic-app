import React from "react";

export const Loader: React.FC = () => {
    return (
        <img className='w-12 h-12' src={require('../assets/loader.svg').default} alt=""/>
    )
}