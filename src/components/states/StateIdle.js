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

    execute () {
        const {
            target: {
                scene: {
                    normalizedControls
                }
            },
            target
        } = this;

        /*
        if (this.target.vel.y > 1000) {
            return this.target.emit(STATE_CHANGE, StateFalling);
        }

        const groundTilePos = {
            x: this.target.body.pos.x + (this.target.body.size.x / 2),
            y: this.target.body.pos.y + this.target.body.size.y
        };
        const currentTileAtPosition = this.target.scene.interactions.getTileAtWorldXY(groundTilePos.x, groundTilePos.y - 1, true);
        const climbKeys = [ 'up', 'down' ];
        const climbKeysPressed = !!Object
            .keys(cursors)
            .filter(key => climbKeys.includes(key))
            .find(key => cursors[key].isDown);

        if (currentTileAtPosition.index === 11 && climbKeysPressed) {
            return this.target.emit(STATE_CHANGE, StateLadder);
        }

        if (cursors.space.isDown) {
            return this.target.emit(STATE_CHANGE, StateAttack);
        }
        */

        if (target.isTouchingLadder && normalizedControls.verticalThreshold !== 0) {
            return target.events.emit(STATE_CHANGE, StateLadder);
        }

        if (normalizedControls.jump) {
            if (target.isTouchingGround) {
                return target.events.emit(STATE_CHANGE, StateJump);
            }
        }

        if (normalizedControls.horizontalThreshold !== 0) {
            return target.events.emit(STATE_CHANGE, StateWalk);
        }
    }

}
