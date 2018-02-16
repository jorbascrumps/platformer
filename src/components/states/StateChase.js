import State from './State';
import StatePatrol from './StatePatrol';

const SPEED = 100;
const REACTION_DISTANCE = 200;

export default class StateChase extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.accelGround = SPEED;
        this.obj.anims.play('enemyWalk');
    }

    execute () {
        const player = players.getFirstAlive();
        const distanceToPlayer = Phaser.Math.Distance.Between(this.obj.x, this.obj.y, player.x, player.y);

        if (!this.obj.canSeePlayer || distanceToPlayer >= REACTION_DISTANCE) {
            return this.obj.changeState(new StatePatrol(this.obj));
        }

        const direction = this.obj.x - player.x > 0 ? -SPEED : SPEED;
        this.obj.body.offset = {
            x: direction < 0 ? 11 : 2,
            y: 9
        };

        this.obj.flipX = direction < 0;

        this.obj.body.accelGround = direction;
        this.obj.setVelocityX(this.obj.body.accelGround);
    }
}
