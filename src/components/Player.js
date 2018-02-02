export default class Player extends Phaser.Physics.Impact.Sprite {
    constructor (scene, x, y) {
        super(scene.impact.world, x, y, 'enemyWalk');

        scene.add.displayList.add(this);

        this.setActive(true);
        this.setOrigin(0, 0);
        this.setMaxVelocity(500);
        this.setFriction(2000, 100);

        this.scene = scene;

        this.body.accelGround = 1000;
        this.body.accelAir = 800;
        this.body.jumpSpeed = 500;
        this.body.isFalling = false;
    }
}
