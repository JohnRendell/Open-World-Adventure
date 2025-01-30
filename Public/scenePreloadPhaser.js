// Preload function (for loading assets)
function loadAssets(scene) {
    //show loading div
    document.getElementById('loadingDiv').style.display = 'flex';

    //objects
    scene.load.image('lobby', '/ImageComponents/Lobby/Lobby Island.png');
    scene.load.image('rock', '/ImageComponents/Objects/Rock.png');
    scene.load.image('tree', '/ImageComponents/Objects/Tree.png');
    scene.load.spritesheet('spawner', '/ImageComponents/Sprite Sheets/Spawner effect Sprite Sheet.png', {
        frameWidth: 5280 / 5,
        frameHeight: 800 / 1
    });

    //icon
    scene.load.image('loggedIcon', '/ImageComponents/UI/Login Icon.png');
    scene.load.image('guestIcon', '/ImageComponents/UI/Guest Icon.png');
    scene.load.image('arrowIcon', '/ImageComponents/UI/Arrow Icon.png');

    //player
    scene.load.spritesheet('guestPlayerIdle', 'https://i.imgur.com/4BkMHTS.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    scene.load.spritesheet('guestPlayerFront', 'https://i.imgur.com/Qq3Yedn.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    scene.load.spritesheet('guestPlayerBack', 'https://i.imgur.com/xhU6u5B.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    //effect
    scene.load.spritesheet('spawnEffect', '/ImageComponents/Sprite Sheets/Spawn effect sprite sheet.png', {
        frameWidth: 5120 / 5,
        frameHeight: 2048 / 2
    });

    // Update text as assets are loaded
    scene.load.on('progress', (value) => {
        let percentage = parseInt(value * 100);
        document.getElementById('loadingProgressText').innerText = `${percentage} %`;
    });

    scene.load.on('complete', () => {
        document.getElementById('loadingProgressText').innerText = 'Starting game...';
    });
}