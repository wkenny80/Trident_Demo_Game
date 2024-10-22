import Phaser from 'phaser';

class PseudoKraken extends Phaser.Physics.Arcade.Sprite {

    id: Number;
    followTarget: Phaser.Physics.Arcade.Sprite;

    constructor(scene, x, y, texture, frame, id) {
        super(scene, x, y, texture, frame);
        let anim = `kraken-${id}-loop`;
        this.play(anim);
        this.scene = scene;
        this.id = id;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.body.setSize(32, 32);
        this.body.setOffset(16, 16);
        this.setDragX(1000);
        // @ts-ignore
        this.body.allowGravity = false;
        this.setDepth(2);
    }

    setFollow(target: Phaser.Physics.Arcade.Sprite) {
        this.followTarget = target;
    }

    stopFollow() {
        this.followTarget = null;
    }

    updateKraken(id: Number) {
        this.id = id;
        this.setTexture(`kraken-${id}-sheet`);
        this.play(`kraken-${id}-loop`);
    }

    follow() {
        const xDistance = (this.followTarget.x - this.x);
        const yDistance = (this.followTarget.y - this.y);
        const absDistance = Math.abs(xDistance);
        if(absDistance > 44) {
            if(absDistance > 650) {
                this.setPosition(this.followTarget.x - 20, this.followTarget.y - 50);
            }
            const target = new Phaser.Math.Vector2(this.followTarget.x, this.followTarget.y - 74);
            this.scene.physics.moveToObject(this, target, Math.abs(this.followTarget.body.velocity.x) * 0.7 + 150);
            this.flipX = this.body.velocity.x < 0;
        }
    }

    update() {
        if (this.followTarget) {
            this.follow();
        }
    }
}

export default PseudoKraken;