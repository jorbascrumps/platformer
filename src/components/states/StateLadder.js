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
                    cursors
                }
            },
            target
        } = this;

        if (!target.isTouching.ladder) {
            return target.events.emit(STATE_CHANGE, StateIdle);
        }

        if (cursors.up.isDown) {
            target.sprite.setVelocityY(-2.5);
        } else if (cursors.down.isDown) {
            target.sprite.setVelocityY(2.5);
        } else {
            target.sprite.setVelocityY(0);
        }

        if (cursors.left.isDown) {
            target.sprite.setVelocityX(-2.5);
        } else if (cursors.right.isDown) {
            target.sprite.setVelocityX(2.5);
        } else {
            target.sprite.setVelocityX(0);
        }
    }

    onExit () {
        super.onExit();

        this.target.sprite
            .setIgnoreGravity(false);
    }

}
