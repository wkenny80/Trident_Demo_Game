import React from 'react';
import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { MODE, CONTRACT_ADDRESS } from '@/lib/consts';
import { default as pseudoABI } from '@/lib/abi/PSEUDO.json';
import dynamic from 'next/dynamic';
import { BigNumber } from 'ethers';
import vars from './phaser/vars';
// import PhaserGame from './phaser/index';

const abi = pseudoABI.filter((item) => item.type == 'function');

// @ts-ignore
import hourglass from '@images/loader.apng';

// IonPhaser causes a problem with NextJS SSR. Need to import component like so so that it can be client rendered only.
const PhaserGame = dynamic(
    () => import('./phaser/index'),
    { ssr: false }
);

interface IControlProps {
    pressKey: string;
    action: string;
    wide?: boolean;
}

const Control = ({ pressKey, action, wide = false }: IControlProps) => {
    const classes = (wide) ? "w-full" : "w-1/2";

    return(
        <div className={`${wide ? "md:w-52 w-44" : "md:w-24 w-16"} md:h-28 h-20 flex flex-col justify-start items-start`}>
            <h1 className="text-zinc-400 font-pixel md:text-2xl text-xl mb-1">{action}</h1>
            <div className={`${wide ? "w-48" : "md:w-16 w-12"} md:h-16 h-12 border-2 border-zinc-400 flex justify-center items-center bg-black shadow-xl`}>
                <span className="text-zinc-200 font-header md:text-2xl text-lg">{pressKey}</span>
            </div>
        </div>
    );
}

const Demo = () => {
    const [connected, setConnected] = useState(false);
    const account = useAccount();

    const [hasKrakens, setHasKrakens] = useState(null);

    useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'balanceOf',
        args: [account.address],
        onSuccess: (data) => {
            if(BigNumber.from(data).toNumber() > 0) {
                setHasKrakens(true);
            } else {
                setHasKrakens(false);
            }
        }
    });

    // useEffect(() => {
    //     console.log(krakenBal)
    // }, [krakenBal]);

    useEffect(() => {
        if (account.isConnected) {
            setConnected(true);
        } else {
            setConnected(false);
        }
    }, [account.isConnected]);

    let blockMsg = '';

    return(
        <div
            className="w-screen min-h-screen h-auto md:p-12 sm:p-8 p-6 bg-gradient-to-b from-transparent to-black
            overflow-hidden rounded-lg flex flex-col justify-center items-stretch"
        >
            <div id="demo" className="relative w-full min-h-screen flex flex-col items-center justify-center bg-murkyblack shadow-2xl sm:p-0 p-2 sm:mt-0 mt-6">
                {!connected
                && <div className="absolute top-0 left-0 bg-black w-full h-full flex flex-col justify-center items-center rounded-t-lg">
                    <h1 className="md:text-2xl sm:text-xl text-lg text-white font-header text-center mb-2">You must be connected to view your<br />pseudo krakens.</h1>
                </div>}
                {
                    hasKrakens === null
                    ? <img className="max-h-full" src={hourglass} alt="Loading..." />
                    : hasKrakens === true
                        ? <PhaserGame isConnected={connected} />
                        : <div className="w-full h-full flex flex-col justify-center items-center rounded-t-lg">
                            <h1 className="md:text-2xl sm:text-xl text-lg text-white font-header text-center mb-2">You have no pseudo krakens.</h1>
                        </div>
                }
                <div className="absolute top-0 left-0 bg-black pointer-events-none w-full h-full md:hidden flex flex-col justify-center items-center rounded-t-lg">
                    <h1 className="md:text-2xl sm:text-xl text-lg text-white font-header text-center mb-2">Experience only viewable on desktop</h1>
                </div>
            </div>
            <div className="bg-zinc-900 w-full p-8 rounded-b-lg flex flex-row lg:flex-nowrap flex-wrap">
                <div className="lg:w-1/2 w-full flex flex-col justify-start items-stretch">
                    <h1 className="text-white font-header text-2xl">Controls</h1>
                    <div className="flex flex-row flex-wrap">
                        <Control pressKey={"W"} action={"Jump"} />
                        <Control pressKey={"A"} action={"Run Left"} />
                        <Control pressKey={"S"} action={"Roll"} />
                        <Control pressKey={"D"} action={"Run Right"} />
                        <Control pressKey={"P"} action={"Restart"} />
                        <Control pressKey={"1"} action={"Katana"} />
                        <Control pressKey={"2"} action={"Conch"} />
                        <Control pressKey={"SPACE"} action={"Attack"} wide />
                    </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col justify-start items-stretch">
                    <h1 className="text-white font-header text-2xl lg:mt-0 mt-2">Intro</h1>
                    <p className="text-zinc-400 font-pixel text-2xl mb-3">
                        We've created this demo so you can hang out with any one of your owned pseudo krakens and see them in game before we launch the official MMO game alpha.
                    </p>
                    <p className="text-zinc-400 font-pixel text-2xl mb-3">
                        Explore the map with the help of your trusty kraken companion. You play as the new character, Barebones.
                    </p>
                    </div>
            </div>
        </div>
    )
}

export default Demo;