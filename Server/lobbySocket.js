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
            console.log('players:');
            console.table(players);
        });

        //player counts
        socket.on('playerCount', (count)=>{
            socket.emit('playerCount', count);
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
            socket.emit('playerCount', players.length);
            socket.broadcast.emit('existingPlayer', playerData);
        });

        //when player logged in, remove it to the lobby
        socket.on('redirectToBase', (playerName)=>{
            socket.broadcast.emit('redirectToBase', playerName);
        });

        //when player disconnected
        socket.on('playerDisconnect', (playerName)=>{
            let decryptPlayerName = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            socket.broadcast.emit('playerDisconnect', decryptPlayerName);
        });
    });
}