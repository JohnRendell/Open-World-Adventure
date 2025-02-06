const express = require('express');
const router = express.Router();
const path = require('path')

router.get('/Base/:username', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '../Game/Base', 'base.html'));
});

router.get('/BaseOutside/:username', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '../Game/Base', 'baseOutside.html'));
});

router.get('/Playground/:username', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, '../Game/Playground', 'playground.html'));
});

module.exports = router;