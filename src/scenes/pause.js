import {
    LEVEL,
    PAUSE,
    UI
} from '@/constants/scenes';

export const key = PAUSE;

export function create () {
    wake.call(this);

    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'PAUSED', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(0.5, 0.5);

    this.input.on('pointerdown', () => {
        this.input.stopPropagation();
        this.scene.switch(LEVEL);
    });
    this.events.on('wake', wake.bind(this));
    this.events.on('sleep', sleep.bind(this));
}

export function update () {}

export function wake () {
    const uiScene = this.scene.get(UI);
    uiScene.scene.setVisible(false);
}

export function sleep () {
    const uiScene = this.scene.get(UI);
    uiScene.scene.setVisible(true);
}
