let playerCount = 0;

socket.on('connect', ()=>{
    function guestID(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }

    let playerName = 'Guest_' + guestID(5);
    if(!localStorage.getItem('tempPlayerName')){
        localStorage.setItem('tempPlayerName', playerName);
    }
    socket.emit('playerConnected', localStorage.getItem('tempPlayerName'));
    socket.emit('spawnPlayer', localStorage.getItem('tempPlayerName'));
});

socket.on('playerCount', (count)=>{
    playerCount = count;
});

   //TODO: make a way to dynamic joining
function sceneSocket(scene){
    //map collection for players joined
    scene.playerCollection = new Map();

    socket.on('spawnPlayer', (playerName) => {
        if(localStorage.getItem('tempPlayerName') !== playerName){
            //joined Player
            scene.joinedPlayer = scene.physics.add.sprite(0,0, 'guestPlayerIdle').setOrigin(0.5);
            scene.joinedPlayer.setDisplaySize(40, 70);
            scene.joinedPlayer.setCollideWorldBounds(true); 
            scene.joinedPlayer.setVisible(false);

            //joined Player name
            scene.joinedPlayerName = scene.add.text(0, -50, playerName, {
                font: "16px 'Pixelify Sans'",
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            //joined Player container
            scene.joinedPlayerContainer = scene.add.container(centerWorld.width + 50, centerWorld.height, [scene.joinedPlayer, scene.joinedPlayerName]);

            //spawn smoke
            scene.spawnSmoke = scene.add.sprite(centerWorld.width, centerWorld.height - 50, "spawn_smoke").setOrigin(0.5);
            scene.spawnSmoke.setDisplaySize(2, 5);
            scene.spawnSmoke.setDepth(2);

            // Play the animation
            scene.spawnSmoke.play('spawnDust');

            scene.spawnSmoke.on('animationcomplete', ()=>{
                scene.spawnSmoke.destroy();
                scene.joinedPlayer.setVisible(true);
            });

            //add player to the collection
            scene.playerCollection.set(playerName, {
                container: scene.joinedPlayerContainer,
                playerSprite: scene.joinedPlayer
            });

            isRenderToClient = true;
        }
    });

    socket.on('playerMove', (playerData)=>{
        const { playerID, x, y, isBack, isFront, spriteX } = playerData;

        //search player to the collection
        const findPlayer = scene.playerCollection.get(playerID);

        if(findPlayer){
            const { container, playerSprite } = findPlayer;

            container.setPosition(x, y);
            playerSprite.flipX = spriteX;

            if (isFront) {
                playerSprite.play('playerFront', true);
            } 
            else if (isBack) {
                playerSprite.play('playerBack', true);
            } 
            else {
                playerSprite.play('playerIdle', true);
            }
        }

        //for tree, to make a illusion of back and front player
        //TODO: fix the tree one
        /*let playerY = scene.container.y - 130;
        if (playerY < scene.tree.y) {
            scene.container.setDepth(1);
            scene.tree.setDepth(2);
        } else {
            scene.container.setDepth(2);
            scene.tree.setDepth(1);
        }*/
    });
}