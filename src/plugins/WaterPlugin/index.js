import WaterBody from './WaterBody';

export default class WaterPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject('water', this.createBody);
    }

    createBody (config) {
        return  new WaterBody(this.scene, config);
    }

}
