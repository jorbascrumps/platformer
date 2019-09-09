import Platform from './Platform';

export default class PlatformPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject('platform', this.createPlatform);
    }

    createPlatform (width, height, duration, pathCoords) {
        return new Platform(this.scene, width, height, duration, pathCoords);
    }

}
