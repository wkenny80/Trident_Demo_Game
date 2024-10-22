import React from 'react';
import FooterSection from '@/components/sections/FooterSection';


const Disclaimer = () => {
    return(
        <>
            <div className="w-screen min-h-screen bg-gradient-to-b from-murkyblack to-black flex flex-col justify-center items-center">
                <div className="lg:max-w-6xl w-full flex flex-col justify-between items-stretch sm:mt-0 mt-20">
                    <div className="rounded-lg bg-zinc-900 p-8 mb-2 mx-8 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-mono text-white">Disclaimer</h1>
                    </div>
                    <div className="rounded-lg bg-zinc-900 bg-opacity-50 p-8 mb-2 mx-8 flex flex-col justify-center items-center">
                        <p className="text-md font-mono text-zinc-400">Pseudo Krakens are a digital pet for the Trident game with planned additional future utility in game. Purchase at your own risk.</p>
                    </div>
                </div>
            </div>
            <FooterSection />
        </>
    )
}

export default Disclaimer;