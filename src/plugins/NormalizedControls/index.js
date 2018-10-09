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
        const [
            controller = {}
        ] = gamepad.getAll();

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
        const [
            {
                leftStick: {
                    x: xAxis = 0
                } = {}
            } = {}
        ] = gamepad.getAll();

        if (xAxis !== 0) {
            return xAxis;
        }

        if (cursors.right.isDown) {
            return 1;
        } else if (cursors.left.isDown) {
            return -1;
        }

        return 0;
    }

    get verticalThreshold () {
        const {
            scene: {
                cursors,
                input: {
                    gamepad
                }
            }
        } = this;
        const [
            {
                leftStick: {
                    y: yAxis = 0
                } = {}
            } = {}
        ] = gamepad.getAll();

        if (yAxis !== 0) {
            return yAxis;
        }

        if (cursors.up.isDown) {
            return -1;
        } else if (cursors.down.isDown) {
            return 1;
        }

        return 0;
    }
    
}
