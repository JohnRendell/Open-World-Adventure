const canvasSize = {
    width: 1000,
    height: 500
}

const worldBounds = {
    width: 1200,
    height: 1000
}

const centerWorld = {
    width: worldBounds.width / 2,
    height: worldBounds.height / 2
}

const speed = 200;
const gameLobby = new Phaser.Scene("Game Lobby");
let isTalking = false;
let isPanelOpen = false;

// Preload function (for loading assets)
gameLobby.preload = function() {
    //show loading div
    document.getElementById('loadingDiv').style.display = 'flex';

     // Update text as assets are loaded
    this.load.on('progress', (value) => {
        let percentage = parseInt(value * 100);
        document.getElementById('loadingProgressText').innerText = `${percentage} %`;
    });

    this.load.on('complete', () => {
        document.getElementById('loadingProgressText').innerText = 'Starting game...';
    });

    //objecs
    this.load.image('lobby', '/ImageComponents/Lobby/Lobby Island.png');
    this.load.image('rock', '/ImageComponents/Objects/Rock.png');
    this.load.image('tree', '/ImageComponents/Objects/Tree.png');
    this.load.spritesheet('spawner', '/ImageComponents/Sprite Sheets/Spawner Sprite Sheet.png', {
        frameWidth: 5280 / 5,
        frameHeight: 800 / 1
    });

    //player
    this.load.spritesheet('guestPlayerIdle', '/ImageComponents/Sprite Sheets/guest player Idle Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    this.load.spritesheet('guestPlayerFront', '/ImageComponents/Sprite Sheets/guest player front Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    this.load.spritesheet('guestPlayerBack', '/ImageComponents/Sprite Sheets/guest player back Sprite Sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    //NPC
    this.load.spritesheet('Rupert_NPC', '/ImageComponents/Sprite Sheets/Rupert Idle sprite sheet.png', {
        frameWidth: 1600 / 5,
        frameHeight: 800 / 1
    });

    //effect
    this.load.spritesheet('spawnEffect', '/ImageComponents/Sprite Sheets/Spawn effect sprite sheet.png', {
        frameWidth: 5120 / 5,
        frameHeight: 2048 / 2
    });
}

// Create function (for initializing the game world)
gameLobby.create = function() {
    //hide the loading once the game finished load
    document.getElementById('loadingDiv').style.display = 'none';

    //set the world bounds
    this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

    //lobby background
    this.lobby = this.add.image(centerWorld.width, centerWorld.height, 'lobby').setOrigin(0.5);
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

    //main player
    this.player = this.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
    this.player.setDisplaySize(40, 70);
    this.player.setCollideWorldBounds(true); 
    this.player.setVisible(false);

    this.anims.create({
        key: 'playerIdle',
        frames: this.anims.generateFrameNumbers('guestPlayerIdle', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: 'playerFront',
        frames: this.anims.generateFrameNumbers('guestPlayerFront', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: 'playerBack',
        frames: this.anims.generateFrameNumbers('guestPlayerBack', { start: 0, end: 1 }),
        frameRate: 4,
        repeat: -1
    });

    //call the scene for the socket phaser
    //TODO: fix this, not getting the centerworld on other class, suggestion setter and getter
    this.scene.launch('Socket Phaser');

    //player name
    this.playerName = this.add.text(0, -50, "Guest_Player", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);

    //player container
    this.playerContainer = this.add.container(centerWorld.width + 50, centerWorld.height, [this.player, this.playerName]);

    this.physics.world.enable(this.playerContainer);

    //tree
    this.tree = this.physics.add.staticSprite(centerWorld.width + 245, centerWorld.height - 350, 'tree').setOrigin(0.5);
    this.tree.setDisplaySize(330, 400);
    this.tree.body.setSize(80, 10, true);
    this.tree.body.setOffset(750, 750);

    this.physics.add.collider(this.playerContainer, this.tree);

    //spawn smoke
    this.spawnSmoke = this.add.sprite(centerWorld.width, centerWorld.height - 50, "spawn_smoke").setOrigin(0.5);
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
    this.spawner = this.physics.add.staticSprite(centerWorld.width, centerWorld.height, 'spawner').setOrigin(0.5);
    this.spawner.setDisplaySize(60, 50);
    this.spawner.body.setSize(60, 20, true);
    this.spawner.body.setOffset(500, 400);
    this.spawner.setDepth(2);

    this.anims.create({
        key: 'spawnerPod',        
        frames: this.anims.generateFrameNumbers('spawner', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1
    });

    this.spawner.play('spawnerPod');

    //collider for spawner
    this.physics.add.collider(this.playerContainer, this.spawner);

   var npc = (npcKey, imageLabel, objectLabel, NPCBodyOffsetX, NPCBodyOffsetY, NPCposX, NPCposY)=>{
        //add the NPC
        const npcObj = this.physics.add.staticSprite(NPCposX, NPCposY, imageLabel).setOrigin(0.5);
        npcObj.setDisplaySize(40, 70);
        npcObj.body.setSize(40, 70, true);
        npcObj.body.setOffset(NPCBodyOffsetX, NPCBodyOffsetY);

        //NPC Label
        this.NPCLabel = this.add.text(NPCposX, (NPCposY - 100) + 50, objectLabel, {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.NPCLabel.setDepth(2);

        const instructionText = this.add.text(NPCposX, (NPCposY - 100) + 20, "Click to talk", {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        instructionText.setVisible(false);
        instructionText.setDepth(2);

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

        npcObj.setInteractive();
        npcObj.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), npcObj.getBounds()) && isPanelOpen === false) {
                document.getElementById('rupertDialog').style.display = 'flex';
                isTalking = true;
                isPanelOpen = true;
            }
        });
   }

   npc.call(this, 'rupert', 'Rupert_NPC', 'Rupert (NPC)', 140, 365, centerWorld.width - 30, centerWorld.height + 200);

    //rock
    this.rockGroup = this.physics.add.staticGroup();

    const rock = [
        this.rockGroup.create(300, 400, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(2),
        this.rockGroup.create(500, 200, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(2),
        this.rockGroup.create(800, 550, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(2),
        this.rockGroup.create(400, 600, 'rock').setOrigin(0.5).setDisplaySize(80,60).setDepth(2)
    ]
    
    rock.forEach(obj => {
        obj.body.setSize(60, 20, true);
        obj.body.setOffset(480, 520);
    });

    //collider for rock
    this.physics.add.collider(this.playerContainer, this.rockGroup);

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
let isFront = false;
let isBack = false;

gameLobby.update = function() {
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

    if(isTalking){
        this.input.keyboard.on('keydown', function (event) {
            let inputField = this.element.getChildByName('npcMessageInput');
                if (event.key === ' ') {
                    // Add a space character when the Space key is pressed
                    inputField.value += ' ';
                } else if (event.key.length === 1) {
                    // Add regular characters like 'a', 's', 'd', 'w', etc.
                    inputField.value += event.key;
                }
        }.bind(this));
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

    // on exit for NPCs
    if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.rupert.getBounds())) {
        this.rupertText.setVisible(false);
    }

    let playerY = this.playerContainer.y - 130;
    if (playerY < this.tree.y) {
        this.playerContainer.setDepth(1);
        this.tree.setDepth(2);
    } else {
        this.playerContainer.setDepth(2);
        this.tree.setDepth(1);
    }
}