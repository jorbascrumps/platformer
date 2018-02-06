import State from './State';
import StateIdle from './StateIdle';
import StateHit from './StateHit';

export default class StateAttack extends State {
    onEnter () {
        super.onEnter();

        this.obj.scene.anims.create({
            key: 'enemyAttack',
            frames: this.obj.scene.anims.generateFrameNumbers('enemyAttack', {
                start: 0,
                end: 17,
                first: 0
            }),
            frameRate: 30,
            repeat: 0,
            onUpdateParams: [ this.obj.scene.enemies ],
            onUpdate: this.checkWeaponCollisionForFrame,
            onComplete: () => this.obj.changeState(new StateIdle(this.obj))
        });
        this.obj.body.offset = {
            x: this.obj.flipX ? 27 : 5,
            y: 14
        };
        this.obj.setDisplayOrigin(this.obj.flipX ? 16 : 3, 5);
        this.obj.anims.play('enemyAttack');
    }

    onExit () {
        super.onExit();

        this.obj.body.offset = {
            x: this.obj.flipX ? 11 : 2,
            y: 9
        };
        this.obj.setDisplayOrigin(0, 0);
    }

    checkWeaponCollisionForFrame (target, anim, enemies) {
        const {
            anims: {
                currentFrame
            }
        } = target;

        if (currentFrame.index !== 9) {
            return;
        }

        const line = new Phaser.Geom.Line(
            target.flipX
                ? target.body.pos.x
                : target.body.pos.x + target.body.size.x,
            target.body.pos.y - target.body.size.x,
            target.flipX
                ? target.body.pos.x - (target.body.size.x * 2)
                : target.body.pos.x + (target.body.size.x * 3),
            target.body.pos.y + target.body.size.y
        );

        enemies.children.each(enemy => {
            const rect = new Phaser.Geom.Rectangle(
                enemy.body.pos.x,
                enemy.body.pos.y,
                enemy.body.size.x,
                enemy.body.size.y
            );

            const isHit = Phaser.Geom.Intersects.LineToRectangle(line, rect);
            isHit && enemy.changeState(new StateHit(enemy));
        });
    }
}
