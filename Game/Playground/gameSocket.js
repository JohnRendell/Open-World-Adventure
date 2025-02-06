function playerSocket(scene){
    socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName ? playerName : 'cookie expired');
        scene.load.image('playerProfile', playerProfile);

        setTimeout(() => {
            homeBaseUI(scene);

            //spawn the player
            game_PlayerName = playerName;
            loggedIn_playerName = playerName;

            socket.emit('game_spawnPlayer', playerName);
        }, 1500);
    });

    socket.on('heal', ()=>{
        document.getElementById('validateDiv').style.display = 'none';
        playerHealthPoints = 100;

        //main player's hp
        scene.playerHealth.destroy();

        scene.playerHealth = scene.add.graphics();
        scene.playerHealth.fillStyle(0xeb281a, 1);
        scene.playerHealth.fillRoundedRect(100, 0, playerHealthPoints, 20, 5);

        //add to the container
        scene.playerUIContainer.add(scene.playerHealth);
    });
}