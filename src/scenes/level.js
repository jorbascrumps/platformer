import Slopes from 'phaser-slopes';

import {
    LEVEL,
    PAUSE,
    UI
} from '@/constants/scenes';

import Map from '../components/map';
import Enemy from '../components/enemy';
import Player from '../components/Player';
import LightSource from '../components/LightSource';
import Flying from '../components/Flying';

export const key = LEVEL;

export const tileSize = 32;
export const roomWidth = 12;
export const roomHeight = 8;
export const numRows = 6;
export const numColumns = 6;
export const mapWidth = roomWidth * numColumns;
export const mapHeight = roomHeight * numRows;
export const waterTable = 64;

let startPosition = {
    x: 0,
    y: 0
};

export function preload () {
    this.load.scenePlugin('Slopes', Slopes);
    // this.load.plugin('pathFollower', window.rexpathfollowerplugin, true, 'pathFollower');
}

export function create () {
    this.normalizedControls.init(this);

    this.scene.launch(UI);

    this.background = this.add.tileSprite(0, 0, mapWidth * tileSize, mapHeight * tileSize + waterTable, 'background')
        .setOrigin(0, 0);

    this.anims.create({
        key: 'enemyWalk',
        frames: this.anims.generateFrameNumbers('enemyWalk', {
            start: 0,
            end: 12,
            first: 0
        }),
        frameRate: 30,
        repeat: -1,
        repeatDelay: 0
    });
    this.anims.create({
        key: 'enemyIdle',
        frames: this.anims.generateFrameNumbers('enemyIdle', {
            start: 0,
            end: 9,
            first: 0
        }),
        frameRate: 6,
        repeat: -1,
        repeatDelay: 0
    });
    this.anims.create({
        key: 'enemyPatrol',
        frames: this.anims.generateFrameNumbers('enemyPatrol', {
            start: 8,
            end: 11,
            first: 8
        }),
        frameRate: 8,
        repeat: -1,
        repeatDelay: 0
    });
    this.anims.create({
        key: 'enemyAttack',
        frames: this.anims.generateFrameNumbers('enemyPatrol', {
            start: 16,
            end: 19,
            first: 16
        }),
        frameRate: 8,
        repeat: 0,
    });
    this.anims.create({
        key: 'enemyFlying',
        frames: this.anims.generateFrameNumbers('enemyFlying', {
            start: 0,
            end: 4,
            first: 0
        }),
        frameRate: 8,
        repeat: -1,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.player = new Player(this, 50, 50);

    this.map.generate({
        size: {
            height: numRows,
            width: numColumns,
        },
        room: {
            height: roomHeight,
            width: roomWidth,
        }
    });

    this.cameras.main
        .setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize + waterTable)
        .setBackgroundColor('#000000')
        .startFollow(this.player.sprite, true);

    this.events.on('pause', pause.bind(this));
    this.events.on('resume', resume.bind(this));

    /*
    TODO
    spawnPositions
        .map(({ x, y, type }) =>
            (
                type === 'fly'
                    ?   new Flying(this, x, y)
                    :   new Enemy(this, x, y)
            )
        );
    */

    /*
    TODO
    this.sceneLights = this.add.group();
    lightPositions
        .forEach(({ x, y }) => this.sceneLights.add(new LightSource({
            scene: this,
            x,
            y,
            flicker: true
        })));
    */

    /*
    TODO
    this.decorations = map.createBlankDynamicLayer('decorations', tileset);
    const decorationsGrid = generatedMap
        .buildRoomGrid(decorations)
        .reduce((room, decorations) => ([ ...room, ...decorations ]), []);
    this.decorations.forEachTile(setTilesFromGrid(decorationsGrid));
    */

    // this.decorations.texture = tileset.image;
    // this.decorations.setPipeline('Light2D');

    // this.ground.texture = tileset.image;
    // this.ground.setPipeline('Light2D');

    // this.interactions.texture = tileset.image;
    // this.interactions.setPipeline('Light2D');
}

export function update () {
    if (this.normalizedControls.reload) {
        return this.scene.restart();
    }

    if (this.normalizedControls.pause) {
        this.scene.pause();
        this.scene.launch(PAUSE);

        return;
    }
}

function pause () {
    const uiScene = this.scene.get(UI);
    uiScene.scene.setVisible(false);
}

function resume () {
    const uiScene = this.scene.get(UI);
    uiScene.scene.setVisible(true);

    this.normalizedControls.init(this);
}

// for (let i = 1; i < 4; i++) {
//     if (i !== 0 && i % 2 !== 0) {
//         // continue;
//     }
//     this.time.delayedCall(i * 500, destroyTile, [ i * 32, 192 ], this);
//     // this.time.delayedCall(i * 500, destroyTile, [ i * 32, 7 * 32 ], this);
// }
//
// this.time.delayedCall(500, placeTile, [ 150, 32 ], this);
//
// function placeTile (x, y) {
//     const translatedX = Math.floor(x / 32);
//     const translatedY = Math.floor(y / 32);
//
//     const tile = this.ground.putTileAt(1, translatedX, translatedY);
//     this.matter.add.tileBody(tile);
//     this.tileBorders.clear();
//     this.ground.forEachTile(renderTileBorder, this);
// }
//
// function destroyTile (x, y) {
//     const translatedX = Math.floor(x / 32);
//     const translatedY = Math.floor(y / 32);
//
//     const tile = this.ground.removeTileAt(translatedX, translatedY, false);
//     tile.physics.matterBody.destroy();
//
//     this.tileBorders.clear()
//     this.ground.forEachTile(renderTileBorder, this);
// }
//
