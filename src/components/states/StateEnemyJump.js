import State from './State';
import StateChase from './StateChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const VELOCITY_JUMP = -7;

export default class StateEnemyJump extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                sprite
            },
        } = this;

        sprite.setVelocityY(VELOCITY_JUMP);
    }

    execute () {
        const {
            target
        } = this;

        if (target.isTouchingGround) {
            target.events.emit(STATE_CHANGE, StateChase);
        }
    }

}
