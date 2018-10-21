export default class State {
    constructor (target) {
        this.target = target;
        this.debugGraphic = target.scene.add.graphics()
            .setDefaultStyles({
                fillStyle: {
                    alpha: 1,
                    color: 0x00ff00,
                },
                lineStyle: {
                    alpha: 1,
                    color: 0x00ff00,
                    width: 1,
                }
            });

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
        this.debugGraphic.clear();

        return console.log(`Exit ${this.constructor.name}`);
    }
}
