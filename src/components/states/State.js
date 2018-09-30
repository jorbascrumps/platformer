export default class State {
    constructor (obj) {
        this.target = obj;

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
