import StatePatrol from './states/StatePatrol';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

export default class Enemy extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        this.update.bind(this);
        this.changeState.bind(this);

        this.on(STATE_CHANGE, this.changeState);

        this.setOrigin(0, 0);
        this.setMaxVelocity(500);
        this.setFriction(2000, 100);
        this.setBodySize(10, 23);
        this.setActiveCollision();
        this.setAvsB();
        this.setCollideCallback(this.collide, this);

        this.canSeePlayer = false;
        this.body.accelGround = Phaser.Math.RND.between(-1, 1);

        this.body.offset = {
            x: 2,
            y: 9
        };

        this.previousState = null;
        this.emit(STATE_CHANGE, StatePatrol);
    }

    collide (enemy, player) {
        const {
            gameObject: playerObject
        } = player;

        playerObject.emit(DAMAGE_RECEIVE, 1);
    }

    preUpdate (...args) {
        this.update(...args);
    }

    update () {
        if (typeof this.state !== 'undefined') {
            this.state.execute(this);
        }

        const player = window.players.getFirstAlive();
        const line = new Phaser.Geom.Line(this.body.pos.x, this.body.pos.y, player.body.pos.x, player.body.pos.y);

        const x = this.body.pos.x > player.body.pos.x
            ?   player.body.pos.x
            :   this.body.pos.x;
        const y = this.body.pos.y > player.body.pos.y
            ?   player.body.pos.y
            :   this.body.pos.y;
        const w = this.body.pos.x > player.body.pos.x
            ?   this.body.pos.x - player.body.pos.x
            :   player.body.pos.x;
        const h = this.body.pos.y > player.body.pos.y
            ?   this.body.pos.y - player.body.pos.y
            :   player.body.pos.y - this.body.pos.y;
        this.canSeePlayer = !this.scene.ground.getTilesWithinWorldXY(x, y, w, h, {
                isNotEmpty: true
            })
            .filter(tile => Phaser.Geom.Intersects.LineToRectangle(line, tile.getBounds()))
            .length;
    }

    changeState (state) {
        if (this.state) {
            this.state.onExit(this);
        }

        this.previousState = this.state;
        this.state = typeof state === 'function'
            ?   new state(this)
            :   new state.constructor(this);
    }
}
