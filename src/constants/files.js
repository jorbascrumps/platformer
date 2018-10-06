const type = (type, assets) => assets
    .map(asset => Object.assign({}, asset, { // TODO: Object spread with rollup
        type
    }));

export const IMAGES = type('image', [
    {
        key: 'tiles',
        url: [ 'tiles.png', 'tiles_n.png' ]
    },
    {
        key: 'player',
        url: 'nega_nathan.png'
    },
    {
        key: 'tilesprite',
        url: [ 'tilesprite.png', 'tilesprite_n.png' ]
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
        url: 'enemy/walk.png',
        frameConfig: {
            frameWidth: 22,
            frameHeight: 33,
            endFrame: 12
        }
    },
    {
        key: 'enemyAttack',
        url: 'enemy/attack.png',
        frameConfig: {
            frameWidth: 43,
            frameHeight: 37,
            endFrame: 18
        }
    },
    {
        key: 'enemyIdle',
        url: 'enemy/idle.png',
        frameConfig: {
            frameWidth: 24,
            frameHeight: 32,
            endFrame: 10
        }
    },
    {
        key: 'enemyHit',
        url: 'enemy/hit.png',
        frameConfig: {
            frameWidth: 30,
            frameHeight: 32,
            endFrame: 9
        }
    },
    {
        key: 'enemyPatrol',
        url: 'enemy/patrol.png',
        frameConfig: {
            endFrame: 30,
            frameHeight: 64,
            frameWidth: 64
        }
    }
]);
