function sceneSocket(scene){
    //player count
    socket.on('passCountData', (count)=>{
        scene.playerCountLabel.setText('Player Count: ' + count);
    });

    socket.on('playerCount', (count)=>{
        scene.playerCountLabel.setText('Player Count: ' + count);
    });
}