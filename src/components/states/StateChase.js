import State from './State';
import {
    STATE_CHANGE
} from '@/constants/events';

const SPEED = 100;
const REACTION_DISTANCE = 200;

export default class StateChase extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.accelGround = SPEED;
        this.obj.anims.play('enemyWalk');
    }

    execute () {
        const {
            obj: self
        } = this;
        const player = players.getFirstAlive();
        const distanceToPlayer = Phaser.Math.Distance.Between(self.x, self.y, player.x, player.y);

        if (!self.canSeePlayer || distanceToPlayer >= REACTION_DISTANCE) {
            return self.emit(STATE_CHANGE, self.previousState);
        }

        const direction = self.x - player.x > 0 ? -SPEED : SPEED;
        self.body.offset = {
            x: direction < 0 ? 11 : 2,
            y: 9
        };

        self.flipX = direction < 0;

        self.body.accelGround = direction;
        self.setVelocityX(self.body.accelGround);
    }
}
