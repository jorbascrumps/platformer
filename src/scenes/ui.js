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
    const {
        player
    } = this.sys.game.scene.getScene('level');

    if (typeof player === 'undefined') {
        return;
    }

    const playerHealth = player.health;

    if (playerHealth === this.heartContainer.children.size) {
        return;
    }

    this.heartContainer.clear(true);

    new Array(playerHealth)
        .fill()
        .forEach((n, i) =>
            this.heartContainer.add(
                this.add.image(4 + i * 14, 4, 'heart')
                    .setOrigin(0, 0)
                    .setDisplaySize(14, 14),
                true
            )
        );
}
