let animationFire = false;

function loadPlayerInfo(scene){
    socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName ? playerName : 'cookie expired');
        scene.load.image('playerProfile', playerProfile);

        setTimeout(() => {
            homeBaseUI(scene);

            //spawn the player
            game_PlayerName = playerName;
            loggedIn_playerName = playerName;

            socket.emit('gameOutside_spawnPlayer', playerName);
            socket.emit('gameOutside_playerConnected', playerName);
        }, 1500);
    });
}

function sceneSocket(scene){
    scene.playerCollection = new Map();

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

    socket.on('gameOutside_playerDisconnect', ()=>{
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

    socket.on('gameOutside_spawnPlayer', (playerUser) => {
        setTimeout(() => {
            if(!scene.playerCollection.has(playerUser) && game_PlayerName !== playerUser){
                //joined Player
                scene.joinedPlayer = scene.physics.add.sprite(0,0, playerUser + '_playerIdle').setOrigin(0.5);
                scene.joinedPlayer.setScale(0.1); 
                scene.joinedPlayer.setVisible(true);
                scene.joinedPlayer.body.setSize(scene.joinedPlayer.width, scene.joinedPlayer.height, true);
                scene.joinedPlayer.body.setOffset(0,0);

                //joined Player name
                scene.joinedPlayerName = scene.add.text(0, -50, playerUser, {
                    font: "16px 'Pixelify Sans'",
                    fill: '#ffffff',
                    align: 'center'
                }).setOrigin(0.5);

                //joined Player container
                scene.joinedPlayerContainer = scene.add.container(380, 250, [scene.joinedPlayer, scene.joinedPlayerName]);
                scene.physics.world.enable(scene.joinedPlayerContainer);

                scene.joinedPlayerContainer.body.setCollideWorldBounds(true);
                scene.joinedPlayerContainer.body.setSize(40, 70, true);
                scene.joinedPlayerContainer.body.setOffset(-20, -35);
                scene.joinedPlayerContainer.setDepth(3);

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

    socket.on('gameOutside_playerMove', (playerData)=>{
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

           //for tree
            const treeY = ()=>{
                if(scene.tree.body.y > container.y){
                    container.setDepth(1);
                }
                else{
                    container.setDepth(4);
                }
            }
            treeY();
        }
    });

    //for rendering player data
    socket.on('gameOutside_existingPlayer', (playerData)=>{
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
                }).setOrigin(0.5);

                //joined Player container
                scene.joinedPlayerContainer = scene.add.container(playerX, playerY, 
                    [
                        scene.joinedPlayerName,
                        scene.joinedPlayer
                    ]);
                scene.physics.world.enable(scene.joinedPlayerContainer);

                scene.joinedPlayerContainer.body.setCollideWorldBounds(true);
                scene.joinedPlayerContainer.body.setSize(40, 70, true);
                scene.joinedPlayerContainer.body.setOffset(-20, -35);
                scene.joinedPlayerContainer.setDepth(3);

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

    //displaying sprite player
    socket.on('gameOutside_loadPlayerSprite', (playerID, spriteFront, spriteBack, spriteSide, frontAttack, backAttack, sideAttack)=>{
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

            scene.load.spritesheet(playerID + '_playerAttackSide', sideAttack, {
                frameWidth: 4800 / 5,
                frameHeight: 960 / 1
            });

            scene.load.spritesheet(playerID + '_playerAttackFront', frontAttack, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            scene.load.spritesheet(playerID + '_playerAttackBack', backAttack, {
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

                if(!scene.anims.exists(playerID + '_playerAttackSide')){
                    scene.anims.create({
                        key: playerID + '_playerAttackSide',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerAttackSide', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: 0
                    });
                }

                if(!scene.anims.exists(playerID + '_playerAttackFront')){
                    scene.anims.create({
                        key: playerID + '_playerAttackFront',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerAttackFront', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: 0
                    });
                }

                if(!scene.anims.exists(playerID + '_playerAttackBack')){
                    scene.anims.create({
                        key: playerID + '_playerAttackBack',
                        frames: scene.anims.generateFrameNumbers(playerID + '_playerAttackBack', { start: 0, end: 1 }),
                        frameRate: 4,
                        repeat: 0
                    });
                }
                animationFire = true;
            });

            scene.load.start();
        }
    });

    //TODO: fix this
    let playerHealthPoints = 100;
    scene.isAttack = false;

    //for main player overlapping the player
    scene.physics.add.overlap(scene.playerContainer, scene.joinedPlayerContainer, () => {
        playerHealthPoints--;
        console.log('hit: ' + playerHealthPoints);

        if(playerHealthPoints <= 0){
            playerHealthPoints = 0;
        }

        //main player's hp
        scene.playerHealth.destroy();
        scene.playerHealth = scene.add.graphics();
        scene.playerHealth.fillStyle(0xeb281a, 1);
        scene.playerHealth.fillRoundedRect(100, 0, playerHealthPoints, 20, 5);
    });

    socket.on('gameOutside_playerAttack', (playerData)=>{
        const { playerID, isAttackingBack, isAttackingSide, isAttackingFront } = playerData;

        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerID);

        if(findPlayer){
            const { playerSprite } = findPlayer;

            if(animationFire){
                if(isAttackingSide){
                    playerSprite.play(playerID + '_playerAttackSide', true);
                }

                if(isAttackingBack){
                    playerSprite.play(playerID + '_playerAttackBack', true);
                }
                
                if(isAttackingFront){
                    playerSprite.play(playerID + '_playerAttackFront', true);
                }
            }
        }
    });
}