import EnemyBase from './EnemyBase';
import StatePatrol from './states/StatePatrol';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

export default class Enemy extends EnemyBase {

    constructor (scene, x, y) {
        super(scene, x, y, 'player');

        this.sprite
            .setDisplaySize(40, 40)
            .setTint(0xce4a4a)
        ;

        this.setPhysicsBody({
            body: {
                height: 32,
                width: 16,
            },
            sprite: {
                offset: {
                    y: 0.15,
                },
            },
        });

        this.events.emit(STATE_CHANGE, StatePatrol);
    }

    onSensorCollide ({ bodyA, bodyB }) {
        if (bodyB.isSensor && bodyB.label.indexOf('player') !== 0) {
            return;
        }

        return super.onSensorCollide(...arguments);
    }

}
