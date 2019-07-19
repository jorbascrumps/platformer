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

        this.sprite
            .setDisplaySize(22, 22)
            .setSize(32, 16)
            .setTint(0xce4a4a)
        ;

        this.setPhysicsBody({
            body: {
                height: 16,
                width: 16,
            },
            ignoreGravity: true,
            sprite: {
                offset: {
                    x: 0,
                    y: 0.05,
                },
            },
        });

        this.events.emit(STATE_CHANGE, StateSleep);
    }

}
