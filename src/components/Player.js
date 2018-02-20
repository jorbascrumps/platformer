import StateIdle from './states/StateIdle';

export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        this.setActive();
        this.setOrigin(0.5, 0.5);
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
    }

    update () {
        const {
            scene: {
                cursors
            }
        } = this;

        if (!cursors.up.isDown && this.body.standing) {
            this.allowedToJump = true;
        }

        if (typeof this.state !== 'undefined') {
            this.state.execute(this);
        }
    }

    changeState (state) {
        this.state.onExit(this);
        this.state = state;
    }
}
