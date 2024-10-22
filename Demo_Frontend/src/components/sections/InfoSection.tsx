import React from 'react'
import Link from 'next/link';
import { useAccount } from 'wagmi'
import Image from 'next/image';
import ts from 'tailwind-styled-components';

import krakenGif from '@images/kraken.gif';

const H1 = ts.h1`
    text-white
    font-header
    lg:text-4xl
    md:text-3xl
    text-2xl
`;

const P = ({ children }) => {
    return (
        <p 
            className="text-zinc-400
            font-pixel
            lg:text-3xl
            text-2xl
            md:mb-3
            mb-2"
        >
            {children}
        </p>
    )
};

const InfoText = ts.h1`
    text-foam
    font-header
    md:text-2xl
    sm:text-xl
    text-lg
`;

const DemoButton = ts.button`
    bg-deepsea
    hover:bg-aqua
    text-zinc-400
    hover:text-white
    font-header
    md:text-2xl
    text-xl
    md:py-3
    md:px-5
    py-2
    px-4
    mt-3
`;

const Info = () => {
    return(
        <div className="w-screen min-h-screen h-auto flex flex-col items-stretch justify-center bg-gradient-to-b from-black to-transparent">
            <div className="w-full h-full md:p-8 p-3 flex flex-row items-stretch justify-center md:flex-nowrap flex-wrap">
                <div className="md:w-1/2 w-full m-3 md:p-10 p-4 bg-black backdrop-blur-sm bg-opacity-40 rounded-lg">
                    <H1>Pseudo Krakens?</H1>
                    {/* <P>In celebration of our launch on Arbitrum Nova, and in honor of SudoSwap...</P> */}
                    <P>Yes, Pseudo Krakens.</P>
                    <P>Pseudo Krakens are your new in-game pet that follow your player, launching on <span className="text-zinc-500">Ethereum</span>.</P>
                    <P>Trident's Alpha release will render these pets in the MMO open-world universe. You will be able to choose which pet follows you at any given time.</P>
                    <P>The pseudo-kraken is known for its telepathy, manipulating crystalline structures to amplify its signals, akin to sonar on steroids. Pseudo-krakens communicate this way, as a hivemind. With their chain of agents dispersed throughout the universe, an ally is never too far.</P>
                    <Link href="/demo">
                        <a className="md:block hidden" href="#"><DemoButton>See in action</DemoButton></a>
                    </Link>
                </div>
                <div className="relative md:w-1/2 w-full m-4 md:p-10 p-4 bg-zinc-700 bg-opacity-0 rounded-lg">
                    <Image layout='responsive' src={krakenGif} />
                    <div className="absolute md:top-8 md:left-8 top-4 left-4">
                        <InfoText>2999 Krakens</InfoText>
                        <InfoText>0.03 ETH Each</InfoText>
                        <InfoText>YOUR INGAME COMPANION</InfoText>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info;