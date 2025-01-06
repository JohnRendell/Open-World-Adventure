const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const CryptoJS = require('crypto-js');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

router.post('/getCookie', (req, res)=>{
    try{
        let guaranteedAccess = req.body.guaranteedAccess;

        if(guaranteedAccess){
            let usernameCookie = req.signedCookies.username;
    
            if(usernameCookie){
                let decryptPlayerName = CryptoJS.AES.decrypt(usernameCookie, 'token').toString(CryptoJS.enc.Utf8);
                res.status(200).json({ message: 'success', decryptPlayerName: decryptPlayerName });
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

router.get('/deleteCookie', (req, res)=>{
    res.clearCookie('username');
    res.status(200).json({ message: 'cookies has been deleted'});
});

module.exports = router;