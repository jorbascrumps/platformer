const type = (type, assets) => assets
    .map(asset => Object.assign({}, asset, { // TODO: Object spread with rollup
        type
    }));

export const IMAGES = type('image', [
    {
        key: 'tiles',
        file: [ 'tiles.png', 'tiles_n.png' ]
    },
    {
        key: 'player',
        file: 'nega_nathan.png'
    },
    {
        key: 'tilesprite',
        file: [ 'tilesprite.png', 'tilesprite_n.png' ]
    }
]);

export const JSON = type('json', [
    {
        key: 'left'
    },
    {
        key: 'right'
    },
    {
        key: 'down'
    },
    {
        key: 'start'
    }
]);

export const SPRITESHEETS = type('spritesheet', [
    {
        key: 'enemyWalk',
        file: 'enemy/walk.png',
        config: {
            frameWidth: 22,
            frameHeight: 33,
            endFrame: 12
        }
    },
    {
        key: 'enemyAttack',
        file: 'enemy/attack.png',
        config: {
            frameWidth: 43,
            frameHeight: 37,
            endFrame: 18
        }
    },
    {
        key: 'enemyIdle',
        file: 'enemy/idle.png',
        config: {
            frameWidth: 24,
            frameHeight: 32,
            endFrame: 10
        }
    },
    {
        key: 'enemyHit',
        file: 'enemy/hit.png',
        config: {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 9
        }
    }
]);
