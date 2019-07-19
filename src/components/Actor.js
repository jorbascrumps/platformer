import EventEmitter from 'eventemitter3';

import ActorSprite from './ActorSprite';

import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

const MIN_SEPARATION = 1;

const {
    Physics: {
        Matter: {
            Matter: {
                Body,
                Bodies
            }
        }
    }
} = Phaser;

export default class Actor {

    #debug = false

    #health = 4

    #isTouching = {
        door: null,
        ladder: null,
        left: null,
        ground: null,
        right: null,
    }

    constructor (scene, x, y, spritesheet) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.events = new EventEmitter();
        this.data = new Phaser.Data.DataManager(this, this.events);
        this.debugGraphic = scene.add.graphics()
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

        this.sprite = new ActorSprite(scene.matter.world, 0, 0, spritesheet, 0)
            .setActor(this)
            .setDisplaySize(16, 32)
            .setDepth(0)
            .setPosition(x, y)
            .setSize(16, 32)
        ;

        this.events.on(DAMAGE_RECEIVE, this.receiveDamage, this);
        this.events.on(STATE_CHANGE, this.changeState, this);

        this.scene.matter.world.on('beforeupdate', this.resetTouching, this);
        this.scene.events.on('update', this.update, this);
        this.scene.events.on('shutdown', this.destroy, this);
    }

    update (...args) {
        if (!this.sprite.active) {
            return;
        }

        if (typeof this.state !== 'undefined') {
            this.state.execute(...args);
        }

        this.sprite.flipX = this.sprite.body.force.x > 0;
    }

    setPhysicsBody ({
        body: {
            height: bodyHeight = this.sprite.displayHeight,
            width: bodyWidth = this.sprite.displayWidth,
        } = {},
        ignoreGravity = false,
        sprite: {
            offset: {
                x: spriteXOffset = 0,
                y: spriteYOffset = 0,
            } = {},
        } = {},
    } = {}) {
        const sensorOptions = {
            gameObject: this,
            isSensor: true,
            label: 'playerSensor'
        };
        const mainBody = Bodies.rectangle(this.x, this.y, bodyWidth, bodyHeight, {
            chamfer: {
                radius: 4,
            },
            gameObject: this,
        });
        this.sensors = {
            right: Bodies.rectangle(this.x + (bodyWidth * 0.5), this.y, 2, bodyHeight * 0.5, sensorOptions),
            bottom: Bodies.rectangle(this.x, this.y + (bodyHeight * 0.5), bodyWidth * 0.25, 2, sensorOptions),
            left: Bodies.rectangle(this.x - (bodyWidth * 0.5), this.y, 2, bodyHeight * 0.5, sensorOptions)
        };
        const compoundBody = Body.create({
            parts: [
                mainBody,
                ...Object.values(this.sensors)
            ],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.05,
            render: {
                sprite: {
                    xOffset: spriteXOffset,
                    yOffset: spriteYOffset,
                }
            },
            label: 'playerBody'
        });

        this.sprite
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setIgnoreGravity(ignoreGravity)
        ;

        this.scene.matterCollision.addOnCollideStart({
            objectA: Object.values(this.sensors),
            callback: this.onSensorCollide,
            context: this,
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: Object.values(this.sensors),
            callback: this.onSensorCollide,
            context: this,
        });
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

    get isTouchingDoor () {
        return this.#isTouching.door;
    }

    set isTouchingDoor (val) {
        this.#isTouching.door = val;

        return this;
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
        this.#isTouching.door = null;
        this.#isTouching.left = null;
        this.#isTouching.right = null;
        this.#isTouching.ground = null;
        this.#isTouching.ladder = null;
    }

    get debug () {
        return this.#debug;
    }

    setDebug (val) {
        this.#debug = Boolean(val);

        return this;
    }

    destroy () {
        this.scene.events.off('update', this.update, this);
        this.events.removeAllListeners();
        this.state = undefined;
        this.sprite.destroy();
    }

}
