import State from './State';
import StateAttack from './StateAttack';
import StatePatrol from './StatePatrol';
import StateEnemyJump from './StateEnemyJump';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED_RUN = 0.00005;
const VELOCITY_MAX_RUN = 1;
const REACTION_DISTANCE = 128;
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

        const vision = new Phaser.Geom.Rectangle(
            target.sprite.x - REACTION_DISTANCE,
            target.sprite.y - REACTION_DISTANCE,
            REACTION_DISTANCE * 2,
            REACTION_DISTANCE * 2
        );
        const attackRect = new Phaser.Geom.Rectangle(
            target.sprite.x - ATTACK_DISTANCE,
            target.sprite.y - ATTACK_DISTANCE,
            ATTACK_DISTANCE * 2,
            ATTACK_DISTANCE * 2
        );

        if (target.debug) {
            this.debugGraphic
                .clear()
                .strokeRectShape(vision)
                .strokeRectShape(attackRect);
        }

        const isWithinChasingDistance = Phaser.Geom.Rectangle.ContainsPoint(vision, player.sprite);
        const isWithinAttackingDistance = Phaser.Geom.Rectangle.ContainsPoint(attackRect, player.sprite)

        if (isWithinAttackingDistance && !this.cooldownTimer) {
            return target.events.emit(STATE_CHANGE, StateAttack);
        }

        if (!isWithinChasingDistance) {
            if (!this.amnesiaTimer) {
                this.amnesiaTimer = scene.time.delayedCall(
                    MEMORY_LIMIT,
                    () => target.events.emit(STATE_CHANGE, StatePatrol),
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

        const direction = -Math.sign(target.sprite.body.force.x);
        const nextX = target.sprite.x + (14 * direction);
        const nextY = target.sprite.y;
        const nextAirTile = scene.ground.getTileAtWorldXY(nextX, nextY, true);

        if (target.isTouchingGround && (nextAirTile && nextAirTile.collides)) {
            return target.events.emit(STATE_CHANGE, StateEnemyJump);
        }
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
