import State from './State';
import StateFlyChase from './StateFlyChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const REACTION_DISTANCE = 128;

export default class StateSleep extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                sprite
            }
        } = this;

        sprite.anims.play('enemyFlying');
    }

    execute () {
        const {
            target: {
                scene: {
                    player
                }
            },
            target
        } = this;

        const visionRect = new Phaser.Geom.Rectangle(
            target.sprite.x - REACTION_DISTANCE,
            target.sprite.y - REACTION_DISTANCE,
            REACTION_DISTANCE * 2,
            REACTION_DISTANCE * 2
        );

        if (target.debug) {
            this.debugGraphic
                .clear()
                .strokeRectShape(visionRect);
        }

        const isWithinChasingDistance = Phaser.Geom.Rectangle.ContainsPoint(visionRect, player.sprite);

        if (target.canSeePlayer && isWithinChasingDistance) {
            return target.events.emit(STATE_CHANGE, StateFlyChase);
        }
    }

}
