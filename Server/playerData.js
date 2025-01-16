const express = require('express');
const sanitize = require('sanitize-html');
const router = express.Router();
const accountModel = require('./accountMongoose');

router.post('/playerProfile', async (req, res)=>{
    try{
        let playerName = sanitize(req.body.playerName);
        let findUser = await accountModel.findOne({ username: playerName });
        let playerUser, playerProfile, playerSprites;

        if(findUser){
            playerUser = findUser.username;
            playerProfile = findUser.profile;
            playerSprites = findUser.sprites;
        }
        else{
            playerUser = playerName;
            playerProfile = 'https://i.imgur.com/ajVzRmV.jpg';
            playerSprites = [
                '/ImageComponents/Templates for players/Back template sprite sheet.png',
                '/ImageComponents/Templates for players/Front template sprite sheet.png',
                '/ImageComponents/Templates for players/Side template sprite sheet.png',
            ]
        }
        res.status(200).json({ message: 'success', username: playerUser, profile: playerProfile, sprites: playerSprites });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;