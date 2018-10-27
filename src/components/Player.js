import Actor from './Actor';
import EnemyBase from './EnemyBase';
import ActorSprite from './ActorSprite';
import LightSource from './LightSource';
import StateIdle from './states/StateIdle';
import StateJump from './states/StateJump';
import {
    STATE_CHANGE
} from '@/constants/events';

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

export default class Player extends Actor {

    constructor (scene, x, y) {
        super(scene, x, y);

        const sensorOptions = {
            isSensor: true,
            label: 'playerSensor'
        };

        const sprite = new ActorSprite(scene.matter.world, 0, 0, 'player', 0)
            .setActor(this)
            .setDisplaySize(16, 32)
            .setSize(16, 32);
        const mainBody = Bodies.rectangle(0, 0, sprite.width, sprite.height, {
            chamfer: {
                radius: 4
            },
            label: 'playerSensor'
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
            friction: 0.05,
            render: {
                sprite: {
                    xOffset: 1,
                    yOffset: 0.3
                }
            },
            label: 'playerBody'
        });
        this.sprite = sprite
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setPosition(x, y);

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
