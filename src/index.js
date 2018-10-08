import * as level from './scenes/level';
import * as ui from './scenes/ui';
import * as preloader from '@/scenes/preloader';
import * as pause from '@/scenes/pause';
import NormalizedControlsPlugin from './plugins/NormalizedControls';

window.onload = () => {
    const game = new Phaser.Game({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height: level.roomHeight * level.tileSize,
        input: {
            gamepad: true
        },
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
            default: 'matter'
        },
        plugins: {
            global: [
                {
                    key: 'normalizedControls',
                    mapping: 'normalizedControls',
                    plugin: NormalizedControlsPlugin,
                }
            ],
            scene: [
                {
                    plugin: PhaserMatterCollisionPlugin,
                    key: 'matterCollision',
                    mapping: 'matterCollision'
                }
            ]
        }
    });
};
