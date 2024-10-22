
import Phaser from 'phaser';

class MiniGoom extends Phaser.Physics.Arcade.Sprite {
    
    health: Number;

    constructor(scene, x, y) {
        super(scene, x, y, 'barebones', 0);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setDragX(500);
        this.setDepth(1);
    }

    attack() {

    }

    preUpdate() {
        
    }
}

export default MiniGoom;