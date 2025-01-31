const accountModel = require('./accountMongoose');
const Fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

module.exports = (server)=>{
    server.on('connect', (socket)=>{
        //when player change profile
        socket.on('updateProfile', async (profile, deleteHash, playerName)=>{
            try{
                //delete old profile
                const findPlayer = await accountModel.findOne({ username: playerName });

                if(findPlayer){
                    //if the profile is not null, it will only null if the profile is default
                    if(findPlayer.profileHash){

                        //TODO: fix this not able to delete the image
                        const deleteProfile = await Fetch('https://api.imgur.com/3/image/' + findPlayer.profileHash, {
                            method: "DELETE",
                            Authorize: `Bearer ${process.env.IMGUR_TOKEN}`
                        });

                        if(!deleteProfile){
                            console.log('Old Profile Can\'t delete');
                        }
                    }
                }
                const changeProfile = await accountModel.findOneAndUpdate(
                    { username: playerName },
                    { $set: { profile: profile, profileHash: deleteHash } },
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
        socket.on('loadSprites', (sprite0, sprite1, sprite2, sprite3, sprite4, sprite5)=>{
            socket.emit('loadSprites', sprite0, sprite1, sprite2, sprite3, sprite4, sprite5);
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

                case 'frontAttack':
                    updateQuery.attackFrontSprite = sprite;
                break;

                case 'backAttack':
                    updateQuery.attackBackSprite = sprite;
                break;

                case 'sideAttack':
                    updateQuery.attackSideSprite = sprite;
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

        //pass the player count
        socket.on('passCountData', (count)=>{
            server.emit('passCountData', count);
        });

        //load new sprite to other player
        socket.on('loadNewSpriteToClient', (playerName, sprite, query)=>{
            socket.broadcast.emit('loadNewSpriteToClient', playerName, sprite, query);
        });
        
        //when player disconnected
        function disconnectPlayer(socket, socketName){
            socket.on(socketName, (playerName)=>{
                socket.broadcast.emit(socketName, playerName);
            });
        }
        disconnectPlayer(socket, 'game_playerDisconnect');
        disconnectPlayer(socket, 'gameOutside_playerDisconnect');

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
            socket.on(socketName, (playerData, isDead, isOutWorld)=>{
                socket.broadcast.emit(socketName, playerData, isDead, isOutWorld);
            });
        }
        renderPlayer(socket, 'game_existingPlayer');
        renderPlayer(socket, 'gameOutside_existingPlayer');

        //load player's sprite
        function loadSprite(socket, socketName){
            socket.on(socketName, (playerID, spriteFront, spriteBack, spriteSide, frontAttack, backAttack, sideAttack)=>{
                socket.broadcast.emit(socketName, playerID, spriteFront, spriteBack, spriteSide, frontAttack, backAttack, sideAttack);
            });
        }
        loadSprite(socket, 'game_loadPlayerSprite');
        loadSprite(socket, 'gameOutside_loadPlayerSprite');

        //for attacking
        socket.on('gameOutside_playerAttack', (playerData)=>{
            socket.broadcast.emit('gameOutside_playerAttack', playerData);
        });

        //for player taking damage
        socket.on('gameOutside_takingDamage', async (healthPoints, playerName)=>{
            try{
                await accountModel.findOneAndUpdate(
                    { username: playerName },
                    { $set: { healthPoints: healthPoints }}
                );
            }
            catch(err){
                console.log(err);
            }
        });

        //for player healing
        socket.on('heal', async (playerName)=>{
            try{
                await accountModel.findOneAndUpdate(
                    { username: playerName },
                    { $set: { healthPoints: 100 }}
                );
                socket.emit('heal');
            }
            catch(err){
                console.log(err);
            }
        });   

        //for player die
        socket.on('playerDie', (playerName)=>{
            socket.broadcast.emit('playerDie', playerName);
        });

        //when player update account
        socket.on('updateAcc', (username)=>{
            socket.emit('updateAcc', username);
        });

        //when player disconnected
        socket.on('game_playerDisconnect', (playerName)=>{
            socket.broadcast.emit('game_playerDisconnect', playerName);
        });
    });
}