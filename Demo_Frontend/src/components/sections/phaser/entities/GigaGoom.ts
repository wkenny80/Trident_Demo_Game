import Phaser from 'phaser';
import { EventManager as events } from '../managers/EventManager';
import Player from './Player';

class GigaGoom extends Phaser.Physics.Arcade.Sprite {
    
    homePoint: Phaser.Math.Vector2;
    id: number;
    isAlive: boolean = true;
    isSpawning: boolean = false;
    isHit: boolean = false;
    isAttacking: boolean = false;
    targetPlayer: Player = null;

    randomPeriod: number = -1;
    randomMovement: number = 0; // -1 left, 0 idle, 1 right

    constructor(scene, x, y, player, id) {
        super(scene, x, y, 'gigagoom-idle', 0);
        this.homePoint = new Phaser.Math.Vector2(x, y);
        this.play('gigagoom-idle');
        this.setData('id', id);
        this.setData('hp', 2);
        this.targetPlayer = player;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // @ts-ignore
        this.scene.enemies.push(this);
        // @ts-ignore
        this.scene.physics.add.collider(this, this.scene.map.getLayer("Collide").tilemapLayer);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        this.body.setSize(36, 72);
        this.body.setOffset(38, 56)
        this.setDragX(500);
        this.setDepth(1);
        this.setScale(2);
        this.spawn();
    }

    spawn() {
        this.isSpawning = true;
        this.setAlpha(0);
        this.play('gigagoom-spawn');
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 1000,
            ease: 'Power1',
        });
        this.scene.time.delayedCall(2750, () => {
            this.isSpawning = false; 
        });
    }

    kill() {
        this.isAlive = false;
        events.emit("enemy-died", this.id);
        // Get random index from deathMsg array
        this.setVelocityY(-300);
        this.anims.play('gigagoom-die');
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 2000,
            ease: 'Power1',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    hit(attacker = null) {
        const currentHp = this.getData('hp');
        if (currentHp <= 0 && this.isAlive) {
            this.kill();
        } else if (this.isAlive && !this.isHit) {
            this.setData('hp', currentHp - 1);
            this.isHit = true;
            this.setTint(0xff0000);
            if(attacker !== null && !this.isSpawning) {
                (attacker.x - this.x > 0) ? this.setVelocityX(-250) : this.setVelocityX(250);
                this.setVelocityY(-200);
            }
            
            this.scene.time.delayedCall(400, () => {
                this.isHit = false;
                this.clearTint();
            });
        }
    }

    attack() {
        // Begin attack windup
        this.setVelocityX(0);
        this.anims.play('gigagoom-punch');
        const flipX = this.flipX ? -1 : 1;
        this.isAttacking = true;

        const rect = this.scene.add.rectangle(this.x, this.y - 35, 20, 90, 0xff0000, 0);
        rect.setOrigin(this.flipX ? 1 : 0, 1);
        this.scene.physics.add.existing(rect);
        const rectOverlap = this.scene.physics.add.overlap(
            // @ts-ignore
            this.scene?.player,
            rect,
            (player, rect) => {
                if(this.isAlive && !this.isHit) {
                    // @ts-ignore
                    player?.hit(this);
                }
            }, null, this.scene
        );
        this.scene.tweens.add({
            delay: 400,
            targets: rect,
            x: this.x + (flipX * 100),
            duration: 300,
            ease: 'Power1',
            yoyo: true,
            repeat: 0,
        });
        // @ts-ignore
        rect.body.setAllowGravity(false);
        // @ts-ignore
        rect.body.setImmovable(true);
        this.scene.time.delayedCall(850, () => {
            this.isAttacking = false;
            rect.destroy();
            rectOverlap.destroy();
        });
    }

    preUpdate(t, d) {
        super.preUpdate(t, d);
        const distanceToPlayer = this.targetPlayer.x - this.x;

        // Update random period every period tick.
        if (this.randomPeriod <= 0) {
            this.randomPeriod = Phaser.Math.Between(3000, 5000);
            // Randomly choose a direction to move in.
            this.randomMovement = Phaser.Math.Between(-1, 1);
        }
        this.randomPeriod -= d;

        // Move if alive, not spawning, not hit, not attacking, and not too close to player.
        if(!this.isAttacking && !this.isHit && this.isAlive && !this.isSpawning) {
            // If in range of player, approach and attempt to attack in range.
            if(Math.abs(distanceToPlayer) <= 400) {
                if(Math.abs(distanceToPlayer) <= 70) {
                    this.attack();
                } else {
                    if(distanceToPlayer > 0) {
                        this.anims.play('gigagoom-sprint', true);
                        this.setVelocityX(175);
                        this.setFlipX(false);
                    } else {
                        this.anims.play('gigagoom-sprint', true);
                        this.setVelocityX(-175);
                        this.setFlipX(true);
                    }
                }
            } else {
                // If not near player, idle and wander around at random. 
                // Never stray too far (500) from home point.
                if(Math.abs(this.x - this.homePoint.x) > 500) {
                    if(this.x > this.homePoint.x) {
                        this.randomMovement = -1;
                    } else {
                        this.randomMovement = 1;
                    }
                }
                if(this.randomMovement == -1) {
                    this.anims.play('gigagoom-run', true);
                    this.setVelocityX(-100);
                    this.setFlipX(true);
                } else if(this.randomMovement == 0) {
                    this.anims.play('gigagoom-idle', true);
                } else if(this.randomMovement == 1) {
                    this.anims.play('gigagoom-run', true);
                    this.setVelocityX(100);
                    this.setFlipX(false);
                }
            }
        }
    }
}

export default GigaGoom;