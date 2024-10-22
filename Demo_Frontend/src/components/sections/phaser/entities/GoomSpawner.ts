
import Phaser from 'phaser';
import GigaGoom from './GigaGoom';

class GoomSpawner extends Phaser.Physics.Arcade.Sprite {
    isAlive: boolean = true;
    isHit: boolean = false;
    spawnGooms: number = 0;
    gooms: GigaGoom[] = [];
    goomId: number = 0;
    spawnTimer: number = 0;

    constructor(scene, x, y, id) {
        super(scene, x, y, 'goomspawn-idle', 0);
        this.play('goomspawn-idle');
        this.setData('id', id);
        this.setData('hp', 10);
        this.setScale(2);
        this.setOrigin(0.5, 1);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        // @ts-ignore
        this.scene.enemies.push(this);
        // @ts-ignore
        this.scene.physics.add.collider(this, this.scene.map.getLayer("Collide").tilemapLayer);
        this.body.setSize(34, 100);
        this.body.setOffset(42, 27);
        this.setCollideWorldBounds(true);
        this.setDragX(500);
        this.setDepth(1);

        // Spawn between 1-3 gooms
        this.spawnGooms = Phaser.Math.Between(1, 3);
        for (let i = 0; i < this.spawnGooms; i++) {
            this.spawnGoom();
        };
    }

    kill() {
        this.isAlive = false;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
        });
        this.play('goomspawn-die');
        this.scene.time.delayedCall(5000, () => {
            this.destroy();
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
            this.scene.time.delayedCall(400, () => {
                this.isHit = false;
                this.clearTint();
            });
        }
    }

    // Should create a circle "spore" that float down to the ground. Where the ground touches the spore, a GigaGoom is spawned.
    spawnGoom() {
        // Don't spawn gooms if dead
        if(!this.isAlive) return;

        let range = 70;
        let x = Phaser.Math.Between(this.x - range, this.x + range);
        let y = this.y - 175;

        let spore = this.scene.add.circle(x, y, 5, 0xaaffff, 1);

        this.scene.physics.add.existing(spore);
        // @ts-ignore
        spore.body.setAllowGravity(true);
        // @ts-ignore
        spore.body.gravity.set(0, 10);
        // @ts-ignore
        spore.body.setImmovable(true);
        // @ts-ignore
        let col = this.scene.physics.add.collider(spore, this.scene.map.getLayer("Collide").tilemapLayer, () => {
            spore.destroy();
            col.destroy();
            // @ts-ignore
            const goom = new GigaGoom(this.scene, spore.x, spore.y - 20, this.scene?.player, this.goomId);
            this.gooms.push(goom);
        }, null, this.scene);

        this.goomId++;

        this.scene.tweens.add({
            targets: spore.body,
            x: x + 30,
            duration: 100,
            ease: 'ease-in-out',
            yoyo: true,
        });
    }

    preUpdate(t, d) {
        super.preUpdate(t, d);

        if(this.spawnTimer <= 0) {
            this.gooms.forEach((goom, i) => {
                if (!goom.isAlive) {
                    // Drop only one goom spore every 5s
                    this.spawnTimer = 5000;
                    delete this.gooms[i];
                    this.scene.time.delayedCall(4500, () => {
                        this.spawnGoom();
                    });
                    return;
                }
            });
        } else {
            this.spawnTimer -= d;
        }
    }
}

export default GoomSpawner;