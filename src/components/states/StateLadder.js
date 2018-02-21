import State from './State';
import StateIdle from './StateIdle';

export default class StateLadder extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.gravityFactor = 0;
    }

    execute () {
        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;
        const currentTileAtPosition = this.obj.scene.map.getTileAtWorldXY(
            this.obj.body.pos.x + (this.obj.body.size.x / 2),
            this.obj.body.pos.y + this.obj.body.size.y - 1,
            true
        );

        if (currentTileAtPosition.index !== 11) {
            return this.obj.changeState(new StateIdle(this.obj));
        }

        if (cursors.up.isDown) {
            this.obj.setVelocityY(-200);
        } else if (cursors.down.isDown) {
            this.obj.setVelocityY(200);
        } else {
            this.obj.setVelocityY(0);
        }

        if (cursors.left.isDown) {
            this.obj.setVelocityX(-200);
        } else if (cursors.right.isDown) {
            this.obj.setVelocityX(200);
        } else {
            this.obj.setVelocityX(0);
        }
    }

    onExit () {
        super.onExit();

        this.obj.body.gravityFactor = 1;
    }
}
