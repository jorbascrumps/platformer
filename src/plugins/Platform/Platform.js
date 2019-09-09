const {
    Physics: {
        Matter: {
            Matter: {
                Body,
            },
        },
    },
} = Phaser;

class PlatformSprite extends Phaser.Physics.Matter.Sprite {

    constructor (world) {
        super(...arguments);

        world.scene.sys.displayList.add(this);
        world.scene.sys.updateList.add(this);
    }

}

Object.assign(PlatformSprite.prototype, Phaser.GameObjects.Components.PathFollower);

export default class Platform {

    constructor (
        scene,
        width = 32,
        height = 32,
        duration = 1000,
        pathCoords = [ 0, 0 ],
    ) {
        this.scene = scene;
        this.pathCoords = pathCoords;
        this.path = new Phaser.Curves.Spline(pathCoords);
        this.prevProgress = 0;
        this.progress = 0;

        this.platform = new PlatformSprite(scene.matter.world, 0, 0, 'player', null, {
            isStatic: true,
        })
            .setDisplaySize(width, height)
            .setPath(this.path, {
                duration,
                hold: 1000,
                positionOnPath: true,
                repeat: -1,
                repeatDelay: 1000,
                yoyo: true,
                onUpdate: (_, { value }) => {
                    this.prevProgress = this.progress;
                    this.progress = value;
                }
            })
        ;

        this.scene.events.on('preupdate', this.preUpdate, this);
        this.scene.events.on('update', this.update, this);

        // const graphics = this.add.graphics()
        //     .lineStyle(1, 0xffffff, 1)
        // ;
        // this.path.draw(graphics, 64);
    }

    preUpdate () {
        if (!this.progress || !this.prevProgress) return;

        const pos = this.path.getPoint(this.progress);
        const prevPos = this.path.getPoint(this.prevProgress);

        Body.setVelocity(this.platform.body, {
            x: pos.x - prevPos.x,
            y: pos.y - prevPos.y,
        });

        Body.setPosition(this.platform.body, {
            x: pos.x,
            y: pos.y,
        });
    }

    update () {
        this.platform.pathUpdate();
    }

}
