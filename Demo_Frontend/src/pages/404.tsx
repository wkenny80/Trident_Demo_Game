import React from 'react'
import Link from 'next/link';
import Head from 'next/head';

const UhOh = () => {
    return(
        <div className="w-full h-screen bg-black flex flex-col justify-center items-center">
            <Head>
                <title>404 - Trident</title>
            </Head>
            <h1 className="text-6xl text-white drop-shadow-2xl font-header font-normal w-full text-center">The Void</h1>
            <p className="text-4xl text-foam font-pixel text-center mb-12" style={{"textShadow": "4px 4px 0 #000"}}>
                There's nothing here.
            </p>
            <Link href="/">
                <a className="flex justify-center items-center font-header text-lg text-zinc-200 w-40 h-12 bg-red-900 hover:bg-red-700 hover:text-white">Return Home</a>
            </Link>
        </div>
    )
}

export default UhOh;