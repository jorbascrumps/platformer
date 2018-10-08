import State from './State';
import StateAttack from './StateAttack';
import StateEnemyJump from './StateEnemyJump';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED_RUN = 0.00005;
const VELOCITY_MAX_RUN = 1;
const REACTION_DISTANCE = 150;
const ATTACK_DISTANCE = 18;
const MEMORY_LIMIT = 1500;
const ATTACK_COOLDOWN = 1500;

export default class StateChase extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                scene
            }
        } = this;

        this.amnesiaTimer = null;

        this.cooldownTimer = scene.time.addEvent({
            delay: ATTACK_COOLDOWN,
            callback: this.onCooldownComplete,
            callbackScope: this
        });
    }

    execute () {
        const {
            target: {
                scene: {
                    player
                },
                scene
            },
            target
        } = this;

        const distanceToPlayer = Phaser.Math.Distance.Between(
            target.sprite.x,
            target.sprite.y,
            player.sprite.x,
            player.sprite.y
        );
        const isWithinChasingDistance = distanceToPlayer < REACTION_DISTANCE;
        const isWithinAttackingDistance = distanceToPlayer < ATTACK_DISTANCE;
        // console.log(this.cooldownTimer);
        if (isWithinAttackingDistance && !this.cooldownTimer) {
            return target.events.emit(STATE_CHANGE, StateAttack);
        }

        if (!isWithinChasingDistance) {
            if (!this.amnesiaTimer) {
                this.amnesiaTimer = scene.time.delayedCall(
                    MEMORY_LIMIT,
                    () => target.events.emit(STATE_CHANGE, target.previousState),
                    [],
                    this
                );
            }

            return;
        }

        if (target.sprite.x < player.sprite.x && !target.isTouchingRight) {
            target.sprite.applyForce({ x: -SPEED_RUN, y: 0 });
            target.sprite.setVelocityX(VELOCITY_MAX_RUN);
        } else if (target.sprite.x > player.sprite.x && !target.isTouchingLeft) {
            target.sprite.applyForce({ x: SPEED_RUN, y: 0 });
            target.sprite.setVelocityX(-VELOCITY_MAX_RUN);
        }

        // const nextY = self.body.pos.y + self.body.size.y + 1;
        // const nextAirTile = self.scene.ground.getTileAtWorldXY(nextX, nextY - (self.body.size.y / 2), true);

        // if (nextAirTile.collides) {
        //     const jumpTargetX = self.body.pos.x + (
        //         self.body.accelGround > 1
        //             ?   self.body.size.x + 32
        //             :   -32
        //     );
        //     const jumpTargetY = self.body.pos.y - 16;
        //     const jumpTargetTile = self.scene.ground.getTileAtWorldXY(jumpTargetX, jumpTargetY);
        //
        //     if (!jumpTargetTile) {
        //         return self.emit(STATE_CHANGE, StateEnemyJump);
        //     }
        // }
    }

    onExit () {
        super.onExit();

        if (this.amnesiaTimer) {
            this.amnesiaTimer.remove(false);
        }

        if (this.cooldownTimer) {
            this.cooldownTimer.remove(false);
        }
    }
    
    onCooldownComplete () {
        this.cooldownTimer.remove(false)
        this.cooldownTimer = null;
    }

}
