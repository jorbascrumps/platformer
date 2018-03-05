import StateIdle from './states/StateIdle';

export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        this.setActive();
        this.setAvsB();
        this.setOrigin(0.5, 0.5);
        this.setMaxVelocity(500);
        this.setFriction(2000, 100);
        this.setBodySize(10, 23);

        this.state = new StateIdle(this);
        this.health = 50;
        this.hitGracePeriod = 1000;
        this.vulnerable = true;

        this.body.offset = {
            x: 2,
            y: 9
        };

        this.damage.bind(this);
        this.update.bind(this);
        this.changeState.bind(this);
    }

    damage (v) {
        if (!this.vulnerable) {
            return;
        }

        const value = parseInt(v, 10);
        const newHealth = this.health - value;

        if (newHealth <= 0) {
            alert('Game over!');
        }

        this.health = newHealth;
        this.vulnerable = false;
        this.scene.time.delayedCall(this.hitGracePeriod, () => this.vulnerable = true);
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
