import Actor from './Actor';
import EnemyBase from './EnemyBase';
import LightSource from './LightSource';
import StateIdle from './states/StateIdle';
import StateJump from './states/StateJump';
import {
    STATE_CHANGE
} from '@/constants/events';

export default class Player extends Actor {

    constructor (scene, x, y) {
        super(scene, x, y, 'player');

        this.setPhysicsBody({
            sprite: {
                offset: {
                    x: 1,
                    y: 0.3,
                },
            },
        });

        this.events.emit(STATE_CHANGE, StateIdle);
    }

    onSensorCollide ({ bodyA, bodyB, gameObjectB }) {
        if (bodyA === this.sensors.bottom) {
            if (bodyB.gameObject instanceof EnemyBase) {
                bodyB.gameObject.destroy();

                return this.events.emit(STATE_CHANGE, StateJump);
            }
        }

        if (bodyB.gameObject instanceof Phaser.Tilemaps.Tile) {
            const {
                isClimbable,
                isDoor
            } = bodyB.gameObject.properties;

            if (isDoor === 'true') {
                return this.isTouchingDoor = bodyB.gameObject;
            }

            if (isClimbable === 'true') {
                return this.isTouchingLadder = bodyB.gameObject;
            }
        }

        return super.onSensorCollide(...arguments);
    }

}
