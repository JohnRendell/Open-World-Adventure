const express = require('express');
const sanitize = require('sanitize-html');
const router = express.Router();
const accountModel = require('./accountMongoose');

router.post('/playerProfile', async (req, res)=>{
    try{
        let playerName = sanitize(req.body.playerName);
        let findUser = await accountModel.findOne({ username: playerName });
        let playerUser, playerProfile;

        if(findUser){
            playerUser = findUser.username;
            playerProfile = findUser.profile;
        }
        else{
            playerUser = playerName;
            playerProfile = 'https://i.imgur.com/ajVzRmV.jpg';
        }
        res.status(200).json({ message: 'success', username: playerUser, profile: playerProfile });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;