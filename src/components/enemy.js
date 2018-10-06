import Actor from './Actor';
import StatePatrol from './states/StatePatrol';
import {
    DAMAGE_RECEIVE,
    STATE_CHANGE
} from '@/constants/events';

const {
    Physics: {
        Matter: {
            Matter: {
                Body,
                Bodies
            }
        }
    }
} = Phaser;

export default class Enemy extends Actor {

    constructor (scene, x, y) {
        super(scene, x, y);

        const sensorOptions = {
            isSensor: true
        };
        const sprite = this.scene.matter.add.sprite(0, 0, 'player', 0)
            .setDisplaySize(16, 32)
            .setSize(16, 32);
        const mainBody = Bodies.rectangle(0, 0, sprite.width, sprite.height, {
            chamfer: {
                radius: 4
            }
        });
        this.sensors = {
            right: Bodies.rectangle(sprite.width * 0.5, 0, 2, sprite.height * 0.5, sensorOptions),
            bottom: Bodies.rectangle(0, sprite.height * 0.5, sprite.width * 0.25, 2, sensorOptions),
            left: Bodies.rectangle(-sprite.width * 0.5, 0, 2, sprite.height * 0.5, sensorOptions)
        };
        const compoundBody = Body.create({
            parts: [
                mainBody,
                ...Object.values(this.sensors)
            ],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.05,
            render: {
                sprite: {
                    xOffset: 1,
                    yOffset: 0.3
                }
            }
        });
        this.sprite = sprite
            .setExistingBody(compoundBody)
            .setFixedRotation()
            .setPosition(x, y)
            .setTint(0xce4a4a);

        this.events.emit(STATE_CHANGE, StatePatrol);
    }

    // update () {
    //     const player = window.players.getFirstAlive();
    //     const line = new Phaser.Geom.Line(this.body.pos.x, this.body.pos.y, player.body.pos.x, player.body.pos.y);
    //
    //     const x = this.body.pos.x > player.body.pos.x
    //         ?   player.body.pos.x
    //         :   this.body.pos.x;
    //     const y = this.body.pos.y > player.body.pos.y
    //         ?   player.body.pos.y
    //         :   this.body.pos.y;
    //     const w = this.body.pos.x > player.body.pos.x
    //         ?   this.body.pos.x - player.body.pos.x
    //         :   player.body.pos.x;
    //     const h = this.body.pos.y > player.body.pos.y
    //         ?   this.body.pos.y - player.body.pos.y
    //         :   player.body.pos.y - this.body.pos.y;
    //     this.canSeePlayer = !this.scene.ground.getTilesWithinWorldXY(x, y, w, h, {
    //             isNotEmpty: true
    //         })
    //         .filter(tile => Phaser.Geom.Intersects.LineToRectangle(line, tile.getBounds()))
    //         .length;
    // }

}
