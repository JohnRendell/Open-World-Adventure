function loadPlayerInfo(scene){
    socket.on('connect', ()=>{
        socket.emit('game_playerDisconnect');
    });

    socket.on('loadNewSprite', (sprite0, sprite1, sprite2)=>{
        //load new assets
        scene.load.spritesheet('main_playerIdle', sprite0, {
            frameWidth: 1600 / 5,
            frameHeight: 800 / 1
        });

        scene.load.spritesheet('main_playerFront', sprite1, {
            frameWidth: 1600 / 5,
            frameHeight: 800 / 1
        });

        scene.load.spritesheet('main_playerBack', sprite2, {
            frameWidth: 1600 / 5,
            frameHeight: 800 / 1
        });

        scene.load.on('complete', ()=>{
            //main player
            scene.player.setTexture('main_playerIdle');

            scene.anims.create({
                key: 'playerIdle',
                frames: scene.anims.generateFrameNumbers('main_playerIdle', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });

            scene.anims.create({
                key: 'playerFront',
                frames: scene.anims.generateFrameNumbers('main_playerFront', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });

            scene.anims.create({
                key: 'playerBack',
                frames: scene.anims.generateFrameNumbers('main_playerBack', { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        });
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

        pressKeysStuff();
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
        scene.playerUIContainer.destroy();

        setTimeout(() => {
            homeBaseUI(scene);
        }, 1500);
    });
}

//this is for pressing buttons, keys
function pressKeysStuff(){
    document.onkeydown = (event)=>{
        if(event.key === 'i' && !isPanelOpen){
            modalStatus('inventoryModal', 'flex', 'modalAnimation');
            isTalking = true;
            isPanelOpen = true;
        }
    }
}