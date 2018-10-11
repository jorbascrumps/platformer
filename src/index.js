import * as level from './scenes/level';
import * as ui from './scenes/ui';
import * as preloader from '@/scenes/preloader';
import * as pause from '@/scenes/pause';
import NormalizedControlsPlugin from './plugins/NormalizedControls';
import WaterPlugin from './plugins/WaterPlugin';

const ratioWidth = 16;
const ratioHeight = 9;
const height = level.roomHeight * level.tileSize;
const ratio = height / ratioHeight;
const width = ratio * ratioWidth;

window.onload = () => {
    const game = new Phaser.Game({
        backgroundColor: 'rgba(0, 0, 0, 0)',
        height,
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
        width,
        physics: {
            default: 'matter'
        },
        plugins: {
            global: [
                {
                    key: 'normalizedControls',
                    mapping: 'normalizedControls',
                    plugin: NormalizedControlsPlugin,
                },
                {
                    key: 'WaterPlugin',
                    plugin: WaterPlugin,
                    start: true
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
