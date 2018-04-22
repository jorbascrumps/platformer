import State from './State';
import StateEnemyJump from './StateEnemyJump';
import StatePatrol from './StatePatrol';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED = 100;
const REACTION_DISTANCE = 200;

export default class StateChase extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.accelGround = SPEED;
        this.obj.anims.play('enemyWalk');
    }

    execute () {
        const {
            obj: self
        } = this;
        const player = players.getFirstAlive();

        const distanceToPlayer = Phaser.Math.Distance.Between(self.x, self.y, player.x, player.y);
        const isWithinChasingDistance = distanceToPlayer < REACTION_DISTANCE;

        if (!self.canSeePlayer || !isWithinChasingDistance) {
            return self.emit(STATE_CHANGE, StatePatrol);
        }

        const direction = self.x - player.x > 0 ? -SPEED : SPEED;
        self.setVelocityX(direction);

        self.body.accelGround = direction;
        self.flipX = direction < 0;
        self.body.offset = {
            x: self.flipX ? 11 : 2,
            y: 9
        };


        const nextX = self.body.pos.x + (
            self.body.accelGround > 1
                ?   self.body.size.x + 1
                :   -1
        );
        const nextY = self.body.pos.y + self.body.size.y + 1;
        const nextAirTile = self.scene.ground.getTileAtWorldXY(nextX, nextY - (self.body.size.y / 2), true);

        if (nextAirTile.collides) {
            const jumpTargetX = self.body.pos.x + (
                self.body.accelGround > 1
                    ?   self.body.size.x + 32
                    :   -32
            );
            const jumpTargetY = self.body.pos.y - 16;
            const jumpTargetTile = self.scene.ground.getTileAtWorldXY(jumpTargetX, jumpTargetY);

            if (!jumpTargetTile) {
                return self.emit(STATE_CHANGE, StateEnemyJump);
            }
        }
    }
}
