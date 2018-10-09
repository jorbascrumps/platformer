import {
    UI
} from '@/constants/scenes';

export const key = UI;

export function preload () {
    this.load.image('heart', '/src/data/heart.png');
}

export function create () {
    this.heartContainer = this.add.group();

    this.add.text(this.cameras.main.width - 2, this.cameras.main.height - 2, 'Alpha v1', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(1, 1);
}

export function update () {
    drawHealthContainer.call(this);
}

function drawHealthContainer () {
    if (typeof window.player === 'undefined') {
        return;
    }

    const playerHealth = window.player.health;

    if (playerHealth === this.heartContainer.children.size) {
        return;
    }

    this.heartContainer.clear(true);

    new Array(playerHealth)
        .fill()
        .forEach((n, i) =>
            this.heartContainer.add(
                this.add.image(i * 14, 0, 'heart')
                    .setOrigin(0, 0)
                    .setDisplaySize(14, 14),
                true
            )
        );
}
