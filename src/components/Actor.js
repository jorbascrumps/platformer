import EventEmitter from 'eventemitter3';

import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

const MIN_SEPARATION = 1;

export default class Actor {

    #health = 4

    #isTouching = {
        left: null,
        ground: null,
        ladder: null,
        right: null,
    }

    constructor (scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.events = new EventEmitter();
        this.data = new Phaser.Data.DataManager(this, this.events);

        scene.sys.updateList.add(this);

        this.events.on(DAMAGE_RECEIVE, this.receiveDamage, this);
        this.events.on(STATE_CHANGE, this.changeState, this);
        this.scene.events.on('update', this.update, this);

        scene.matter.world.on('beforeupdate', this.resetTouching, this);
    }

    update () {
        if (typeof this.state !== 'undefined') {
            this.state.execute();
        }

        this.sprite.flipX = this.sprite.body.force.x < 0;
    }

    receiveDamage (val) {
        this.health -= val;
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
        if (bodyA === this.sensors.left) {
            this.#isTouching.left = bodyB;

            if (separation > MIN_SEPARATION) {
                this.sprite.x += separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.right) {
            this.#isTouching.right = bodyB;

            if (separation > MIN_SEPARATION) {
                this.sprite.x -= separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.bottom) {
            this.#isTouching.ground = bodyB;
        }
    }

    get isTouchingGround () {
        return this.#isTouching.ground;
    }

    get isTouchingLadder () {
        return this.#isTouching.ladder;
    }

    set isTouchingLadder (val) {
        this.#isTouching.ladder = val;

        return this;
    }

    get isTouchingLeft () {
        return this.#isTouching.left;
    }

    get isTouchingRight () {
        return this.#isTouching.right;
    }

    get health () {
        return this.#health;
    }

    set health (val) {
        this.#health = val;
    }

    resetTouching () {
        this.#isTouching.left = null;
        this.#isTouching.right = null;
        this.#isTouching.ground = null;
        this.#isTouching.ladder = null;
    }

}
