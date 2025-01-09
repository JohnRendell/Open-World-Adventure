module.exports = (server)=>{
    server.on('connect', (socket)=>{
        //passing player data upon loading
        socket.on('loadPlayerData', (playerName, playerProfile)=>{
            socket.emit('loadPlayerData', playerName, playerProfile);
        });
    });
}