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
    height: worldBounds.height / 2,
}

const speed = 200;
let isTalking = false;
let isPanelOpen = false;

let isFront = false;
let isBack = false;

async function getPlayerName(scene){
    const getUserToken = await fetch('/cookie/getCookie', {
        method: "POST",
        headers: {
            "Accept": "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ guaranteedAccess: true })
    });

    const getUserToken_Data = await getUserToken.json();

    if(getUserToken_Data.message === 'success'){
        scene.playerName.setText(getUserToken_Data.decryptPlayerName);
    }
    else{
        scene.playerName.setText('cant read token');
    }
}

class homeBase extends Phaser.Scene{
    constructor(){
        super("Home Base");
    }

    preload = function(){
        loadAssets(this);
    }

    create = function(){
        getPlayerName(this);
        
        //hide the loading once the game finished load
        document.getElementById('loadingDiv').style.display = 'none';
        
        //set the world bounds
        this.physics.world.setBounds(0,0, worldBounds.width, worldBounds.height);

        //zone
        this.topZone = this.physics.add.staticSprite(0, 100).setOrigin(0.5);
        this.topZone.setDisplaySize(worldBounds.width + 100, 100);
        this.topZone.body.setSize(worldBounds.width + 100, 100, true);
        this.topZone.body.setOffset(0,0);

        //add the river
        this.river = this.add.sprite(0, 0, 'river').setOrigin(0.5);
        this.river.setDisplaySize(3000, 1000);
        this.river.setDepth(1);

        this.anims.create({
            key: 'riverFlow', 
            frames: this.anims.generateFrameNumbers('river', { start: 0, end: 2 }),
            frameRate: 6, 
            repeat: -1
        });
        this.river.play('riverFlow');

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
        this.playerContainer = this.add.container(centerWorld.width + 50, centerWorld.height, [this.player, this.playerName]);

        this.physics.world.enable(this.playerContainer);

        this.playerContainer.body.setCollideWorldBounds(true);
        this.playerContainer.body.setSize(40, 70);
        this.playerContainer.body.setOffset(-20, -35);
        this.playerContainer.setDepth(1);

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

        //collider for zone
        this.physics.add.collider(this.playerContainer, this.topZone);

        //camera follow main player
        this.cameras.main.startFollow(this.playerContainer);
        this.cameras.main.setBounds(0,0, worldBounds.width, worldBounds.height);

        //keys for movement of player/camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        lobbyUI(this);
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