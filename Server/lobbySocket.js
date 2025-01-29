const CryptoJS = require('crypto-js');

module.exports = (server)=>{
    //for connection established
    server.on('connect', (socket)=>{
        console.log('Connected to the socketIO: ' + socket.id);

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