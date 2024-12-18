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
    this.load.image('lobby', '/ImageComponents/Lobby/Lobby Hall.png');
    this.load.image('guest_sprite', '/ImageComponents/Lobby/guest player.png');
    this.load.image('spawner_pod', '/ImageComponents/Lobby/Spawner Pod.png');
}

// Create function (for initializing the game world)
gameLobby.create = function() {
    //set the world bounds
    this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height)

    //lobby background
    this.lobby = this.add.image(worldBounds.width / 2, worldBounds.height / 2, 'lobby').setOrigin(0.5);
    this.lobby.setDisplaySize(worldBounds.width, worldBounds.height);

    //player
    this.player = this.physics.add.sprite(0,0, 'guest_sprite').setOrigin(0.5);
    this.player.setDisplaySize(40, 70);
    this.player.setCollideWorldBounds(true); 

    //player name
    this.playerName = this.add.text(0, -50, "Guest_Player", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);

    //player container
    this.playerContainer = this.add.container(canvasSize.width / 2, canvasSize.height / 2, [this.player, this.playerName]);
    this.physics.world.enable(this.playerContainer);

    //add the spawner pod
    this.spawner = this.physics.add.staticSprite((canvasSize.width / 2) - 50, canvasSize.height / 2, 'spawner_pod').setOrigin(0.5);
    this.spawner.setDisplaySize(50, 70);
    this.spawner.body.setSize(50, 70, true);
    this.spawner.body.setOffset(200, 365);

    //spawner Label
    this.spawnerLabel = this.add.text((canvasSize.width / 2) - 50, (canvasSize.height / 2) - 50, "Spawner Pod", {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0.5);

    //collider for spawner
    this.physics.add.collider(this.playerContainer, this.spawner);

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
}