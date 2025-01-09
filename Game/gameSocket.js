function loadPlayerInfo(scene){
     socket.on('loadPlayerData', (playerName, playerProfile)=>{
        scene.playerName.setText(playerName);

        setTimeout(() => {
            homeBaseUI(scene, playerName, playerProfile);
        }, 1500);
     });
}