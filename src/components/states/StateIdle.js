import State from './State';
import StateAttack from './StateAttack';
import StateWalk from './StateWalk';

export default class StateIdle extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.offset = {
            x: this.obj.flipX ? 11 : 2,
            y: 9
        };
        this.obj.anims.play('enemyIdle');
    }

    execute () {
        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;
        const controlPressed = Object.keys(cursors).find(key => cursors[key].isDown);

        if (cursors.space.isDown) {
            return this.obj.changeState(new StateAttack(this.obj));
        }

        if (controlPressed) {
            return this.obj.changeState(new StateWalk(this.obj));
        }
    }
}
