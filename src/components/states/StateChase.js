import State from './State';
import StatePatrol from './StatePatrol';

const SPEED = 100;
const REACTION_DISTANCE = 200;

export default class StateChase extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.accelGround = SPEED;
    }

    execute () {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.obj.x, this.obj.y, window.player.x, window.player.y);

        if (distanceToPlayer >= REACTION_DISTANCE) {
            return this.obj.changeState(new StatePatrol(this.obj));
        }

        const direction = this.obj.x - window.player.x > 0 ? -SPEED : SPEED;
        this.obj.body.accelGround = direction;
        this.obj.setVelocityX(this.obj.body.accelGround);
    }
}
