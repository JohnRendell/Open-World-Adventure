function checkDevice() {
    if(window.innerWidth < 1194){
        return 'mobile'
    }
};

const canvasSize = {
    width: checkDevice() === 'mobile' ? window.innerWidth - 20 : 1000,
    height: checkDevice() === 'mobile' ? window.innerHeight - 20 : 500
}

const worldBounds = {
    width: 5000,
    height: 3000
}

const centerWorld = {
    width: worldBounds.width / 2,
    height: worldBounds.height / 2,
}

function getOutWorld(){
    return isOutWorld;
}

function setOutWorld(status){
    isOutWorld = status;
}

const speed = 200;

let isTalking = false;
let isPanelOpen = false;
let isLoaded = false;
var game_PlayerName, loggedIn_playerName;

let spriteFront, spriteSide, spriteBack;
let spriteFrontAttack, spriteSideAttack, spriteBackAttack;

let isFront = false;
let isBack = false;
let isAttackingSide = false;
let isAttackingFront = false;
let isAttackingBack = false;
let isAttack = false;
let isDead = false;
let isOutWorld = false;

class playground extends Phaser.Scene{
    constructor(){
        super('Playground');
    }

    preload = function(){
        loadAssets(this);
    }

    create = function(){
        socket.on('loadSprites', (front, back, side, sideAttack, frontAttack, backAttack)=>{
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

            this.load.spritesheet('main_playerAttackSide', sideAttack, {
                frameWidth: 4800 / 5,
                frameHeight: 960 / 1
            });

            this.load.spritesheet('main_playerAttackFront', frontAttack, {
                frameWidth: 1600 / 5,
                frameHeight: 800 / 1
            });

            this.load.spritesheet('main_playerAttackBack', backAttack, {
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

                this.anims.create({
                    key: 'playerAttackSide',
                    frames: this.anims.generateFrameNumbers('main_playerAttackSide', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: 0
                });

                this.anims.create({
                    key: 'playerAttackFront',
                    frames: this.anims.generateFrameNumbers('main_playerAttackFront', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: 0
                });

                this.anims.create({
                    key: 'playerAttackBack',
                    frames: this.anims.generateFrameNumbers('main_playerAttackBack', { start: 0, end: 1 }),
                    frameRate: 4,
                    repeat: 0
                });

                isLoaded = true;
                spriteFront = front;
                spriteSide = side;
                spriteBack = back;

                spriteFrontAttack = frontAttack;
                spriteSideAttack = sideAttack;
                spriteBackAttack = backAttack;
            });

            this.load.start();
        });

        //game status, NOTE: Remove when added more stuff
        this.gameStatus = this.add.text(canvasSize.width / 2, canvasSize.height - 50, 'Game is on development...', {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.gameStatus.setScrollFactor(0).setDepth(10);

         //death animation
        this.anims.create({
            key: 'deathAnim',
            frames: this.anims.generateFrameNumbers('deathEffect', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: 0
        });

        //player count Label
        this.playerCountLabel = this.add.text(20, 20, "Player Count: processing...", {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0).setScrollFactor(0);
        this.playerCountLabel.setDepth(5);

        //tips
        this.labelTip = this.add.text(canvasSize.width / 2, 20, 'Press Z (Zebra) to attack. (Punch or use weapon).', {
            font: "12px 'Pixelify Sans'",
            fill: '#ffffff',
            align: 'center'
        }).setDepth(10).setScrollFactor(0).setOrigin(0.5);

        //button for attack, this is only for mobile
        this.attackButton = this.add.image(canvasSize.width - 50, canvasSize.height - 120, 'zButton').setScale(0.2);
        this.attackButton.setScrollFactor(0);
        this.attackButton.setDepth(10).setVisible(checkDevice() === 'mobile');

        this.attackButton.setInteractive({ useHandCursor: true });
        this.attackButton.on('pointerdown', ()=>{
            if(isPanelOpen === false){
                isAttack = true;
            }
        });
        this.attackButton.on('pointerup', () => isAttack = false);
        this.attackButton.on('pointerout', () => isAttack = false);
        this.attackButton.on('pointerupoutside', () => isAttack = false);
        this.input.on('pointerup', () => isAttack = false);

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
        this.playerContainer = this.add.container(worldBounds.width - 800, worldBounds.height - 400, [this.player, this.playerName]);
        
        this.physics.world.enable(this.playerContainer);
        this.playerContainer.body.setCollideWorldBounds(true);
        
        this.playerContainer.body.setSize(40, 70, true);
        this.playerContainer.body.setOffset(-20, -35);
        this.playerContainer.setDepth(3);

        //camera follow main player
        this.cameras.main.startFollow(this.playerContainer);
        this.cameras.main.setBounds(0,0, worldBounds.width, worldBounds.height);

        //keys for movement of player/camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //for attack
        this.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.input.keyboard.enableGlobalCapture();

        //zones
        var zone = (posX, posY, sizeX, sizeY)=>{
            this.borderZone = this.physics.add.staticSprite(posX, posY);
            this.borderZone.setDisplaySize(sizeX, sizeY);
            this.borderZone.body.setSize(sizeX, sizeY, true);
            this.borderZone.body.setOffset(0,0);

            this.physics.add.collider(this.borderZone, this.playerContainer);
        }

        //island A
        this.islandA = this.add.image(worldBounds.width - 800, worldBounds.height - 600, 'islandA').setScale(0.1).setDepth(0);

        //entrance gate
        this.gate = this.physics.add.staticSprite(worldBounds.width - 800, worldBounds.height - 200, 'gate').setDepth(3).setDisplaySize(150, 220).setOrigin(0.5);
        this.gate.body.setSize(150, 80, true);
        this.gate.body.setOffset(435, 480);

        this.physics.add.collider(this.gate, this.playerContainer, ()=>{
            //setOutWorld(true);
            //socket.emit('game_playerDisconnect', game_PlayerName);
            //goingOutside(worldBounds.width - 800, worldBounds.height - 200, 10, 10, 0, 0);
        });

        zone(worldBounds.width - 1200, worldBounds.height - 150, 900, 100);
        zone(worldBounds.width - 1400, worldBounds.height - 550, 100, 300);
        zone(worldBounds.width - 1300, worldBounds.height - 250, 100, 100);
        zone(worldBounds.width - 1400, worldBounds.height - 1100, 1100, 100);
        zone(worldBounds.width - 300, worldBounds.height - 1100, 100, 1000);
        zone(worldBounds.width - 1400, worldBounds.height - 1000, 100, 300);

        //tree
        this.tree = this.add.image(worldBounds.width - 500, worldBounds.height - 1200, 'tree').setDisplaySize(300, 600).setDepth(1);

        this.physics.add.collider(this.tree, this.playerContainer);

        lobbyUI(this);
        playerSocket(this);
        sceneSocket(this);
    }

    update = function(){
         if(isLoaded){
            this.playerContainer.body.setVelocity(0);

            if(isTalking == false){
                if(this.cursors.left.isDown || this.A.isDown || moveLeft){
                    this.playerContainer.body.setVelocityX(-speed);
                    this.player.flipX = false;
                    isFront = false;
                    isBack = false;
                }
                if(this.cursors.right.isDown || this.D.isDown || moveRight){
                    this.playerContainer.body.setVelocityX(speed);
                    this.player.flipX = true;
                    isFront = false;
                    isBack = false;
                }
                if(this.cursors.up.isDown || this.W.isDown || moveUp){
                    this.playerContainer.body.setVelocityY(-speed);
                    isFront = false;
                    isBack = true;
                }
                if(this.cursors.down.isDown || this.S.isDown || moveDown){
                    this.playerContainer.body.setVelocityY(speed);
                    isFront = true;
                    isBack = false;
                }
                if(this.Z.isDown || isAttack){
                    if(!isFront || !isBack){
                        isAttackingSide = true;
                    }

                    if(isFront){
                        isAttackingFront = true;
                    }

                    if(isBack){
                        isAttackingBack = true;
                    }
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

            //attacking
            if(isAttackingSide){
                this.player.play('playerAttackSide', true);
                socket.emit('gameOutside_playerAttack', { playerID: game_PlayerName, isAttackingBack: isAttackingBack, isAttackingFront: isAttackingFront, isAttackingSide: isAttackingSide });

                isAttackingSide = false;
            }

            if(isAttackingFront){
                this.player.play('playerAttackFront', true);
                socket.emit('gameOutside_playerAttack', { playerID: game_PlayerName, isAttackingBack: isAttackingBack, isAttackingFront: isAttackingFront, isAttackingSide: isAttackingSide });

                isAttackingFront = false;
            }

            if(isAttackingBack){
                this.player.play('playerAttackBack', true);
                socket.emit('gameOutside_playerAttack', { playerID: game_PlayerName, isAttackingBack: isAttackingBack, isAttackingFront: isAttackingFront, isAttackingSide: isAttackingSide });

                isAttackingBack = false;
            }

            /*
            //exiting door
            if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.door.getBounds())) {
                this.doorLabel.setVisible(false);
            }

            //for tree
            const treeY = ()=>{
                if(this.tree.body.y > this.playerContainer.y){
                    this.tree.setDepth(4);
                }
                else{
                    this.tree.setDepth(2);
                }
            }
            treeY();
            
            // on exit for NPCs
            if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bob.getBounds())) {
                this.bobText.setVisible(false);
            }

            if(!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bobPrototype.getBounds())){
                this.bobPrototypeText.setVisible(false);
            }

            //hovering bob
            if(this.bob){
                this.bobXHover += this.bobDirection * 2;
                this.bobXOffset += this.bobDirection * 2;

                //right
                if (this.bobXHover >= 700) {
                    this.bob.flipX = true;
                    this.bobDirection = -1;

                //left
                } else if (this.bobXHover <= 200) {
                    this.bob.flipX = false;
                    this.bobDirection = 1;
                }

                // Apply the updated position to the static sprite
                this.bob.setX(this.bobXHover);
                this.bob.body.setOffset(this.bobXOffset, this.bobYOffset);
                this.bobLabel.setX(this.bobXHover);
                this.bobText.setX(this.bobXHover);
            }*/

            //for other player movement        
            const playerData = {
                playerID: game_PlayerName,
                x: this.playerContainer.x,
                y: this.playerContainer.y,
                isBack: isBack,
                isFront: isFront,
                spriteX: this.player.flipX,
                isDead: isDead
            }
            //socket.emit('gameOutside_playerMove', playerData);
            //socket.emit('gameOutside_existingPlayer', playerData, isDead, getOutWorld());

            //socket.emit('gameOutside_loadPlayerSprite', game_PlayerName, spriteFront, spriteBack, spriteSide, spriteFrontAttack, spriteBackAttack, spriteSideAttack);
        }
    }
}

// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: canvasSize.width,
    height: canvasSize.height,
    canvas: gameCanvas,
    backgroundColor: '#82c8e5',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [playground]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);