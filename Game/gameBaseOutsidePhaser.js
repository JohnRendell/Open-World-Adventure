const canvasSize = {
    width: 1000,
    height: 500
}

//max base size 4000, min is 1200
const worldBounds = {
    width: 1200,
    height: 1200
}

const centerWorld = {
    width: worldBounds.width / 2,
    height: worldBounds.height / 2,
}

const speed = 200;

let isTalking = false;
let isPanelOpen = false;
let isLoaded = false;
let isMainPlayerGoingToRoom = false;
let game_PlayerName, loggedIn_playerName;
let spriteFront, spriteSide, spriteBack;

let isFront = false;
let isBack = false;

class baseOutside extends Phaser.Scene{
    constructor(){
        super('Outside Base');
    }

    preload = function(){
        loadAssets(this);
    }

    create = function(){
        socket.on('loadSprites', (front, back, side)=>{
            this.load.spritesheet('main_playerBack', back, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            this.load.spritesheet('main_playerFront', front, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            this.load.spritesheet('main_playerIdle', side, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            this.load.once('complete', ()=>{
                this.anims.create({
                    key: 'playerIdle',
                    frames: this.anims.generateFrameNumbers('main_playerIdle', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: -1
                });

                this.anims.create({
                    key: 'playerFront',
                    frames: this.anims.generateFrameNumbers('main_playerFront', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: -1
                });

                this.anims.create({
                    key: 'playerBack',
                    frames: this.anims.generateFrameNumbers('main_playerBack', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: -1
                });

                isLoaded = true;
                spriteFront = front;
                spriteSide = side;
                spriteBack = back;
            });

            this.load.start();
        });

        //hide the loading once the game finished load
        document.getElementById('loadingDiv').style.display = 'none';

        lobbyUI(this);
        loadPlayerInfo(this);
    }
}

// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: canvasSize.width,
    height: canvasSize.height,
    canvas: gameCanvas,
    backgroundColor: '#00bf10',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [baseOutside]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);