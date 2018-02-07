import State from './State';
import StateIdle from './StateIdle';

export default class StateFalling extends State {
    execute () {
        if (this.obj.body.standing) {
            console.log('Take fall damage');

            return this.obj.changeState(new StateIdle(this.obj));
        }
    }
}
