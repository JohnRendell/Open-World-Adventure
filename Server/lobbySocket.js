module.exports = (server)=>{
    //for connection established
    server.on('connect', (socket)=>{
        //player move
        socket.on('playerMove', (playerData)=>{
            socket.broadcast.emit('playerMove', playerData);
        });

        //loading player name
        socket.on('loadPlayerName', (playerName)=>{
            socket.emit('loadPlayerName', playerName);
        });

        //spawn the player
        socket.on('spawnPlayer', (playerName)=>{
            socket.broadcast.emit('spawnPlayer', playerName);
        });

        //spawn the existing player
        socket.on('existingPlayer', (playerData)=>{
            socket.broadcast.emit('existingPlayer', playerData);
        });

        //when player logged in, remove it to the lobby
        socket.on('redirectToBase', (playerName)=>{
            socket.broadcast.emit('redirectToBase', playerName);
        });

        //when player disconnected
        socket.on('playerDisconnect', (playerName)=>{
            socket.broadcast.emit('playerDisconnect', playerName);
        });
    });
}