export default class Flying extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        scene.sys.displayList.add(this); // TODO: Remove in favour of Group
        scene.sys.updateList.add(this); // TODO: Remove in favour of Group

        this.setActiveCollision();
        this.setAvsB();
        this.setGravity(0);
        this.setBodySize(10, 10);
        this.setOrigin(0.5, 0.5);
        this.body.offset = {
            x: 5,
            y: 16
        };
        this.update.bind(this);
    }

    preUpdate (...args) {
        this.update(...args);
    }

    update () {
        const {
            body: {
                pos: {
                    x: playerX,
                    y: playerY
                }
            }
        } = window.players.getFirstAlive();

        const distance = Phaser.Math.Distance.Between(
            playerX,
            playerY,
            this.body.pos.x,
            this.body.pos.y - 20
        );

        if (distance < 200) {
            const rotation = Phaser.Math.Angle.Between(
                playerX,
                playerY,
                this.body.pos.x,
                this.body.pos.y + 20
            );

            this.setVelocity(
                -Math.cos(rotation) * 60,
                -Math.sin(rotation) * 60
            );

            this.setRotation(Phaser.Math.Angle.Normalize(rotation));
        } else {
            this.setVelocity(0, 0);
        }
    }
}
