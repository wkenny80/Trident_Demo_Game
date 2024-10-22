import Player from "../Player";

/**
 * A weapon that can be equipped by a player.
 * A weapon should have a player it's attached to and a name for the weapon.
 * The weapon name will be used to find the weapon's sprite in the scene's texture atlas.
 * Any classes implementing the Weapon class should have an attack method.
 * The attack method will be called when the player attacks with the weapon, and may do some action on the enemies. 
 */
abstract class Weapon {
    scene: Phaser.Scene;
    player: Player;
    weaponName: string;

    constructor(scene, player, name) {
        const x = 0;
        const y = 0;
        this.player = player;
        this.scene = scene;
        this.weaponName = name;
    }

    attack() {
        throw new Error("Method not implemented.");
    }

    update() {}
}

export default Weapon;