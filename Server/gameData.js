const gameModel = require('./gameDataMongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res)=>{
    try{
        const countPlayer = await gameModel.findOne({});
        res.status(200).json({ message: 'success', playerCount: countPlayer.playerCount });
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;