import Phaser from 'phaser'

import PseudoKraken from '../entities/PseudoKraken'
import Player from '../entities/Player'
import GoomSpawner from '../entities/GoomSpawner'
import GigaGoom from '../entities/GigaGoom'
import MiniGoom from '../entities/MiniGoom'

import vars from '../vars'
import { EventManager as events } from '../managers/EventManager'

interface ISpawn {
	x?: number;
	y?: number;
	type?: string;
}

class DemoScene extends Phaser.Scene {
	krakenIDs: string[]
	chosenKrakenID: string
    map: Phaser.Tilemaps.Tilemap;
	collisionLayer: Phaser.Tilemaps.TilemapLayer;
	sceneIsRebooting: boolean;
	mapScale: number = 1;

	// Entities
    player: Player; // Player
	playerSpawn: ISpawn;
	krakenPet: PseudoKraken
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
	goomSpawns: ISpawn[] = [];
	gigaGooms: GigaGoom[] = [];
	miniGooms: MiniGoom[] = [];
	enemies: Phaser.Physics.Arcade.Sprite[] = [];

	constructor() {
		super('DemoScene')
		this.krakenIDs = vars.krakenIDs
		this.chosenKrakenID = this.krakenIDs[Math.floor(Math.random() * this.krakenIDs.length)]
	}

	updateKrakenData() {
		const oldKrakenIDs = this.krakenIDs
		this.krakenIDs = vars.krakenIDs

		// Get any new kraken IDs, and then load their assets and generate their animations.
		const newKrakenIDs = this.krakenIDs.filter(id => {
			return !oldKrakenIDs.includes(id)
		})

		newKrakenIDs.forEach(id => {
			this.load.spritesheet(`kraken-${id}-sheet`, `krakenData/images/${id}/sheet.png`, {
				frameWidth: 64,
				frameHeight: 64,
			})
		})
		this.load.once('complete', () => {
			newKrakenIDs.forEach(id => {
				this.anims.create({
					key: `kraken-${id}-loop`,
                    // @ts-ignore
					frames: this.anims.generateFrameNumbers(`kraken-${id}-sheet`),
					frameRate: 10,
					repeat: -1,
				})
			});
			this.chosenKrakenID = vars.chosenKrakenID.toString();
			this.selectKraken(this.chosenKrakenID);
		})
		this.load.start()
	}

	selectKraken(id) {
		this.chosenKrakenID = id
		this.krakenPet.updateKraken(id)
	}

	create() {
		this.sceneIsRebooting = false;
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

		// Load Map + Entities
		this.addMap();
		this.addPlayer();
		this.addKrakenPet();
		this.addEnemies();

		// Camera Effect on Load
		this.cameras.main.fadeIn(2000, 0, 0, 0);
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels * this.mapScale, this.map.heightInPixels * this.mapScale);
		this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Keyboard Inputs
        this.input.keyboard.on("keydown-P", () => {
			if(!this.sceneIsRebooting)
            	this.respawn();
        });
		// Register events
		events.on('updateKrakenIDs', this.updateKrakenData, this)
		events.on('enemy-died', (id) => {
			this.enemies.forEach((enemy, i) => {
				if (enemy.getData('id') === id) {
					delete this.enemies[i];
				}
			});
		})
	}

	addMap() {
        this.map = this.make.tilemap({ key: "rotwood" });
		
		// BG Image(s)
		let bgImg = this.add.image(0, 0, "Ghostwood").setOrigin(0, 0);
		const imgScale = this.map.widthInPixels / bgImg.width;
		bgImg.setScale(2).setDepth(0);

		// Tilesets
		const tilemap = this.map.addTilesetImage("Ratlas", "rotwood-tile");
		// const tileTwo = this.map.addTilesetImage("CaveTile", "bottom-tile");

		// Layers
		// BG
		this.map.createLayer("Background", tilemap, 0, 0).setDepth(1);
		// Collide
		this.collisionLayer = this.map.createLayer("Collide", [tilemap]).setDepth(2);
		this.collisionLayer.setCollision([1, 2, 4, 5, 6, 7, 8, 10, 14], true);
		// Decoration
		this.map.createLayer("Decoration", tilemap, 0, 0).setDepth(3);

		// Add physics
		this.physics.world.setBounds(0, 0, this.map.widthInPixels * this.mapScale, this.map.heightInPixels * this.mapScale);
		this.physics.world.setBoundsCollision(true, true, false, true);

		// Add spawns
		if(this.goomSpawns.length == 0) {
			this.map.getObjectLayer("Object").objects.forEach(object => {
				if (object.name === "PlayerSpawn") {
					this.playerSpawn = { x: object.x, y: object.y };
				}
				if (object.name === "GoomSpawn") {
					this.goomSpawns.push({ x: object.x, y: object.y });
				}
			});
		}
    }

	addPlayer() {
        this.player = new Player(this, this.playerSpawn.x, this.playerSpawn.y, ['katana', 'conch']);
		const playerCollider = this.physics.add.collider(this.player, this.map.getLayer("Collide").tilemapLayer);
    }

	addKrakenPet() {
		this.krakenPet = new PseudoKraken(
			this,
			this.player.x,
			this.player.y - 30,
			`kraken-${this.chosenKrakenID}-sheet`,
            0,
            vars.chosenKrakenID,
		);
        this.krakenPet.setFollow(this.player);
		const krakenCollider = this.physics.add.collider(this.krakenPet, this.map.getLayer("Collide").tilemapLayer);
	}

	addEnemies() {
		this.goomSpawns.forEach((spawn, i) => {
			// 50% chance of spawning a GigaGoom or MiniGoom
			// const goom = Math.random() > 0.5 ? new GigaGoom(this, spawn.x, spawn.y, this.player) : new MiniGoom(this, spawn.x, spawn.y);
			// const goom = new GigaGoom(this, spawn.x, spawn.y, this.player, i);
			const goomSpawner = new GoomSpawner(this, spawn.x, spawn.y, i);
			// const goomCollider = this.physics.add.collider(goom, this.map.getLayer("Collide").tilemapLayer);
		});
    }

	respawn() {
		this.sceneIsRebooting = true;
		this.cameras.main.zoomTo(1.5, 1500, "Power2");
		this.cameras.main.fadeOut(1500, 0, 0, 0);
		this.time.delayedCall(2250, () => {
			// Kill all entities in scene
			this.player.destroy();
			this.player = null;
			this.krakenPet.destroy();
			this.krakenPet = null;
			this.enemies.forEach(goom => {
				goom.destroy();
			});
			this.enemies = [];
			
			events.eventNames().forEach(event => {
				events.removeAllListeners(event);
			});

			this.scene.restart();
			this.cameras.main.fadeIn(1500, 0, 0, 0);
			this.cameras.main.setZoom(1, 1);
		})
	}

	update(d, t) {
		super.update(d, t)

		// Call update on entities
		if (this.krakenPet != null) {
			this.krakenPet.update()
		}
		if (this.player != null) {
			this.player.update()
			if(!this.player.isAlive) {
				this.respawn();
			}
		}
	}
}

export default DemoScene
