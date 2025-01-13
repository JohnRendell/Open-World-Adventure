const CryptoJS = require('crypto-js');

module.exports = (server)=>{
    server.on('connect', (socket)=>{
        //when player disconnected
        socket.on('game_playerDisconnect', (playerName)=>{
            let decryptPlayerNameGuest = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);
            let decryptPlayerNameLoggedIn = CryptoJS.AES.decrypt(playerName, 'token').toString(CryptoJS.enc.Utf8);

            if(decryptPlayerNameGuest || decryptPlayerNameLoggedIn){
                let decryptPlayerName = decryptPlayerNameGuest ? decryptPlayerNameGuest : decryptPlayerNameLoggedIn;

                socket.broadcast.emit('game_playerDisconnect', decryptPlayerName);
            }
        });

        //passing player data upon loading
        socket.on('loadPlayerData', (playerName, playerProfile)=>{
            socket.emit('loadPlayerData', playerName, playerProfile);
        });

         //player move
        socket.on('game_playerMove', (playerData)=>{
            socket.broadcast.emit('game_playerMove', playerData);
        });

        //spawn the player
        socket.on('game_spawnPlayer', (playerName)=>{
            let decryptPlayerNameGuest = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);
            let decryptPlayerNameLoggedIn = CryptoJS.AES.decrypt(playerName, 'token').toString(CryptoJS.enc.Utf8);

            if(decryptPlayerNameGuest || decryptPlayerNameLoggedIn){
                let decryptPlayerName = decryptPlayerNameGuest ? decryptPlayerNameGuest : decryptPlayerNameLoggedIn;

                socket.broadcast.emit('game_spawnPlayer', decryptPlayerName);
            }
        });

        //spawn the existing player
        socket.on('game_existingPlayer', (playerData)=>{
            //socket.emit('playerCount', players.length);
            socket.broadcast.emit('game_existingPlayer', playerData);
        });
    });
}