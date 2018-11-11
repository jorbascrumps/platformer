import {
    LEVEL,
    PRELOADER
} from '@/constants/scenes';
import {
    ATLAS,
    IMAGES,
    JSON,
    SPRITESHEETS,
    XML
} from '@/constants/files';

export const key = PRELOADER;

export const loader = {
    path: 'src/data'
};

export function preload () {
    this.load.atlas(ATLAS);
    this.load.image(IMAGES);
    this.load.tilemapTiledJSON(JSON);
    this.load.spritesheet(SPRITESHEETS);
    this.load.xml(XML);

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
    this.scene.start(LEVEL);
}
