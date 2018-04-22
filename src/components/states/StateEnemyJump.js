import State from './State';
import StateIdle from './StateIdle';
import StateWalk from './StateWalk';
import {
    STATE_CHANGE
} from '@/constants/events';

export default class StateEnemyJump extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.offset = {
            x: this.obj.flipX ? 11 : 2,
            y: 9
        };

        this.obj.setVelocityY(-650);
    }

    execute () {
        const {
            obj: self
        } = this;

        self.setVelocityX(self.body.accelGround);

        if (self.body.standing) {
            return self.emit(STATE_CHANGE, self.previousState);
        }
    }
}
