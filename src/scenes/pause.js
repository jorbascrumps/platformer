import {
    LEVEL,
    PAUSE,
} from '@/constants/scenes';

export const key = PAUSE;

export function create () {
    this.normalizedControls.init(this);

    this.add.graphics()
        .fillStyle(0x000000, 0.80)
        .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PAUSED', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(0.5, 0.5);
}

export function update () {
    if (this.normalizedControls.pause) {
        this.plugins.stop('normalizedControls');
        this.scene.stop();
        this.scene.resume(LEVEL);
    }
}
