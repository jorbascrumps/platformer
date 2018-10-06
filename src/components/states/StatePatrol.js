import State from './State';
import StateChase from './StateChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const REACTION_DISTANCE = 200;
const SPEED_WALK = 0.0005;
const SPEED_RUN = 0.005;
const VELOCITY_MAX_WALK = 4;
const VELOCITY_MAX_RUN = 5;

export default class StatePatrol extends State {

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
        const {
            direction = 1
        } = target.data.getAll();

        const distanceToPlayerX = Phaser.Math.Distance.Between(
            target.sprite.x + (target.sprite.displayWidth / 2),
            target.sprite.y + (target.sprite.displayHeight / 2),
            player.sprite.x,
            player.sprite.y
        );
        const isWithinChasingDistance = distanceToPlayerX <= REACTION_DISTANCE;

        if (isWithinChasingDistance) {
            return target.sprite.setVelocityX(0);
        }

        // if (this.obj.canSeePlayer && isWithinChasingDistance && (player.y >= self.y && self.y + self.height >= player.y)) {
        //     return self.emit(STATE_CHANGE, StateChase);
        // }

        const nextX = target.sprite.x + (target.sprite.displayWidth / 2 * direction);
        const nextY = target.sprite.y + (target.sprite.displayHeight / 2);
        const nextGroundTile = ground.getTileAtWorldXY(nextX, nextY, true);
        const nextAirTile = ground.getTileAtWorldXY(nextX, nextY - 1, true);

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
