import State from './State';
import StatePatrol from './StatePatrol';
import StateHit from './StateHit';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

export default class StateAttack extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                sprite
            },
        } = this;

        sprite.anims.play('enemyAttack');
        sprite.once('animationcomplete', this.onAnimComplete, this);
    }

    onAnimComplete () {
        const {
            target: {
                isTouchingLeft,
                isTouchingRight
            },
            target
        } = this;

        if (isTouchingLeft !== null || isTouchingRight !== null) {
            const {
                parent: {
                    gameObject: {
                        actor
                    }
                }
            } = isTouchingLeft || isTouchingRight;

            actor.events.emit(DAMAGE_RECEIVE, 1);
        }

        target.events.emit(STATE_CHANGE, StatePatrol);
    }

    // checkWeaponCollisionForFrame (target, anim, enemies) {
    //     const {
    //         anims: {
    //             currentFrame
    //         }
    //     } = target;
    //
    //     if (currentFrame.index !== 9) {
    //         return;
    //     }
    //
    //     const line = new Phaser.Geom.Line(
    //         target.flipX
    //             ? target.body.pos.x
    //             : target.body.pos.x + target.body.size.x,
    //         target.body.pos.y - target.body.size.x,
    //         target.flipX
    //             ? target.body.pos.x - (target.body.size.x * 2)
    //             : target.body.pos.x + (target.body.size.x * 3),
    //         target.body.pos.y + target.body.size.y
    //     );
    //
    //     enemies.children.each(enemy => {
    //         const rect = new Phaser.Geom.Rectangle(
    //             enemy.body.pos.x,
    //             enemy.body.pos.y,
    //             enemy.body.size.x,
    //             enemy.body.size.y
    //         );
    //
    //         const isHit = Phaser.Geom.Intersects.LineToRectangle(line, rect);
    //         isHit && enemy.changeState(new StateHit(enemy));
    //     });
    // }

}
