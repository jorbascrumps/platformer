import StateIdle from './states/StateIdle';

export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        this.setActive();
        this.setOrigin(0, 0);
        this.setMaxVelocity(500);
        this.setFriction(2000, 100);
        this.setBodySize(10, 23);

        this.scene = scene;
        this.state = new StateIdle(this);

        this.body.offset = {
            x: 2,
            y: 9
        };

        this.update.bind(this);
        this.changeState.bind(this);

        scene.anims.create({
            key: 'enemyAttack',
            frames: scene.anims.generateFrameNumbers('enemyAttack', {
                start: 0,
                end: 17,
                first: 0
            }),
            frameRate: 30,
            repeat: 0,
            onComplete: () => this.changeState(new StateIdle(this))
        });
    }

    update () {
        if (typeof this.state !== 'undefined') {
            this.state.execute(this);
        }
    }

    changeState (state) {
        this.state.onExit(this);
        this.state = state;
        this.state.onEnter(this);
    }
}
