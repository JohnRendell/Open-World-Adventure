const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');
const accountModel = require('./accountMongoose');
const bcryptJS = require('bcryptjs');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

router.post('/', async (req, res)=>{
    const username = sanitizeHtml(req.body.username);
    const password = sanitizeHtml(req.body.password);

    const comparePass = (rawPass, hash)=>{
        return bcryptJS.compareSync(rawPass, hash);
    }

    if(username && password){
        try{
            const loginAcc = await accountModel.findOne({ username: username });

            if(loginAcc){
                let checkPass = comparePass(password, loginAcc.password);

                if(checkPass){
                    res.status(200).json({ message: 'success', username: username });
                }
                else{
                    res.status(200).json({ message: 'Wrong Credentials' });
                }
            }
            else{
                res.status(200).json({ message: 'Wrong Credentials' });
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({ message: 'internal server error' });
        }
    }
    else{
        res.status(200).json({ message: 'Fields cannot be empty!' });
    }
});

module.exports = router;