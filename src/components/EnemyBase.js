import Actor from './Actor';

export default class EnemyBase extends Actor {

    update () {
        super.update();

        if (!this.sprite.active) {
            return;
        }

        const {
            scene: {
                map: {
                    ground,
                },
                player,
            }
        } = this;

        const line = new Phaser.Geom.Line(this.sprite.x, this.sprite.y, player.sprite.x, player.sprite.y);
        this.canSeePlayer = ground.getTilesWithinShape(line, {
            isNotEmpty: true
        })
            .length === 0;

        if (this.debug) {
            const lineColour = this.canSeePlayer ? this.debugGraphic.defaultStrokeColor : 0xff0000;
            this.debugGraphic
                .clear()
                .lineStyle(1, lineColour)
                .strokeLineShape(line)
        }
    }

}
