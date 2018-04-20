import State from './State';
import StateAttack from './StateAttack';
import StateWalk from './StateWalk';
import StateFalling from './StateFalling';
import StateJump from './StateJump';
import StateLadder from './StateLadder';
import {
    STATE_CHANGE
} from '@/constants/events';

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
            return this.obj.emit(STATE_CHANGE, StateFalling);
        }

        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;
        const groundTilePos = {
            x: this.obj.body.pos.x + (this.obj.body.size.x / 2),
            y: this.obj.body.pos.y + this.obj.body.size.y
        };
        const currentTileAtPosition = this.obj.scene.interactions.getTileAtWorldXY(groundTilePos.x, groundTilePos.y - 1, true);
        const climbKeys = [ 'up', 'down' ];
        const climbKeysPressed = !!Object
            .keys(cursors)
            .filter(key => climbKeys.includes(key))
            .find(key => cursors[key].isDown);

        if (currentTileAtPosition.index === 11 && climbKeysPressed) {
            return this.obj.emit(STATE_CHANGE, StateLadder);
        }

        if (this.obj.body.standing && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            return this.obj.emit(STATE_CHANGE, StateJump);
        }

        if (cursors.space.isDown) {
            return this.obj.emit(STATE_CHANGE, StateAttack);
        }

        const movementKeys = [ 'left', 'right' ];
        const movementKeysPressed = !!Object
            .keys(cursors)
            .filter(key => movementKeys.includes(key))
            .find(key => cursors[key].isDown);

        if (movementKeysPressed) {
            return this.obj.emit(STATE_CHANGE, StateWalk);
        }
    }
}
