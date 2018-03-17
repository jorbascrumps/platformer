export const key = 'preloader';
export const loader = {
    path: 'src/data'
};

export function preload () {
    this.load.image('tiles', 'tiles.png');
    this.load.image('player', 'nega_nathan.png');
    this.load.spritesheet('enemyWalk', 'enemy/walk.png', { frameWidth: 22, frameHeight: 33, endFrame: 12 });
    this.load.spritesheet('enemyAttack', 'enemy/attack.png', { frameWidth: 43, frameHeight: 37, endFrame: 18 });
    this.load.spritesheet('enemyIdle', 'enemy/idle.png', { frameWidth: 24, frameHeight: 32, endFrame: 10 });
    this.load.spritesheet('enemyHit', 'enemy/hit.png', { frameWidth: 30, frameHeight: 32, endFrame: 9 });

    this.load.json('left', 'left.json');
    this.load.json('right', 'right.json');
    this.load.json('down', 'down.json');
    this.load.json('start', 'start.json');

    this.progressBar = this.add.graphics();
    this.progressValue = this.add.text(this.cameras.main.width - 10, (this.cameras.main.height / 2) + 5, '0%', {
        fontSize: 10,
        fontFamily: 'Arial'
    })
        .setOrigin(1, 0);
    this.load.on('progress', value => {
        this.progressValue.setText(`${Math.floor(value * 100)}%`);
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(10, this.cameras.main.height / 2, (this.cameras.main.width - 20) * value, 1);
    });
}

export function create () {
    this.scene.start('level');
}
