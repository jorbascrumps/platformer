export const key = 'ui';
export const active = true;

export function create () {
    this.playerHealthTxt = this.add.text(1, 1, {
        fontFamily: 'Arial',
        fontSize: 14
    })
        .setStroke(0x000000, 3)
        .setText(0);
    this.add.text(this.cameras.main.width - 2, this.cameras.main.height - 2, 'Alpha v1', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(1, 1);
}

export function update () {
    if (typeof window.players !== 'undefined') {
        const playerHealth = window.players.getFirstAlive().health;

        this.playerHealthTxt.setText(playerHealth);
    }
}
