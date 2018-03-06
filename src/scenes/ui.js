export const key = 'ui';
export const active = true;

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
    if (typeof window.players !== 'undefined') {
        this.heartContainer.clear(true);

        const playerHealth = window.players.getFirstAlive().health;
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
}
