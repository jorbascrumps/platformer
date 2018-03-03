export const key = 'ui';
export const active = true;

export function create () {
    this.add.text(this.cameras.main.width - 2, this.cameras.main.height - 2, 'Alpha v1', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(1, 1);
}
