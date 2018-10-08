import State from './State';
import StateIdle from './StateIdle';
import {
    STATE_CHANGE
} from '@/constants/events';

export default class StateLadder extends State {

    onEnter () {
        super.onEnter();

        this.target.sprite
            .setIgnoreGravity(true)
            .setVelocity(0);
    }

    execute () {
        const {
            target: {
                scene: {
                    normalizedControls
                }
            },
            target
        } = this;

        if (!target.isTouchingLadder) {
            return target.events.emit(STATE_CHANGE, StateIdle);
        }

        target.sprite.setVelocityY(normalizedControls.verticalThreshold * 2.5);
        target.sprite.setVelocityX(normalizedControls.horizontalThreshold * 2.5);
    }

    onExit () {
        super.onExit();

        this.target.sprite
            .setIgnoreGravity(false);
    }

}
