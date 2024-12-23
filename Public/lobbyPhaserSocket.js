let isOtherPlayerFront = false;
let isOtherPlayerBack = false;

   //TODO: make a way to dynamic joining
function sceneSocket(scene){
    scene.playerCollection = new Map();

    socket.on('spawnPlayer', (playerName) => {
        if(localStorage.getItem('tempPlayerName') !== playerName){
            let otherPlayer = scene.physics.add.staticSprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
            otherPlayer.setDisplaySize(40, 70);
            otherPlayer.setVisible(false);

            //player name
            let otherPlayerName = scene.add.text(0, -50, playerName, {
                font: "16px 'Pixelify Sans'",
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            //player container
            let otherPlayerContainer = scene.add.container(centerWorld.width + 50, centerWorld.height, [otherPlayer, otherPlayerName]);
            otherPlayerContainer.setDepth(2);

            //add player data to the map
            scene.playerCollection.set(playerName, {
                container: otherPlayerContainer,
                playerSprite: otherPlayer
            });

            //spawn smoke
            scene.spawnSmoke = scene.add.sprite(centerWorld.width, centerWorld.height - 50, "spawn_smoke").setOrigin(0.5);
            scene.spawnSmoke.setDisplaySize(2, 5);
            scene.spawnSmoke.setDepth(3);

            // Play the animation
            scene.spawnSmoke.play('spawnDust');
            scene.spawnSmoke.on('animationcomplete', ()=>{
                scene.spawnSmoke.destroy();
                otherPlayer.setVisible(true);
            });
        }
    });

    socket.on('playerMove', (playerData)=>{
        const { playerID, x, y, isBack, isFront, spriteX } = playerData;

        const findPlayer = scene.playerCollection.get(playerID);

        if(findPlayer){
            const { container, playerSprite } = findPlayer;

            container.setPosition(x, y);
            playerSprite.flipX = spriteX;

            if (isFront) {
                playerSprite.play('playerFront', true);
            } 
            else if (isBack) {
                playerSprite.play('playerBack', true);
            } 
            else {
                playerSprite.play('playerIdle', true);
            }
        }
    });
}