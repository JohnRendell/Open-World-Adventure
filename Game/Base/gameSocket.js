function loadPlayerInfo(scene){
    socket.on('connect', ()=>{
        socket.emit('game_playerDisconnect');
    });

    socket.on('loadNewSprite', (imageID, sprite, query)=>{
        isLoaded = false;
        alert(query + ' sprite updated');

        scene.player.setVisible(false);
        localStorage.removeItem(imageID);

        switch(query){
            case 'front':
                if (scene.anims.exists('playerFront')) {
                    scene.anims.remove('playerFront');
                }

                if (scene.textures.exists('main_playerFront')) {
                    scene.textures.remove('main_playerFront');
                }

                //load new assets
                scene.load.spritesheet('main_playerFront', sprite, {
                    frameWidth: 1600 / 5,
                    frameHeight: 800 / 1
                });

                scene.load.once('complete', ()=>{
                    if(!scene.anims.exists('playerFront')){
                        scene.anims.create({
                            key: 'playerFront',
                            frames: scene.anims.generateFrameNumbers('main_playerFront', { start: 0, end: 1 }),
                            frameRate: 4,
                            repeat: -1
                        });
                    }
                    scene.player.play('playerFront');
                });

                scene.load.start();
            break;

            case 'back':
                if (scene.anims.exists('playerBack')) {
                    scene.anims.remove('playerBack');
                }

                if (scene.textures.exists('main_playerBack')) {
                    scene.textures.remove('main_playerBack');
                }

                //load new assets
                scene.load.spritesheet('main_playerBack', sprite, {
                    frameWidth: 1600 / 5,
                    frameHeight: 800 / 1
                });

                scene.load.once('complete', ()=>{
                    if(!scene.anims.exists('playerBack')){
                        scene.anims.create({
                            key: 'playerBack',
                            frames: scene.anims.generateFrameNumbers('main_playerBack', { start: 0, end: 1 }),
                            frameRate: 4,
                            repeat: -1
                        });
                    }
                    scene.player.play('playerBack');
                });

                scene.load.start();
            break;

            case 'side':
                if (scene.anims.exists('playerIdle')) {
                    scene.anims.remove('playerIdle');
                }

                if (scene.textures.exists('main_playerIdle')) {
                    scene.textures.remove('main_playerIdle');
                }

                //load new assets
                scene.load.spritesheet('main_playerIdle', sprite, {
                    frameWidth: 1600 / 5,
                    frameHeight: 800 / 1
                });

                scene.load.once('complete', ()=>{
                    if(!scene.anims.exists('playerIdle')){
                        scene.anims.create({
                            key: 'playerIdle',
                            frames: scene.anims.generateFrameNumbers('main_playerIdle', { start: 0, end: 1 }),
                            frameRate: 4,
                            repeat: -1
                        });
                    }
                    scene.player.play('playerIdle');
                });

                scene.load.start();
            break;
        }

        setTimeout(() => {
            isLoaded = true;
            scene.player.setVisible(true);
        }, 1000);
        socket.emit('loadNewSpriteToClient', game_PlayerName, sprite, query);
    });

    socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName ? playerName : 'cookie expired');
        scene.load.image('playerProfile', playerProfile);

        setTimeout(() => {
            homeBaseUI(scene);

            //spawn the player
            game_PlayerName = playerName;
            loggedIn_playerName = playerName;

            socket.emit('game_spawnPlayer', playerName);
            socket.emit('game_playerConnected', playerName);
        }, 1500);
    });

    socket.on('updateAcc', (playerName)=>{
        game_PlayerName = playerName;
        scene.playerName.setText(playerName);
    });

    socket.on('updateProfile', (profile)=>{
        if(scene.textures.exists('playerProfile')){
            scene.textures.remove('playerProfile');
        }
        scene.load.image('playerProfile', profile);

        scene.profileBorder.destroy();
        scene.playerProfile.destroy();
        scene.heartIcon.destroy();
        scene.playerHealthContainer.destroy();
        scene.playerHealth.destroy();
        scene.meatIcon.destroy();
        scene.playerHungerContainer.destroy();
        scene.playerHunger.destroy();
        scene.playerInventory.destroy();
        scene.playerSetting.destroy();
        scene.playerUIContainer.destroy();

        setTimeout(() => {
            homeBaseUI(scene);
        }, 1500);
    });
}