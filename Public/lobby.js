const speed = 200;
const boundWidth = 1400;
const boundHeight = 1000;

const size = {
    width: 900,
    height: 500
}

class lobbyScene extends Phaser.Scene{
    preload(){
        this.load.image('lobby', '/ImageComponents/Lobby/Lobby Hall.png');
        this.load.image('guest_player', '/ImageComponents/Lobby/guest player.png');
    }

    create(){
        var lobby = this.add.image(boundWidth / 2, boundHeight / 2, 'lobby');
        lobby.setDisplaySize(1500, 1200);

        //for lobby bounding box
        this.physics.world.bounds.width = boundWidth;
        this.physics.world.bounds.height = boundHeight;

        this.guestPlayer = this.physics.add.image(boundWidth / 2, boundHeight / 2, 'guest_player').setDisplaySize(40, 60);
        this.guestPlayer.setCollideWorldBounds(true);

        //add camera
        this.cameras.main.startFollow(this.guestPlayer);
        this.cameras.main.setBounds(0,0, boundWidth, boundHeight);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');
    }

    update(){
        // Set player velocity based on input (using physics)
        this.guestPlayer.setVelocity(0);  // Reset velocity each frame

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            this.guestPlayer.setVelocityX(-speed);
        }
        if (this.cursors.right.isDown || this.keys.D.isDown) {
            this.guestPlayer.setVelocityX(speed);
        }
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.guestPlayer.setVelocityY(-speed);
        }
        if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.guestPlayer.setVelocityY(speed);
        }
    }
}

const config = {
    type: Phaser.WEBGL,
    width: size.width,
    height: size.height,
    canvas: gameCanvas,
    scene: lobbyScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    }
}

var game = new Phaser.Game(config);