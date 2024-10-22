import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { infuraRpcUrls, useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { AIRDROP_ADDRESS } from "@/lib/consts";
import { default as airdropABI } from "@/lib/abi/AIRDROP.json";
import { BigNumber } from "ethers";
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import airdropData from '@/lib/airdropData';

// @ts-ignore
import hourglass from '@images/loader.apng';
import { easeInOut } from "@popmotion/popcorn";

const abi = airdropABI.filter((item) => item.type == 'function');

const DataLoader = () => {
    return (
        <motion.div
            className="w-full"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
                duration: 2,
                repeat: 10,
                ease: 'easeInOut'
            }}
        >
            <div className="w-2/3 h-5 bg-zinc-800 rounded-lg mb-2"></div>
            <div className="w-1/2 h-3 bg-zinc-800 rounded-lg mb-3"></div>
            <div className="w-2/3 h-5 bg-zinc-800 rounded-lg mb-2"></div>
            <div className="w-1/2 h-3 bg-zinc-800 rounded-lg mb-3"></div>
            <div className="w-2/3 h-5 bg-zinc-800 rounded-lg mb-2"></div>
            <div className="w-1/2 h-3 bg-zinc-800 rounded-lg mb-3"></div>
            <div className="w-2/3 h-5 bg-zinc-800 rounded-lg mb-2"></div>
            <div className="w-1/2 h-3 bg-zinc-800 rounded-lg mb-3"></div>
        </motion.div>
    )
}

const VideoPlayer = ({ url} ) => {
    return(
        <video key={url} autoPlay loop muted className="rounded-xl w-32 sm:mt-0 mt-2 mb-2 shadow-xl">
            <source src={url} type="video/mp4" />
        </video>
    )
}

const RarityNumber = (props: any) => {
    // @todo Get trait from rarity.json
    const rarityNumber = 0;
    const getRarityInfo = (rarity) => {
        if(rarity <= 0.02) {
            return {
                "bg": "bg-[#c9a81a]", 
                "text": "text-zinc-900",
                "content": "Ultra",
            };
        } else if(rarity <= 0.05) {
            return {
                "bg": "bg-aqua", 
                "text": "text-foam",
                "content": "Super",
            };
        } else if(rarity <= 0.1) {
            return {
                "bg": "bg-indigo-700", 
                "text": "text-zinc-200",
                "content": "Uncommon",
            };
        } else {
            return {
                "bg": "bg-zinc-700", 
                "text": "text-zinc-200",
                "content": "Common",
            };
        }
    }

    const rarityInfo = getRarityInfo(props.trait);

    return (
        <div className="flex flex-col justify-start items-end">
            <span className="text-zinc-400 font-mono text-md">{props.trait * 100}%</span>
            <span className={`block px-2 py-1 text-xs cursor-default rounded-md shadow-2xl ${rarityInfo.bg} ${rarityInfo.text} font-header`}>{rarityInfo.content}</span>
        </div>
    )
}

const MortiCard = ( props: any ) => {
    const router = useRouter();

    const [mortiData, setMortiData] = useState(null);
    const [mortiVideoUrl, setMortiVideoUrl] = useState(null);

    const base = "absolute sm:w-96 w-64 sm:h-auto overflow-scroll max-h-[380px] flex flex-col justify-start items-center bg-zinc-900 p-4 transition-all duration-300 ease-in-out transform hover:scale-105 rounded-xl";

    const clickFunc = () => {
        if(props.selected < props.index) {
            props.incFunc();
        } else if(props.selected > props.index) {
            props.decFunc();
        } else {
            return;
        }
    }

    const { data: krakenNum } = useContractRead({
        addressOrName: AIRDROP_ADDRESS,
        contractInterface: abi,
        functionName: 'totalSupply',
        watch: true,
        onSuccess: (data) => {
            // @ts-ignore
            if(Number(id) > data) {
                // router.push('/404');
            }
        }
    });

    const { data } = useContractRead({
        addressOrName: AIRDROP_ADDRESS,
        contractInterface: abi,
        functionName: 'tokenURI',
        args: [props.mortiId],
    });

    useEffect(() => {
        if(data) {
            const res = fetch(`${data}`,{
                cache: 'no-cache'
            })
            .then((res) => res.json())
            .then((res) => {
                setMortiData(res)
                setMortiVideoUrl(res.image);
            });
        }
    }, [data]);

    const id = props.mortiId;

    return (
        <AnimatePresence>
            {props.selected == props.index && <motion.div
                className={base} onClick={clickFunc}
                initial={{
                    opacity: 0,
                    scale: 0.75,
                    x: (250 * props.dir)
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.75,
                    // x: (250 * props.dir * -1)
                }}
                transition={{
                    duration: 0.1,
                    delay: 0.1,
                    ease: [0, 0.71, 0.2, 1.05]
                }}
            >
                <h1 className="text-zinc-400 text-xl font-header">
                    Mortimarrow <span className="text-2xl text-foam">#{id}</span>
                </h1>
                <VideoPlayer url={mortiVideoUrl} />
                <div className="w-full flex flex-col justify-start items-start">
                    {/* <RarityNumber trait={0.005} />
                    <RarityNumber trait={0.03} />
                    <RarityNumber trait={0.13} />
                    <RarityNumber trait={0.34} /> */}
                    
                    {mortiData
                        ? mortiData.attributes.map((attr, index) => {
                            return (
                                <div key={index} className="w-full rounded-lg bg-black bg-opacity-20 text-left">
                                    <h1 className="text-mint md:text-xl text-md font-header">{attr.trait_type}</h1>
                                    <h1 className="text-zinc-200 md:text-2xl sm:text-xl text-md font-pixel">{attr.value}</h1>
                                </div>
                            )
                        })
                        : <DataLoader />
                    }
                </div>
            </motion.div>}
        </AnimatePresence>
    )
}

/**
 * This component creates a modal window when a user claims their airdrop. This modal will show carousel of cards, with each card representing each Mortimarrow they were airdropped.
 * Each card will show the image of the Mortimarrow, its traits, its rarities per trait, and a link to it on OpenSea.
 */
const ClaimCarousel = () => {
    const [ visible, setVisible ] = useState(false);
    const [ mortiIds, setMortiIds ] = useState([12, 15, 233, 1534]);
    const [ [selectedCard, direction], setSelectedCard ] = useState([0,1]);

    const incrementCard = () => {
        if(selectedCard < mortiIds.length - 1) {
            setSelectedCard([selectedCard + 1,1]);
        } else {
            setSelectedCard([0,1]); // Loop back to the first card
        }
    }

    const decrementCard = () => {
        if(selectedCard > 0) {
            setSelectedCard([selectedCard - 1,-1]);
        } else {
            setSelectedCard([mortiIds.length - 1,-1]); // Loop back to the end
        }
    }

    let cards = mortiIds.map((mortiId, index) => {
        return(
            <MortiCard mortiId={mortiId} index={index} key={index} selected={selectedCard} incFunc={incrementCard} decFunc={decrementCard} dir={direction} />
        );
    });

    return(
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 w-full h-full bg-black backdrop-blur-md bg-opacity-50 z-50 flex flex-col justify-center items-center"
                >
                    <motion.div
                        className="w-11/12 md:w-1/2 h-auto flex flex-col justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: [0, 0.71, 0.2, 1.01]
                        }}
                    >
                        <div className="w-full flex flex-col justify-center items-center">
                            <h1 className="text-zinc-300 sm:text-4xl text-2xl font-header">See your Mortis</h1>
                            <span className="text-zinc-400 font-mono sm:text-xl text-lg">
                                Viewing <motion.span>{selectedCard + 1}</motion.span>/{mortiIds.length}
                            </span>
                        </div>
                        {
                            /**
                             * @todo Need to add a loader while waiting for images
                             */
                        }
                        <div className="w-full sm:h-[500px] h-[400px] flex flex-row justify-center items-center relative">
                            <AnimateSharedLayout>
                                {cards}
                            </AnimateSharedLayout>
                        </div>

                        <div className="w-full flex flex-row justify-center items-center">
                            <button 
                                className="flex justify-center items-center rounded-full font-mono text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-all duration-75 hover:scale-105 active:scale-95 w-20 h-20 mr-6"
                                onClick={decrementCard}
                            >                    
                                <ArrowLeftIcon className="w-8 h-8" />
                            </button>
                            <button
                                className="flex justify-center items-center rounded-full font-mono text-zinc-400 hover:text-white border-2 border-zinc-900 bg-transparent hover:bg-zinc-800 transition-all duration-75 hover:scale-105 active:scale-95 w-20 h-20 mr-6"
                                onClick={() => setVisible(false)}
                            >
                                <XMarkIcon className="w-8 h-8" />
                            </button>
                            <button 
                                className="flex justify-center items-center rounded-full font-mono text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-all duration-75 hover:scale-105 active:scale-95 w-20 h-20"
                                onClick={incrementCard}
                            >                    
                                <ArrowRightIcon className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
            
    )
}

/**
 * This page allows a user to input a numerical ID (1-3000) and then be redirected to the corresponding kraken page (/kraken/[id])
 * @returns A JSX component that renders the search bar
 */
const Airdrop = () => {
    const [ connected, setConnected ] = useState(false);
    const [ inputBoxVal, setInputBoxVal ] = useState("");
    const [ checkAddress, setCheckAddress ] = useState(null);
    const [ mortisOwed, setMortisOwed ] = useState(0);

    const [ addressProof, setAddressProof ] = useState('');
    const [ isClaiming, setIsClaiming ] = useState(false);

    const [ hasClaimed, setHasClaimed ] = useState(false);

    const router = useRouter();

    const address = useAccount({
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
    });
    useEffect(() => {
        if(address.address) {
            setConnected(true);
        }
    }, [address]);

    const handleChange = (e) => {
        setInputBoxVal(e.target.value);
        // Reset check address & owed Mortis when user changes addresses
        setCheckAddress(null);
        setMortisOwed(0);
    };

    const { writeAsync, data: claimData } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: AIRDROP_ADDRESS,
        contractInterface: abi,
        functionName: 'claimTo',
        args: [checkAddress, mortisOwed, addressProof],
    });

    const claimTxn = useWaitForTransaction({
        hash: claimData?.hash,
        onSuccess: () => {
            setIsClaiming(false);
            setHasClaimed(true);
            setMortisOwed(0);
            toast.success('Claimed Mortimarrows!')
            // @todo Open modal

        },
        onError: () => {setIsClaiming(false); toast.error('Transaction failed')}
    });

    const checkAddressFunc = (address) => {
        setCheckAddress(address);
        // Check for validity
        if(airdropData[address] != null) {
            setMortisOwed(airdropData[address].amount);
            setAddressProof(airdropData[address].proof);
            // console.log(address, mortisOwed, addressProof);
        } else {
            setMortisOwed(0);
            setAddressProof('');
        }
    }
    // Check for claiming
    const checkAddressForAirdrop = useContractRead({
        addressOrName: AIRDROP_ADDRESS,
        contractInterface: abi,
        functionName: 'claimed',
        args: [checkAddress],
        onSuccess(data) {
            // console.log(data);
            // @ts-ignore
            setHasClaimed(data);
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsClaiming(true);
            console.log([checkAddress, mortisOwed, addressProof]);
            await writeAsync();
        } catch (e) {}
    };

    const validAddress = () => (inputBoxVal.length == 42 && inputBoxVal.startsWith("0x"));

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen h-full bg-murkyblack"
            style={{"background": "linear-gradient(to right, #000000cc 0,  #000000ff 50%, #000000cc 100%), center / cover no-repeat url('images/iconsBg2.png')"}}>
            <Head>
                <title>Mortimarrow Airdrop - Trident</title>
            </Head>
            <motion.div
                className="flex flex-col justify-center items-center max-w-2xl w-full h-full px-4"
                initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
				  duration: 0.6,
				  delay: 0.2,
				  ease: [0, 0.71, 0.2, 1.01]
				}}
            >
                <div className="flex flex-row md:flex-nowrap flex-wrap justify-center items-center">
                    <img className="w-36" src="images/MarrowExample.png" alt="Mortimarrow Example" />
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="md:text-6xl text-4xl font-header bg-gradient-to-br from-foam to-indigo-400 text-transparent bg-clip-text">Mortimarrow</h1>
                        <h1 className="md:text-5xl text-3xl font-header text-white">Airdrop</h1>
                    </div>
                </div>
                <span className="text-zinc-600 text-md text-center font-mono px-2 my-4">If you were holding a Pseudo Kraken on October 30th, you are eligible for an airdrop of 1 Mortimarrow per Pseudo Kraken.</span>
                {/* <div className="w-full box-border">
                    <div className={`w-auto p-4 mx-2 my-2 rounded-lg box-border bg-deepsea bg-opacity-50 flex flex-row justify-center`}>
                    </div>
                </div> */}
                <form onSubmit={handleSubmit} className="w-full flex flex-row flex-wrap justify-between">
                    <div className="w-full bg-zinc-900 h-auto rounded-lg pl-2 pr-2 pb-2 m-2 outline-none text-center">
                        {
                            checkAddress === inputBoxVal
                            ? (mortisOwed > 0 && !hasClaimed)
                                ? <span className="block my-3 text-zinc-600 text-md text-center font-mono"><span className="text-zinc-400">{mortisOwed}</span> Mortimarrows available for <span className={"text-zinc-400"}>{checkAddress.substring(0, 6)}...{checkAddress.substring(38)}</span></span>
                                : (hasClaimed)
                                    ? <span className="block my-3 text-lg text-center font-mono text-green-600">{checkAddress.substring(0, 6)}...{checkAddress.substring(38)} has already claimed!</span>
                                    : <span className="block my-3 text-lg text-center font-mono text-red-600">{checkAddress.substring(0, 6)}...{checkAddress.substring(38)} is unable to claim any Mortimarrows!</span>
                            : (validAddress())
                                ? <span className="block my-3 text-lg text-center font-mono text-zinc-600">Address valid. Check for eligibility.</span>
                                : <span className="block my-3 text-lg text-center font-mono text-red-600">{inputBoxVal === "" ? "Please enter an address" : "Invalid address!"}</span>
                        }
                        <input
                            className="w-full bg-black bg-opacity-20 hover:bg-zinc-800 transition-all duration-75 text-zinc-400 font-mono text-xl h-16 rounded-lg p-4 outline-none text-center"
                            type="text"
                            onChange={handleChange}
                            placeholder="Enter Address"
                        />
                    </div>
                    <div className="w-full flex flex-row justify-between md:flex-nowrap flex-wrap">
                        <button
                            onClick={() => checkAddressFunc(inputBoxVal)}
                            type="button"
                            disabled={!validAddress()}
                            className="w-full bg-deepsea hover:bg-aqua text-zinc-400 hover:text-white disabled:bg-zinc-900 disabled:hover:text-zinc-400
                                rounded-lg font-header text-xl p-1 m-2 h-16 transition-all duration-75"
                        >
                            Check Address
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={!validAddress() || (mortisOwed == 0) || isClaiming || hasClaimed}
                            className="w-full bg-deepsea hover:bg-aqua text-zinc-400 hover:text-white disabled:bg-zinc-900 disabled:hover:text-zinc-400
                                rounded-lg font-header text-xl p-1 m-2 h-16 transition-all duration-75"
                        >
                            {
                                isClaiming
                                ? <div className="w-full h-full flex justify-center items-center">
                                    <img className="max-h-full" src={hourglass} alt="Loading..." />
                                    <h1 className="ml-2 text-xl text-zinc-400 font-medium font-header">Loading...</h1>
                                </div> 
                                : "Claim to Address"
                            }
                        </button>
                    </div>
                </form>
            </motion.div>
            <ClaimCarousel />
        </div>
    );
}

export default Airdrop;