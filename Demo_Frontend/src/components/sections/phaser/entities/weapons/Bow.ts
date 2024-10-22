import Weapon from "../bases/Weapon";

class Bow extends Weapon {
    constructor(scene, player) {
        super(scene, player, 'bow');
        this.scene = scene;
    }

    attack() {
        console.log("Bow attack");
    }
}

export default Bow;