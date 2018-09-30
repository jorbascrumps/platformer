import State from './State';
import StateIdle from './StateIdle';
import StateJump from './StateJump';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED_WALK = 0.003;
const SPEED_RUN = 0.005;
const VELOCITY_MAX_WALK = 4;
const VELOCITY_MAX_RUN = 5;

export default class StateWalk extends State {

    execute () {
        const {
            target: {
                scene: {
                    cursors
                }
            },
            target
        } = this;

        if (target.isTouching.ground && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            return target.events.emit(STATE_CHANGE, StateJump);
        }

        if (!target.isTouching.left && cursors.left.isDown && cursors.right.isUp) {
            target.sprite.applyForce({ x: -SPEED_WALK, y: 0 });
        } else if (!target.isTouching.right && cursors.right.isDown && cursors.left.isUp) {
            target.sprite.applyForce({ x: SPEED_WALK, y: 0 });
        } else {
            target.events.emit(STATE_CHANGE, StateIdle);
        }

        const maxVelocity = target.isTouching.ground
            ?   VELOCITY_MAX_WALK
            :   VELOCITY_MAX_WALK / 3;
        const minVlocity = -maxVelocity;

        if (target.sprite.body.velocity.x > maxVelocity) {
            target.sprite.setVelocityX(maxVelocity);
        } else if (target.sprite.body.velocity.x < minVlocity) {
            target.sprite.setVelocityX(minVlocity);
        }

        // TODO: Pan camera down when down held
    }

}
