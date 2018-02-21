import State from './State';
import StateAttack from './StateAttack';
import StateWalk from './StateWalk';
import StateFalling from './StateFalling';
import StateJump from './StateJump';
import StateLadder from './StateLadder';

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
        if (this.obj.vel.y > 1000) {
            return this.obj.changeState(new StateFalling(this.obj));
        }

        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;
        const currentTileAtPosition = this.obj.scene.map.getTileAtWorldXY(
            this.obj.body.pos.x + (this.obj.body.size.x / 2),
            this.obj.body.pos.y + this.obj.body.size.y - 1,
            true
        );
        const climbKeys = [ 'up', 'down' ];
        const climbKeysPressed = !!Object
            .keys(cursors)
            .filter(key => climbKeys.includes(key))
            .find(key => cursors[key].isDown);

        if (currentTileAtPosition.index === 11 && climbKeysPressed) {
            return this.obj.changeState(new StateLadder(this.obj));
        }

        if (this.obj.allowedToJump && cursors.up.isDown) {
            return this.obj.changeState(new StateJump(this.obj));
        }

        if (cursors.space.isDown) {
            return this.obj.changeState(new StateAttack(this.obj));
        }

        const movementKeys = [ 'left', 'right' ];
        const movementKeysPressed = !!Object
            .keys(cursors)
            .filter(key => movementKeys.includes(key))
            .find(key => cursors[key].isDown);

        if (movementKeysPressed) {
            return this.obj.changeState(new StateWalk(this.obj));
        }
    }
}
