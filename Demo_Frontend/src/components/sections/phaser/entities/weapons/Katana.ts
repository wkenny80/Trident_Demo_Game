import Weapon from "../bases/Weapon";

class Katana extends Weapon {
    constructor(scene, player) {
        super(scene, player, 'katana');
        this.scene = scene;
        // this.setScale(2);
    }

    attack() {
        this.player.isAttacking = true;
        const flipX = this.player.flipX ? -1 : 1;
        const rectWidth = 80;
        const rect = this.scene.add.rectangle(this.player.x + (flipX * 20), this.player.y - 35, 8, 90, 0xff0000, 0);
        rect.setOrigin(this.player.flipX ? 1 : 0, 1);
        this.scene.physics.add.existing(rect);
        const rectOverlap = this.scene.physics.add.overlap(
            // @ts-ignore
            this.scene?.enemies,
            rect,
            (enemy, rect) => {
                // @ts-ignore
                enemy?.hit(this.player);
            }, null, this.scene
        );
        this.scene.tweens.add({
            delay: 250,
            targets: rect,
            x: this.player.x + (flipX * rectWidth),
            duration: 100,
            ease: 'Power1',
            yoyo: true,
            repeat: 0,
        });
        this.scene.time.delayedCall(500, () => {
            this.player.isAttacking = false;
        });
        // @ts-ignore
        rect.body.setAllowGravity(false);
        // @ts-ignore
        rect.body.setImmovable(true);
        // @ts-ignore
        this.scene.time.delayedCall(350, () => {
            rect.destroy();
            rectOverlap.destroy();
        })
    }
}

export default Katana;