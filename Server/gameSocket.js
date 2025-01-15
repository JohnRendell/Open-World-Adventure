const CryptoJS = require('crypto-js');

const players = [];

module.exports = (server)=>{
    server.on('connect', (socket)=>{
        //when player disconnected
        socket.on('game_playerDisconnect', ()=>{
            socket.broadcast.emit('game_playerDisconnect');
        });

        socket.on('game_playerConnected', (playerName)=>{
            var data = { playerName: playerName };

            //add the player to the array
            const findPlayerIndex = players.findIndex(player => playerName == player['playerName']);

            if(findPlayerIndex == -1){
                players.push(data);
            }
            console.log('players in lobby:');
            console.table(players);
        });

        //player counts
        socket.on('playerCount', (count)=>{
            socket.emit('playerCount', count);

            console.log('Player in lobby count: ');
            console.table(players);
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
            try{
                let decryptPlayerNameGuest = CryptoJS.AES.decrypt(playerName, 'tempPlayerName').toString(CryptoJS.enc.Utf8);
                let decryptPlayerNameLoggedIn = CryptoJS.AES.decrypt(playerName, 'token').toString(CryptoJS.enc.Utf8);

                if(decryptPlayerNameGuest || decryptPlayerNameLoggedIn){
                    let decryptPlayerName = decryptPlayerNameGuest ? decryptPlayerNameGuest : decryptPlayerNameLoggedIn;

                    socket.broadcast.emit('game_spawnPlayer', decryptPlayerName);
                }
            }
            catch(err){
                console.log(err);
            }
        });

        //spawn the existing player
        socket.on('game_existingPlayer', (playerData)=>{
            socket.emit('playerCount', players.length);
            socket.broadcast.emit('game_existingPlayer', playerData);
        });

        //when player disconnected
        socket.on('game_playerDisconnect', (playerName)=>{
            socket.broadcast.emit('game_playerDisconnect', playerName);
        });
    });
}