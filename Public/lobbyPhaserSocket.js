let isOtherPlayerFront = false;
let isOtherPlayerBack = false;

function createScene(scene){
    socket.on('spawnPlayer', () => {
        scene.otherPlayer = scene.physics.add.staticSprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
        scene.otherPlayer.setDisplaySize(40, 70);
        scene.otherPlayer.setVisible(false);

        //player name
        scene.otherPlayerName = scene.add.text(0, -50, "Guest_Player 2", {
            font: "16px 'Pixelify Sans'",
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        //player container
        scene.otherPlayerContainer = scene.add.container(centerWorld.width + 50, centerWorld.height, [scene.otherPlayer, scene.otherPlayerName]);

        //spawn smoke
        scene.spawnSmoke = scene.add.sprite(centerWorld.width, centerWorld.height - 50, "spawn_smoke").setOrigin(0.5);
        scene.spawnSmoke.setDisplaySize(2, 5);
        scene.spawnSmoke.setDepth(2);

        //animation for spawn effect
        scene.anims.create({
            key: 'spawnDust', 
            frames: scene.anims.generateFrameNumbers('spawnEffect', { start: 0, end: 8 }),
            frameRate: 12, 
            repeat: 0
        });

        // Play the animation
        scene.spawnSmoke.play('spawnDust');
        scene.spawnSmoke.on('animationcomplete', ()=>{
            scene.spawnSmoke.destroy();
            scene.otherPlayer.setVisible(true);
        });
    });

    socket.on('playerMove', (x, y, isBack, isFront, isFlip)=>{
        scene.otherPlayerContainer.setPosition(x, y);
        scene.otherPlayer.flipX = isFlip;

        if (isFront) {
            scene.otherPlayer.play('playerFront', true);
        } 
        else if (isBack) {
            scene.otherPlayer.play('playerBack', true);
        } 
        else {
            scene.otherPlayer.play('playerIdle', true);
        }
    });
}