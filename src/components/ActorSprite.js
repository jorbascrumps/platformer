export default class ActorSprite extends Phaser.Physics.Matter.Sprite {

    #actor = null

    constructor (world) {
        super(...arguments);

        world.scene.sys.displayList.add(this);
        world.scene.sys.updateList.add(this);
    }

    get actor () {
        return this.#actor;
    }

    setActor (actor) {
        this.#actor = actor;

        return this;
    }

}
