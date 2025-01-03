const players = [];

   //TODO: make a way to dynamic joining
module.exports = (server)=>{
    //for connection established
    server.on('connect', (socket)=>{
        console.log('Connected to the socketIO: ' + socket.id);

        socket.on('playerConnected', (playerName)=>{
            var data = { playerName: playerName };

            //add the player to the array
            const findPlayerIndex = players.findIndex(player => playerName == player['playerName']);

            if(findPlayerIndex == -1){
                players.push(data);
            }
            //count players
            server.emit('playerCount', players.length);
        });

        console.log('Current Players: ');
        console.table(players);

        //player move
        socket.on('playerMove', (playerData)=>{
            socket.broadcast.emit('playerMove', playerData);
        });

        //spawn the player
        socket.on('spawnPlayer', (playerName)=>{
            socket.broadcast.emit('spawnPlayer', playerName);
        });

        //when player disconnected
        socket.on('disconnected', ()=>{

        });
    });
}