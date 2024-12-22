const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressServer = require('http').createServer(app);
const socketServer = require('socket.io')(expressServer);

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

app.use(bodyParser.json());

//for socket connections
socketServer.on('connect', (socket)=>{
    console.log('connected to socket');
});
//require('./lobbySocket')(socketServer);

//routers
app.use('/lobby', require('./lobbyRouter'));
app.use('/promptNPC', require('./geminiAI'));
app.use('/login', require('./accountLoginValidation'));
app.use('/signin', require('./accountSigninValidation'));

//for 404 pages
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../404pages', 'index.html'));
});

const PORT = process.env.PORT;
expressServer.listen(PORT, ()=>{
    console.log('listening to port: ' + PORT);
})