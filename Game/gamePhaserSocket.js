function sceneSocket(scene){
    //TODO: fix the sockets

    //map collection for players joined
    scene.playerCollection = new Map();

    socket.on('game_playerDisconnect', (playerName)=>{
        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerName);

        if(findPlayer){
            const { playerName, container, playerSprite } = findPlayer;
            playerName.destroy();
            playerSprite.destroy();
            container.destroy();
            scene.playerCollection.delete(game_PlayerName);
        }
    });

    socket.on('game_spawnPlayer', (playerUser) => {
        if(game_PlayerName !== playerUser){
            //joined Player
            scene.joinedPlayer = scene.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
            scene.joinedPlayer.setDisplaySize(40, 70);
            scene.joinedPlayer.setCollideWorldBounds(true); 
            scene.joinedPlayer.setVisible(false);

            //joined Player name
            scene.joinedPlayerName = scene.add.text(0, -50, playerUser, {
                font: "16px 'Pixelify Sans'",
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            //joined Player container
            scene.joinedPlayerContainer = scene.add.container(499, 296, [scene.joinedPlayer, scene.joinedPlayerName]);
            scene.joinedPlayerContainer.setDepth(2);

            //spawn smoke
            scene.spawnSmoke = scene.add.sprite(447, 266, "spawn_smoke").setOrigin(0.5);
            scene.spawnSmoke.setDisplaySize(2, 5);
            scene.spawnSmoke.setDepth(1);

            // Play the animation
            scene.spawnSmoke.play('spawnDust');

            scene.spawnSmoke.on('animationcomplete', ()=>{
                scene.spawnSmoke.destroy();
                scene.joinedPlayer.setVisible(true);
            });

            //add player to the collection
            scene.playerCollection.set(playerName, {
                playerName: scene.joinedPlayerName,
                container: scene.joinedPlayerContainer,
                playerSprite: scene.joinedPlayer
            });
        }
    });

    //for rendering player data
    socket.on('game_existingPlayer', (playerData)=>{
        const { playerID, playerX, playerY } = playerData;

        if(!scene.playerCollection.has(playerID)){

            //joined Player
            scene.joinedPlayer = scene.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
            scene.joinedPlayer.setDisplaySize(40, 70);
            scene.joinedPlayer.setCollideWorldBounds(true); 
            scene.joinedPlayer.setVisible(true);

            //joined Player name
            scene.joinedPlayerName = scene.add.text(0, -50, playerID, {
                font: "16px 'Pixelify Sans'",
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            //joined Player container
            scene.joinedPlayerContainer = scene.add.container(playerX, playerY, [scene.joinedPlayer, scene.joinedPlayerName]);
            scene.joinedPlayerContainer.setDepth(1);

            //add player to the collection
            scene.playerCollection.set(playerID, {
                playerName: scene.joinedPlayerName,
                container: scene.joinedPlayerContainer,
                playerSprite: scene.joinedPlayer
            });
        }
    });

    socket.on('game_playerMove', (playerData)=>{
        const { playerID, x, y, isBack, isFront, spriteX } = playerData;

        //search player to the collection
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