import Trekker  from 'trekker';

import State from './State';
import StateSleep from './StateSleep';
import StateFlyChase from './StateFlyChase';
import {
    STATE_CHANGE
} from '@/constants/events';

const REACTION_DISTANCE = 128;
const PATH_DISTANCE = 1000;
const CHASE_DELAY = 1500;

export default class StateFlyPathTo extends State {

    onEnter () {
        super.onEnter();

        const {
            target: {
                scene: {
                    ground: {
                        layer: {
                            data
                        }
                    },
                    player,
                },
                scene,
                sprite
            },
        } = this;

        this.chaseDelay = null;

        const grid = data.map(row =>
            row.map(({ index }) =>
                Number(index === -1)
            )
        );
        const start = [ sprite.x, sprite.y ];
        const end = [ Math.floor(player.sprite.x / 32), Math.floor(player.sprite.y / 32) ];
        const path = new Phaser.Curves.Spline(
            new Trekker(grid)
                .setDiagonalMode(Trekker.DIAGONAL_MODE.NO_OBSTACLES)
                .search(Math.floor(start[0] / 32), Math.floor(start[1] / 32), end[0], end[1])
                .reduce((p, { x, y }) => ([
                    ...p,
                    x * 32 + 16,
                    y * 32 + 16
                ]), start)
        );

        sprite.pathFollower = scene.plugins.get('pathFollower').add(sprite, {
            path,
            t: 0,
        });

        this.tween = scene.tweens.add({
            targets: sprite.pathFollower,
            t: 1,
            ease: 'Linear',
            duration: 575 * (path.getPoints().length + 1),
            repeat: 0,
            onComplete: this.onPathComplete,
            onCompleteScope: this
        });

        sprite.anims.play('enemyFlying');
    }

    execute () {
        const {
            target: {
                scene: {
                    player
                },
                scene,
                sprite
            },
            target
        } = this;

        const visionRect = new Phaser.Geom.Rectangle(
            target.sprite.x - REACTION_DISTANCE,
            target.sprite.y - REACTION_DISTANCE,
            REACTION_DISTANCE * 2,
            REACTION_DISTANCE * 2
        );
        const pathRect = new Phaser.Geom.Rectangle(
            target.sprite.x - PATH_DISTANCE,
            target.sprite.y - PATH_DISTANCE,
            PATH_DISTANCE * 2,
            PATH_DISTANCE * 2
        );

        if (target.debug) {
            this.debugGraphic
                .clear()
                .strokeRectShape(visionRect)
                .strokeRectShape(pathRect);

            if (sprite.pathFollower) {
                sprite.pathFollower.path.draw(this.debugGraphic);
            }
        }

        const isWithinChasingDistance = Phaser.Geom.Rectangle.ContainsPoint(visionRect, player.sprite);
        const isWithinPathingDistance = Phaser.Geom.Rectangle.ContainsPoint(pathRect, player.sprite);

        if (isWithinChasingDistance && target.canSeePlayer) {
            if (!this.chaseDelay) {
                this.chaseDelay = scene.time.delayedCall(
                    CHASE_DELAY,
                    () => target.events.emit(STATE_CHANGE, StateFlyChase),
                    [],
                    this
                );
            }
        }

        if (!isWithinPathingDistance && !sprite.pathFollower) {
            return target.events.emit(STATE_CHANGE, StateSleep);
        }

        if (sprite.pathFollower !== null) {
            return;
        }

        return target.events.emit(STATE_CHANGE, this);
    }

    onExit () {
        super.onExit();

        const {
            target: {
                sprite
            }
        } = this;

        sprite.pathFollower = null;

        this.tween.stop();
    }

    onPathComplete () {
        const {
            target: {
                sprite
            }
        } = this;

        sprite.pathFollower = null;
    }

}
