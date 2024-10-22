import Phaser from "phaser";
import { EventManager as events } from "../managers/EventManager";
import vars from "../vars";

class BootScene extends Phaser.Scene {
    krakenIDs: string[];
    chosenKrakenID: string;

    constructor() {
        super("BootScene");
        this.krakenIDs = vars.krakenIDs || [];
		this.chosenKrakenID = this.krakenIDs[Math.floor(Math.random() * this.krakenIDs.length)]
    }
  
    preload() {
		// Load Kraken 1
        this.load.spritesheet(`kraken-1-sheet`, `krakenData/images/1/sheet.png`, {
            frameWidth: 64,
            frameHeight: 64,
        });
		// Dynamic Loading for Krakens
		this.krakenIDs.forEach(id => {
			console.log(`Loading kraken ${id}`)
			// this.load.image(`kraken-${id}-sheet`, `krakenData/images/${id}/sheet.png`);
			this.load.spritesheet(`kraken-${id}-sheet`, `krakenData/images/${id}/sheet.png`, {
				frameWidth: 64,
				frameHeight: 64,
			});
		});

		// Load Map
		this.load.tilemapTiledJSON('sanctuary', 'assets/map/Sanctuary.json');
		this.load.image('cave-tile', 'assets/map/SanctuaryBlockTop.png');
		this.load.image('bottom-tile', 'assets/map/SanctuaryBlockBottom.png');
		this.load.image('Knotwood', 'assets/map/KnotWoodExpanse.png');

		this.load.tilemapTiledJSON('rotwood', 'assets/map/Rotwood_Thicket.json');
		this.load.image('rotwood-tile', 'assets/map/tile_ratlas.png');
		this.load.image('Ghostwood', 'assets/map/Ghostwood.png');
		// this.load.image('crystalTileImage', 'assets/images/crystal.png');

        // Load items
		this.load.image('tridentTool', 'assets/images/tridentMultiTool.png');
        this.load.spritesheet('katana-attack', 'assets/katana/katana-attack.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('katana-idle', 'assets/katana/katana-idle.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('katana-run', 'assets/katana/katana-run.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('katana-jump', 'assets/katana/katana-jump.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('katana-roll', 'assets/katana/katana-roll.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('attack-bow', 'assets/Barebones/bow/bow-attack.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('idle-bow', 'assets/Barebones/bow/bow-idle.png', {
            frameWidth: 128,
            frameHeight: 128,
        });
        this.load.spritesheet('barebone-attack-bow', 'assets/Barebones/bow/barebone-attack-bow.png', {
            frameWidth: 128,
            frameHeight: 128,
        });

		// Load enemies
		this.loadEnemySprites();
        // Load player
		this.loadPlayerSprites();

		// Load audio
		this.loadSounds();

		this.load.spritesheet('tridentTool2', 'assets/images/tridentMultiTool2.2.png', {
			frameWidth: 22,
			frameHeight: 60,
		});
	}
	
	/**
	 * ============================== LOAD SPRITES ==============================
	 */

	loadEnemySprites() {
		// Load enemies
		// Goomspawner
		this.load.spritesheet('goom-spawner', 'assets/entities/goomspawn/idle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		// Gigagoom
		this.load.spritesheet('gg-spawn', 'assets/entities/gigagoom/spawn.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('gg-run', 'assets/entities/gigagoom/run.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('gg-punch', 'assets/entities/gigagoom/punch.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('gg-idle', 'assets/entities/gigagoom/idle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('gg-hit', 'assets/entities/gigagoom/hit.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('gg-die', 'assets/entities/gigagoom/die.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
	}

	loadPlayerSprites() {
		this.load.spritesheet('bone-run', 'assets/entities/player/base/run.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('bone-attack', 'assets/entities/player/base/attack.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('bone-jump', 'assets/entities/player/base/jump.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('bone-idle', 'assets/entities/player/base/idle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('bone-roll', 'assets/entities/player/base/roll.png', {
            frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('bone-die', 'assets/entities/player/base/death.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		// Katana
		this.load.spritesheet('katana-bone-run', 'assets/entities/player/katana/run.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('katana-bone-attack', 'assets/entities/player/katana/attack.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('katana-bone-jump', 'assets/entities/player/katana/jump.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('katana-bone-idle', 'assets/entities/player/katana/idle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('katana-bone-roll', 'assets/entities/player/katana/roll.png', {
            frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('katana-bone-die', 'assets/entities/player/katana/death.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		// Conch
		this.load.spritesheet('conch-bone-run', 'assets/entities/player/conch/run.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-bone-attack', 'assets/entities/player/conch/attack.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-bone-jump', 'assets/entities/player/conch/jump.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-bone-idle', 'assets/entities/player/conch/idle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-toggle', 'assets/entities/player/conch/conch-toggle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-untoggle', 'assets/entities/player/conch/conch-untoggle.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-bone-roll', 'assets/entities/player/conch/roll.png', {
            frameWidth: 128,
			frameHeight: 128,
		});
		this.load.spritesheet('conch-bone-die', 'assets/entities/player/conch/death.png', {
			frameWidth: 128,
			frameHeight: 128,
		});
	}
	
	/**
	 * ============================== LOAD SOUNDS ==============================
	 */
	loadSounds() {
		this.load.audio('conch-1', 'assets/audio/MagicConch_1.mp3');
		this.load.audio('conch-2', 'assets/audio/MagicConch_2.mp3');
		this.load.audio('conch-3', 'assets/audio/MagicConch_3.mp3');
		this.load.audio('conch-4', 'assets/audio/MagicConch_4.mp3');
		this.load.audio('conch-5', 'assets/audio/MagicConch_5.mp3');
		this.load.audio('conch-6', 'assets/audio/MagicConch_6.mp3');
		this.load.audio('conch-7', 'assets/audio/MagicConch_7.mp3');
		this.load.audio('conch-8', 'assets/audio/MagicConch_8.mp3');
		this.load.audio('conch-9', 'assets/audio/MagicConch_9.mp3');
		this.load.audio('conch-10', 'assets/audio/MagicConch_0.mp3');
	}

	/**
	 * ============================== CREATE ANIMS ==============================
	 */

	createPlayerAnims() {
		// Create player anims
		this.anims.create({
			key: "player-running",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-run"),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: "player-rolling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-roll", {
			  start: 3,
			}),
			frameRate: 16,
			repeat: 0,
		});
		this.anims.create({
			key: "player-attacking",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-attack"),
			frameRate: 15,
			repeat: 0,
		});
		this.anims.create({
			key: "player-jumping",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-jump", {
			  start: 0,
			  end: 4,
			}),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: "player-idle",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-idle"),
			frameRate: 7,
			repeat: -1,
		});
		this.anims.create({
			key: "player-falling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-jump", {
			  start: 4,
			  end: 4,
			}),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: "player-dead",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("bone-die"),
			frameRate: 10,
			repeat: 0,
		});
		// Katana anims
		this.anims.create({
			key: "katana-player-running",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-run"),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: "katana-player-rolling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-roll", {
			  start: 3,
			}),
			frameRate: 16,
			repeat: 0,
		});
		this.anims.create({
			key: "katana-player-attacking",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-attack"),
			frameRate: 15,
			repeat: 0,
		});
		this.anims.create({
			key: "katana-player-jumping",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-jump", {
			  start: 0,
			  end: 4,
			}),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: "katana-player-idle",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-idle"),
			frameRate: 7,
			repeat: -1,
		});
		this.anims.create({
			key: "katana-player-falling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-jump", {
			  start: 4,
			  end: 4,
			}),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: "katana-player-dead",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("katana-bone-die"),
			frameRate: 10,
			repeat: 0,
		});
		// Conch
		this.anims.create({
			key: "conch-player-running",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-run"),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: "conch-player-rolling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-roll", {
			  start: 3,
			}),
			frameRate: 16,
			repeat: 0,
		});
		this.anims.create({
			key: "conch-player-attacking",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-attack"),
			frameRate: 15,
			repeat: 0,
		});
		this.anims.create({
			key: "conch-player-jumping",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-jump", {
			  start: 0,
			  end: 4,
			}),
			frameRate: 60,
			repeat: 0,
		});
		this.anims.create({
			key: "conch-player-idle",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-idle"),
			frameRate: 7,
			repeat: -1,
		});
		this.anims.create({
			key: "conch-toggle",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-toggle"),
			frameRate: 9,
			repeat: 0,
		});
		this.anims.create({
			key: "conch-untoggle",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-untoggle"),
			frameRate: 9,
			repeat: 0,
		});
		this.anims.create({
			key: "conch-player-falling",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-jump", {
			  start: 4,
			  end: 4,
			}),
			frameRate: 5,
			repeat: -1,
		});
		this.anims.create({
			key: "conch-player-dead",
			// @ts-ignore
			frames: this.anims.generateFrameNumbers("conch-bone-die"),
			frameRate: 10,
			repeat: 0,
		});
	}

	createEnemyAnims() {
		// Create enemy anims
		// Goomspawner
		this.anims.create({
			key: 'goomspawn-idle',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('goom-spawner'),
			frameRate: 10,
			repeat: -1,
		});
		// Gigagoom
		this.anims.create({
			key: 'gigagoom-spawn',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-spawn', { start: 0, end: 43}),
			frameRate: 14,
			repeat: 0,
		})
		this.anims.create({
			key: 'gigagoom-run',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-run', { start: 0, end: 3 }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: 'gigagoom-sprint',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-run', { start: 0, end: 3 }),
			frameRate: 12,
			repeat: -1,
		});
		this.anims.create({
			key: 'gigagoom-punch',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-punch', { start: 0, end: 14 }),
			frameRate: 18,
			repeat: 0,
		});
		this.anims.create({
			key: 'gigagoom-idle',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-idle', { start: 0, end: 5 }),
			frameRate: 10,
			repeat: -1,
		});
		this.anims.create({
			key: 'gigagoom-die',
			// @ts-ignore
			frames: this.anims.generateFrameNumbers('gg-die', { start: 0, end: 9 }),
			frameRate: 10,
			repeat: 0,
		});
	}

    createAnims() {
		// Generate kraken 1
        this.anims.create({
            key: `kraken-1-loop`,
            // @ts-ignore
            frames: this.anims.generateFrameNumbers(`kraken-1-sheet`),
            frameRate: 10,
            repeat: -1,
        })
		// Generate anims for player's krakens.
		this.krakenIDs.forEach(id => {
			this.anims.create({
				key: `kraken-${id}-loop`,
                // @ts-ignore
				frames: this.anims.generateFrameNumbers(`kraken-${id}-sheet`),
				frameRate: 10,
				repeat: -1,
			})
		})
		
		// Create enemy animations
		this.createEnemyAnims();

		// Create player animations
		this.createPlayerAnims();
	}
    
    create() {
        this.createAnims();
        this.scene.start('DemoScene');
    }
};

export default BootScene;