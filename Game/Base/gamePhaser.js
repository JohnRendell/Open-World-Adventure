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
    width: 800,
    height: 800
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
var game_PlayerName, loggedIn_playerName;
let isOutWorld = false;

let spriteFront, spriteSide, spriteBack;

let isFront = false;
let isBack = false;

function getOutWorld(){
    return isOutWorld;
}

function setOutWorld(status){
    isOutWorld = status;
}

class homeBase extends Phaser.Scene{
    constructor(){
        super("Home Base");
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

        //player count Label
        this.playerCountLabel = this.add.text(20, 20, "Player Count: processing...", {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0).setScrollFactor(0);
        this.playerCountLabel.setDepth(5);
        
        //hide the loading once the game finished load
        document.getElementById('loadingDiv').style.display = 'none';
        
        //set the world bounds
        this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

        //main player
        this.player = this.physics.add.sprite(0,0, 'main_playerIdle').setOrigin(0.5);
        this.player.setScale(0.1);
        this.player.setVisible(false);

        //player name
        this.playerName = this.add.text(0, -50, 'loading...', {
            font: "16px 'Pixelify Sans'",
            fill: '#06402b',
            align: 'center'
        }).setOrigin(0.5);

        //player container
        this.playerContainer = this.add.container(499, 296, [this.player, this.playerName]);

        this.physics.world.enable(this.playerContainer);

        this.playerContainer.body.setCollideWorldBounds(true);
        this.playerContainer.body.setSize(40, 70, true);
        this.playerContainer.body.setOffset(-20, -35);
        this.playerContainer.setDepth(2);

        //spawn smoke
        this.spawnSmoke = this.add.sprite(447, 266, "spawn_smoke").setOrigin(0.5);
        this.spawnSmoke.setDisplaySize(2, 5);
        this.spawnSmoke.setDepth(2);

        //animation for spawn effect
        this.anims.create({
            key: 'spawnDust', 
            frames: this.anims.generateFrameNumbers('spawnEffect', { start: 0, end: 8 }),
            frameRate: 12, 
            repeat: 0
        });

        // Play the animation
        this.spawnSmoke.play('spawnDust');
        this.spawnSmoke.on('animationcomplete', ()=>{
            this.spawnSmoke.destroy();
            this.player.setVisible(true);
        });

        //add the spawner pod
        this.spawner = this.physics.add.staticSprite(447, 320, 'spawner').setOrigin(0.5);
        this.spawner.setDisplaySize(60, 50);
        this.spawner.body.setSize(60, 20, true);
        this.spawner.body.setOffset(500, 400);
        this.spawner.setDepth(3);

        this.anims.create({
            key: 'spawnerPod',        
            frames: this.anims.generateFrameNumbers('spawner', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });

        this.spawner.play('spawnerPod');

        //collider for spawner
        this.physics.add.collider(this.playerContainer, this.spawner);

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

        //add bob NPC
        this.bob = this.physics.add.staticSprite(200, 300, 'Bob_NPC').setOrigin(0.5);
        this.bob.setScale(0.1);
        this.bob.setDepth(3);
        this.bob.body.setSize(70, 80, true);
        this.bob.body.setOffset(450, 430);

        //NPC Label
        this.bobLabel = this.add.text(200, 240, 'Bob (NPC)', {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.bobLabel.setDepth(4);

        this.bobText = this.add.text(200, (300 - 100) + 20, "Click to talk", {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.bobText.setVisible(false);
        this.bobText.setDepth(4);

        //animation idle for bob npc
        this.anims.create({
            key: 'bob',
            frames: this.anims.generateFrameNumbers('Bob_NPC', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.bob.play('bob');

        //trigger for this npc, on enter
        this.physics.add.overlap(this.playerContainer, this.bob, () => {
            this.bobText.setVisible(true);
        });

        this.bob.setInteractive({ useHandCursor: true });
        this.bob.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bob.getBounds()) && isPanelOpen === false) {
                modalStatus('bobDialog', 'flex', 'modalAnimation');
                isTalking = true;
                isPanelOpen = true;

                socket.emit('NPCPrompt', 'bob');
                npcGreet('npcConversationDiv', 'Hi im Bob, your robot guide. *Beep boop*');
            }
        });

        var door = (doorName, doorText, posX, posY, depth, forPlayer, roomObj)=>{
            //door
            const doorObj = this.physics.add.staticSprite(posX, posY, 'door').setOrigin(0.5).setDisplaySize(80, 100).setDepth(depth);
            doorObj.body.setSize(47, 120, true);
            doorObj.body.setOffset(138, 110);

            //door status
            const label = this.add.text(posX, (posY + 50) - 50, doorText, {
                font: "16px 'Pixelify Sans",
                fill: "#ffffff",
                align: "center"
            }).setOrigin(0.5);
            label.setDepth(5).setVisible(false);

            //door interactions
            doorObj.setInteractive({ useHandCursor: true });
            doorObj.on('pointerdown', () => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), doorObj.getBounds())) {
                    if(forPlayer){
                        const offsetY = roomObj.body.offset.y > 0 ? 0 : 80;
                        const wallDepth = offsetY === 0 ? 0 : 4;
                        const newPlayerY = offsetY === 0 ? posY + 100 : posY - 100;
                        const colliderSize = offsetY === 0 ? 80 : 50;
                        const doorLabel = offsetY === 0 ? 'Click to go outside the Room' : doorText;

                        label.setText(doorLabel);
                        label.setDepth(5).setVisible(false);

                        //for cabinet
                        this.cabinet.setDepth(wallDepth);
                        
                        roomObj.setDepth(wallDepth);
                        doorObj.setDepth(wallDepth);
                        this.playerContainer.setY(newPlayerY);

                        roomObj.body.setSize(300, colliderSize, true);
                        roomObj.body.setOffset(0, offsetY);

                        isMainPlayerGoingToRoom = offsetY === 0 ? true : false;
                        
                        //when player going to the door
                        socket.emit('playerGoToDoor', offsetY, game_PlayerName);

                        //hide all players outside of the room
                        socket.emit('hidePlayersWhenGoToRoom', offsetY);
                    }
                    else{
                        setOutWorld(true);
                        socket.emit('game_playerDisconnect', game_PlayerName);
                        goingOutside();
                    }
                }
            });
            this.physics.add.overlap(this.playerContainer, doorObj, () => {
                label.setVisible(true);
            });

            //passing data
            this[doorName] = doorObj;
            this[`${doorName}_label`] = label;
        }

        //wall of the house
        this.frontWallHouse = this.add.rectangle(470, 95, 720, 150, 0xa7a7a7).setDepth(0);
        this.physics.add.existing(this.frontWallHouse, true);
        this.frontWallHouse.body.setSize(720, 100, true);
        this.frontWallHouse.body.setOffset(0, 0);

        this.frontRoomWall = this.add.rectangle(620, 535, 300, 130, 0xa7a7a7).setDepth(4);
        this.physics.add.existing(this.frontRoomWall, true);
        this.frontRoomWall.body.setSize(300, 50, true);
        this.frontRoomWall.body.setOffset(0, 80);

        this.physics.add.collider(this.frontWallHouse, this.playerContainer);
        this.physics.add.collider(this.frontRoomWall, this.playerContainer);

        //stuff in rooms
        this.cabinet = this.physics.add.staticSprite(600, 560, 'Cabinet').setOrigin(0.5).setDisplaySize(100, 130).setDepth(4).setName('Cabinet'),
        this.cabinet.body.setSize(65, 90, true);
        this.cabinet.body.setOffset(480, 470);
        this.cabinet.setInteractive({ useHandCursor: true });

        this.cabinet.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.cabinet.getBounds()) && isPanelOpen === false) {
                isTalking = true;
                isPanelOpen = true;
                modalStatus('cosmeticModal', 'flex', 'modalAnimation');
            }
        });

        //door for front house
        door.call(this, 'frontDoor', 'Click the door to go outside', 600, 120, 0, false, null);

        //door for room
        door.call(this, 'roomDoor', 'Click the door to go inside the Room', 700, 550, 4, true, this.frontRoomWall);

        //window
        this.window = this.add.image(400, 100, 'window').setOrigin(0.5).setDisplaySize(60, 60);

        const walls = [
            this.add.rectangle(140, 470, 60, 600, 0xa7a7a7).setDepth(0),
            this.add.rectangle(500, 685, 60, 175, 0xa7a7a7).setDepth(2),
            this.add.rectangle(800, 470, 60, 600, 0xa7a7a7).setDepth(0),
        ];
        walls.forEach(obj =>{
            this.physics.add.existing(obj, true);
            this.physics.add.collider(obj, this.playerContainer);
        });

        this.bottomWallHouse = this.add.rectangle(470, 800, 600, 60, 0xa7a7a7).setDepth(2);
        this.physics.add.existing(this.bottomWallHouse, true);
        this.physics.add.collider(this.bottomWallHouse, this.playerContainer);

        //floors
        this.groupFloor = this.add.group();

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                const floor = this.groupFloor.create(200 + (60 * i), (200 + (60 * j)), 'floor').setOrigin(0.5).setDisplaySize(60,60).setDepth(0);

                this.groupFloor.add(floor);
            }
        }

        //tables
        this.groupTable = this.physics.add.staticGroup();

        const tables = [
            this.groupTable.create(220, 170, 'table').setOrigin(0.5).setDisplaySize(80,60).setDepth(0),
            this.groupTable.create(600, 700, 'table').setOrigin(0.5).setDisplaySize(80,60).setDepth(0),
        ]
        
        tables.forEach(obj => {
            obj.body.setSize(65, 30, true);
            obj.body.setOffset(288, 130);
        });

        //chest
        this.chest = this.physics.add.staticSprite(700, 300, 'chest').setOrigin(0.5).setDisplaySize(100, 80).setDepth(3);
        this.chest.body.setSize(100, 45, true);
        this.chest.body.setOffset(270, 300);

        this.chestLabel = this.add.text(700, 250, 'Click the chest to open', {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.chestLabel.setDepth(4).setVisible(false);

        //chest interactions
        this.chest.setInteractive({ useHandCursor: true });
        this.chest.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.chest.getBounds()) && isPanelOpen === false) {
                modalStatus('chestModal', 'flex', 'modalAnimation');
            }
        });
        this.physics.add.overlap(this.playerContainer, this.chest, () => {
            this.chestLabel.setVisible(true);
        });

        //object colliders
        this.physics.add.collider(this.groupTable, this.playerContainer);
        this.physics.add.collider(this.chest, this.playerContainer);

        lobbyUI(this);
        loadPlayerInfo(this);
        sceneSocket(this);
    }

    // Update function (for game logic and updates every frame)
    update = function() {
        if(isLoaded){
            try{
                this.playerContainer.body.setVelocity(0);

                if(isTalking || isPanelOpen){
                    this.input.keyboard.disableGlobalCapture();
                }

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
                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.frontDoor.getBounds())) {
                    this.frontDoor_label.setVisible(false);
                }

                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.roomDoor.getBounds())) {
                    this.roomDoor_label.setVisible(false);
                }

                //leaving chest
                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.chest.getBounds())) {
                    this.chestLabel.setVisible(false);
                }

                // on exit for NPCs
                if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bob.getBounds())) {
                    this.bobText.setVisible(false);
                }

                //for other player movement        
                const playerData = {
                    playerID: game_PlayerName,
                    x: this.playerContainer.x,
                    y: this.playerContainer.y,
                    isBack: isBack,
                    isFront: isFront,
                    spriteX: this.player.flipX
                }
                socket.emit('game_playerMove', playerData);
                socket.emit('game_existingPlayer', playerData, false, getOutWorld());
                socket.emit('game_loadPlayerSprite', game_PlayerName, spriteFront, spriteBack, spriteSide, null, null, null);
            } catch(err){
                console.log(err);
                window.location.reload();
            }
        }
    }
}

// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: canvasSize.width,
    height: canvasSize.height,
    canvas: gameCanvas,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [homeBase]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);