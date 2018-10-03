import EventEmitter from 'eventemitter3';

import StateIdle from './states/StateIdle';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

const MIN_SEPARATION = 1;

export default class Actor {

    #isTouching = {
        left: false,
        ground: false,
        ladder: false,
        right: false,
    }

    constructor (scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.events = new EventEmitter();

        scene.sys.updateList.add(this);

        this.events.on(STATE_CHANGE, this.changeState, this);
        this.scene.events.on('update', this.update, this);

        this.events.emit(STATE_CHANGE, StateIdle);
        scene.matter.world.on('beforeupdate', this.resetTouching, this);
    }

    update () {
        if (typeof this.state !== 'undefined') {
            this.state.execute();
        }
    }

    changeState (state) {
        if (this.state) {
            this.state.onExit();
        }

        this.previousState = this.state;
        this.state = typeof state === 'function'
            ?   new state(this)
            :   new state.constructor(this);
    }

    onSensorCollide ({ bodyA, bodyB, pair: { separation } }) {
        if (bodyB.isSensor) {
            return this.#isTouching.ladder = true;
        }

        if (bodyA === this.sensors.left) {
            this.#isTouching.left = true;

            if (separation > MIN_SEPARATION) {
                this.sprite.x += separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.right) {
            this.#isTouching.right = true;

            if (separation > MIN_SEPARATION) {
                this.sprite.x -= separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.bottom) {
            this.#isTouching.ground = true;
        }
    }

    get isTouchingGround () {
        return this.#isTouching.ground;
    }

    get isTouchingLadder () {
        return this.#isTouching.ladder;
    }

    get isTouchingLeft () {
        return this.#isTouching.left;
    }

    get isTouchingRight () {
        return this.#isTouching.right;
    }

    resetTouching () {
        this.#isTouching.left = false;
        this.#isTouching.right = false;
        this.#isTouching.ground = false;
        this.#isTouching.ladder = false;
    }

}
