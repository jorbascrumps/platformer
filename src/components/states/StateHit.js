import State from './State';
import StatePatrol from './StatePatrol';

export default class StateHit extends State {
    onEnter () {
        super.onEnter();

        this.obj.scene.anims.create({
            key: 'enemyHit',
            frames: this.obj.scene.anims.generateFrameNumbers('enemyHit', {
                start: 0,
                end: 7,
                first: 0
            }),
            frameRate: 10,
            onComplete: () => this.obj.changeState(new StatePatrol(this.obj))
        });
        this.obj.anims.play('enemyHit');
    }
}
