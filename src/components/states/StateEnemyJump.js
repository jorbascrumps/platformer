import State from './State';
import StateChase from './StateChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const VELOCITY_JUMP = -6;

export default class StateEnemyJump extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                sprite
            },
        } = this;

        this.velocityX = sprite.body.velocity.x;

        sprite.setVelocityY(VELOCITY_JUMP);
    }

    execute () {
        const {
            target
        } = this;

        target.sprite.setVelocityX(this.velocityX);

        if (target.isTouchingGround) {
            target.events.emit(STATE_CHANGE, StateChase);
        }
    }

}
