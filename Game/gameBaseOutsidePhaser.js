const canvasSize = {
    width: 1000,
    height: 500
}

const worldBounds = {
    width: 2000,
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

        //set the world bounds
        this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

        //for main player
        this.player = this.physics.add.sprite(0,0, 'main_playerIdle').setOrigin(0.5);
        this.player.setScale(0.1);
        this.player.setVisible(true);

        //player name
        this.playerName = this.add.text(0, -50, 'loading...', {
            font: "16px 'Pixelify Sans'",
            fill: '#06402b',
            align: 'center'
        }).setOrigin(0.5);

        //player container
        this.playerContainer = this.add.container(380, 250, [this.player, this.playerName]);
        
        this.physics.world.enable(this.playerContainer);
        this.playerContainer.body.setCollideWorldBounds(true);
        
        this.playerContainer.body.setSize(40, 70, true);
        this.playerContainer.body.setOffset(-20, -35);
        this.playerContainer.setDepth(2);

        //camera follow main player
        this.cameras.main.startFollow(this.playerContainer);
        this.cameras.main.setBounds(0,0, worldBounds.width, worldBounds.height);

        //keys for movement of player/camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.input.keyboard.enableGlobalCapture();

        //house base
        this.house = this.add.rectangle(420, 120, 720, 300, 0xa7a7a7).setDepth(1);

        this.physics.add.existing(this.house, true);
        this.house.body.setSize(720, 245, true);
        this.house.body.setOffset(0, 0);

        this.physics.add.collider(this.house, this.playerContainer);


        //window
        this.window = this.add.image(500, 200, 'window').setDisplaySize(60, 60).setDepth(1);

        //door
        this.door = this.physics.add.staticSprite(300, 220, 'door').setOrigin(0.5).setDisplaySize(80, 100).setDepth(1);
        this.door.body.setSize(47, 120, true);
        this.door.body.setOffset(138, 110);

        //door status
        this.doorLabel = this.add.text(300, 200, 'click to go inside', {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.doorLabel.setDepth(5).setVisible(true);

        //door interactions
        this.door.setInteractive({ useHandCursor: true });
        this.door.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.door.getBounds())) {
                backToBase();
            }
        });
        this.physics.add.overlap(this.playerContainer, this.door, () => {
            this.doorLabel.setVisible(true);
        });

        //grass texture
        this.groupGrassTexture = this.add.group();

        for(let i = 0; i < 50; i++){
            for(let j = 0; j < 50; j++){
                const grass = this.groupGrassTexture.create(0 + (60 * i), (0 + (60 * j)), 'grassTexture').setOrigin(0.5).setDisplaySize(60,60).setDepth(0);

                this.groupGrassTexture.add(grass);
            }
        }

        //grass road
        this.groupDirtTopDown = this.add.group();

        for(let i = 0; i < 5; i++){
            const road = this.groupDirtTopDown.create(300, 300 + (60 * i), i === 4 ? 'dirtCorner' : 'dirt').setOrigin(0.5).setDisplaySize(60, 60).setDepth(1);

            this.groupGrassTexture.add(road);
        }

        for(let i = 0; i < 25; i++){
            const road = this.groupDirtTopDown.create(360 + (60 * i), 540, 'dirt').setOrigin(0.5).setDisplaySize(60, 60).setDepth(1);
            road.setAngle(90);
            
            if(i === 24){
                road.setTexture('dirtCorner');
                road.setAngle(0);
                road.setFlipX(true);
            }

            this.groupGrassTexture.add(road);
        }

        for(let i = 0; i < 6; i++){
            const road = this.groupDirtTopDown.create(1800, 180 + (60 * i), 'dirt').setOrigin(0.5).setDisplaySize(60, 60).setDepth(1);

            this.groupGrassTexture.add(road);
        }
        
        //entrance gate
        this.gate = this.physics.add.staticSprite(1800, 100, 'gate').setDepth(0).setDisplaySize(150, 220).setOrigin(0.5);
        this.gate.body.setSize(150, 80, true);
        this.gate.body.setOffset(435, 420);

        this.physics.add.collider(this.gate, this.playerContainer, ()=>{
            alert('going places')
        });

        //river
        this.riverGroup = this.physics.add.staticGroup();

        this.anims.create({
            key: 'riverFlow',
            frames: this.anims.generateFrameNumbers('river', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });

        for(let i = 0; i < 4; i++){
            const river = this.physics.add.staticSprite(300 + (600 * i), 1000, 'river').setDisplaySize(600, 600).setDepth(0).setOrigin(0.5);

            river.body.setSize(600, 130, true);
            river.body.setOffset(669, 580);
            river.play('riverFlow');
    
            this.riverGroup.add(river);
        }
        
        this.physics.add.collider(this.riverGroup, this.playerContainer);

        lobbyUI(this);
        loadPlayerInfo(this);
    }

    update = function(){
        if(isLoaded){
            this.playerContainer.body.setVelocity(0);

            if(isTalking == false){
                if(this.cursors.left.isDown || this.A.isDown){
                    this.playerContainer.body.setVelocityX(-speed);
                    this.player.flipX = false;
                    isFront = false;
                    isBack = false;
                }
                if(this.cursors.right.isDown || this.D.isDown){
                    this.playerContainer.body.setVelocityX(speed);
                    this.player.flipX = true;
                    isFront = false;
                    isBack = false;
                }
                if(this.cursors.up.isDown || this.W.isDown){
                    this.playerContainer.body.setVelocityY(-speed);
                    isFront = false;
                    isBack = true;
                }
                if(this.cursors.down.isDown || this.S.isDown){
                    this.playerContainer.body.setVelocityY(speed);
                    isFront = true;
                    isBack = false;
                }
            }

            if(isTalking || isPanelOpen){
                this.input.keyboard.disableGlobalCapture();
            }

            if(isFront){
                this.player.play('playerFront', true);
            }

            if(isBack){
                this.player.play('playerBack', true);
            }

            if(!isFront && !isBack){
                this.player.play('playerIdle', true);
            }

            //exiting door
            if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.door.getBounds())) {
                this.doorLabel.setVisible(false);
            }

            /*
            // on exit for NPCs
            if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bob.getBounds())) {
                this.bobText.setVisible(false);
            }*/

            //for other player movement        
            const playerData = {
                playerID: game_PlayerName,
                x: this.playerContainer.x,
                y: this.playerContainer.y,
                isBack: isBack,
                isFront: isFront,
                spriteX: this.player.flipX
            }
            //socket.emit('game_playerMove', playerData);
            //socket.emit('game_existingPlayer', playerData);
            //socket.emit('game_loadPlayerSprite', game_PlayerName, spriteFront, spriteBack, spriteSide);
        }
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