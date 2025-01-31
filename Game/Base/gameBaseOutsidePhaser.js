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

function getOutWorld(){
    return isOutWorld;
}

function setOutWorld(status){
    isOutWorld = status;
}

class baseOutside extends Phaser.Scene{
    constructor(){
        super('Outside Base');
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

        //game status
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
        this.playerContainer = this.add.container(380, 250, [this.player, this.playerName]);
        
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

         //npc functions
        var npc = (npcKey, imageLabel, objectLabel, NPCBodyOffsetX, NPCBodyOffsetY, NPCposX, NPCposY, width, height)=>{
            //add the NPC
            const npcObj = this.physics.add.staticSprite(NPCposX, NPCposY, imageLabel).setOrigin(0.5);
            npcObj.setScale(0.1);
            npcObj.setDepth(3);
            npcObj.body.setSize(width, height, true);
            npcObj.body.setOffset(NPCBodyOffsetX, NPCBodyOffsetY);

            //NPC Label
            this.NPCLabel = this.add.text(NPCposX, (NPCposY - 60), objectLabel, {
                font: "16px 'Pixelify Sans",
                fill: "#ffffff",
                align: "center"
            }).setOrigin(0.5);
            this.NPCLabel.setDepth(4);

            const instructionText = this.add.text(NPCposX, (NPCposY - 100) + 20, "Click to talk", {
                font: "16px 'Pixelify Sans",
                fill: "#ffffff",
                align: "center"
            }).setOrigin(0.5);
            instructionText.setVisible(false);
            instructionText.setDepth(4);

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

            this[npcKey] = npcObj;
            this[`${npcKey}Text`] = instructionText;
            this[`${npcKey}Label`] = this.NPCLabel;

            npcObj.setInteractive({ useHandCursor: true });
            npcObj.on('pointerdown', () => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), npcObj.getBounds()) && isPanelOpen === false) {
                    modalStatus(npcKey + 'Dialog', 'flex', 'modalAnimation');
                    isTalking = true;
                    isPanelOpen = true;

                    switch(npcKey){
                        case 'bob':
                            socket.emit('NPCPrompt', 'bob');
                            npcGreet('npcConversationDiv', 'Hi im Bob, your robot guide. *Beep boop*');
                        break;

                        case 'bobPrototype':
                            npcGreet('bobPrototypeMessage', 'Hey, its me Bob first model, your robot helper, *Buzz Buzz*');
                        break;
                    }
                }
            });
        }

        this.bobXHover = 200;
        this.bobXOffset = 450;
        this.bobYOffset = 430;
        this.bobDirection = 1;
        npc.call(this, 'bob', 'Bob_NPC', 'Bob (NPC)', this.bobXOffset, this.bobYOffset, this.bobXHover, 700, 70, 80);

        npc.call(this, 'bobPrototype', 'BobPrototype_NPC', 'Bob Prototype Model (NPC)', 450, 430, 800, 450, 70, 80);

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
                setOutWorld(true);
                socket.emit('gameOutside_playerDisconnect', game_PlayerName);
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

        //scattered rocks
        this.rockGroup = this.physics.add.staticGroup();

        const rock = [
            this.rockGroup.create(400, 600, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(4),
            this.rockGroup.create(850, 700, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(4),
            this.rockGroup.create(1000, 300, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(4),
            this.rockGroup.create(1400, 750, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(4)
        ]
        
        rock.forEach(obj => {
            obj.body.setSize(60, 20, true);
            obj.body.setOffset(480, 520);
        });

        //collider for rock
        this.physics.add.collider(this.playerContainer, this.rockGroup);

        //tree
        this.tree = this.physics.add.staticSprite(1400, 100, 'tree').setDisplaySize(300, 600).setOrigin(0.5).setDepth(3);
        this.tree.body.setSize(100, 20, true);
        this.tree.body.setOffset(750, 850);

        this.physics.add.collider(this.tree, this.playerContainer);

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

        //walls
        this.woodenWalls = this.physics.add.staticGroup();

        //top wall
        for(let i = 0; i < 5; i++){
            const wall = this.woodenWalls.create(890 + (180 * i), 100, 'front_Wall').setDisplaySize(180, 230).setDepth(0).setOrigin(0.5);
            wall.body.setSize(180, 50, true);
            wall.body.setOffset(420, 460);

            this.woodenWalls.add(wall);
        }

        //bottom wall
        for(let i = 0; i < 11; i++){
            const wall = this.woodenWalls.create(100 + (180 * i), 830, 'front_Wall').setDisplaySize(180, 230).setDepth(3).setOrigin(0.5);
            wall.body.setSize(180, 50, true);
            wall.body.setOffset(420, 520);

            this.woodenWalls.add(wall);
        }
        this.physics.add.collider(this.playerContainer, this.woodenWalls);
        
        //entrance gate
        this.gate = this.physics.add.staticSprite(1800, 100, 'gate').setDepth(0).setDisplaySize(150, 220).setOrigin(0.5);
        this.gate.body.setSize(150, 80, true);
        this.gate.body.setOffset(435, 420);

        this.physics.add.collider(this.gate, this.playerContainer, ()=>{
            alert('going places')
        });

        //river
        this.riverGroup = this.add.group();

        this.anims.create({
            key: 'riverFlow',
            frames: this.anims.generateFrameNumbers('river', { start: 0, end: 4 }),
            frameRate: 12,
            repeat: -1
        });

        for(let i = 0; i < 4; i++){
            const river = this.add.sprite(300 + (600 * i), 1000, 'river').setDisplaySize(600, 600).setOrigin(0.5);
            river.play('riverFlow');
    
            this.riverGroup.add(river);
        }
        lobbyUI(this);
        loadPlayerInfo(this);
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
            }

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
            socket.emit('gameOutside_playerMove', playerData);
            socket.emit('gameOutside_existingPlayer', playerData, isDead, getOutWorld());

            socket.emit('gameOutside_loadPlayerSprite', game_PlayerName, spriteFront, spriteBack, spriteSide, spriteFrontAttack, spriteBackAttack, spriteSideAttack);
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
            debug: false
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