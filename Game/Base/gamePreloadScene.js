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
    scene.load.image('grassTexture', '/ImageComponents/Texture/Grass Texture.png');
    scene.load.image('dirt', '/ImageComponents/Texture/Dirt Road.png');
    scene.load.image('dirtCorner', '/ImageComponents/Texture/Dirt Road corner.png');

    //UI images
    scene.load.image('heartIcon', '/ImageComponents/UI/Heart Icon.png');
    scene.load.image('inventoryIcon', '/ImageComponents/UI/Inventory Icon.png');
    scene.load.image('meatIcon', '/ImageComponents/UI/meat icon.png');
    scene.load.image('settingIcon', '/ImageComponents/UI/Setting Icon.png');
    scene.load.image('arrowIcon', '/ImageComponents/UI/Arrow Icon.png');
    scene.load.image('zButton', '/ImageComponents/UI/Z button.png');

    //objects
    scene.load.image('table', '/ImageComponents/Objects/Long table.png');
    scene.load.image('door', '/ImageComponents/Objects/Wooden Door.png');
    scene.load.image('window', '/ImageComponents/Objects/window day.png');
    scene.load.image('chest', '/ImageComponents/Objects/Wooden chest.png');
    scene.load.image('Cabinet', '/ImageComponents/Objects/Cabinet.png');
    scene.load.image('rock', '/ImageComponents/Objects/Rock.png');
    scene.load.image('tree', '/ImageComponents/Objects/Tree.png');
    scene.load.spritesheet('spawner', '/ImageComponents/Sprite Sheets/Spawner Sprite Sheet.png', {
        frameWidth: 5280 / 5,
        frameHeight: 800 / 1
    });
    scene.load.image('front_Wall', '/ImageComponents/Objects/Wooden Wall.png');
    scene.load.image('gate', '/ImageComponents/Objects/Wooden Gate.png')

    //effect
    scene.load.spritesheet('spawnEffect', '/ImageComponents/Sprite Sheets/Spawn effect Sprite Sheet.png', {
        frameWidth: 5120 / 5,
        frameHeight: 2048 / 2
    });

    scene.load.spritesheet('deathEffect', '/ImageComponents/Sprite Sheets/Death Effect Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 320 / 1
    });

    //NPC
    scene.load.spritesheet('Bob_NPC', '/ImageComponents/Sprite Sheets/Guide Robot Sprite Sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 960 / 1
    });

    scene.load.spritesheet('BobPrototype_NPC', '/ImageComponents/Sprite Sheets/Helper Robot Sprite Sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 960 / 1
    });
}