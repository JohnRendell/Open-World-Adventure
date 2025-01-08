const express = require('express');
const sanitize = require('sanitize-html');
const router = express.Router();
const accountModel = require('./accountMongoose');

router.post('/playerProfile', async (req, res)=>{
    try{
        let playerName = sanitize(req.body.playerName);
        let findUser = await accountModel.findOne({ username: playerName });

        if(findUser){
            res.status(200).json({ message: 'success', profile: findUser.profile });
        }
        else{
            res.status(200).json({ message: 'failed' });
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;