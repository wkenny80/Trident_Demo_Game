import Phaser from "phaser";

export default {
    type: Phaser.AUTO,
    parent: "phaser-wrapper",
    gameTitle: "Pseudo Kraken Demo",
    hidePhaser: true,
    hideBanner: true,
    backgroundColor: "#0a0a0a",
    scale: {
        width: window.innerWidth,
        height: window.innerHeight,
        // mode: Phaser.Scale.FIT,
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 900 },
            debug: false, // ENABLE DEBUG
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true,
        },
    },
    // canvasStyle: "z-index: 6; position:absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #000;",
    dom: {
        createContainer: true,
    },
    antialias: true,
    antialiasGL: true,
    audio: {
        disableWebAudio: true,
    },
};
