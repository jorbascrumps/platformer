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

const {
    Physics: {
        Matter: {
            Matter: {
                Body,
                Bodies
            }
        }
    }
} = Phaser;

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

const setTilesFromGrid = grid => (tile, pos) => {
    const {
        [pos]: index
    } = grid;

    tile.index = index;
};

const createInteractionsBody = tile =>
    Bodies.rectangle(
        tile.x * tile.width + (tile.width / 2),
        tile.y * tile.height + (tile.height / 2),
        tile.width,
        tile.height,
        {
            isStatic: true,
            isSensor: true,
            gameObject: tile,
        }
    );

const assignTileProps = props => tile => {
    if (tile.index === -1) {
        return;
    }

    tile.properties = Array
        .from(
            props
                .getElementById(tile.index)
                .getElementsByTagName('property')
        )
        .reduce((o, { attributes }) => ({
            ...o,
            [attributes.getNamedItem('name').value]: attributes.getNamedItem('value').value
        }), {});

    return tile;
};

export function preload () {
    this.load.scenePlugin('Slopes', Slopes);
}

export function create () {
    this.normalizedControls.init(LEVEL);

    this.scene.launch(UI);

    this.background = this.add.tileSprite(0, 0, mapWidth * tileSize, mapHeight * tileSize + waterTable, 'background')
        .setOrigin(0, 0);
    // this.background.setPipeline('Light2D');

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

    const generatedMap = new Map({
        size: {
            columns: numColumns,
            rows: numRows
        },
        room: {
            height: roomHeight,
            width: roomWidth
        }
    });

    let spawnPositions = [];
    let lightPositions = [];
    let waterPositions = [
        this.add.water(0, mapHeight * tileSize, mapWidth * tileSize, waterTable)
            .setDepth(waterTable - 8)
    ];

    const layouts = {
        left: this.cache.tilemap.get('left').data,
        right: this.cache.tilemap.get('right').data,
        down: this.cache.tilemap.get('down').data,
        start: this.cache.tilemap.get('start').data,
        end: this.cache.tilemap.get('end').data,
    };

    const levelLayout = generatedMap.solutionPath;
    const {
        decorations,
        interactions,
        rooms
    } = levelLayout
        .reduce(({ decorations, rooms, interactions }, direction, i) => {
            const type = directionsMap[direction];
            const {
                [type]: {
                    layers: [
                        {
                            data: layoutData = new Array(80).fill(-1)
                        } = {},
                        {
                            data: interactiveData = new Array(80).fill(-1)
                        } = {},
                        {
                            data: decorationsData = new Array(80).fill(-1)
                        } = {},
                        {
                            objects: spawns = []
                        } = {},
                        {
                            objects: lights = []
                        } = {},
                        {
                            objects: waterBodies = []
                        } = {}
                    ]
                }
            } = layouts;

            const rowNum = Math.floor(i / numColumns);
            const colNum = i % numColumns;
            const width = roomWidth * tileSize;
            const height = roomHeight * tileSize;

            if (type === 'start') {
                startPosition.x = i * width + (width / 2);
            }

            if (spawns.length) {
                spawns.forEach(({ x, y, properties: { type } = {} }) => spawnPositions.push({
                    x: (colNum * width) + x,
                    y: (rowNum * height) + y,
                    type
                }));
            }

            if (lights.length) {
                lights.forEach(({ x, y }) => lightPositions.push({
                    x: (colNum * width) + x,
                    y: (rowNum * height) + y
                }));
            }
            
            if (waterBodies.length) {
                waterBodies.forEach(({ height: h, width: w, x, y }) =>
                    waterPositions.push(
                        this.add.water((colNum * width) + x, (rowNum * height) + y, w, h)
                    )
                );
            }

            return {
                rooms: [
                    ...rooms,
                    layoutData.map(i => i - 1)
                ],
                interactions: [
                    ...interactions,
                    interactiveData.map(i => i - 1)
                ],
                decorations: [
                    ...decorations,
                    decorationsData.map(i => i - 1)
                ]
            }
        }, { rooms: [], interactions: [], decorations: [] });

    const map = this.make.tilemap({
        tileWidth: tileSize,
        tileHeight: tileSize,
        width: roomWidth * numColumns,
        height: roomHeight * numRows
    });
    const tileset = map.addTilesetImage('tiles');

    this.interactions = map.createBlankDynamicLayer('interactions', tileset);
    const interactionsGrid = generatedMap
        .buildRoomGrid(interactions)
        .reduce((room, interactions) => ([ ...room, ...interactions ]), []);
    this.interactions.forEachTile(setTilesFromGrid(interactionsGrid));
    this.interactions.setCollisionByExclusion(([ -1 ]));

    const tileProps = this.cache.xml.get('tileset');
    this.interactions.forEachTile(assignTileProps(tileProps));

    const interactionBodies = Body.create({
        parts: this.interactions
            .filterTiles(tile => tile, this, undefined, undefined, undefined, undefined, { isNotEmpty: true })
            .map(createInteractionsBody),
        isStatic: true
    });
    this.matter.world.add(interactionBodies);
    
    this.ground = map.createBlankDynamicLayer('ground', tileset);
    const roomGrid = generatedMap
        .buildRoomGrid(rooms)
        .reduce((room, segment) => ([ ...room, ...segment ]), []);
    this.ground.forEachTile(setTilesFromGrid(roomGrid));
    this.ground.setCollisionByExclusion(([ -1 ]));

    this.matter.world.convertTilemapLayer(this.ground);
    this.matter.world.setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize + waterTable);
    // this.matter.world.createDebugGraphic();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player = new Player(this, startPosition.x + 32, startPosition.y + 32);

    // START - Interactions prompts
    const buttonPrompt = this.add.image(50, 50, 'keyboard', 50)
        .setDisplaySize(24, 24)
        .setPosition(-50, -50)
    this.matterCollision.addOnCollideActive({
        objectA: this.player.sprite,
        objectB: interactionBodies.parts,
        callback ({ bodyB }) {
            const {
                gameObject: {
                    properties: {
                        prompt
                    }
                }
            } = bodyB;

            if (prompt === 'up') {
                buttonPrompt.setPosition(
                    bodyB.gameObject.x * 32 + 16,
                    bodyB.gameObject.y * 32 - 16,
                );
            }
        }
    });
    this.matterCollision.addOnCollideEnd({
        objectA: this.player.sprite,
        objectB: interactionBodies.parts,
        callback ({ bodyB }) {
            buttonPrompt.setPosition(-50, -50);
        }
    });
    // END - Interactions prompts

    this.matterCollision.addOnCollideStart({
        objectA: waterPositions.map(({ sensor }) => sensor),
        callback ({ gameObjectA, gameObjectB }) {
            if (gameObjectB === null) {
                return console.log('mssing body');
            }

            const i = gameObjectA.columns.findIndex((col, i) =>
                gameObjectA.x + col.x >= gameObjectB.x && i
            );
            const columnIndex = Phaser.Math.Clamp(i, 0, gameObjectA.columns.length - 1);
            gameObjectA.splash(columnIndex, 3);
        },
        context: this
    });

    spawnPositions
        .map(({ x, y, type }) =>
            new Enemy(this, x, y)
        );

    this.sceneLights = this.add.group();
    lightPositions
        .forEach(({ x, y }) => this.sceneLights.add(new LightSource({
            scene: this,
            x,
            y,
            flicker: true
        })));

    this.decorations = map.createBlankDynamicLayer('decorations', tileset);
    const decorationsGrid = generatedMap
        .buildRoomGrid(decorations)
        .reduce((room, decorations) => ([ ...room, ...decorations ]), []);
    this.decorations.forEachTile(setTilesFromGrid(decorationsGrid));

    this.cameras.main
        .setBounds(0, 0, mapWidth * tileSize, mapHeight * tileSize + waterTable)
        .setBackgroundColor('#000000')
        .startFollow(this.player.sprite);

    this.input.on('pointerdown', () => {
        this.input.stopPropagation();
        this.scene.switch(PAUSE);
    });

    this.decorations.texture = tileset.image;
    // this.decorations.setPipeline('Light2D');

    this.ground.texture = tileset.image;
    // this.ground.setPipeline('Light2D');

    this.interactions.texture = tileset.image;
    // this.interactions.setPipeline('Light2D');

    this.lights
        .enable()
        .setAmbientColor(0x333333);
}

export function update () {
    if (this.normalizedControls.reload) {
        this.scene.restart();
    }
}

const directionsMap = {
    0: 'left',
    1: 'left',
    2: 'right',
    3: 'right',
    4: 'down',
    5: 'start',
    6: 'end'
};
