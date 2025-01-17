const express = require('express');
const sanitize = require('sanitize-html');
const router = express.Router();
const accountModel = require('./accountMongoose');

router.post('/playerProfile', async (req, res)=>{
    try{
        let playerName = sanitize(req.body.playerName);
        let findUser = await accountModel.findOne({ username: playerName });
        let playerUser, playerProfile;
        let frontSprite, backSprite, sideSprite;
        let isGuest;

        if(findUser){
            playerUser = findUser.username;
            playerProfile = findUser.profile;
            frontSprite = findUser.frontSprite;
            backSprite = findUser.backSprite;
            sideSprite = findUser.sideSprite;
            isGuest = false;
        }
        else{
            playerUser = playerName;
            playerProfile = 'https://i.imgur.com/ajVzRmV.jpg';
            frontSprite = 'https://i.imgur.com/Qq3Yedn.png';
            backSprite = 'https://i.imgur.com/xhU6u5B.png';
            sideSprite = 'https://i.imgur.com/4BkMHTS.png';
            isGuest = true;
        }
        res.status(200).json({ message: 'success', username: playerUser, profile: playerProfile, frontSprite: frontSprite, backSprite: backSprite, sideSprite: sideSprite, isGuest: isGuest });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;