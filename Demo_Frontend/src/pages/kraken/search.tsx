import React, { useState } from "react";
import { useRouter } from "next/router";
import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS } from "@/lib/consts";
import { default as pseudoABI } from "@/lib/abi/PSEUDO.json";
import { BigNumber } from "ethers";

const abi = pseudoABI.filter((item) => item.type == 'function');

/**
 * This page allows a user to input a numerical ID (1-3000) and then be redirected to the corresponding kraken page (/kraken/[id])
 * @returns A JSX component that renders the search bar
 */
const Search = () => {
    const [krakenId, setKrakenId] = useState("");
    const [krakensMinted, setKrakensMinted] = useState(0);
    const router = useRouter();

    useContractRead({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'totalMinted',
        args: [],
        onSuccess(data) {
            setKrakensMinted(BigNumber.from(data).toNumber());
        }
    });

    const handleChange = (e) => {
        if((e.target.value >= 1 && e.target.value <= 2999) || e.target.value.length == 0) {
            setKrakenId(e.target.value);
        } else {
            return;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push(`/kraken/${krakenId}`);
    };

    const validRange = () => {
        if(Number(krakenId) >= 1 && Number(krakenId) <= 2999 && Number(krakenId) <= krakensMinted - 1) {
            return true;
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen h-full">
            <div className="flex flex-col justify-center items-center max-w-2xl w-full h-full">
                <h1 className="text-4xl font-header text-white">Search</h1>
                <span className="text-zinc-600 text-md font-mono">{krakensMinted} Minted</span>
                <form onSubmit={handleSubmit} className="w-full flex flex-row sm:flex-nowrap flex-wrap px-4 justify-between">
                    <input
                        className="w-full bg-zinc-900 text-zinc-400 font-mono text-xl h-16 rounded-lg p-4 m-2 outline-none"
                        type="number"
                        min="1"
                        max="2999"
                        value={krakenId}
                        onChange={handleChange}
                        placeholder="Enter ID"
                    />
                    <button
                        onClick={handleSubmit}
                        type="submit"
                        disabled={!validRange()}
                        className="bg-deepsea hover:bg-aqua text-zinc-400 hover:text-white disabled:bg-zinc-900 disabled:hover:text-zinc-400
                            rounded-lg font-header sm:w-32 w-full text-xl p-4 m-2 h-16"
                    >
                        Go
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Search;