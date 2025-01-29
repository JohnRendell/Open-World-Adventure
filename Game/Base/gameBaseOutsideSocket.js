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
        }, 1500);
    });

    socket.on('heal', ()=>{
        document.getElementById('validateDiv').style.display = 'none';
        playerHealthPoints = 100;

        //main player's hp
        scene.playerHealth.destroy();

        scene.playerHealth = scene.add.graphics();
        scene.playerHealth.fillStyle(0xeb281a, 1);
        scene.playerHealth.fillRoundedRect(100, 0, playerHealthPoints, 20, 5);

        //add to the container
        scene.playerUIContainer.add(scene.playerHealth);
    });
}

function sceneSocket(scene){
    scene.playerCollection = new Map();
    scene.isAttack = false;

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

    //player count
    socket.on('passCountData', (count)=>{
        scene.playerCountLabel.setText('Player Count: ' + count);
    });

    socket.on('playerCount', (count)=>{
        scene.playerCountLabel.setText('Player Count: ' + count);
    });

    socket.on('playerDie', (username)=>{
        setTimeout(() => {
            //search player to the collection
            scene.playerCollection.forEach((player, name) => {
                if(name === username){
                    const { playerName, container, playerSprite } = player;
                    container.setVisible(false);

                    //play death animation
                    scene.deathSmoke = scene.add.sprite(container.body.x, container.body.y, "deathEffect").setOrigin(0.5).setScale(0.3);
                    scene.deathSmoke.setDepth(2);

                    // Play the animation
                    scene.deathSmoke.play('deathAnim');
                    
                    scene.deathSmoke.on('animationcomplete', ()=>{
                        scene.deathSmoke.destroy();
                        
                        playerName.destroy();
                        playerSprite.destroy();
                        container.destroy();
                        scene.playerCollection.delete(name);
                    });
                } 
            });
        }, 1000);
    });

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
    socket.on('gameOutside_existingPlayer', (playerData, isDead)=>{
        const { playerID, playerX, playerY } = playerData;

        setTimeout(() => {
            if(!scene.playerCollection.has(playerID)){
                if(!isDead){
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
                }
                else{
                    socket.on('playerDie', playerID);
                }
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

    socket.on('gameOutside_playerAttack', (playerData)=>{
        const { playerID, isAttackingBack, isAttackingSide, isAttackingFront } = playerData;

        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerID);

        if(findPlayer){
            const { playerSprite, container } = findPlayer;

            if(animationFire){
                if(isAttackingSide){
                    playerSprite.play(playerID + '_playerAttackSide', true);
                    setTimeout(() => {
                        scene.isAttack = true;
                    }, 1000);
                }

                if(isAttackingBack){
                    playerSprite.play(playerID + '_playerAttackBack', true);
                    setTimeout(() => {
                        scene.isAttack = true;
                    }, 1000);
                }
                
                if(isAttackingFront){
                    playerSprite.play(playerID + '_playerAttackFront', true);
                    setTimeout(() => {
                        scene.isAttack = true;
                    }, 1000);
                }

                //for main player overlapping the player
                scene.physics.add.overlap(scene.playerContainer, container, () => {
                    if(scene.isAttack){
                        playerHealthPoints--;

                        if(playerHealthPoints <= 0){
                            isDead = true;
                            isPanelOpen = true;
                            isTalking = true;
                            scene.playerContainer.setVisible(false);

                            //play death animation
                            scene.deathSmoke = scene.add.sprite(scene.playerContainer.body.x, scene.playerContainer.body.y, "deathEffect").setOrigin(0.5).setScale(0.3);
                            scene.deathSmoke.setDepth(2);

                            // Play the animation
                            scene.deathSmoke.play('deathAnim');
                            scene.deathSmoke.on('animationcomplete', ()=>{
                                scene.deathSmoke.destroy();
                            });
                            socket.emit('playerDie', game_PlayerName, isDead);
                            modalStatus('deathModal', 'flex', 'modalAnimation');
                            playerHealthPoints = 0;
                        }

                        //main player's hp
                        scene.playerHealth.destroy();

                        scene.playerHealth = scene.add.graphics();
                        scene.playerHealth.fillStyle(0xeb281a, 1);
                        scene.playerHealth.fillRoundedRect(100, 0, playerHealthPoints, 20, 5);

                        //add to the container
                        scene.playerUIContainer.add(scene.playerHealth);

                        socket.emit('gameOutside_takingDamage', playerHealthPoints, game_PlayerName);
                        scene.isAttack = false;
                    }
                });
            }
        }
    });
}