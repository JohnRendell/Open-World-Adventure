const express = require('express');
const sanitize = require('sanitize-html');
const router = express.Router();
const accountModel = require('./accountMongoose');
const bcryptJS = require('bcryptjs');

router.post('/playerProfile', async (req, res)=>{
    try{
        let playerName = sanitize(req.body.playerName);
        let findUser = await accountModel.findOne({ username: playerName });
        let playerUser, playerProfile;
        let frontSprite, backSprite, sideSprite;
        let attackSideSprite, attackFrontSprite, attackBackSprite;
        let playerHealthPoints;
        let playerGem;

        if(findUser){
            playerUser = findUser.username;
            playerProfile = findUser.profile.sprite;
            playerHealthPoints = findUser.healthPoints,
            frontSprite = findUser.frontSprite.sprite;
            backSprite = findUser.backSprite.sprite;
            sideSprite = findUser.sideSprite.sprite;
            attackSideSprite = findUser.attackSideSprite.sprite;
            attackFrontSprite = findUser.attackFrontSprite.sprite;
            attackBackSprite = findUser.attackBackSprite.sprite;
            playerGem = findUser.gem;
        }
        else{
            playerUser = playerName;
            playerProfile = 'https://i.imgur.com/ajVzRmV.jpg';
            playerHealthPoints = 100,
            frontSprite = 'https://i.imgur.com/Qq3Yedn.png';
            backSprite = 'https://i.imgur.com/xhU6u5B.png';
            sideSprite = 'https://i.imgur.com/4BkMHTS.png';
            attackSideSprite = 'https://i.imgur.com/jVS0NeM.png';
            attackFrontSprite = 'https://i.imgur.com/ebhD511.png';
            attackBackSprite = 'https://i.imgur.com/z1jmKkm.png';
            playerGem = 0;
        }
        res.status(200).json({ message: 'success', username: playerUser, profile: playerProfile, playerHealthPoints: playerHealthPoints, playerGem: playerGem, frontSprite: frontSprite, backSprite: backSprite, sideSprite: sideSprite, attackSideSprite: attackSideSprite, attackFrontSprite: attackFrontSprite, attackBackSprite: attackBackSprite });
    }
    catch(err){
        console.log(err);
    }
});

router.post('/changeAcc', async (req, res)=>{
    const currentName = req.body.currentName;
    const username = sanitize(req.body.username);
    const oldPass = sanitize(req.body.currentPassword);
    const newPassword = sanitize(req.body.newPassword);

    const comparePass = (rawPass, hash)=>{
        return bcryptJS.compareSync(rawPass, hash);
    }

    const hasWhiteSpace = (s)=> {
        return (/\s/).test(s);
    }

    const hasSpecialChar = (s)=>{
        return (/['"]/).test(s);
    }

     const hashPass = (password)=>{
        var salt = bcryptJS.genSaltSync(10);
        return bcryptJS.hashSync(password, salt);
    }

    try{
        const findUser = await accountModel.findOne({ username: currentName });

        if(findUser){
            if(comparePass(oldPass, findUser.password)){
                if(username.length <= 4){
                    res.status(200).json({ message: 'Username is too short!' });
                }

                else if(hasWhiteSpace(username)){
                    res.status(200).json({ message: 'Username should not have white space!' });
                }

                else if(hasSpecialChar(username)){
                    res.status(200).json({ message: 'Username should not have illegal Character' });
                }
                
                else if(newPassword.length <= 4){
                    res.status(200).json({ message: 'Password is too short!' });
                }

                else{
                    const updateAccount = await accountModel.findOneAndUpdate(
                        { username: currentName },
                        { $set: { username: username, password: hashPass(newPassword) } },
                        { new: true }
                    );

                    if(updateAccount){
                        res.status(200).json({ message: 'success', username: username });
                    }
                }
            }
            else{
                res.status(200).json({ message: 'Wrong password'});
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;