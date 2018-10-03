import EventEmitter from 'eventemitter3';

import StateIdle from './states/StateIdle';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';
import LightSource from './LightSource';

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

class Entity {

    constructor (scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.events = new EventEmitter();
        
        scene.sys.updateList.add(this);

        this.events.on(STATE_CHANGE, this.changeState, this);
        this.scene.events.on('update', this.update, this);

        this.events.emit(STATE_CHANGE, StateIdle);
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

}

export default class Player extends Entity {

    constructor (scene, x, y) {
        super(scene, x, y);

        const sensorOptions = {
            isSensor: true
        };
        const sprite = this.scene.matter.add.sprite(0, 0, 'player', 0)
            .setDisplaySize(15, 30)
            .setSize(15, 30);
        const mainBody = Bodies.rectangle(0, 0, sprite.width, sprite.height, {
            chamfer: {
                radius: 4
            }
        });
        this.sensors = {
            right: Bodies.rectangle(sprite.width * 0.5, 0, 2, sprite.height * 0.5, sensorOptions),
            bottom: Bodies.rectangle(0, sprite.height * 0.5, sprite.width * 0.25, 2, sensorOptions),
            left: Bodies.rectangle(-sprite.width * 0.5, 0, 2, sprite.height * 0.5, sensorOptions)
        };
        const compoundBody = Body.create({
            parts: [
                mainBody,
                ...Object.values(this.sensors)
            ],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.05
        });
        this.sprite = sprite
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setPosition(x, y);

        this.isTouching = {
            left: false,
            right: false,
            ground: false
        };
        this.scene.matterCollision.addOnCollideStart({
            objectA: Object.values(this.sensors),
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: Object.values(this.sensors),
            callback: this.onSensorCollide,
            context: this
        });

        scene.matter.world.on('beforeupdate', this.resetTouching, this);
    }

    onSensorCollide ({ bodyA, bodyB, pair: { separation } }) {
        if (bodyB.isSensor) {
            return;
        }

        if (bodyA === this.sensors.left) {
            this.isTouching.left = true;

            if (separation > MIN_SEPARATION) {
                this.sprite.x += separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.right) {
            this.isTouching.right = true;

            if (separation > MIN_SEPARATION) {
                this.sprite.x -= separation - MIN_SEPARATION;
            }
        } else if (bodyA === this.sensors.bottom) {
            this.isTouching.ground = true;
        }
    }

    resetTouching () {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }

}

/*
export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.matter.world, x, y, 'enemyWalk');

        this.update.bind(this);
        this.changeState.bind(this);

        this.on(DAMAGE_RECEIVE, this.damage);
        this.on(STATE_CHANGE, this.changeState);

        this.setActiveCollision();
        this.setAvsB();
        this.setOrigin(0.5, 0.5);
        // this.setMaxVelocity(500);
        this.setFriction(2000, 100);
        this.setBodySize(10, 23);

        this.light = new LightSource({
            scene: this.scene,
            x: this.x,
            y: this.y,
            flicker: true,
            radius: 150
        })
            .startFollow(this);
        this.health = 5;
        this.hitGracePeriod = 1000;
        this.vulnerable = true;

        this.body.offset = {
            x: 2,
            y: 9
        };

        this.previousState = null;
        this.emit(STATE_CHANGE, StateIdle);
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
}
*/
