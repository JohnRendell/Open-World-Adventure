function loadAssets(scene){
    //show loading div
    document.getElementById('loadingDiv').style.display = 'flex';

    // Update text as assets are loaded
    scene.load.on('progress', (value) => {
        let percentage = parseInt(value * 100);
        document.getElementById('loadingProgressText').innerText = `${percentage} %`;
    });

    scene.load.on('complete', () => {
        document.getElementById('loadingProgressText').innerText = 'Starting game...';
    });

    scene.load.spritesheet('river', '/ImageComponents/Sprite Sheets/River Sprite Sheet.png', {
        frameWidth: 9600 / 5,
        frameHeight: 1280 / 1
    });

    //texture images
    scene.load.image('floor', '/ImageComponents/Texture/Wooden Floor.png');

    //UI images
    scene.load.image('heartIcon', '/ImageComponents/UI/Heart Icon.png');
    scene.load.image('inventoryIcon', '/ImageComponents/UI/Inventory Icon.png');
    scene.load.image('meatIcon', '/ImageComponents/UI/meat icon.png');

    //objects
    scene.load.image('table', '/ImageComponents/Objects/Long table.png');
    scene.load.image('door', '/ImageComponents/Objects/Wooden Door.png');
    scene.load.image('window', '/ImageComponents/Objects/window day.png');
    scene.load.image('chest', '/ImageComponents/Objects/Wooden chest.png');
    scene.load.spritesheet('spawner', '/ImageComponents/Sprite Sheets/Spawner Sprite Sheet.png', {
        frameWidth: 5280 / 5,
        frameHeight: 800 / 1
    });
    //scene.load.image('front_Wall', '/ImageComponents/Objects/Wooden Wall lvl 1.png');
    //scene.load.image('side_Wall', '/ImageComponents/Objects/Side Wooden Wall lvl 1.png');
    //scene.load.image('gate', '/ImageComponents/Objects/Wooden Gate lvl 1.png')

    //player
    scene.load.spritesheet('guestPlayerIdle', '/ImageComponents/Sprite Sheets/guest player Idle Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    scene.load.spritesheet('guestPlayerFront', '/ImageComponents/Sprite Sheets/guest player front Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    scene.load.spritesheet('guestPlayerBack', '/ImageComponents/Sprite Sheets/guest player back Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    //effect
    scene.load.spritesheet('spawnEffect', '/ImageComponents/Sprite Sheets/Spawn effect sprite sheet.png', {
        frameWidth: 5120 / 5,
        frameHeight: 2048 / 2
    });

    //NPC
    scene.load.spritesheet('Bob_NPC', '/ImageComponents/Sprite Sheets/Guide Robot Sprite sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 960 / 1
    });
}