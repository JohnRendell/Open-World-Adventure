let userProfile;

socket.on('connect', ()=>{
     function guestID(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }

    let playerName = 'Guest_' + guestID(5);

    setTimeout(() => {
        socket.emit('loadPlayerName', playerName);
        socket.emit('playerDisconnect', playerName);
        socket.emit('spawnPlayer', playerName);

        socket.emit('game_playerDisconnect');
    }, 1000);

    userProfile = 'https://i.imgur.com/ajVzRmV.jpg';
});

function sceneSocket(scene){
    //map collection for players joined
    scene.playerCollection = new Map();

    socket.on('playerDisconnect', (playerName)=>{
        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerName);

        if(findPlayer){
            const { playerName, container, playerSprite } = findPlayer;
            playerName.destroy();
            playerSprite.destroy();
            container.destroy();
            scene.playerCollection.delete(playerName);
        }
    });

    socket.on('spawnPlayer', (playerName) => {
        setTimeout(() => {
            if(lobby_playerName !== playerName){
                //joined Player
                scene.joinedPlayer = scene.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
                scene.joinedPlayer.setScale(0.1); 
                scene.joinedPlayer.setVisible(false);

                //joined Player name
                scene.joinedPlayerName = scene.add.text(0, -50, playerName, {
                    font: "16px 'Pixelify Sans'",
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);

                //joined Player container
                scene.joinedPlayerContainer = scene.add.container(centerWorld.width + 50, centerWorld.height, [scene.joinedPlayer, scene.joinedPlayerName]);
                scene.joinedPlayerContainer.setDepth(2);

                //spawn smoke
                scene.spawnSmoke = scene.add.sprite(centerWorld.width, centerWorld.height - 50, "spawn_smoke").setOrigin(0.5);
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
        }, 1000);
    });

    //for rendering player data
    socket.on('existingPlayer', (playerData)=>{
        const { playerID, playerX, playerY } = playerData;

        setTimeout(() => {
            if(!scene.playerCollection.has(playerID)){
                //joined Player
                scene.joinedPlayer = scene.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
                scene.joinedPlayer.setScale(0.1); 
                scene.joinedPlayer.setVisible(true);

                //joined Player name
                scene.joinedPlayerName = scene.add.text(0, -50, playerID, {
                    font: "16px 'Pixelify Sans'",
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);

                //joined Player container
                scene.joinedPlayerContainer = scene.add.container(playerX, playerY, [scene.joinedPlayer, scene.joinedPlayerName]);
                scene.joinedPlayerContainer.setDepth(2);

                //add player to the collection
                scene.playerCollection.set(playerID, {
                    playerName: scene.joinedPlayerName,
                    container: scene.joinedPlayerContainer,
                    playerSprite: scene.joinedPlayer
                });
            }
        }, 1000);
    });

    socket.on('playerMove', (playerData)=>{
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

    //when player logged in
    socket.on('redirectToBase', (playerName)=>{
        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerName);

        if(findPlayer){
            const { playerName, container, playerSprite } = findPlayer;
            playerName.destroy();
            playerSprite.destroy();
            container.destroy();
            scene.playerCollection.delete(playerName);
        }
    });
}

function loadPlayerData(scene){
    //load playername
    socket.on('loadPlayerName', (playerName)=>{
        loggedIn_playerName = playerName;
        lobby_playerName = playerName;
        scene.playerName.setText(playerName);
    });
}