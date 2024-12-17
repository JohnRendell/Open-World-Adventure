const canvasSize = {
    width: 900,
    height: 500
}

const worldBounds = {
    width: 1200,
    height: 1000
}

const speed = 200;

class gameLobby extends Phaser.Scene{
    // Preload function (for loading assets)
    preload() {
        this.load.image('lobby', '/ImageComponents/Lobby/Lobby Hall.png');
        this.load.image('guest_sprite', '/ImageComponents/Lobby/guest player.png');
    }

    // Create function (for initializing the game world)
    create() {
        //lobby background
        this.lobby = this.add.image(0,0, 'lobby').setOrigin(0.5);
        this.lobby.setScale(100);

        //player
        this.player = this.physics.add.sprite(canvasSize.width / 2, canvasSize.height / 2, 'guest_sprite').setOrigin(0.5);
        this.player.setDisplaySize(40, 70);
        this.player.setCollideWorldBounds(true); 

        //camera
        this.playerCam = this.cameras.main;

        console.log('Game is ready!');

        //keys for movement of player/camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    // Update function (for game logic and updates every frame)
    update() {
        this.player.setVelocity(0);

        if(this.cursors.left.isDown || this.A.isDown){
            this.player.setVelocityX(-speed);
        }
        if(this.cursors.right.isDown || this.D.isDown){
            this.player.setVelocityX(speed);
        }
        if(this.cursors.up.isDown || this.W.isDown){
            this.player.setVelocityY(-speed);
        }
        if(this.cursors.down.isDown || this.S.isDown){
            this.player.setVelocityY(speed);
        }
    }
}

// Game configuration
const config = {
    type: Phaser.WEBGL, // Automatically use WebGL or Canvas
    width: canvasSize.width, // Game width
    height: canvasSize.height, // Game height
    backgroundColor: '#000000', // Black background
    canvas: gameCanvas,
    physics: {
        default: 'arcade', // Simple physics engine
        arcade: {
            gravity: { y: 0 }, // No gravity by default
            debug: true
        }
    },
    scene: gameLobby
};

// Initialize the Phaser Game
const game = new Phaser.Game(config);