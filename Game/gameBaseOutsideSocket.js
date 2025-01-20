function loadPlayerInfo(scene){
    socket.on('loadPlayerData', (playerName, playerProfile)=>{
        //scene.playerName.setText(playerName ? playerName : 'cookie expired');
        scene.load.image('playerProfile', playerProfile);

        setTimeout(() => {
            homeBaseUI(scene);

            //spawn the player
            game_PlayerName = playerName;
            loggedIn_playerName = playerName;

            socket.emit('game_spawnPlayer', playerName);
            socket.emit('game_playerConnected', playerName);
        }, 1500);
    });
}