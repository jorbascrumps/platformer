import State from './State';
import StateIdle from './StateIdle';
import StateWalk from './StateWalk';
import {
    STATE_CHANGE
} from '@/constants/events';

export default class StateJump extends State {
    onEnter () {
        super.onEnter();

        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;

        if (cursors.left.isDown) {
            this.obj.flipX = true;
        } else if (cursors.right.isDown) {
            this.obj.flipX = false;
        }

        this.obj.body.offset = {
            x: this.obj.flipX ? 11 : 2,
            y: 9
        };

        this.obj.setVelocityY(-500);
    }

    execute () {
        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;

        if (this.obj.body.standing) {
            return this.obj.emit(STATE_CHANGE, StateIdle);
        }

        if (cursors.left.isDown || cursors.right.isDown) {
            return this.obj.emit(STATE_CHANGE, StateWalk);
        }
    }
}
