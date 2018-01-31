import State from './State';
import StatePatrol from './StatePatrol';

export default class StateChase extends State {
    onEnter () {
        this.obj.body.accelGround = 200;
    }

    execute () {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.obj.x, this.obj.y, window.player.x, window.player.y);

        if (distanceToPlayer >= 200) {
            return this.obj.changeState(new StatePatrol(this.obj));
        }

        const direction = this.obj.x - window.player.x > 0 ? -200 : 200;
        this.obj.body.accelGround = direction;
        this.obj.setVelocityX(this.obj.body.accelGround);
    }
}
