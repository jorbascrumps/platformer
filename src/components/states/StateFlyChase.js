import State from './State';
import StateFlyPathTo from './StateFlyPathTo';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED_RUN = 0.00005;
const VELOCITY_MAX_RUN = 1;
const REACTION_DISTANCE = 160;
const ATTACK_DISTANCE = 18;
const ATTACK_COOLDOWN = 1500;

export default class StateFlyChase extends State {

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
            return;
        }

        if (!target.canSeePlayer || !isWithinChasingDistance) {
            return target.events.emit(STATE_CHANGE, StateFlyPathTo);
        }

        let x = 0;
        let y = 0;

        if (target.sprite.y < player.sprite.y) {
            y = SPEED_RUN;
        } else if (target.sprite.y > player.sprite.y) {
            y = -SPEED_RUN;
        }

        if (target.sprite.x < player.sprite.x && !target.isTouchingRight) {
            x = -SPEED_RUN;
            target.sprite.setVelocityX(VELOCITY_MAX_RUN);
        } else if (target.sprite.x > player.sprite.x && !target.isTouchingLeft) {
            x = SPEED_RUN;
            target.sprite.setVelocityX(-VELOCITY_MAX_RUN);
        }

        target.sprite.applyForce({ x, y });
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
