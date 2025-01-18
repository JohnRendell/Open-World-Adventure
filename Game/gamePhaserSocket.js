function destroyNoNameSprite(scene){
    //search player to the collection
    scene.playerCollection.forEach((player, name) => {
        if(!name){
            const { playerName, container, playerSprite } = player;
            playerName.destroy();
            playerSprite.destroy();
            container.destroy();
            scene.playerCollection.delete(name);
        } 
    });
}

function sceneSocket(scene){
    //map collection for players joined
    scene.playerCollection = new Map();
    let animationFire = false;

    //load new player's sprite
    socket.on('loadNewSpriteToClient', (playerName, sprite, query)=>{
        scene.playerCollection.forEach((player, name)=>{
             if(playerName === name){
                const { playerSprite } = player;
                playerSprite.setVisible(false);
                animationFire = false;

                switch(query){
                    case 'front':
                        if (scene.anims.exists(name + '_playerFront')) {
                            scene.anims.remove(name + '_playerFront');
                        }

                        if (scene.textures.exists(name + '_playerFront')) {
                            scene.textures.remove(name + '_playerFront');
                        }

                        //load new assets
                        scene.load.spritesheet(name + '_playerFront', sprite, {
                            frameWidth: 1600 / 5,
                            frameHeight: 800 / 1
                        });

                        scene.load.once('complete', ()=>{
                            if(!scene.anims.exists(name + '_playerFront')){
                                scene.anims.create({
                                    key: name + '_playerFront',
                                    frames: scene.anims.generateFrameNumbers(name + '_playerFront', { start: 0, end: 1 }),
                                    frameRate: 4,
                                    repeat: -1
                                });
                            }
                            playerSprite.play(name + '_playerFront');
                            playerSprite.setVisible(true);
                            animationFire = true;
                        });

                        scene.load.start();
                    break;

                    case 'back':
                        if (scene.anims.exists(name + '_playerBack')) {
                            scene.anims.remove(name + '_playerBack');
                        }

                        if (scene.textures.exists(name + '_playerBack')) {
                            scene.textures.remove(name + '_playerBack');
                        }

                        //load new assets
                        scene.load.spritesheet(name + '_playerBack', sprite, {
                            frameWidth: 1600 / 5,
                            frameHeight: 800 / 1
                        });

                        scene.load.once('complete', ()=>{
                            if(!scene.anims.exists(name + '_playerBack')){
                                scene.anims.create({
                                    key: name + '_playerBack',
                                    frames: scene.anims.generateFrameNumbers(name + '_playerBack', { start: 0, end: 1 }),
                                    frameRate: 4,
                                    repeat: -1
                                });
                            }
                            playerSprite.play(name + '_playerBack');
                            playerSprite.setVisible(true);
                            animationFire = true;
                        });

                        scene.load.start();
                    break;

                    case 'side':
                        if (scene.anims.exists(name + '_playerIdle')) {
                            scene.anims.remove(name + '_playerIdle');
                        }

                        if (scene.textures.exists(name + '_playerIdle')) {
                            scene.textures.remove(name + '_playerIdle');
                        }

                        //load new assets
                        scene.load.spritesheet(name + '_playerIdle', sprite, {
                            frameWidth: 1600 / 5,
                            frameHeight: 800 / 1
                        });

                        scene.load.once('complete', ()=>{
                            if(!scene.anims.exists(name + '_playerIdle')){
                                scene.anims.create({
                                    key: name + '_playerIdle',
                                    frames: scene.anims.generateFrameNumbers(name + '_playerIdle', { start: 0, end: 1 }),
                                    frameRate: 4,
                                    repeat: -1
                                });
                            }
                            playerSprite.play(name + '_playerIdle');
                            playerSprite.setVisible(true);
                            animationFire = true;
                        });

                        scene.load.start();
                    break;
                }
            }
        })
    });

    //load player's sprite
    socket.on('game_loadPlayerSprite', (playerID, spriteFront, spriteBack, spriteSide)=>{
        if(playerID !== game_PlayerName){
            scene.load.spritesheet(playerID + '_playerBack', spriteBack, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            scene.load.spritesheet(playerID + '_playerFront', spriteFront, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            scene.load.spritesheet(playerID + '_playerIdle', spriteSide, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            scene.load.once('complete', ()=>{
                if(!scene.anims.exists(playerID + '_playerIdle')){
                    scene.anims.create({
                        key: playerID + '_playerIdle',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerIdle', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: -1
                    });
                }

                if(!scene.anims.exists(playerID + '_playerFront')){
                    scene.anims.create({
                        key: playerID + '_playerFront',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerFront', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: -1
                    });
                }

                if(!scene.anims.exists(playerID + '_playerBack')){
                    scene.anims.create({
                        key: playerID + '_playerBack',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerBack', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: -1
                    });
                }
                animationFire = true;
            });

            scene.load.start();
        }
    });

    socket.on('game_playerDisconnect', ()=>{
        //search player to the collection
        scene.playerCollection.forEach((player, name) => {
            if(name !== game_PlayerName){
                const { playerName, container, playerSprite } = player;
                playerName.destroy();
                playerSprite.destroy();
                container.destroy();
                scene.playerCollection.delete(name);
            } 
        });
    });

    socket.on('game_spawnPlayer', (playerUser) => {
        setTimeout(() => {
            if(game_PlayerName !== playerUser){
                //joined Player
                scene.joinedPlayer = scene.physics.add.sprite(0,0, playerUser + '_playerIdle').setOrigin(0.5);
                scene.joinedPlayer.setScale(0.1); 
                scene.joinedPlayer.setVisible(false);

                //joined Player name
                scene.joinedPlayerName = scene.add.text(0, -50, playerUser, {
                    font: "16px 'Pixelify Sans'",
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5).setDepth(5);

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
                scene.playerCollection.set(playerUser, {
                    playerName: scene.joinedPlayerName,
                    isInsideOfRoom: false,
                    container: scene.joinedPlayerContainer,
                    playerSprite: scene.joinedPlayer
                });

                destroyNoNameSprite(scene);
            }
        }, 1000);
    });

    //when other player go inside or outside of room
    socket.on('playerGoToDoor', (offsetY, playerName)=>{
        scene.playerCollection.forEach((player, name)=>{
            if(playerName == name){
                //going outside
                if(offsetY > 0){
                    player.isInsideOfRoom = false;
                    player.container.setVisible(true);

                    if(isMainPlayerGoingToRoom){
                        player.container.setVisible(false);
                    }
                }

                //going inside
                else{
                    player.isInsideOfRoom = true;
                    player.container.setVisible(false);

                    if(isMainPlayerGoingToRoom){
                        player.container.setVisible(true);
                    }
                }
            }
        });
    });

    //hiding players when going to room
    socket.on('hidePlayersWhenGoToRoom', (offsetY)=>{
        scene.playerCollection.forEach((player, name)=>{
            if(game_PlayerName != name){
                //main player going outside
                if(offsetY > 0){
                    if(player.isInsideOfRoom){
                        player.container.setVisible(false);
                    }
                    else{
                        player.container.setVisible(true);
                    }
                }

                //main player going inside
                else{
                    if(player.isInsideOfRoom){
                        player.container.setVisible(true);
                    }
                    else{
                        player.container.setVisible(false);
                    }
                }
            }
        });
    });

    //for rendering player data
    socket.on('game_existingPlayer', (playerData)=>{
        const { playerID, playerX, playerY } = playerData;

        setTimeout(() => {
            if(!scene.playerCollection.has(playerID)){
                //joined Player
                scene.joinedPlayer = scene.physics.add.sprite(0,0, playerID + '_playerIdle').setOrigin(0.5);
                scene.joinedPlayer.setScale(0.1); 
                scene.joinedPlayer.setVisible(true);

                //joined Player name
                scene.joinedPlayerName = scene.add.text(0, -50, playerID, {
                    font: "16px 'Pixelify Sans'",
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5).setDepth(5);

                //joined Player container
                scene.joinedPlayerContainer = scene.add.container(playerX, playerY, 
                    [
                        scene.joinedPlayerName,
                        scene.joinedPlayer
                    ]);
                scene.joinedPlayerContainer.setDepth(1);

                //add player to the collection
                scene.playerCollection.set(playerID, {
                    playerName: scene.joinedPlayerName,
                    isInsideOfRoom: false,
                    container: scene.joinedPlayerContainer,
                    playerSprite: scene.joinedPlayer
                });

                destroyNoNameSprite(scene);
            }
        }, 1000);
    });

    socket.on('game_playerMove', (playerData)=>{
        const { playerID, x, y, isBack, isFront, spriteX } = playerData;

        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerID);

        if(findPlayer){
            const { container, playerSprite } = findPlayer;

            container.setPosition(x, y);
            playerSprite.flipX = spriteX;

           if(animationFire){
                if (isFront) {
                    playerSprite.play(playerID + '_playerFront', true);
                } 
                else if (isBack) {
                    playerSprite.play(playerID + '_playerBack', true);
                } 
                else {
                    playerSprite.play(playerID + '_playerIdle', true);
                }
           }
        }
    });
}