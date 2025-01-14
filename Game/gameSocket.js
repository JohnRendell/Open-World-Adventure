function loadPlayerInfo(scene){
    socket.on('disconnect', ()=>{
        socket.emit('game_playerDisconnect', game_PlayerName);
    });

    socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName ? playerName : 'cookie expired');

        setTimeout(() => {
            homeBaseUI(scene, playerProfile);

            //spawn the player
            game_PlayerName = playerName;
            loggedIn_playerName = playerName;
            socket.emit('game_spawnPlayer', playerName);
        }, 1500);

        pressKeysStuff();
     });
}

//this is for pressing buttons, keys
function pressKeysStuff(){
    document.onkeydown = (event)=>{
        if(event.key === 'i' && !isPanelOpen){
            modalStatus('inventoryModal', 'flex', 'modalAnimation');
            isTalking = true;
            isPanelOpen = true;
        }
    }
}