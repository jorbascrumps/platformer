export const tileSize = 32;
export const roomWidth = 8;
export const roomHeight = 6;
export const numRows = 4;
export const numColumns = 4;
export const mapWidth = roomWidth * numColumns;
export const mapHeight = roomHeight * numRows;
let map;

export function preload () {
    this.load.image('tiles', '/src/data/tiles.png');
    this.load.json('left', '/src/data/left.json');
    this.load.json('right', '/src/data/left.json');
    this.load.json('down', '/src/data/down.json');
}

export function create () {
    const {
        layers: [
            leftLayout
        ]
    } = this.cache.json.get('left');
    const {
        layers: [
            rightLayout
        ]
    } = this.cache.json.get('right');
    const {
        layers: [
            downLayout
        ]
    } = this.cache.json.get('down');

    const layouts = {
        left: leftLayout,
        right: rightLayout,
        down: downLayout
    }
    const levelLayout = generateSolutionPath();

    const rooms = levelLayout
        .reduce((level, direction, i) => {
            const insertRow = i % (mapWidth / roomWidth) === 0;
            if (insertRow) {
                level.push([]);
            }

            const layout = layouts[directionsMap[direction]].data.map(i => i - 1);

            level[level.length - 1].push(layout);

            return level;
        }, []);

    const roomGrid = buildRoomGrid({
        height: mapHeight,
        width: mapWidth,
        rooms
    });

    map = this.make.tilemap({
        map: {
            data: roomGrid,
            width: mapWidth,
            height: mapHeight
        },
        tile: {
            width: tileSize,
            height: tileSize,
            texture: 'tiles'
        }
    });
}

function buildRoomGrid ({
    rooms = [],
    width = 1,
    height = 1
}) {
    let data = [];

    for (let row = 0; row < rooms.length; row++) {
        for (let j = 0; j < rooms[row][0].length / roomWidth; j++) {
            const offset = j * roomWidth;

            rooms[row].forEach(room => data.push(...room.slice(offset, offset + roomWidth)));
        }
    }

    return data;
}

function generateSolutionPath () {
    Phaser.Math.RND.sow([ Date.now() ]);

    const calcHeight = mapHeight / roomHeight;
    const calcWidth = mapWidth / roomWidth;
    const startTile = Phaser.Math.RND.between(0, mapWidth - 1);
    let data = [];

    for (let row = 0; row < calcHeight; row++) {
        let rowData = [];

        for (let col = 0; col < calcWidth; col++) {
            let t = Phaser.Math.RND.pick(fillRange(0, 4));

            if (row < calcHeight - 1) {
                const position = Phaser.Math.RND.pick(fillRange(0, numColumns - 1));

                if (t > 3) {
                    rowData.splice(position, 0, 4);

                    continue;
                } else if (col === (calcWidth) - 1 && !rowData.includes(4)) {
                    rowData.splice(position, 0, 4);

                    continue;
                }
            } else if (t === 4) {
                t = Phaser.Math.RND.pick(fillRange(0, 3));
            }

            rowData.push(t);
        }

        data.push(...rowData);
    }

    return data;
}

const directionsMap = {
    0: 'left',
    1: 'left',
    2: 'right',
    3: 'right',
    4: 'down'
};

const fillRange = (start, end) =>
    Array(end - start + 1)
    .fill()
    .map((item, index) => start + index);
