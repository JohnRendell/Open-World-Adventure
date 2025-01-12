function loadPlayerInfo(scene){
     socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName ? playerName : 'cookie expired');

        setTimeout(() => {
            homeBaseUI(scene, playerProfile);
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