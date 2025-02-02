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

router.post('/setSkinToDefault', async (req, res)=>{
    try{
        const skinType = req.body.skinType;
        //const 

        switch(skinType){
            case "Front":
                const setDefault = await gameModel.findOneAndUpdate(
                    {},
                    { backgroundColor: ''}
                );

                if(setDefault){

                }
                else{

                }
                res.status(200).json({ message: 'success' });
            break;
        }
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;