export default class Map {
    constructor ({
        size: {
            columns: numColumns = 5,
            rows: numRows = 5
        } = {},
        room: {
            height: roomHeight = 5,
            width: roomWidth = 5
        } = {}
    } = {}) {
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.roomHeight = roomHeight;
        this.roomWidth = roomWidth;
        this.mapHeight = this.roomHeight * this.numRows;
        this.mapWidth = this.roomWidth * this.numColumns;

        this.solutionPath = this.generateSolutionPath();
    }

    getCollisionMap (rooms) {
        const solidTiles = [ 19 ];

        return rooms
            .map(room => room
                .map(space => Number(solidTiles.includes(space)))
            );
    }

    buildRoomGrid (rooms = []) {
        let data = [];

        for (let row = 0; row < this.numRows; row++) {
            const offset = row * this.numColumns;
            const roomsInRow = rooms.slice(offset, offset + this.numColumns);

            let rowData = [];

            for (let i = 0; i < this.roomHeight; i++) {
                const roomOffset = i * this.roomWidth;

                let t = [];

                roomsInRow.forEach(room => t.push(...room.slice(roomOffset, roomOffset + this.roomWidth)));
                rowData.push(t);
            }

            data.push(...rowData);
        }

        return data;
    }

    generateSolutionPath () {
        Phaser.Math.RND.sow([ Date.now() ]);

        const calcHeight = this.mapHeight / this.roomHeight;
        const calcWidth = this.mapWidth / this.roomWidth;
        const startTile = Phaser.Math.RND.between(0, calcWidth - 1);
        const endTile = Phaser.Math.RND.between(0, calcWidth - 1);

        let data = [];

        for (let row = 0; row < calcHeight; row++) {
            let rowData = [];

            for (let col = 0; col < calcWidth; col++) {

                // Place start tile
                if (row === 0 && col === startTile) {
                    rowData.push(5);

                    continue;
                }
                
                if (row === calcHeight - 1 && col === endTile) {
                    rowData.push(6);

                    continue;
                }

                let t = Phaser.Math.RND.pick(fillRange(0, 4));

                if (row < calcHeight - 1) {
                    const position = Phaser.Math.RND.pick(fillRange(0, calcWidth - 1));

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
}

const fillRange = (start, end) =>
    Array(end - start + 1)
        .fill()
        .map((item, index) => start + index);
