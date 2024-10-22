import React, { useState, useRef, useEffect } from 'react';
import { IonPhaser } from "@ion-phaser/react";
import config from "./config";
import vars from './vars';
import { EventManager as events } from './managers/EventManager';
// import "./style.scss";

import DemoScene from "./scenes/Demo";
import BootScene from './scenes/Boot';

const PhaserGame = ({ isConnected }: { isConnected: boolean }) => {
    const gameRef = useRef(null);
    const startBtnRef = useRef(null);
    
    const [initialize, setInitialize] = useState(false);

    function startGame() {
        events.removeAllListeners();
        console.log("Game started");
        setInitialize(true);
    };

    useEffect(() => {
        events.removeAllListeners();
        destroy();
    }, [isConnected]);

    function destroy() {
        if (gameRef.current) {
            gameRef.current.destroy();
        }
        setInitialize(false);
    };

    return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div id="phaser-wrapper" className="w-full h-full flex flex-col justify-center items-center rounded-lg">
            <span className={!initialize ? 'text-white text-4xl font-pixel text-center w-full mb-6' : 'hidden'}>
                Click on the wallet in the upper-right
                <br />corner to see your new krakens.
                <br />Select a kraken and click "View Kraken"
                <br />to see how it looks in-game.
            </span>
            <button
                className={
                    !initialize
                    ? 'w-64 h-16 bg-deepsea text-zinc-400 hover:bg-aqua hover:text-white font-header text-3xl sm:block hidden'
                    : 'hidden'
                }
                onClick={() => startGame()}
                ref={startBtnRef}
            >
                Start
            </button>
            <IonPhaser
                ref={gameRef}
                game={Object.assign(config, {
                    scene: [
                        BootScene,
                        DemoScene,
                    ]
                })}
                initialize={initialize}
            />
        </div>
    </div>
    );

}

export default PhaserGame;