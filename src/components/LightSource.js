export default class extends Phaser.GameObjects.Container {
    constructor ({
        scene,
        x = 0,
        y = 0,
        radius = 100,
        intensity = 2,
        colour = 0xffff00,
        flicker = false
    } = {}) {
        super(scene, x, y);

        scene.sys.updateList.add(this);

        this.x = x;
        this.y = y;
        this.radius = radius;
        this.intensity = intensity;
        this.colour = colour;

        this.light = scene.lights.addLight(this.x, this.y, radius, colour, intensity);
        this.lightArea = new Phaser.Geom.Circle(this.x, this.y, 5, 5);

        this._follow = undefined;

        if (flicker) {
            scene.time.addEvent({
                delay: 100,
                callback: () => Phaser.Geom.Circle.Random(this.lightArea, this.light),
                repeat: -1
            });
        }

        this.update.bind(this);
        this.setPosition.bind(this);
        this.startFollow.bind(this);

        return this;
    }

    preUpdate (...args) {
        return this.update(...args);
    }

    update () {
        if (typeof this._follow !== 'undefined') {
            this.setPosition(this._follow.x, this._follow.y - (this.radius / 2));
            this.lightArea.setPosition(this.x, this.y);
        }
    }

    setPosition (x, y) {
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        return this;
    }

    startFollow (target) {
        this._follow = target;
    }
}
