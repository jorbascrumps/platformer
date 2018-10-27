import EnemyBase from './EnemyBase';
import ActorSprite from './ActorSprite';
import StateSleep from './states/StateSleep';
import {
    STATE_CHANGE,
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

export default class Flying extends EnemyBase {

    constructor (scene, x, y) {
        super(scene, x, y);

        const sensorOptions = {
            isSensor: true
        };
        const sprite = new ActorSprite(scene.matter.world, 0, 0, 'enemyFlying', 0)
            .setActor(this)
            .setDisplaySize(32, 32)
            .setSize(32, 16);
        const mainBody = Bodies.rectangle(0, 0, 16, 16, {
            chamfer: {
                radius: 4
            }
        });
        this.sensors = {
            right: Bodies.rectangle(8, 0, 2, sprite.height * 0.5, sensorOptions),
            bottom: Bodies.rectangle(0, sprite.height * 0.5, sprite.width * 0.25, 2, sensorOptions),
            left: Bodies.rectangle(-8, 0, 2, sprite.height * 0.5, sensorOptions)
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
                    xOffset: 0,
                    yOffset: 0.1
                }
            }
        });
        this.sprite = sprite
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setIgnoreGravity(true)
            .setPosition(x, y)
            .setTint(0xce4a4a);

        this.events.emit(STATE_CHANGE, StateSleep);
    }

}
