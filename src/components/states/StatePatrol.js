import State from './State';
import StateChase from './StateChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const REACTION_DISTANCE = 96;
const SPEED_WALK = 0.00025;
const SPEED_RUN = 0.005;
const VELOCITY_MAX_WALK = 4;
const VELOCITY_MAX_RUN = 5;

export default class StatePatrol extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                sprite
            }
        } = this;

        sprite.anims.play('enemyPatrol');
    }

    execute () {
        const {
            target: {
                scene: {
                    ground,
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

        if (target.isTouchingLeft) {
            target.data.set('direction', 1);
        } else if (target.isTouchingRight) {
            target.data.set('direction', -1);
        }

        const {
            direction = 1
        } = target.data.getAll();

        const isWithinChasingDistance = Phaser.Geom.Rectangle.ContainsPoint(visionRect, player.sprite);

        if (target.canSeePlayer && isWithinChasingDistance) {
            return target.events.emit(STATE_CHANGE, StateChase);
        }

        const nextX = target.sprite.x + (target.sprite.displayWidth / 2 * direction);
        const nextY = target.sprite.y + (target.sprite.displayHeight / 2);
        const nextGroundTile = ground.getTileAtWorldXY(nextX, nextY, true);
        const nextAirTile = ground.getTileAtWorldXY(nextX, nextY - (target.sprite.displayHeight / 2), true);

        if ((nextGroundTile === null || !nextGroundTile.collides) || (nextAirTile === null || nextAirTile.collides)) {
            target.sprite.setVelocity(0);

            return target.data.set('direction', direction * -1);
        }

        target.sprite.applyForce({ x: SPEED_WALK * direction, y: 0 });

        const maxVelocity = target.isTouchingGround
            ?   VELOCITY_MAX_WALK
            :   VELOCITY_MAX_WALK / 3;
        const minVlocity = -maxVelocity;

        if (target.sprite.body.velocity.x > maxVelocity) {
            target.sprite.setVelocityX(maxVelocity);
        } else if (target.sprite.body.velocity.x < minVlocity) {
            target.sprite.setVelocityX(minVlocity);
        }
    }

}
