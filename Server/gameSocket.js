const CryptoJS = require('crypto-js');
const accountModel = require('./accountMongoose');

const players = [];

module.exports = (server)=>{
    server.on('connect', (socket)=>{
        //when player change profile
        socket.on('updateProfile', async (profile, playerName)=>{
            try{
                const changeProfile = await accountModel.findOneAndUpdate(
                    { username: playerName },
                    { $set: { profile: profile } },
                    { new: true }
                )

                if(changeProfile){
                    socket.emit('updateProfile', profile);
                }
            }
            catch(err){
                console.log(err);
            }
        });

        //for initial loading of sprites
        socket.on('loadSprites', (sprite0, sprite1, sprite2)=>{
            socket.emit('loadSprites', sprite0, sprite1, sprite2);
        });

        //when player upload new sprite
        socket.on('loadNewSprite', async (playerName, imageID, sprite, query)=>{
            const updateQuery = {};

            switch(query){
                case 'front':
                    updateQuery.frontSprite = sprite;
                break;

                case 'back':
                    updateQuery.backSprite = sprite;
                break;

                case 'side':
                    updateQuery.sideSprite = sprite;
                break;
            }

            try{
                const changeSprites = await accountModel.findOneAndUpdate(
                    { username: playerName },
                    { $set: updateQuery },
                    { new: true }
                );

                if(changeSprites){
                    socket.emit('loadNewSprite', imageID, sprite, query);
                }
            }
            catch(err){
                console.log(err);
            }
        });

        //load new sprite to other player
        socket.on('loadNewSpriteToClient', (playerName, sprite, query)=>{
            socket.broadcast.emit('loadNewSpriteToClient', playerName, sprite, query);
        });
        
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

        //when other player go inside or outside the room
        socket.on('playerGoToDoor', (offsetY, playerName)=>{
            socket.broadcast.emit('playerGoToDoor', offsetY, playerName);
        });

        //hiding all players when goes into room
        socket.on('hidePlayersWhenGoToRoom', (offsetY)=>{
            socket.emit('hidePlayersWhenGoToRoom', offsetY);
        });

        //spawn the existing player
        socket.on('game_existingPlayer', (playerData)=>{
            socket.emit('playerCount', players.length);
            socket.broadcast.emit('game_existingPlayer', playerData);
        });

        //load player's sprite
        socket.on('game_loadPlayerSprite', (playerID, spriteFront, spriteBack, spriteSide)=>{
            socket.broadcast.emit('game_loadPlayerSprite', playerID, spriteFront, spriteBack, spriteSide);
        });

        //when player disconnected
        socket.on('game_playerDisconnect', (playerName)=>{
            socket.broadcast.emit('game_playerDisconnect', playerName);
        });
    });
}