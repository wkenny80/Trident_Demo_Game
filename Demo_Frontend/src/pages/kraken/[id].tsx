import { useState } from 'react';
import { useRouter } from 'next/router'
import { useContractRead } from 'wagmi';
import { MODE, CONTRACT_ADDRESS } from '@/lib/consts';
import { default as pseudoABI } from '@/lib/abi/PSEUDO.json';
import Head from 'next/head'
import Image from 'next/image';
import { useEffect } from 'react';

const abi = pseudoABI.filter((item) => item.type == 'function');

const VideoPlayer = ({ url} ) => {
    return(
        <video key={url} autoPlay loop muted className="rounded-xl sm:mt-0 mt-2 shadow-xl w-full">
            <source src={url} type="video/mp4" />
        </video>
    )
}


const Kraken = () => {
    const router = useRouter()
    const { id } = router.query

    const [krakenData, setKrakenData] = useState(null);
    const [krakenVideoUrl, setKrakenVideoUrl] = useState(null);

    const { data: krakenNum } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'totalSupply',
        watch: true,
        onSuccess: (data) => {
            // @ts-ignore
            if(Number(id) > data) {
                router.push('/404');
            }
        }
    });

    const { data } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'tokenURI',
        args: [id],
    });

    useEffect(() => {
        if(data) {
            const res = fetch(`${data}`,{
                cache: 'no-cache'
            })
            .then((res) => res.json())
            .then((res) => {
                setKrakenData(res)
                setKrakenVideoUrl(res.image);
            });
        }
    }, [data]);

    let prevId = Number(id) - 1;
    let nextId = Number(id) + 1;

    if(prevId < 1) {
        prevId = Number(krakenNum) - 1;
    } else if(nextId > Number(krakenNum) - 1) {
        nextId = 1;
    }

    if(Number(id) < 0 || Number(id) > 2999) {
        router.push('/404');
    } else {
        return (
            <div className="w-screen min-h-screen bg-black flex flex-col justify-center items-center">
                <Head>
                    <title>Kraken {id} - Trident</title>
                </Head>
                <div className="lg:max-w-6xl w-full flex flex-row justify-between items-stretch sm:mt-0 mt-20">
                    <div 
                        className="bg-zinc-900 text-zinc-700 hover:bg-zinc-800 hover:text-white cursor-pointer md:p-10 sm:p-8 p-2 rounded-lg flex flex-col justify-center items-center mx-2"
                        onClick={() => router.push(`/kraken/${prevId}`)}
                    >
                        <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl select-none font-mono">{"◄"}</h1>
                    </div>
                    <div className="bg-zinc-900 w-full lg:p-10 md:p-8 sm:p-6 p-4 rounded-lg flex flex-col justify-start items-start">
                        <h1 className="w-full text-center lg:text-4xl md:text-3xl sm:text-2xl text-xl text-white font-header mb-2">Pseudo Kraken #{id}</h1>
                        {krakenData &&
                        <div className="w-full">
                            <h1 className="text-white md:text-xl text-lg font-header mt-3 mb-2">Attributes</h1>
                            <div className="flex sm:flex-row flex-col justify-between item flex-nowrap">
                                <div className="w-full">
                                    <div className="flex flex-col justify-center items-stretch flex-wrap">
                                        {krakenData.attributes.map((attr, index) => {
                                            return (
                                                <div key={index} className="w-full rounded-lg bg-black bg-opacity-20
                                                    lg:px-3 lg:py-8 md:py-6 px-2 py-3 mb-2 mr-2 flex flex-col justify-center items-center shadow-md">
                                                    <h1 className="text-mint md:text-xl text-md font-header">{attr.trait_type}</h1>
                                                    <h1 className="text-zinc-200 md:text-2xl sm:text-xl text-md font-pixel">{attr.value}</h1>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-col w-full sm:mt-0 sm:ml-2 mt-2 ml-0 lg:w-96 md:w-64 sm:w-48">
                                    <VideoPlayer url={krakenVideoUrl} />
                                    <div className="flex flex-col justify-start items-center mt-2">
                                        <a className="block w-full transition duration-100 text-center rounded-xl px-3 py-2 bg-indigo-700 hover:bg-indigo-600 font-header text-white shadow-xl mb-2" href={`https://opensea.io/assets/ethereum/0x6389936fac235a4fadf660ca5c428084115579bb/${id}`} target="_blank" rel="noreferrer">
                                            OpenSea    
                                        </a>
                                        <a className="block w-full transition duration-100 text-center rounded-xl px-3 py-2 bg-indigo-200 hover:bg-indigo-300 font-header text-zinc-900 shadow-xl mb-2" href={`https://sudoswap.xyz/#/browse/buy/0x6389936fac235a4fadf660ca5c428084115579bb`} target="_blank" rel="noreferrer">
                                            SudoSwap    
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                    <div 
                        className="bg-zinc-900 text-zinc-700 hover:bg-zinc-800 hover:text-white cursor-pointer md:p-10 sm:p-8 p-4 rounded-lg flex flex-col justify-center items-center mx-2"
                        onClick={() => router.push(`/kraken/${nextId}`)}
                    >
                        <h1 className="lg:text-4xl md:text-3xl sm:text-2xl text-xl select-none font-mono">{"►"}</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Kraken
