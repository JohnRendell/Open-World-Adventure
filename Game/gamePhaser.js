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
let game_PlayerName, loggedIn_playerName;

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
        this.playerContainer.setDepth(3);

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
        this.spawner.setDepth(4);

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
        var npc = (npcKey, imageLabel, objectLabel, NPCBodyOffsetX, NPCBodyOffsetY, NPCposX, NPCposY, width, height)=>{
            //add the NPC
            const npcObj = this.physics.add.staticSprite(NPCposX, NPCposY, imageLabel).setOrigin(0.5);
            npcObj.setDisplaySize(width, height);
            npcObj.setDepth(3);
            npcObj.body.setSize(width, height, true);
            npcObj.body.setOffset(NPCBodyOffsetX, NPCBodyOffsetY);

            //NPC Label
            this.NPCLabel = this.add.text(NPCposX, (NPCposY - 100) + 50, objectLabel, {
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

                        case 'bob':
                            npcGreet('npcConversationDiv', 'Hi im Bob, your robot guide. *Beep boop*');
                            bobPrompt();
                        break;
                    }
                }
            });
        }

        npc.call(this, 'bob', 'Bob_NPC', 'Bob (NPC)', 450, 430, 200, 300, 70, 80);

        var door = (doorName, doorText, posX, posY, depth, forPlayer, path, roomObj, roomStuff)=>{
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

                        //stuff in the rooms
                        let roomStuffCount = roomStuff.length;

                        for(let i = 0; i < roomStuffCount; i++){
                            let obj = roomStuff[i];
                            obj.setDepth(wallDepth);

                            label.setDepth(5).setVisible(false);

                            if(wallDepth === 0){
                                if(obj.name === 'Cabinet'){ 
                                    obj.on('pointerdown', () => {
                                        if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), obj.getBounds())) {
                                            alert('You are clicking cabinet ' + wallDepth);
                                        }
                                    });
                                }
                            }
                            else{
                                label.setDepth(5).setVisible(false);
                            }
                        }
                        
                        roomObj.setDepth(wallDepth);
                        doorObj.setDepth(wallDepth);
                        this.playerContainer.setY(newPlayerY);

                        roomObj.body.setSize(240, colliderSize, true);
                        roomObj.body.setOffset(0, offsetY);
                    }
                    else{
                        alert(path);
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

        this.frontRoomWall = this.add.rectangle(650, 535, 240, 130, 0xa7a7a7).setDepth(4);
        this.physics.add.existing(this.frontRoomWall, true);
        this.frontRoomWall.body.setSize(240, 50, true);
        this.frontRoomWall.body.setOffset(0, 80);

        this.physics.add.collider(this.frontWallHouse, this.playerContainer);
        this.physics.add.collider(this.frontRoomWall, this.playerContainer);

        //stuff in rooms
        this.roomStuff = this.physics.add.staticGroup();

        const stuff = [
            this.roomStuff.create(600, 560, 'Cabinet').setOrigin(0.5).setDisplaySize(100, 130).setDepth(4).setName('Cabinet'),
        ]

        stuff.forEach(obj =>{
            obj.body.setSize(65, 90, true);
            obj.body.setOffset(480, 470);
            obj.setInteractive({ useHandCursor: true });
        });

        //door for front house
        door.call(this, 'frontDoor', 'Click the door to go outside', 600, 120, 0, false, null, null, null);

        //door for room
        door.call(this, 'roomDoor', 'Click the door to go inside the Room', 700, 550, 4, true, null, this.frontRoomWall, stuff);

        //window
        this.window = this.add.image(400, 100, 'window').setOrigin(0.5).setDisplaySize(60, 60);

        const walls = [
            this.add.rectangle(140, 470, 60, 600, 0xa7a7a7).setDepth(0),
            this.add.rectangle(500, 620, 60, 300, 0xa7a7a7).setDepth(2),
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
        this.chest = this.physics.add.staticSprite(700, 300, 'chest').setOrigin(0.5).setDisplaySize(100, 80).setDepth(4);
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
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.playerContainer.getBounds(), this.chest.getBounds())) {
                alert('Opening Chest')
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
        socket.emit('game_existingPlayer', playerData);
    }
}