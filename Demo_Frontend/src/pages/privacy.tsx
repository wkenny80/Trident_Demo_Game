import React from 'react';
import FooterSection from '@/components/sections/FooterSection';


const Privacy = () => {
    return(
        <>
            <div className="w-screen min-h-screen bg-gradient-to-b from-murkyblack to-black flex flex-col justify-center items-center">
                <div className="lg:max-w-6xl w-full flex flex-col justify-between items-stretch sm:mt-0 mt-20">
                    <div className="rounded-lg bg-zinc-900 p-8 mb-2 mx-8 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-mono text-white">Privacy Policy</h1>
                    </div>
                    <div className="rounded-lg bg-zinc-900 bg-opacity-50 p-8 mb-2 mx-8 flex flex-col justify-center items-center">
                        <p className="text-md font-mono text-zinc-400">We don't collect any personalized data, nor do we sell any data.</p>
                        <p className="text-md font-mono text-zinc-400">Have a good day :)</p>
                    </div>
                </div>
            </div>
            <FooterSection />
        </>
    )
}

export default Privacy;