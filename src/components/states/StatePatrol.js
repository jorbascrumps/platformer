import State from './State';
import StateChase from './StateChase';

const SPEED = 50;
const REACTION_DISTANCE = 200;

export default class StatePatrol extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.accelGround = this.obj.body.accelGround > 0 ? SPEED : -SPEED;
        this.obj.anims.play('enemyWalk');
    }

    execute () {
        const {
            obj: self
        } = this;

        const distanceToPlayerX = Phaser.Math.Distance.Between(self.x, self.y, window.player.x, window.player.y);
        const isWithinChasingDistance = distanceToPlayerX < REACTION_DISTANCE;

        if (isWithinChasingDistance && (window.player.y >= self.y && self.y + self.height >= window.player.y)) {
            return self.changeState(new StateChase(self));
        }

        const nextX = this.obj.body.accelGround > 1 ? this.obj.width + 1 : -1;
        const nextGroundTile = this.obj.scene.map.getTileAtWorldXY(this.obj.body.pos.x + nextX, this.obj.body.pos.y + 45);

        if (nextGroundTile === null) {
            this.obj.body.accelGround *= -1;
        }

        this.obj.flipX = this.obj.body.accelGround < 0;

        return self.setVelocityX(self.body.accelGround);
    }
}
