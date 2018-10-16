const KEY_INTERACT = 'interact';
const KEY_JUMP = 'jump';
const KEY_RELOAD = 'reload';

export default class extends Phaser.Plugins.BasePlugin {
    
    #keys = {
        jump: null
    }

    init (sceneKey) {
        this.scene = this.game.scene.getScene(sceneKey);

        if (this.scene === null) {
            return;
        }

        this.setKey(KEY_INTERACT, 'up');
        this.setKey(KEY_JUMP, 'X');
        this.setKey(KEY_RELOAD, 'enter');
    }
    
    setKey (key, val) {
        this.#keys[key] = this.scene.input.keyboard.addKey(val);

        return this;
    }

    get interact () {
        const {
            scene: {
                input: {
                    gamepad
                }
            }
        } = this;
        const [
            controller = {}
        ] = gamepad.getAll();

        return controller.isButtonDown(3) ||  Phaser.Input.Keyboard.JustDown(this.#keys[KEY_INTERACT]);
    }

    get jump () {
        const {
            scene: {
                input: {
                    gamepad
                }
            }
        } = this;
        const [
            controller = {}
        ] = gamepad.getAll();

        return controller.isButtonDown(0) || Phaser.Input.Keyboard.JustDown(this.#keys[KEY_JUMP]);
    }

    get reload () {
        const {
            scene: {
                input: {
                    gamepad
                }
            }
        } = this;
        const [
            controller = {}
        ] = gamepad.getAll();

        return controller.isButtonDown(8) || Phaser.Input.Keyboard.JustDown(this.#keys[KEY_RELOAD]);
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
