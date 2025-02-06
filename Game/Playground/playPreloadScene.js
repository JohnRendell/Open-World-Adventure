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

    //objects
    scene.load.image('gate', '/ImageComponents/Objects/Wooden Gate.png');

    //islands
    scene.load.image('islandA', '/ImageComponents/Playground/IslandA.png');

    //UI images
    scene.load.image('heartIcon', '/ImageComponents/UI/Heart Icon.png');
    scene.load.image('inventoryIcon', '/ImageComponents/UI/Inventory Icon.png');
    scene.load.image('meatIcon', '/ImageComponents/UI/meat icon.png');
    scene.load.image('settingIcon', '/ImageComponents/UI/Setting Icon.png');
    scene.load.image('arrowIcon', '/ImageComponents/UI/Arrow Icon.png');
    scene.load.image('zButton', '/ImageComponents/UI/Z button.png');

    //objects
    scene.load.image('rock', '/ImageComponents/Objects/Rock.png');
    scene.load.image('tree', '/ImageComponents/Objects/Tree.png');

    scene.load.spritesheet('deathEffect', '/ImageComponents/Sprite Sheets/Death Effect Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 320 / 1
    });

    //NPC
    /*
    scene.load.spritesheet('Bob_NPC', '/ImageComponents/Sprite Sheets/Guide Robot Sprite Sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 960 / 1
    });

    scene.load.spritesheet('BobPrototype_NPC', '/ImageComponents/Sprite Sheets/Helper Robot Sprite Sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 960 / 1
    });*/
}