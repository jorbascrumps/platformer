import State from './State';
import StateIdle from './StateIdle';
import StateWalk from './StateWalk';

export default class StateJump extends State {
    onEnter () {
        super.onEnter();

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

        if (cursors.left.isDown || cursors.right.isDown) {
            return this.obj.changeState(new StateWalk(this.obj));
        }

        return this.obj.changeState(new StateIdle(this.obj));
    }
}
