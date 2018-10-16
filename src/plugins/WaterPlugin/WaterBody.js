import WaterColumn from './WaterColumn';

export default class WaterBody {

    #context

    #height = 50
    #width = 50
    #x = 0
    #y = 0
    #debug = false

    #tension = 0.025
    #dampening = 0.025
    #spread = 0.25
    #depth = 10

    constructor (context, x, y, width, height) {
        this.#context = context;

        this.#x = Math.floor(x);
        this.#y = Math.floor(y);
        this.#width = Math.floor(width);
        this.#height = Math.floor(height);
        this.#depth = Math.floor(height);

        this.background = context.add.tileSprite(this.#x, this.#y, this.#width, this.#height, 'water')
            .setAlpha(0.75)
            .setDepth(0)
            .setOrigin(0, 0);

        const coords = [
            0,
            this.#height - this.#depth,
            this.#width,
            this.#height - this.#depth
        ];
        const surface = new Phaser.Geom.Line(...coords);
        const points = surface.getPoints(0, 20);
        this.columns = [
            ...points,
            {
                x: this.#width,
                y: coords[1]
            }
        ]
            .map(({ x, y }, i) =>
                new WaterColumn(x, y, i)
            );

        const data = this.columns
            .reduce((cache, { x, y }) => ([ ...cache, x, y ]), []);
        this.body = context.add.polygon(x, y, [
            coords[0], this.#height,
            ...data,
            coords[2], this.#height
        ])
            .setFillStyle(0x145dd1, 0)
            .setDepth(99)
            .setOrigin(0, 0);

        this.background.mask = new Phaser.Display.Masks.GeometryMask(context, this.body);

        this.sensor = context.matter.add.rectangle(
            this.#x + (this.#width / 2),
            this.#y + this.#height - (this.#depth / 2),
            this.#width,
            this.#depth,
            {
                isSensor: true,
                isStatic: true,
                gameObject: this
            }
        );

        this.debugGraphic = context.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.emitter = context.add.particles('droplet').createEmitter({
            alpha: 0.5,
            tint: 0x08bde1,
            speed: { min: 100, max: 500 },
            gravityY: 1000,
            lifespan: 4000,
            quantity: 0,
            frequency: 1000,
            angle: { min: 240, max: 300 },
            scale: { min: .5, max: .1 },
            deathZone: {
                type: 'onEnter',
                source: new Phaser.Geom.Polygon(
                    Object.values(this.body.geom.points)
                        .map(({ x, y }) => ([
                            this.#x + x,
                            this.#y + y
                        ]))
                )
            },
            deathCallback: ({ x }) => {
                const i = this.columns.findIndex((col, i) => this.#x + col.x >= x && i);
                this.ripple(Phaser.Math.Clamp(i, 0, this.columns.length - 1), 10);
            }
        });

        context.events.on('update', this.update, this);
        context.events.on('shutdown', this.destroy, this);
    }

    update () {
        this.columns.forEach(column =>
            column.update(this.#dampening, this.#tension)
        );

        const data = this.columns
            .reduce((cache, { x, y }) => ([ ...cache, x, y ]), []);
        this.body.geom.setTo([
            0, this.#height,
            ...data,
            this.#width, this.#height
        ]);
        this.body.updateData();

        this.debugGraphic.clear();
        if (this.#debug) {
            this.columns.forEach(({ x, y }) =>
                this.debugGraphic.fillRect(this.#x + x - 1, this.#y + y - 1, 2, 2)
            );
        }

        let lDeltas = Array(this.columns.length).fill(0);
        let rDeltas = Array(this.columns.length).fill(0);

        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < this.columns.length - 1; j++) {
                if (j > 0) {
                    const currColumn = this.columns[j];
                    const prevColumn = this.columns[j - 1];

                    lDeltas[j] = this.#spread * (currColumn.y - prevColumn.y);
                    prevColumn.speed += lDeltas[j];
                }

                if (j < this.columns.length - 1) {
                    const currColumn = this.columns[j];
                    const nextColumn = this.columns[j + 1];

                    rDeltas[j] = this.#spread * (currColumn.y - nextColumn.y);
                    nextColumn.speed += rDeltas[j];
                }
            }

            for (let j = 0; j < this.columns.length - 1; j++) {
                if (j > 0) {
                    const prevColumn = this.columns[j - 1];
                    prevColumn.y += lDeltas[j];
                }

                if (j < this.columns.length - 1) {
                    const nextColumn = this.columns[j + 1];
                    nextColumn.y += rDeltas[j];
                }
            }
        }

        this.background.tilePositionX += .1;
        this.background.tilePositionY += .05;
    }

    splash (index, speed) {
        const numDroplets = Math.floor(speed / 3);
        let column = this.columns[index];
        column.speed = speed;

        this.emitter
            .explode(numDroplets, this.#x + column.x, this.#y + column.y)

        return this;
    }

    ripple (index, speed) {
        let column = this.columns[index];
        column.speed = speed;

        return this;
    }

    get x () {
        return this.#x;
    }

    setDebug (bool) {
        this.#debug = bool;

        return this;
    }

    // TODO: Fix body not resizing
    setDepth (val) {
        this.#depth = this.#height - val;

        this.columns.forEach(col =>
            col.targetY = this.#depth
        );

        return this;
    }

    destroy () {
        this.#context.events.off('update', this.update, this);
    }

}
