const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const CryptoJS = require('crypto-js');

require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

router.use(cookieParser(process.env.COOKIE_KEY));

router.post('/setCookie', (req, res)=>{
    try{
        let user = req.body.username;
        let type = req.body.userType;

        let encryptUsername = CryptoJS.AES.encrypt(user, 'token').toString();

        //add httpOnly: true later on
        let sessionData = JSON.stringify({
            username: encryptUsername,
            userType: type
        });

        res.cookie('session', sessionData, { signed: true, maxAge: 3600000, secure: true, path: '/' });
        res.status(200).json({ message: 'success', encryptUser: encryptUsername });
    }
    catch(err){
        console.log(err);
        res.status(200).json({ message: 'setting up cookie failed' });
    }
});

router.post('/getCookie', (req, res)=>{
    try{
        let guaranteedAccess = req.body.guaranteedAccess;

        if(guaranteedAccess){
            let userSession = req.signedCookies.session;
    
            if(userSession){
                const { username, userType } = JSON.parse(userSession);
                let playerToken = CryptoJS.AES.decrypt(username, 'token').toString(CryptoJS.enc.Utf8);

                if(playerToken){
                    res.status(200).json({ message: 'success', decryptPlayerName: playerToken, encryptPlayerName: username, userType: userType });
                }
            }
            else{
                res.status(200).json({ message: 'no cookie' });
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

router.get('/deleteCookie', (req, res)=>{
    res.clearCookie('session');
    res.status(200).json({ message: 'cookies has been deleted'});
});

module.exports = router;