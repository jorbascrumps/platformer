export default class extends Phaser.Plugins.BasePlugin {

    init (sceneKey) {
        this.scene = this.game.scene.getScene(sceneKey);
    }
    
    get jump () {
        const {
            scene: {
                cursors,
                input: {
                    gamepad
                }
            }
        } = this;
        const controller = gamepad.getPad(0);

        return controller.A || Phaser.Input.Keyboard.JustDown(cursors.up);
    }

    get horizontalThreshold () {
        const {
            scene: {
                cursors,
                input: {
                    gamepad
                }
            }
        } = this;
        const controller = gamepad.getPad(0);

        if (controller.leftStick.x !== 0) {
            return controller.leftStick.x;
        }

        if (cursors.right.isDown) {
            return 1;
        } else if (cursors.left.isDown) {
            return -1;
        }

        return 0;
    }
    
}
