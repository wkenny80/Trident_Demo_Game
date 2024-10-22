import React, { useState, useEffect, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { WalletIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useAccount, useBalance, useContractRead } from 'wagmi';
import { Interface, FormatTypes } from 'ethers/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import vars from './sections/phaser/vars';
import { EventManager as events } from './sections/phaser/managers/EventManager';
import { MODE, CONTRACT_ADDRESS } from '@/lib/consts';
import { default as pseudoABI } from '@/lib/abi/PSEUDO.json';
import { BigNumber } from 'ethers';

const SelectKraken = dynamic(
    () => import('./sections/phaser/SelectKraken'),
    { ssr: false }
);

const KrakenViewer = ({ account }) => {
    const [krakenIDs, setKrakenIDs] = useState([]);

    const abi = pseudoABI.filter((item) => item.type == 'function');

    useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'tokensOfOwner',
        args: [account.address],
        watch: true,
        onSuccess: (data) => {
            const parsedData = data.map((item) => {
                return BigNumber.from(item).toNumber();
            });
            setKrakenIDs([...parsedData]);
            vars.krakenIDs = [...parsedData];
        }
    });

    const [selKrakenID, setSelKrakenID] = useState(vars.chosenKrakenID);

    const setSelectedKrakenID = (id) => {
        if(!krakenIDs.includes(id)) {
            setKrakenIDs([...krakenIDs, id]);
        }
        vars.krakenIDs = krakenIDs;
        vars.chosenKrakenID = id;
        setSelKrakenID(id);
    }

    let krakenComponents = krakenIDs.map((krakenID, i) => {
        const classes = `border-2 mt-3 mr-3 rounded-sm ${vars.chosenKrakenID === krakenID ? 'border-zinc-200 bg-zinc-800' : 'border-transparent'}`;
        return (
            <div key={i} className={classes} onClick={() => setSelectedKrakenID(krakenID)}><Kraken key={i} id={krakenID} /></div>
        )
    });
    // Should load a users krakens and map them as children
    return(
        <div className="w-full h-auto md:max-h-96 sm:max-h-full max-h-96 flex flex-col">
            <div className="mb-3 pb-3 border-b-2 border-zinc-800 flex flex-row overflow-scroll flex-wrap justify-start">{krakenIDs.length > 0
                ? krakenComponents
                : <div className="disabled:hidden flex-col">
                    <p className="text-zinc-300 font-mono text-md block mb-2 mt-3 w-full text-center">No Pseudo Krakens to display...</p>
                </div>}
            </div>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row flex-nowrap items-center">
                    <SelectKraken id={selKrakenID} />
                    <a className="block shadow-md w-auto bg-zinc-800 px-3 py-1 rounded-sm hover:bg-zinc-600 font-mono text-zinc-400 hover:text-white text-center mr-2" href="https://sudoswap.xyz/#/browse/buy/0x6389936fac235a4fadf660ca5c428084115579bb">SudoSwap</a>
                </div>
                {krakenIDs.length > 0 && <span className="text-md text-zinc-600 font-mono">Krakens <span className="text-zinc-200">{krakenIDs.length}</span></span>}
            </div>
        </div>
    )   
}

const Kraken = ({ id }: any) => {
    // Should fetch the image of the kraken from the metadata of the kraken at id
    return(
        <div className="relative lg:w-28 w-24 border-2 p-1 rounded-sm border-zinc-800 hover:border-zinc-700 text-transparent hover:text-zinc-700 flex justify-center items-center">
            <Image src={`/krakenData/images/${id}/8.png`} alt="Kraken" width={96} height={96} />
            <span className="absolute bottom-1 left-2 w-full text-xl font-pixel text-zinc-200">ID {id}</span>
            <span className="absolute bottom-1 right-1">
                <Link href="/kraken/[id]" as={`/kraken/${id}`}>
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 hover:text-white cursor-pointer" />
                </Link>
            </span>
        </div>
    )
}

const WalletItems = ({ walletCtrl, visible }) => {
    const account = useAccount();

    const variants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.1,
                ease: [0.6, 0.05, -0.01, 0.9],
            },
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.1,
                ease: [0.6, 0.05, -0.01, 0.9],
            },
        },
    };

    return(
        <AnimatePresence>
            {visible && <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={variants}
                style={{"transition": "all 100ms"}} className={`cursor-default absolute md:left-auto left-4 right-4 top-10 p-4 rounded-sm bg-zinc-900 shadow-2xl z-50 lg:w-2/5 md:w-1/2 w-auto`}>
                {!account.isConnected
                ? <div className="text-zinc-300 font-mono text-md block w-full text-center">You're not connected.</div>
                : <div className="w-full h-auto flex flex-row flex-wrap justify-start">
                    <div className="flex flex-row justify-between items-center w-full border-b-2 border-zinc-800">
                        <h1 className="text-zinc-300 text-xl block w-full font-header">Pseudo Krakens</h1>
                        <div onClick={() => walletCtrl(false)} className="text-zinc-400 hover:text-white">
                            <XMarkIcon className="w-5 h-5" />
                        </div>
                    </div>
                    <KrakenViewer account={account} />
                </div>}
            </motion.div>}
        </AnimatePresence>
    )
}

const Wallet = ({ setKrakenIds }) => {
    const [ walletOpen, setWalletOpen ] = useState(false);

    return(
        <div>
            <a onClick={() => setWalletOpen(!walletOpen)} className="flex justify-center items-center bg-zinc-900 w-8 h-8 transition-all duration-100 rounded-md shadow-2xl text-green-700 hover:bg-zinc-800 hover:text-green-500">
                <WalletIcon className="transition duration-100 h-5 w-5" />
            </a>
            <AnimatePresence>
                {walletOpen && <motion.div
                    className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-30`}
                    onClick={() => setWalletOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                ></motion.div>}
            </AnimatePresence>
            <WalletItems walletCtrl={setWalletOpen} visible={walletOpen} />
        </div>
    )
}

export default Wallet;