import State from './State';
import StateIdle from './StateIdle';

export default class StateLadder extends State {
    onEnter () {
        super.onEnter();

        this.obj.setGravity(0);
    }

    execute () {
        const {
            obj: {
                scene: {
                    cursors
                }
            }
        } = this;
        const groundTilePos = {
            x: this.obj.body.pos.x + (this.obj.body.size.x / 2),
            y: this.obj.body.pos.y + this.obj.body.size.y
        };
        const currentTileAtPosition = this.obj.scene.interactions.getTileAtWorldXY(groundTilePos.x, groundTilePos.y - 1, true);

        if (currentTileAtPosition.index !== 11) {
            return this.obj.emit('change_state', StateIdle);
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

        this.obj.setGravity(1);
    }
}
