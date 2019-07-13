const DIRECTIONS = {
    0: 'left',
    1: 'left',
    2: 'right',
    3: 'right',
    4: 'down',
    5: 'start',
    6: 'end'
};

const ROOMS = {
    START: 5,
    END: 6,
    LEFT: 2,
    RIGHT: 3,
    DOWN: 4,
};

const LAYERS = {
    GROUND: 0,
    INTERACTIONS: 1,
    DECORATIONS: 2,
    SPAWNS: 3,
    LIGHTS: 4,
    WATER: 5,
};

const WATER_TABLE = 64;
const waterConfig = {
    texture: 'water',
    renderDepth: 0,
    dampening: 0.01,
    spread: 0.1,
};

const setTilesFromGrid = grid => (tile, pos) => {
    const {
        [pos]: index
    } = grid;

    tile.index = index;
};

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

const createInteractionsBody = tile =>
    Phaser.Physics.Matter.Matter.Bodies.rectangle(
        tile.x * tile.width + (tile.width / 2),
        tile.y * tile.height + (tile.height / 2),
        tile.width,
        tile.height,
        {
            isStatic: true,
            isSensor: true,
            gameObject: tile,
        }
    )
;

const getKeyByVal = obj => val =>
    Object
        .keys(obj)
        .find(key => obj[key] === val)
;

const fillRange = (start, end) =>
    Array(end - start + 1)
        .fill()
        .map((item, index) => start + index);

export default class extends Phaser.Plugins.BasePlugin {

    #layers = {}
    #layouts = {}
    #numCols = 1
    #numRows = 1
    #roomHeight = 4
    #roomWidth = 4
    #mapHeight = this.#roomHeight * this.#numRows
    #mapWidth = this.#roomWidth * this.#numCols
    #solutionPath = []
    #tileSize = 32

    get solutionPath () {
        return this.#solutionPath;
    }

    generate ({
        room: {
            height: roomHeight = this.#roomHeight,
            width: roomWidth = this.#roomWidth,
        } = {},
        size: {
            height: mapHeight = this.#mapHeight,
            width: mapWidth = this.#mapWidth,
        } = {},
        tileSize = this.#tileSize,
    } = {}) {
        this.#numCols = mapWidth;
        this.#numRows = mapHeight;
        this.#mapHeight = mapHeight * roomHeight;
        this.#mapWidth = mapWidth * roomWidth;
        this.#roomHeight = roomHeight;
        this.#roomWidth = roomWidth;
        this.#tileSize = tileSize;

        const cache = this.pluginManager.scene.scene.cache.tilemap;
        this.#layouts = {
            left: cache.get('left').data,
            right: cache.get('right').data,
            start: cache.get('start').data,
            end: cache.get('end').data,
            down: cache.get('down').data,
        };

        this.#solutionPath = this.#generateSolutionPath();

        this.#draw();

        this.#setupPhysics();

        return this;
    }

    buildRoomGrid (rooms = []) {
        let data = [];

        for (let row = 0; row < this.#numRows; row++) {
            const offset = row * this.#numCols;
            const roomsInRow = rooms.slice(offset, offset + this.#numCols);

            let rowData = [];

            for (let i = 0; i < this.#roomHeight; i++) {
                const roomOffset = i * this.#roomWidth;
                let t = [];

                for (let room of roomsInRow) {
                    t.push(...room.slice(roomOffset, roomOffset + this.#roomWidth))
                }

                rowData.push(t);
            }

            data.push(...rowData);
        }

        return data.flat();
    }

    #generateLayer (type = LAYERS.GROUND) {
        return (data = [], direction) => {
            const roomType = (getKeyByVal(ROOMS)(direction) || 'left').toLowerCase();
            const {
                [roomType]: {
                    layers: {
                        [type]: {
                            data: roomData,
                        },
                    },
                },
            } = this.#layouts;

            return [
                ...data,
                roomData.map(i => i - 1),
            ];
        }
    }

    #generateSolutionPath () {
        Phaser.Math.RND.sow([ Date.now() ]);

        const calcHeight = this.#mapHeight / this.#roomHeight;
        const calcWidth = this.#mapWidth / this.#roomWidth;
        const startTile = Phaser.Math.RND.between(0, calcWidth - 1);
        const endTile = Phaser.Math.RND.between(0, calcWidth - 1);

        let data = [];

        for (let row = 0; row < calcHeight; row++) {
            let rowData = [];

            for (let col = 0; col < calcWidth; col++) {

                // Place start tile
                if (row === 0 && col === startTile) {
                    rowData.push(ROOMS.START);

                    continue;
                }

                // Place end tile
                if (row === calcHeight - 1 && col === endTile) {
                    rowData.push(ROOMS.END);

                    continue;
                }

                let tileIndex = Phaser.Math.RND.pick(fillRange(0, ROOMS.DOWN));

                if (row < calcHeight - 1) {
                    const position = Phaser.Math.RND.pick(fillRange(0, calcWidth - 1));

                    if (tileIndex > ROOMS.RIGHT) {
                        rowData.splice(position, 0, ROOMS.DOWN);

                        continue;
                    } else if (col === (calcWidth) - 1 && !rowData.includes(ROOMS.DOWN)) {
                        rowData.splice(position, 0, ROOMS.DOWN);

                        continue;
                    }
                } else if (tileIndex === ROOMS.DOWN) {
                    tileIndex = Phaser.Math.RND.pick(fillRange(0, ROOMS.RIGHT));
                }

                rowData.push(tileIndex);
            }

            data.push(...rowData);
        }

        return data;
    }

    #draw () {
        const scene = this.pluginManager.scene.scene;
        const map = scene.make.tilemap({
            height: this.#mapHeight,
            tileHeight: this.#tileSize,
            tileWidth: this.#tileSize,
            width: this.#mapWidth,
        });
        const tileset = map.addTilesetImage('tiles');

        // START GROUND
        const rooms = this.#solutionPath
            .reduce(this.#extractLayerData(LAYERS.GROUND), [])
            .map(row => row
                .map(i => i - 1)
            )
        ;
        const ground = map.createBlankDynamicLayer('ground', tileset);
        const roomGrid = this.buildRoomGrid(rooms);
        ground.forEachTile(setTilesFromGrid(roomGrid));
        ground.setCollisionByExclusion([ -1 ]);
        this.#layers.ground = ground;

        const t = map.addTilesetImage('dirttiles');
        let dirt = map.createBlankDynamicLayer('test', t) // TODO: Convert to Static
            .weightedRandomize(0, 0, map.width, map.height, [
                { index: 8, weight: 20 },
                { index: 9, weight: 1 },
                { index: 10, weight: 1 },
                { index: 11, weight: 1 },
                { index: 16, weight: 1 },
                { index: 17, weight: 1 },
                { index: 18, weight: 1 },
                { index: 19, weight: 1 },
            ])
            .setVisible(false)
        ;
        const rt = scene.add.renderTexture(0, 0, map.widthInPixels, map.heightInPixels)
            .draw(dirt)
            .setMask(new Phaser.Display.Masks.GeometryMask(scene, ground))
        ;
        this.tileBorders = scene.add.renderTexture(0, 0, map.widthInPixels, map.heightInPixels);
        ground.forEachTile(this.#renderTileBorder, this);
        // END GROUND

        // START INTERACTIONS
        const interactionsData = this.#solutionPath
            .reduce(this.#extractLayerData(LAYERS.INTERACTIONS), [])
            .map(row => row
                .map(i => i - 1)
            )
        ;
        const interactions = map.createBlankDynamicLayer('interactions', tileset);
        const interactionsGrid = this.buildRoomGrid(interactionsData);
        interactions.forEachTile(setTilesFromGrid(interactionsGrid));
        interactions.setCollisionByExclusion([ -1 ]);
        this.#layers.interactions = interactions;

        const tileProps = scene.cache.xml.get('tileset');
        interactions.forEachTile(assignTileProps(tileProps));
        // END INTERACTIONS

        // const decorations = this.#solutionPath
        //     .reduce(this.#extractLayerData(LAYERS.DECORATIONS), [])
        //     .map(i => i - 1)
        // ;
        // const spawns = this.#solutionPath
        //     .reduce(this.#extractLayerData(LAYERS.SPAWNS, 'objects'), [])
        // ;
        // const lights = this.#solutionPath
        //     .reduce(this.#extractLayerData(LAYERS.LIGHTS, 'objects'), [])
        // ;

        // START WATER
        const water = this.#solutionPath
            .reduce(this.#extractLayerData(LAYERS.WATER, 'objects'), [])
            .flatMap((bodies, i) => {
                const colNum = i % this.#numCols;
                const rowNum = Math.floor(i / this.#numCols);
                const width = this.#roomWidth * this.#tileSize;
                const height = this.#roomHeight * this.#tileSize;

                return bodies.map(({ height: h, width: w, x, y }) =>
                    scene.add.water((colNum * width) + x, (rowNum * height) + y, w, h, 25, waterConfig)
                );
            })
        ;

        this.#layers.water = [
            scene.add.water(0, 0, this.#mapWidth * this.#tileSize, (this.#mapHeight * this.#tileSize) + WATER_TABLE, WATER_TABLE, waterConfig),
            ...water,
        ];
        // END WATER
    }

    #setupPhysics () {
        const scene = this.pluginManager.scene.scene;

        scene.matter.world.convertTilemapLayer(this.#layers.ground);
        scene.matter.world.setBounds(0, 0, this.#mapWidth * this.#tileSize, this.#mapHeight * this.#tileSize + WATER_TABLE);
        // scene.matter.world.createDebugGraphic();

        // START WATER INTERACTION
        scene.matterCollision.addOnCollideStart({
            objectA: this.#layers.water.map(({ sensor }) => sensor),
            callback ({ gameObjectA: water, gameObjectB: target }) {
                const i = water.columns.findIndex((col, i) =>
                    water.x + col.x >= target.x && i
                );
                const speed = target.body.speed * 2;
                const numDroplets = Phaser.Math.Between(5, 10);

                water.splash(Phaser.Math.Clamp(i, 0, water.columns.length - 1), speed, numDroplets);
            },
        });
        scene.matterCollision.addOnCollideEnd({
            objectA: this.#layers.water.map(({ sensor }) => sensor),
            callback ({ gameObjectA: water, gameObjectB: target }) {
                const i = water.columns.findIndex((col, i) =>
                    water.x + col.x >= target.x && i
                );
                const speed = target.body.speed * 1;
                const numDroplets = Phaser.Math.Between(3, 7);

                water.splash(Phaser.Math.Clamp(i, 0, water.columns.length - 1), speed, numDroplets);
            },
        });
        // END WATER INTERACTION

        // START
        const interactionBodies = Phaser.Physics.Matter.Matter.Body.create({
            parts: this.#layers.interactions
                .filterTiles(tile => tile, this, undefined, undefined, undefined, undefined, { isNotEmpty: true })
                .map(createInteractionsBody),
            isStatic: true
        });
        scene.matter.world.add(interactionBodies);

        const buttonPrompt = scene.add.image(50, 100, 'keyboard', 50)
            .setDisplaySize(24, 24)
            // .setPosition(-50, -50)
        ;
        let tween;
        scene.matterCollision.addOnCollideStart({
            objectA: scene.player.sprite.body.parts[0],
            objectB: interactionBodies.parts,
            callback ({
                bodyB: {
                    gameObject: {
                        properties: {
                            prompt,
                        },
                        x,
                        y,
                    }
                }
            }) {
                tween = scene.tweens.add({
                    alpha: {
                        from: 0.5,
                        start: 0,
                        to: 1,
                    },
                    duration: 250,
                    // repeat: -1,
                    targets: buttonPrompt,
                    y: {
                        from: y * 32 - 16,
                        to: '-=4',
                    },
                    x: {
                        start: x * 32 + 16,
                    },
                    // yoyo: true,
                });
                if (prompt === 'up') {
                    buttonPrompt.setPosition(
                        x * 32 + 16,
                        y * 32 - 16,
                    );
                }
            },
        });
        console.log(scene.player.sprite.body.parent)
        scene.matterCollision.addOnCollideEnd({
            objectA: scene.player.sprite.body.parts[0],
            objectB: interactionBodies.parts,
            callback ({
                bodyB: {
                    gameObject: {
                        y,
                    }
                }
            }) {
                scene.tweens.add({
                    alpha: 0,
                    duration: 150,
                    targets: buttonPrompt,
                    y: y * 32 - 16,
                    onComplete () {
                        tween.stop();
                    }
                });
                // buttonPrompt.setPosition(-50, -50);
            }
        });
        // END
    }

    #renderTileBorder ({ index, x, y, pixelX, pixelY }) {
        if (index === -1) {
            return;
        }

        const scene = this.pluginManager.scene.scene;

        const BORDER_WIDTH = 1;

        // TODO: Store coords for later
        const leftTile = this.#layers.ground.getTileAt(x - 1, y, true);
        const rightTile = this.#layers.ground.getTileAt(x + 1, y, true);
        const topTile = this.#layers.ground.getTileAt(x, y - 1, true);
        const bottomTile = this.#layers.ground.getTileAt(x, y + 1, true);


        // Left decal
        if (!leftTile || leftTile.index === -1) {
            this.tileBorders.drawFrame('dirttiles', 'dirtleft', pixelX - 8, pixelY);
            // border.fillRect(pixelX, pixelY, BORDER_WIDTH, tileSize);
        } else {
            this.#layers.ground.calculateFacesAt(leftTile.x, leftTile.y);
            leftTile.setCollision(true);
        }

        // Top decal
        if (!topTile || topTile.index === -1) {
            this.tileBorders.drawFrame('dirttiles', 'dirttop', pixelX, pixelY - 1);
            // border.fillRect(pixelX, pixelY, tileSize, BORDER_WIDTH);
        } else {
            this.#layers.ground.calculateFacesAt(topTile.x, topTile.y);
            topTile.setCollision(true);
        }

        // Bottom deacl
        if (!bottomTile || bottomTile.index === -1) {
            this.tileBorders.drawFrame('dirttiles', 'dirtbottom', pixelX, pixelY + 26);
            // border.fillRect(pixelX, pixelY + tileSize - BORDER_WIDTH, tileSize, BORDER_WIDTH);
        } else {
            this.#layers.ground.calculateFacesAt(bottomTile.x, bottomTile.y);
            bottomTile.setCollision(true);
        }

        // Right deacl
        if (!rightTile || rightTile.index === -1) {
            this.tileBorders.drawFrame('dirttiles', 'dirtright', pixelX + 21, pixelY + 2);
            // border.fillRect(pixelX + tileSize - BORDER_WIDTH, pixelY, BORDER_WIDTH, tileSize);
        } else {
            this.#layers.ground.calculateFacesAt(rightTile.x, rightTile.y);
            rightTile.setCollision(true);
        }
    }

    #extractLayerData (layer, target = 'data') {
        return (data = [], direction, i) => {
            const type = DIRECTIONS[direction];
            const {
                [type]: {
                    layers: {
                        [layer]: {
                            [target]: layerData = [],
                        } = {},
                    } = [],
                } = {},
            } = this.#layouts;

            return [
                ...data,
                layerData,
            ];
        }
    }

}
