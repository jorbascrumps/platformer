import State from './State';
import StateChase from './StateChase';

export default class StatePatrol extends State {
    onEnter () {
        this.obj.body.accelGround = this.obj.body.accelGround > 0 ? 100 : -100;
    }

    execute () {
        const nextX = this.obj.body.accelGround > 1 ? 33 : -1;
        const nextTile = this.obj.scene.map.getTileAtWorldXY(this.obj.body.pos.x + nextX, this.obj.body.pos.y + 45);

        if (nextTile === null) {
            this.obj.body.accelGround = this.obj.body.accelGround * -1;
        }

        const distanceToPlayerX = Phaser.Math.Distance.Between(this.obj.x, this.obj.y, window.player.x, window.player.y);

        if ((this.obj.y <= window.player.y + 16 && this.obj.y >= window.player.y - 16) && distanceToPlayerX < 200) {
            return this.obj.changeState(new StateChase(this.obj));
        }

        this.obj.setVelocityX(this.obj.body.accelGround);
    }
}
