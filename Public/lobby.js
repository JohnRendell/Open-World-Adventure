const canvasSize = {
    width: 1000,
    height: 500
}

const worldBounds = {
    width: 1200,
    height: 1000
}

const speed = 200;

const gameLobby = new Phaser.Scene("Game Lobby");

// Preload function (for loading assets)
gameLobby.preload = function() {
    this.load.image('lobby', '/ImageComponents/Lobby/Lobby Island.png');
    this.load.image('guest_sprite', '/ImageComponents/Lobby/guest player.png');
    this.load.image('spawner_pod', '/ImageComponents/Objects/Spawner Pod.png');
    this.load.image('table', '/ImageComponents/Objects/Long table.png')

    //NPC
    this.load.spritesheet('Rupert_NPC', '/ImageComponents/Sprite Sheets/Rupert Idle sprite sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    //sprite sheets
    this.load.spritesheet('spawn_smoke', '/ImageComponents/Sprite Sheets/spawn smoke sprite sheet.png', {
        frameWidth: 4800 / 5,
        frameHeight: 1600 / 2
    });
}

// Create function (for initializing the game world)
gameLobby.create = function() {
    //set the world bounds
    this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

    //lobby background
    this.lobby = this.add.image(worldBounds.width / 2, worldBounds.height / 2, 'lobby').setOrigin(0.5);
    this.lobby.setDisplaySize(worldBounds.width, worldBounds.height);

    //zone
    this.topZone = this.physics.add.staticSprite(0, 100).setOrigin(0.5);
    this.topZone.setDisplaySize(worldBounds.width, 100);
    this.topZone.body.setSize(worldBounds.width, 100, true);
    this.topZone.body.setOffset(0,0);

    this.bottomZone = this.physics.add.staticSprite(0, 770).setOrigin(0.5);
    this.bottomZone.setDisplaySize(worldBounds.width, 100);
    this.bottomZone.body.setSize(worldBounds.width, 100, true);
    this.bottomZone.body.setOffset(0,0);

    this.leftZone = this.physics.add.staticSprite(100, 0).setOrigin(0.5);
    this.leftZone.setDisplaySize(100, worldBounds.height);
    this.leftZone.body.setSize(100, worldBounds.height, true);
    this.leftZone.body.setOffset(0,0);

    this.rightZone = this.physics.add.staticSprite(1000, 0).setOrigin(0.5);
    this.rightZone.setDisplaySize(100, worldBounds.height);
    this.rightZone.body.setSize(100, worldBounds.height, true);
    this.rightZone.body.setOffset(0,0);
    

    //spawn smoke
    this.spawnSmoke = this.add.sprite(worldBounds.width / 2, worldBounds.height / 2, "spawn_smoke").setOrigin(0.5);
    this.spawnSmoke.setDisplaySize(60, 80);

    //create animation for spawn smoke
    this.anims.create({
        key: 'spawn',            // Animation name
        frames: this.anims.generateFrameNumbers('spawn_smoke', { start: 0, end: 6 }),
        frameRate: 12,           // Frames per second
        repeat: 0              // Repeat forever (-1 means infinite loop)
    });

    //player
    this.player = this.physics.add.sprite(0,0, 'guest_sprite').setOrigin(0.5);
    this.player.setDisplaySize(40, 70);
    this.player.setCollideWorldBounds(true); 
    this.player.setVisible(false);

    //player name
    this.playerName = this.add.text(0, -50, "Guest_Player", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);

    // Play the animation
    this.spawnSmoke.play('spawn');

    this.spawnSmoke.on('animationcomplete', ()=>{
        this.spawnSmoke.destroy();
        this.player.setVisible(true);
    });

    //player container
    this.playerContainer = this.add.container((worldBounds.width / 2) + 50, worldBounds.height / 2, [this.player, this.playerName]);

    this.physics.world.enable(this.playerContainer);

    //add the spawner pod
    this.spawner = this.physics.add.staticSprite((worldBounds.width / 2), worldBounds.height / 2, 'spawner_pod').setOrigin(0.5);
    this.spawner.setDisplaySize(50, 70);
    this.spawner.body.setSize(50, 20, true);
    this.spawner.body.setOffset(200, 420);

    //spawner Label
    this.spawnerLabel = this.add.text((worldBounds.width / 2), (worldBounds.height / 2) - 50, "Spawner Pod", {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0.5);

    //collider for spawner
    this.physics.add.collider(this.playerContainer, this.spawner);

   var npc = (npcKey, imageLabel, objectLabel, NPCBodyOffsetX, NPCBodyOffsetY, NPCposX, NPCposY)=>{
        //add the NPC
        const npcObj = this.physics.add.staticSprite(NPCposX, NPCposY, imageLabel).setOrigin(0.5);
        npcObj.setDisplaySize(40, 70);
        npcObj.body.setSize(40, 20, true);
        npcObj.body.setOffset(NPCBodyOffsetX, NPCBodyOffsetY);

        //NPC Label
        this.NPCLabel = this.add.text(NPCposX, (NPCposY - 100) + 50, objectLabel, {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);

        const instructionText = this.add.text(NPCposX, (NPCposY - 100) + 20, "Click to talk", {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        instructionText.setVisible(false);

        //animation idle for npc
        this.anims.create({
            key: npcKey,
            frames: this.anims.generateFrameNumbers(imageLabel, { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        npcObj.play(npcKey);

        //trigger for this npc, on enter
        this.physics.add.overlap(this.playerContainer, npcObj, () => {
            instructionText.setVisible(true);
        });

        //collider for npc
        this.physics.add.collider(this.playerContainer, npcObj);

        this[npcKey] = npcObj;
        this[`${npcKey}Text`] = instructionText;
   }

   npc.call(this, 'rupert', 'Rupert_NPC', 'Rupert (NPC)', 140, 420, (canvasSize.width / 2) + 200, (canvasSize.height / 2) + 100);

   //table beside Rupert
   this.rupertTable = this.physics.add.staticSprite((canvasSize.width / 2) + 150, (canvasSize.height / 2) + 120, 'table').setOrigin(0.5);
    this.rupertTable.setDisplaySize(40, 50);
    this.rupertTable.body.setSize(40, 55, true);
    this.rupertTable.body.setOffset(300, 130);

    //collider for table
    this.physics.add.collider(this.playerContainer, this.rupertTable);

    //collision for zone
    this.physics.add.collider(this.playerContainer, this.topZone);
    this.physics.add.collider(this.playerContainer, this.bottomZone);
    this.physics.add.collider(this.playerContainer, this.leftZone);
    this.physics.add.collider(this.playerContainer, this.rightZone);

    //Follow player
    this.playerContainer.body.setCollideWorldBounds(true);
    this.playerContainer.body.setSize(40, 70);
    this.playerContainer.body.setOffset(-20, -35);

    //camera
    this.cameras.main.startFollow(this.playerContainer);
    this.cameras.main.setBounds(0,0, worldBounds.width, worldBounds.height);

    //keys for movement of player/camera
    this.cursors = this.input.keyboard.createCursorKeys();
    this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //call the UI scene
    this.scene.launch('Game UI');
}

// Update function (for game logic and updates every frame)
gameLobby.update = function() {
    this.playerContainer.body.setVelocity(0);

    if(this.cursors.left.isDown || this.A.isDown){
        this.playerContainer.body.setVelocityX(-speed);
    }
    if(this.cursors.right.isDown || this.D.isDown){
        this.playerContainer.body.setVelocityX(speed);
    }
    if(this.cursors.up.isDown || this.W.isDown){
        this.playerContainer.body.setVelocityY(-speed);
    }
    if(this.cursors.down.isDown || this.S.isDown){
        this.playerContainer.body.setVelocityY(speed);
    }

    // on exit for NPCs
    if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.rupert.getBounds())) {
        this.rupertText.setVisible(false);
    }
}