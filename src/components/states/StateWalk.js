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
                    normalizedControls
                }
            },
            target
        } = this;

        if (target.isTouchingGround && normalizedControls.jump) {
            return target.events.emit(STATE_CHANGE, StateJump);
        }

        if (normalizedControls.horizontalThreshold === 0) {
            return target.events.emit(STATE_CHANGE, StateIdle);
        }

        target.sprite.applyForce({
            x: SPEED_WALK * normalizedControls.horizontalThreshold,
            y: 0
        });

        const maxVelocity = target.isTouchingGround
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
