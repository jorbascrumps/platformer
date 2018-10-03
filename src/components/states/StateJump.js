import State from './State';
import StateWalk from './StateWalk';
import {
    STATE_CHANGE
} from '@/constants/events';

const VELOCITY_JUMP = -7;

export default class StateJump extends State {
    onEnter () {
        super.onEnter();

        this.target.sprite.setVelocityY(VELOCITY_JUMP);
    }

    execute () {
        const {
            target: {
                scene: {
                    cursors
                }
            },
            target
        } = this;

        if (target.isTouchingGround) {
            return target.events.emit(STATE_CHANGE, target.previousState);
        }

        if (cursors.left.isDown || cursors.right.isDown) {
            return target.events.emit(STATE_CHANGE, StateWalk);
        }
    }
}
