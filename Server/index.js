const express = require('express');
const app = express();
const path = require('path');

//get the env keys
require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

//serve the static folders
app.use(express.static(path.join(__dirname, '../Public')));
app.use(express.static(path.join(__dirname, '../Assets')));
app.use(express.static(path.join(__dirname, '../404pages')));

//get the main html file
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../Public', 'index.html'));
});

//for 404 pages
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../404pages', 'index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log('listening to port: ' + PORT);
})