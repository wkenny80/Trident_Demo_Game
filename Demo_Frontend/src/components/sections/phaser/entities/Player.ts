import Phaser from "phaser";
import StateMachine from "javascript-state-machine";
import { EventManager as events } from '../managers/EventManager';
import vars from '../vars';

import Weapon from './bases/Weapon';
import Katana from "./weapons/Katana";
import Bow from "./weapons/Bow";
import Conch from "./weapons/Conch";

const getWeapon = (weapon, scene, player) => {
    switch (weapon) {
        case 'katana':
            return new Katana(scene, player);
        case 'bow':
            return new Bow(scene, player);
        case 'conch':
            return new Conch(scene, player);
        default:
            throw new Error(`No weapon of type ${weapon} exists`);
    }
}

interface IKeys {
    up?: Phaser.Input.Keyboard.Key | undefined;
    down?: Phaser.Input.Keyboard.Key | undefined;
    left?: Phaser.Input.Keyboard.Key | undefined;
    right?: Phaser.Input.Keyboard.Key | undefined;
    attack?: Phaser.Input.Keyboard.Key | undefined;
    jump?: Phaser.Input.Keyboard.Key | undefined;
}

class Player extends Phaser.Physics.Arcade.Sprite {
    keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

    hitPoints: number = 5;
    isAlive: boolean = true;
    isHit: boolean = false;
    isAttacking: boolean = false;
    isRolling: boolean = false;
    weapons: Weapon[] = [];
    currentWeapon: number = 0;

    input: any;
    keys: IKeys;

    animState: StateMachine;
    moveState: StateMachine;
    movePredicates: any;
    animPredicates: any;
    
    constructor(scene, x, y, weapons = []) {
        super(scene, x, y, 'barebones', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDragX(1000);
        this.setDepth(2);

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.body.setSize(16,41)
        this.body.setOffset(50, 87)
        this.setScale(2);
        this.setMaxVelocity(550, 1000);
        this.setGravityY(400);

        this.setupKeys();
        this.setupMovement();
        this.setupAnimations();

        console.log(weapons);
        // Add weapons
        weapons.forEach(weapon => {
            this.addWeapon(weapon)
        });

        if(weapons.length > 0) {
            this.switchWeapon(0);
        }

        if (!this.scene.scene.isActive("DeathScreen")) {
            this.scene.scene.launch("GameUI", { hp: this.hitPoints }).moveAbove(scene.key);
        }
    }

    setupKeys() {
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
        });
        this.input = {};
        this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);
        this.keyboard = this.scene.input.keyboard;
    }

    pauseGame() {
        this.scene.scene.launch("PauseMenu", this.scene);
        this.scene.scene.bringToTop("PauseMenu");
        this.scene.scene.pause();
    }

    addWeapon(weapon) {
        let weaponObj = getWeapon(weapon, this.scene, this);
        this.weapons.push(weaponObj);
    }

    setupAnimations() {
        this.animState = new StateMachine({
            init: "idle",
            transitions: [
                { name: "idle", from: ["falling", "rolling", "jumping", "running", "teleporting", "attacking"], to: "idle" },
                { name: "jump", from: ["idle", "rolling", "jumping", "running", "falling", "attacking"], to: "jumping" },
                { name: "fall", from: ["idle", "rolling", "jumping", "running"], to: "falling" },
                { name: "run", from: ["idle", "rolling", "falling", "teleporting"], to: "running" },
                { name: "roll", from: ["running"], to: "rolling" },
                // { name: 'pivot', from: ['idle', 'falling', 'teleporting', 'running'], to: 'pivoting' },
                { name: "attack", from: ["idle", "rolling", "falling", "running"], to: "attacking" },
                { name: "die", from: "*", to: "dead" },
            ],
            methods: {
                onEnterState: lifecycle => {
                    // If the player has weapons, show the current weapon
                    const prefix = (this.weapons.length > 0 ) ? (this.weapons[this.currentWeapon].weaponName) + '-' : '';
                    this.anims.play(`${prefix}player-${lifecycle.to}`, true);
                    // console.log(lifecycle.to)
                },
                resetAnim: () => {
                    const prefix = (this.weapons.length > 0 ) ? (this.weapons[this.currentWeapon].weaponName) + '-' : '';
                    // console.log(this.animState.state);
                    this.anims.play(`${prefix}player-${this.animState.state}`, false);
                }
            },
        });
        this.animPredicates = {
            idle: () => {
                return this.onFloor() && this.body.velocity.x == 0 && !this.isAttacking;
            },
            jump: () => {
                return this.body.velocity.y < 0;
            },
            fall: () => {
                return this.body.velocity.y > 0;
            },
            run: () => {
                return this.onFloor() && this.body.velocity.x != 0 && !this.isRolling;
            },
            roll: () => {
                return this.onFloor() && this.body.velocity.x != 0 && this.isRolling;
            },
            attack: () => {
                return this.isAttacking && this.weapons.length > 0;
            },
        };
    }

    onFloor() {
        return this.body.touching.down || this.body.blocked.down;
    }

    resetMovements() {
        this.keys.left.isDown = false;
        this.keys.right.isDown = false;
    }

    setupMovement() {
        this.moveState = new StateMachine({
            init: "standing",
            transitions: [
                { name: "jump", from: ["standing", "attacking"], to: "jumping" },
                { name: "fall", from: ["standing"], to: "falling" },
                { name: "touchdown", from: ["jumping", "falling", "attacking"], to: "standing" },
                { name: "die", from: "*", to: "dead" },
            ],
            methods: {
                onEnterState: lifecycle => {
                    //console.log(lifecycle)
                },
                onJump: () => {
                    this.setVelocityY(-670);
                },
            },
        });

        this.movePredicates = {
            jump: () => {
                return this.input.didPressJump && !this.isAttacking;
            },
            fall: () => {
                return !this.onFloor() && !this.isAttacking;
            },
            touchdown: () => {
                return this.onFloor() && !this.isAttacking;
            },
        };
    }

    doRoll() {
        if(this.isRolling || !this.onFloor()) return;
        this.isRolling = true;
        // this.weapons[this.currentWeapon].hide();
        const flipX = (this.flipX) ? -1 : 1;
        this.setVelocityX(flipX * (Math.abs(this.body.velocity.x) + 150));
        this.anims.play('player-rolling', true);
        this.scene.time.delayedCall(500, () => {
            this.isRolling = false;
            // this.weapons[this.currentWeapon].show();
            this.setAccelerationX(0);
        });
    }

    kill() {
        this.moveState.die();
        this.animState.die();
        this.isAlive = false;
        events.emit("player-died");
        const deathMsg = ["RIP BOZO 💔", "No maidens? 😢", "Git gud", "NGMI 😈", "You are not goated with the sauce.", "F 💀", "💀💀💀", "🪦"];
        const styles = ["font-size: 18px", "padding: 2px 4px", "background-color: #000000"].join(";");
        
        // Get random index from deathMsg array
        const randomIndex = Math.floor(Math.random() * deathMsg.length);
        console.log("%c" + deathMsg[randomIndex], styles);
        this.setVelocityY(-300);
    }

    hit(attacker = null, damage = 1, force = 250) {
        if (this.hitPoints <= 0 && this.isAlive) {
            this.kill();
        } else if (this.isAlive && !this.isHit && !this.isRolling) {
            this.hitPoints -= damage;
            this.isHit = true;
            this.setTint(0xff0000);
            this.scene.cameras.main.flash(150);
            this.scene.cameras.main.shake(150, 0.02);
            this.scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.clearTint();
                },
            });
            if(attacker !== null) {
                (attacker.x - this.x > 0) ? this.setVelocityX(-force) : this.setVelocityX(force);
            }
            this.setVelocityY(-(200 + force / 2));
            this.scene.time.delayedCall(500, () => {
                this.isHit = false;
                //this.resetMovements()
            });
        }
    }

    switchWeapon(weaponId: number) {
        // if (this.currentWeapon == weaponId) return;
        // this.weapons[this.currentWeapon].hide();
        this.currentWeapon = weaponId;
        const heldWeaponTexture = `${this.weapons[this.currentWeapon].weaponName}-player-idle`;
        // this.setTexture(heldWeaponTexture);
        this.animState.resetAnim();  
        // this.weapons[this.currentWeapon].show();
    }

    setPauseInput(bool: boolean) {
        vars.inputPaused = bool;
        console.log(this.keyboard.getCaptures());
        // this.keyboard.clearCaptures();
        // this.keyboard.
        // this.keyboard.removeCapture('W,A,S,D');
        if(!bool) {
            this.setupKeys();
        }
    }

    attack() {
        // Can't attack if player is dead, jumping, falling, currently attacking, rolling, or has no weapon
        if (!this.isAlive || this.movePredicates.jump() || this.movePredicates.fall() || this.isRolling || this.isAttacking || this.weapons.length == 0) {
            return;
        } else {
            this.weapons[this.currentWeapon].attack();
            this.setVelocityX(0);
            // let playerAttackSound = this.scene.sound.add("player-attack");
            // playerAttackSound.play();
        }
    }

    preUpdate(time, delta) {
        if (this.isHit) {
            return;
        }
        if (this.hitPoints <= 0 && this.isAlive) {
            this.kill();
        }
        super.preUpdate(time, delta);

        if (!vars.inputPaused) {
            this.keyboard = this.scene.input.keyboard;
            this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

            let key1 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
            let key2 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);

            // Switching Attack
            if (Phaser.Input.Keyboard.JustDown(key1) && this.currentWeapon != 0) {
                this.switchWeapon(0);
            } else if (Phaser.Input.Keyboard.JustDown(key2) && this.currentWeapon != 1) {
                this.switchWeapon(1);
            }

            let spaceBar = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
                this.attack();
            }

            if (this.isAlive && this.keys.left.isDown && !this.isAttacking && !this.isRolling) {
                this.setAccelerationX(-400);
                // this.weapons[this.currentWeapon]?.setAccelerationX(-400);
                this.setFlipX(true);
                // this.weapons[this.currentWeapon]?.setFlipX(true);
                this.body.offset.x = 63;
                // this.weapons[this.currentWeapon].body.offset.x = 63;
                if(this.keys.down.isDown) {
                    this.doRoll();
                }
            } else if (this.isAlive && this.keys.right.isDown && !this.isAttacking && !this.isRolling) {
                this.setAccelerationX(400);
                // this.weapons[this.currentWeapon]?.setAccelerationX(400);
                this.setFlipX(false);
                // this.weapons[this.currentWeapon]?.setFlipX(false);
                this.body.offset.x = 50;
                // this.weapons[this.currentWeapon].body.offset.x = 50;
                if(this.keys.down.isDown) {
                    this.doRoll();
                }
            } else if(this.isRolling) {
                const flipX = (this.flipX) ? -1 : 1;
                // this.setAccelerationX(flipX * 1700);
            } else {
                // this.weapons[this.currentWeapon]?.setAccelerationX(0);
                this.setAccelerationX(0);
                //this.body.offset.x = 18;
            }
        }

        for (const t of this.moveState.transitions()) {
            if (t in this.movePredicates && this.movePredicates[t]()) {
                this.moveState[t]();
                break;
            }
        }
        for (const t of this.animState.transitions()) {
            //console.log(this.animState.transitions())
            if (t in this.animPredicates && this.animPredicates[t]()) {
                this.animState[t]();
                break;
            }
        }

        if(this.weapons.length > 0 && this.currentWeapon !== null) {
            this.weapons[this.currentWeapon].update();
        }
    }
}

export default Player;
