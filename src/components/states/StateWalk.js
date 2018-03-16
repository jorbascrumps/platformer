import State from './State';
import StateIdle from './StateIdle';
import StateJump from './StateJump';

const SPEED = 200;

export default class StateWalk extends State {
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

        if (this.obj.allowedToJump && cursors.up.isDown) {
            return this.obj.emit('change_state', StateJump);
        }

        if (cursors.left.isDown && cursors.right.isUp) {
            this.obj.setVelocityX(-SPEED);
        } else if (cursors.right.isDown && cursors.left.isUp) {
            this.obj.setVelocityX(SPEED);
        } else {
            this.obj.emit('change_state', StateIdle);
        }

        // TODO: Pan camera down when down held
    }

    onExit () {
        this.obj.body.offset = {
            x: this.obj.flipX ? 11 : 2,
            y: 9
        };
    }
}
