import Weapon from "../bases/Weapon";

class Conch extends Weapon {
    conchToggle: boolean = false;
    conchSounds: Phaser.Sound.BaseSound[];
    instructions: Phaser.GameObjects.Text;
    
    constructor(scene, player) {
        super(scene, player, 'conch');
        this.scene = scene;
        this.conchSounds = [
            this.scene.sound.add('conch-1', { volume: 0.5 }),
            this.scene.sound.add('conch-2', { volume: 0.5 }),
            this.scene.sound.add('conch-3', { volume: 0.5 }),
            this.scene.sound.add('conch-4', { volume: 0.5 }),
            this.scene.sound.add('conch-5', { volume: 0.5 }),
            this.scene.sound.add('conch-6', { volume: 0.5 }),
            this.scene.sound.add('conch-7', { volume: 0.5 }),
            this.scene.sound.add('conch-8', { volume: 0.5 }),
            this.scene.sound.add('conch-9', { volume: 0.5 }),
            this.scene.sound.add('conch-10', { volume: 0.5 }),
        ];
        this.instructions = this.scene.add.text(
            10, 10,
            [
                'Press SPACE to start playing the conch.',
                'Then, press any key 1 through 0 to play a sound.',
                'When you\'re done, press SPACE again.'
            ], {
                fontFamily: 'Timmy', 
                fontSize: '24px', 
                color: '#ffffff'
            }
        );
        this.instructions.setDepth(5);
        this.instructions.setScrollFactor(0);
        this.instructions.setAlpha(0);
    }

    /**
     * This function will play the sound at the given index
     * It also stops all other sounds except the chosen sound.
     * @param id - The id of the sound to play
     */
    playSound(id) {
        this.conchSounds.forEach((sound, index) => {
            if(index === id) {
                sound.play();
            } else {
                sound.stop();
            }
        });
        this.player.anims.play('conch-player-attacking', true);
        // this.conchSounds[id].play();
    }

    showText() {
        this.scene.tweens.add({
            targets: this.instructions,
            alpha: 1,
            duration: 1000,
            ease: 'Power1',
            yoyo: false,
            repeat: 0
        });
    }

    hideText() {
        this.scene.tweens.add({
            targets: this.instructions,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            yoyo: false,
            repeat: 0
        });
    }

    /**
     * "Attack" functions as a toggle for the conch
     * It will toggle the conch on and off and also show/hide the instructions
     */
    attack() {
        this.conchToggle = !this.conchToggle;
        this.player.isAttacking = this.conchToggle;
        if(this.conchToggle) {
            this.player.setPauseInput(true);
            this.player.setTexture('conch-toggle');
            this.player.setFrame(5);
            this.player.anims.play('conch-toggle', true);
            this.player.anims.chain(['conch-player-attacking']);
            this.showText();
        } else {
            this.player.setPauseInput(false);
            this.player.anims.play('conch-untoggle', true);
            this.hideText();
        }
    }

    update() {
        if(this.conchToggle) {
            if(!this.player.anims.isPlaying) {
                this.player.setTexture('conch-toggle');
                this.player.setFrame(5);
            }
            let space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            let keys = [
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
                this.player.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
            ];

            // Switching Attack
            if (Phaser.Input.Keyboard.JustDown(keys[0])) {
                this.playSound(0);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[1])) {
                this.playSound(1);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[2])) {
                this.playSound(2);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[3])) {
                this.playSound(3);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[4])) {
                this.playSound(4);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[5])) {
                this.playSound(5);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[6])) {
                this.playSound(6);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[7])) {
                this.playSound(7);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[8])) {
                this.playSound(8);
            }
            else if (Phaser.Input.Keyboard.JustDown(keys[9])) {
                this.playSound(9);
            } else if(Phaser.Input.Keyboard.JustDown(space)) {
                this.attack();
            }
        }
    }
}

export default Conch;