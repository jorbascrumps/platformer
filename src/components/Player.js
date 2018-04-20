import StateIdle from './states/StateIdle';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';
import LightSource from './LightSource';

export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        this.setActive();
        this.setAvsB();
        this.setOrigin(0.5, 0.5);
        this.setMaxVelocity(500);
        this.setFriction(2000, 100);
        this.setBodySize(10, 23);

        this.light = new LightSource({
            scene: this.scene,
            x: this.x,
            y: this.y,
            flicker: true,
            radius: 200
        })
            .startFollow(this);

        this.previousState = null;
        this.state = new StateIdle(this);
        this.health = 5;
        this.hitGracePeriod = 1000;
        this.vulnerable = true;

        this.body.offset = {
            x: 2,
            y: 9
        };

        this.update.bind(this);
        this.changeState.bind(this);

        this.on(DAMAGE_RECEIVE, this.damage);
        this.on(STATE_CHANGE, this.changeState);
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

    preUpdate (...args) {
        this.update(...args);
    }

    update () {
        const {
            scene: {
                cursors
            }
        } = this;

        if (typeof this.state !== 'undefined') {
            this.state.execute(this);
        }
    }

    changeState (state) {
        this.state.onExit(this);

        this.previousState = this.state;
        this.state = new state(this);
    }
}
