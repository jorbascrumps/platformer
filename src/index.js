import * as level from './scenes/level';
import * as ui from './scenes/ui';
import * as preloader from '@/scenes/preloader';
import * as pause from '@/scenes/pause';

window.onload = () => {
    const game = new Phaser.Game({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: level.roomHeight * level.tileSize,
        parent: 'game',
        pixelArt: true,
        scene: [
            preloader,
            level,
            ui,
            pause
        ],
        type: Phaser.AUTO,
        width: level.roomWidth * level.tileSize,
        physics: {
            default: 'impact',
            impact: {
                gravity: 2000,
                // debug: true
            }
        },
    });
};
