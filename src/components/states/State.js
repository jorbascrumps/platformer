export default class State {
    constructor (target) {
        this.target = target;
        this.debugGraphic = target.scene.add.graphics()
            .fillStyle(0x00ff00, 1);

        this.onEnter.bind(this);
        this.execute.bind(this);
        this.onExit.bind(this);

        this.onEnter();
    }

    onEnter () {
        return console.log(`Enter ${this.constructor.name}`);
    }

    execute () {}

    onExit () {
        return console.log(`Exit ${this.constructor.name}`);
    }
}
