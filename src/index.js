import * as scene from './states/game';

window.onload = () => {
    const game = new Phaser.Game({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: scene.mapHeight * scene.tileSize,
        parent: 'game',
        scene,
        type: Phaser.AUTO,
        width: scene.mapWidth * scene.tileSize
    });
};
