const canvasSize = {
    width: 1000,
    height: 500
}

//max base size 4000, min is 1200
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

let isFront = false;
let isBack = false;

class homeBase extends Phaser.Scene{
    constructor(){
        super("Home Base");
    }

    preload = function(){
        loadAssets(this);
    }

    create = function(){        
        //hide the loading once the game finished load
        document.getElementById('loadingDiv').style.display = 'none';
        
        //set the world bounds
        this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

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
        this.playerContainer.body.setSize(40, 70);
        this.playerContainer.body.setOffset(-20, -35);
        this.playerContainer.setDepth(1);

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

        //npc functions
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

            npcObj.setInteractive({ useHandCursor: true });
            npcObj.on('pointerdown', () => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), npcObj.getBounds()) && isPanelOpen === false) {
                    modalStatus(npcKey + 'Dialog', 'flex', 'modalAnimation');
                    isTalking = true;
                    isPanelOpen = true;

                    switch(npcKey){
                        case 'bimbo':
                            bimboPrompt();
                        break;
                    }
                }
            });
        }

        //npc.call(this, 'bimbo', 'Bimbo_NPC', 'Bimbo (NPC)', 140, 365, 123, 700);
        //this.bimbo.flipX = true;

        //wall of the house
        this.frontWallHouse = this.add.rectangle(470, 95, 720, 150, 0xa7a7a7).setDepth(0);
        this.physics.add.existing(this.frontWallHouse, true);
        this.physics.add.collider(this.frontWallHouse, this.playerContainer);

        //window
        this.window = this.add.image(400, 100, 'window').setOrigin(0.5).setDisplaySize(60, 60);

        //door
        this.door = this.physics.add.staticSprite(600, 120, 'door').setOrigin(0.5)
        this.door.setDisplaySize(80, 100);
        this.door.body.setSize(47, 120, true);
        this.door.body.setOffset(138, 110);

        //door status
        this.doorLabel = this.add.text(600, 50, 'Click the door to go outside', {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5);
        this.doorLabel.setDepth(2).setVisible(false);

        //door interactions
        this.door.setInteractive({ useHandCursor: true });
        this.door.on('pointerdown', () => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.door.getBounds())) {
                alert('going outside')
            }
        });
        this.physics.add.overlap(this.playerContainer, this.door, () => {
            this.doorLabel.setVisible(true);
        });

        const walls = [
            this.add.rectangle(140, 470, 60, 600, 0xa7a7a7).setDepth(0),
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
        ]
        
        tables.forEach(obj => {
            obj.body.setSize(65, 30, true);
            obj.body.setOffset(288, 130);
        });

        this.physics.add.collider(this.groupTable, this.playerContainer);

        lobbyUI(this);
        loadPlayerInfo(this);
    }

    // Update function (for game logic and updates every frame)
    update = function() {
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

        // on exit for NPCs
        /*if (!Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.bimbo.getBounds())) {
            this.bimboText.setVisible(false);
        }*/

        //for other player movement
        /*
        let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);
        
        const playerData = {
            playerID: decryptPlayerName,
            x: this.playerContainer.x,
            y: this.playerContainer.y,
            isBack: isBack,
            isFront: isFront,
            spriteX: this.player.flipX
        }
        socket.emit('playerMove', playerData);
        socket.emit('existingPlayer', playerData);*/
    }
}