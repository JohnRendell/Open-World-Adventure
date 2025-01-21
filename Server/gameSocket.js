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
        function disconnectPlayer(socket, socketName){
            socket.on(socketName, ()=>{
                socket.broadcast.emit(socketName);
            });
        }
        disconnectPlayer(socket, 'game_playerDisconnect');
        disconnectPlayer(socket, 'gameOutside_playerDisconnect');

        function playerConnectedSocket(socket, socketName){
            socket.on(socketName, (playerName)=>{
                var data = { playerName: playerName };

                //add the player to the array
                const findPlayerIndex = players.findIndex(player => playerName == player['playerName']);

                if(findPlayerIndex == -1){
                    players.push(data);
                }
                console.log('players in lobby:');
                console.table(players);
            });   
        }
        playerConnectedSocket(socket, 'game_playerConnected');
        playerConnectedSocket(socket, 'gameOutside_playerConnected');

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
        function playerMove(socket, socketName){
            socket.on(socketName, (playerData)=>{
                socket.broadcast.emit(socketName, playerData);
            });
        }
        playerMove(socket, 'game_playerMove');
        playerMove(socket, 'gameOutside_playerMove');

        //spawn the player
        function spawnPlayer(socket, socketName){
            socket.on(socketName, (playerName)=>{
                socket.broadcast.emit(socketName, playerName);
            });
        }
        spawnPlayer(socket, 'game_spawnPlayer');
        spawnPlayer(socket, 'gameOutside_spawnPlayer');

        //when other player go inside or outside the room
        socket.on('playerGoToDoor', (offsetY, playerName)=>{
            socket.broadcast.emit('playerGoToDoor', offsetY, playerName);
        });

        //hiding all players when goes into room
        socket.on('hidePlayersWhenGoToRoom', (offsetY)=>{
            socket.emit('hidePlayersWhenGoToRoom', offsetY);
        });

        //spawn the existing player
        function renderPlayer(socket, socketName){
            socket.on(socketName, (playerData)=>{
                socket.emit('playerCount', players.length);
                socket.broadcast.emit(socketName, playerData);
            });
        }
        renderPlayer(socket, 'game_existingPlayer');
        renderPlayer(socket, 'gameOutside_existingPlayer');

        //load player's sprite
        function loadSprite(socket, socketName){
            socket.on(socketName, (playerID, spriteFront, spriteBack, spriteSide)=>{
                socket.broadcast.emit(socketName, playerID, spriteFront, spriteBack, spriteSide);
            });
        }
        loadSprite(socket, 'game_loadPlayerSprite');
        loadSprite(socket, 'gameOutside_loadPlayerSprite');

        //when player disconnected
        socket.on('game_playerDisconnect', (playerName)=>{
            socket.broadcast.emit('game_playerDisconnect', playerName);
        });
    });
}