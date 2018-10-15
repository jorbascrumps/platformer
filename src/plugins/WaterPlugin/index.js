import WaterBody from './WaterBody';

export default class WaterPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject('water', this.createBody);
    }

    createBody (x, y, width, height) {
        return new WaterBody(this.scene, x, y, width, height);
    }

}
