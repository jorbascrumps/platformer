import State from './State';
import StateIdle from './StateIdle';
import StateJump from './StateJump';

const SPEED = 200;

export default class StateWalk extends State {
    onEnter () {
        super.onEnter();

        this.obj.anims.play('enemyWalk');
    }

    execute () {
        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;

        if (cursors.up.isDown && this.obj.body.standing) {
            return this.obj.changeState(new StateJump(this.obj));
        }

        if (cursors.left.isDown && cursors.right.isUp) {
            this.obj.setVelocityX(-SPEED);
            this.obj.flipX = true;
        } else if (cursors.right.isDown && cursors.left.isUp) {
            this.obj.setVelocityX(SPEED);
            this.obj.flipX = false;
        } else {
            this.obj.changeState(new StateIdle(this.obj));
        }

        // TODO: Pan camera down when down held
    }
}
