import React, { useState, useEffect, useRef, useMemo, Ref } from 'react';
import {
    chain, useAccount, useBalance,
    useContractRead, useBlockNumber,
    useWaitForTransaction, usePrepareContractWrite, useContractWrite
} from 'wagmi';
import { MODE, CONTRACT_ADDRESS } from '@/lib/consts';
import { default as pseudoABI } from '@/lib/abi/PSEUDO.json';
import { BigNumber, ethers } from 'ethers';
import { ToastContainer, toast } from 'react-toastify';
import ts from 'tailwind-styled-components';

// @ts-ignore
import hourglass from '@images/loader.apng';
// @ts-ignore
import barebonesIdle from '@images/barebones.apng';
// @ts-ignore
import krakenIdle from '@images/kraken.apng';
// @ts-ignore
import buttonClick from '@audio/button-click.wav';
// @ts-ignore
import buttonClick2 from '@audio/button-click-2.wav';

const abi = pseudoABI.filter((item) => item.type == 'function');


interface IMintButtonProps {
    selection: number;
    audioRef: any;
    connected: boolean;
    mintEnabled: boolean
}
/**
 * Mint Button
 * 
 * When clicked, begins a mint transaction with the chosen 
 * 
 * @param selection - 
 * @param audioRef -
 * @param connected - 
 * @returns MintButton
 */
const MintButton = ({ selection, audioRef, connected, mintEnabled }: IMintButtonProps) => {
    const [ loading, setLoading ] = useState(false);

    const [ buttonDisabled, setButtonDisabled ] = useState(false);
    /**
     * Mint Button should be disabled if the user isn't connected, if the button is loading, or if they haven't selected an amount yet
     */
    useEffect(() => {
        if (connected && !loading && selection != 0 && mintEnabled) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [connected, loading, selection, mintEnabled]);

    const classes = `
        w-full
        h-16
        bg-murkyblack
        backdrop-blur-lg
        bg-opacity-90
        border-2
        border-gray-2
        rounded-b-md
        font-header
        text-2xl
        font-medium
        text-zinc-400
        hover:bg-opacity-90
        hover:bg-deepsea
        hover:border-deepsea
        hover:text-foam
        active:bg-aqua
        active:border-white
        disabled:text-zinc-600
        disabled:bg-opacity-80
        disabled:bg-black
        disabled:border-gray-2
    `;

    /**
     * ================== Setup Mint Functions ==================
     */
    // const { config: mintFuncConfig, error: mintError, isError: mintIsError } = usePrepareContractWrite({
    //     addressOrName: CONTRACT_ADDRESS,
    //     contractInterface: abi,
    //     functionName: 'mint',
    //     overrides: {
    //         value: ethers.utils.parseEther('0.03')
    //     }
    // });
    // const { config: mintFiveFuncConfig, error: mintFiveError, isError: mintFiveIsError } = usePrepareContractWrite({
    //     addressOrName: CONTRACT_ADDRESS,
    //     contractInterface: abi,
    //     functionName: 'mintFive',
    //     overrides: {
    //         value: ethers.utils.parseEther('0.15')
    //     }
    // });
    // const { config: mintTenFuncConfig, error: mintTenError, isError: mintTenIsError } = usePrepareContractWrite({
    //     addressOrName: CONTRACT_ADDRESS,
    //     contractInterface: abi,
    //     functionName: 'mintFive',
    //     overrides: {
    //         value: ethers.utils.parseEther('0.3')
    //     }
    // });

    const { writeAsync: mintFunc, data: mintData } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'mint',
        overrides: {
            value: ethers.utils.parseEther('0.03')
        }
    });
    const mintTxn = useWaitForTransaction({
        hash: mintData?.hash,
        onSuccess: () => {setLoading(false); toast.success('Minted 1 kraken')},
        onError: () => {setLoading(false); toast.error('Transaction failed')}
    });

    const { writeAsync: mintFiveFunc, data: mintFiveData } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'mintFive',
        overrides: {
            value: ethers.utils.parseEther('0.15')
        }
    });
    const mintFiveTxn = useWaitForTransaction({
        hash: mintFiveData?.hash,
        onSuccess: () => {setLoading(false); toast.success('Minted 5 krakens')},
        onError: () => {setLoading(false); toast.error('Transaction failed')}
    });

    const { writeAsync: mintTenFunc, data: mintTenData } = useContractWrite({
        mode: 'recklesslyUnprepared',
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'mintTen',
        overrides: {
            value: ethers.utils.parseEther('0.3')
        }
    });
    const mintTenTxn = useWaitForTransaction({
        hash: mintTenData?.hash,
        onSuccess: () => {setLoading(false); toast.success('Minted 10 krakens')},
        onError: () => {setLoading(false); toast.error('Transaction failed')}
    });

    const clickFunc = () => {
        if(!buttonDisabled) {
            audioRef?.current?.play();
            switch(selection) {
                case 1:
                    mintFunc?.()
                        .then(() => console.log('Attempting to mint 1 kraken'))
                        .catch((e) => setLoading(false));
                    break;
                case 5:
                    mintFiveFunc?.()
                        .then(() => console.log('Attempting to mint 5 krakens'))
                        .catch((e) => setLoading(false));
                    break;
                case 10:
                    mintTenFunc?.()
                        .then(() => console.log('Attempting to mint 10 krakens'))
                        .catch((e) => setLoading(false));
                    break;
                default:
                    console.log('Invalid selection');
                    break;
            }
            setLoading(true);
        }
    }

    const loadingMessage = 'Loading...';
    let buttonMessage = (mintEnabled) ? 'Mint' : 'Minting Not Live';

    return(
        <div>
            <div className="w-full h-full absolute top-0 left-0 bg-zinc-900 bg-opacity-50 z-10 backdrop-blur-sm justify-center flex flex-col items-center">
                <span className="text-4xl text-white font-header">Sold Out!</span>
                <div className="flex flex-row mt-2">
                    <a className="px-2 py-1 rounded-md bg-indigo-200 hover:bg-indigo-300 text-zinc-900 text-2xl font-header" href="https://sudoswap.xyz/#/browse/buy/0x6389936fac235a4fadf660ca5c428084115579bb">SudoSwap</a>
                    <a className="px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-2xl font-header ml-2" href="https://opensea.io/collection/pseudo-krakens">OpenSea</a>
                </div>
            </div>
            <button className={classes} onClick={clickFunc} disabled={buttonDisabled}>
                {!loading
                    ? buttonMessage
                    : <div className="w-full h-full flex justify-center items-center">
                        <img className="max-h-full" src={hourglass} alt="Loading..." />
                        <h1 className="ml-2 text-xl text-zinc-400 font-medium font-header">{loadingMessage}</h1>
                    </div>
                }
            </button>
        </div>
    )
}

interface ISelectorButtonProps {
    selection: number;
    disabledBtns: boolean[];
    setSelection: (selection: number) => void;
    audioRef: any;
}

/**
 * Selector Buttons
 * 
 * A group of 3 buttons that allow the user to select how many krakens they want to mint
 * 
 * @param selection
 * @param disabledBtns
 * @param setSelection
 * @param audioRef
 * @returns SelectorButtons
 */
const SelectorButtons = ({ selection, disabledBtns, setSelection, audioRef }: ISelectorButtonProps) => {

    const sel1 = useRef(null);
    const sel2 = useRef(null);
    const sel3 = useRef(null);

    const setActive = (ref) => {
        ref.current.classList.add('bg-deepsea');
        ref.current.classList.add('text-white');
        ref.current.classList.replace('border-opacity-0', 'border-opacity-100');
        ref.current.classList.replace('border-murkyblack', 'border-white');
    }
    const setInactive = (ref) => {
        ref.current.classList.remove('bg-deepsea');
        ref.current.classList.remove('text-white');
        ref.current.classList.replace('border-opacity-100', 'border-opacity-0');
        ref.current.classList.replace('border-white', 'border-murkyblack');
    }

    useEffect(() => {
        if (selection === 1) {
            setActive(sel1);
            setInactive(sel2);
            setInactive(sel3);
        } else if (selection === 5) {
            setActive(sel2);
            setInactive(sel1);
            setInactive(sel3);
        } else if (selection === 10) {
            setActive(sel3);
            setInactive(sel1);
            setInactive(sel2);
        }
    }, [selection]);

    return(
        <div className="w-full h-8 flex flex-row justify-between items-center border-2 border-b-0 border-gray-2 rounded-t-md">
            <button
                ref={sel1}
                className="w-1/3 h-full bg-murkyblack backdrop-blur-lg bg-opacity-80 hover:bg-opacity-90 hover:bg-deepsea border-2 border-murkyblack
                    border-opacity-0 text-sm leading-0 font-header font-normal text-zinc-400 hover:text-white
                    disabled:text-zinc-600 disabled:bg-black disabled:bg-opacity-80 rounded-tl-md"
                onClick={() => {setSelection(1); audioRef.current?.play();}}
                disabled={disabledBtns[0]}
            >1</button>
            <button
                ref={sel2}
                className="w-1/3 h-full bg-murkyblack backdrop-blur-lg bg-opacity-80 hover:bg-opacity-90 hover:bg-deepsea border-2 border-murkyblack
                    border-opacity-0 text-sm leading-0 font-header font-normal text-zinc-400 hover:text-white
                    disabled:text-zinc-600 disabled:bg-black disabled:bg-opacity-80"
                onClick={() => {setSelection(5); audioRef.current?.play();}}
                disabled={disabledBtns[1]}
            >5</button>
            <button
                ref={sel3}
                className="w-1/3 h-full bg-murkyblack backdrop-blur-lg bg-opacity-80 hover:bg-opacity-90 hover:bg-deepsea border-2 border-murkyblack
                    border-opacity-0 text-sm leading-0 font-header font-normal text-zinc-400 hover:text-white
                    disabled:text-zinc-600 disabled:bg-black disabled:bg-opacity-80 rounded-tr-md"
                onClick={() => {setSelection(10); audioRef.current?.play();}}
                disabled={disabledBtns[2]}
            >10</button>
        </div>
    )
}

/**
 * Displays basic NFT and wallet info: user balance of ETH, and 
 * @returns Information Section
 */
const Information = ({ balance, remKrakens }) => {
    const contractLink = `https://etherscan.io/address/${CONTRACT_ADDRESS}`;

    return (
        <div className="w-full h-7 bg-murkyblack bg-opacity-40 backdrop-blur-md flex items-center justify-center">
            <span className="text-zinc-600 text-xl font-pixel">
                {/* 0.03 ETH EACH */}
                {/* {remKrakens && <span>&nbsp;·&nbsp;{remKrakens}/2999 Remaining</span>} */}
                {/* {isSuccess && <span>&nbsp;·&nbsp;{`${(data.decimals > 0) ? data.formatted.substring(0, 5) : 0} ETH`}</span>} */}
                {/* {balance && <span>&nbsp;·&nbsp;{balance} ETH</span>} */}
                SOLD OUT&nbsp;·&nbsp;<a className="hover:underline" href={contractLink}>Contract</a>
            </span>
        </div>
    )
}

const MintPanel = () => {
    const [ connected, setConnected ] = useState(false);
    const [ balance, setBalance ] = useState(null);
    const [ selButtonsDisabled, setSelButtonsDisabled ] = useState([false, false, false]);
    const [ selection, setSelection ] = useState(0);
    const [ mintEnabled, setMintEnabled ] = useState(false);
    const [ remKrakens, setRemKrakens ] = useState(null);

    const btnClick = useRef<HTMLAudioElement | undefined>(
		typeof Audio !== "undefined" ? new Audio("") : undefined
    );
    const btnClick2 = useRef<HTMLAudioElement | undefined>(
        typeof Audio !== "undefined" ? new Audio("") : undefined
    );

    // @ts-ignore
    const chosenChain = (MODE == 'prod' ? chain.mainnet : chain.goerli);
    
    const address = useAccount({
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
    });
    useEffect(() => {
        if(address.address) {
            setConnected(true);
        }
    }, [address]);

    // Cases where user can't mint:
    // Not enough ETH
    // Not connected to wallet
    // Minting is disabled
    // All krakens have been minted
    
    // MINT ENABLED STATUS
    const { data: mintStatus } = useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'getMintEnabled',
        watch: true,
        onSuccess(data) {
            // @ts-ignore
            setMintEnabled(data);
        },
    });

    // USER BALANCE
    const { data, isError, isLoading, isSuccess } = useBalance({
        addressOrName: address.address,
        chainId: chosenChain.id,
        watch: true,
        onSuccess(data) {
            setBalance(data.formatted.substring(0, 5));
        }
    });

    // KRAKEN MINT SUPPLY
    useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'totalMinted',
        watch: true,
        onSuccess: (data) => {
            setRemKrakens(2999 - BigNumber.from(data).toNumber() - 1);
        }
    });

    /**
     * To make sure the UI accurately reflects the state of the contract, we need to watch for changes to the contract state.
     * We will watch for changes to the total supply of minted krakens, and the mintingEnabled state.
     * Additionally, we will watch for 
     */
    useEffect(() => {
        // If minting is disabled, OR there are 0 krakens left, disable the selection buttons (and the mint button by extension)
        if(!mintEnabled || remKrakens <= 0 || balance < 0.03) {
            setSelButtonsDisabled([true, true, true]);
            setSelection(0);
        } else {
            // If there's fewer than 10 krakens remaining, disable the option to mint 10.
            if(remKrakens < 10 || balance < 0.3) {
                setSelButtonsDisabled([false, false, true]);
                setSelection(0);
            }
            if(remKrakens < 5 || balance < 0.15) {
                setSelButtonsDisabled([false, true, true]);
                setSelection(0);
            } else {
                setSelButtonsDisabled([false, false, false]);
            }
        }
    }, [mintEnabled, remKrakens, balance]);

    return(
        <div className="lg:max-w-xl md:max-w-lg max-w-sm w-full h-full flex flex-col justify-between z-10">
            {/* Button Audios */}
            <audio ref={btnClick} src={buttonClick} loop={false}></audio>
            <audio ref={btnClick2} src={buttonClick2} loop={false}></audio>
            <div className="sm:mt-0 mt-6">
                <h1 className="md:text-6xl text-4xl text-white drop-shadow-2xl font-header font-normal w-full text-center mb-2" style={{"textShadow": "8px 8px 0 rgba(0,0,0,0.7)"}}>Pseudo Krakens</h1>
                <p className="md:text-4xl text-2xl text-foam font-pixel text-center" style={{"textShadow": "4px 4px 0 #000"}}>
                    They're up to no good.
                </p>
            </div>
            {/** Button Group */}
            <div className="w-full">
                <div className="relative flex flex-row justify-center items-end z-10">
                    <img src={krakenIdle} alt="Barebones Idle" />
                    <img src={barebonesIdle} alt="Barebones Idle" />
                </div>
                <div className="relative z-20">
                    <SelectorButtons audioRef={btnClick} selection={selection} disabledBtns={selButtonsDisabled} setSelection={setSelection} />
                    <div>
                        <MintButton audioRef={btnClick2} selection={selection} mintEnabled={mintEnabled} connected={connected} />
                        {/** Information */}
                        <Information balance={balance} remKrakens={remKrakens} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MintPanel;