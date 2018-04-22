import State from './State';
import StateWalk from './StateWalk';
import {
    STATE_CHANGE
} from '@/constants/events';

export default class StateJump extends State {
    onEnter () {
        super.onEnter();

        const {
            obj: self
        } = this;
        const {
            scene: {
                cursors
            }
        } = self;

        if (cursors.left.isDown) {
            self.flipX = true;
        } else if (cursors.right.isDown) {
            self.flipX = false;
        }

        self.body.offset = {
            x: self.flipX ? 11 : 2,
            y: 9
        };

        self.setVelocityY(-650);
    }

    execute () {
        const {
            obj: self
        } = this;
        const {
            scene: {
                cursors
            }
        } = self;

        if (self.body.standing) {
            return self.emit(STATE_CHANGE, self.previousState);
        }

        if (cursors.left.isDown || cursors.right.isDown) {
            return self.emit(STATE_CHANGE, StateWalk);
        }
    }
}
