import State from './State';

export default class StateAttack extends State {
    onEnter () {
        super.onEnter();

        this.obj.body.offset = {
            x: this.obj.flipX ? 16 : 3,
            y: 4
        };
        this.obj.setDisplayOrigin(this.obj.flipX ? 16 : 3, 5);
        this.obj.anims.play('enemyAttack');
    }

    onExit () {
        super.onExit();

        this.obj.body.offset = {
            x: 0,
            y: -1
        };
        this.obj.setDisplayOrigin(0, 0);
    }
}
