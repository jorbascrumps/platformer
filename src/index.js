import * as level from './scenes/level';
import * as ui from './scenes/ui';

window.onload = () => {
    const game = new Phaser.Game({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: level.mapHeight * level.tileSize,
        parent: 'game',
        pixelArt: true,
        scene: [
            level,
            ui
        ],
        type: Phaser.AUTO,
        width: level.mapWidth * level.tileSize,
        physics: {
            default: 'impact',
            impact: {
                gravity: 2000,
                debug: true
            }
        },
    });
};
