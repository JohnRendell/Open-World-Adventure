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
        frameHeight: 1920 / 1
    });

    //objects
    scene.load.spritesheet('spawner', '/ImageComponents/Sprite Sheets/Spawner Sprite Sheet.png', {
        frameWidth: 5280 / 5,
        frameHeight: 800 / 1
    });

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
    scene.load.spritesheet('Bimbo_NPC', '/ImageComponents/Sprite Sheets/Bimbo Idle sprite sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });
}