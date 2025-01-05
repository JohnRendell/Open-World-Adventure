const CryptoJS = require('crypto-js');

const players = [];

module.exports = (server)=>{
    //for connection established
    server.on('connect', (socket)=>{
        console.log('Connected to the socketIO: ' + socket.id);

        socket.on('playerConnected', (playerName)=>{
            let decryptPlayerName = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            var data = { playerName: decryptPlayerName };

            //add the player to the array
            const findPlayerIndex = players.findIndex(player => decryptPlayerName == player['playerName']);

            if(findPlayerIndex == -1){
                players.push(data);
            }

            //count players
            console.log('player Count: ' + players.length);
            console.table(players);
            server.emit('playerCount', players.length);
        });

        //player move
        socket.on('playerMove', (playerData)=>{
            socket.broadcast.emit('playerMove', playerData);
        });

        //spawn the player
        socket.on('spawnPlayer', (playerName)=>{
            let decryptPlayerName = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            socket.broadcast.emit('spawnPlayer', decryptPlayerName);
        });

        //spawn the existing player
        socket.on('existingPlayer', (playerData)=>{
           socket.broadcast.emit('existingPlayer', playerData);
        });

        //when player disconnected
        socket.on('playerDisconnect', (playerName)=>{
            let decryptPlayerName = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            socket.broadcast.emit('playerDisconnect', decryptPlayerName);
        });
    });
}