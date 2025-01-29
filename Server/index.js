const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const expressServer = require('http').createServer(app);
const socketServer = require('socket.io')(expressServer);
const mongoose = require('mongoose');

//get the env keys
require('dotenv').config({ path: path.resolve(__dirname, '../keys.env') });

//connect to the mongoose database
const uri = process.env.URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  catch(err) {
    console.log(err);
  }
}
run().catch(console.dir);


//serve the static folders
app.use(express.static(path.join(__dirname, '../Public')));
app.use(express.static(path.join(__dirname, '../Assets')));
app.use(express.static(path.join(__dirname, '../404pages')));
app.use(express.static(path.join(__dirname, '../Game')));

//get the main html file
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '../Public', 'index.html'));
});

app.use(bodyParser.json());

//for socket connections
require('./lobbySocket')(socketServer);
require('./globalSocket')(socketServer);
require('./gameSocket')(socketServer);

//routers
app.use('/lobby', require('./lobbyRouter'));
app.use('/promptNPC', require('./geminiAI'));
app.use('/login', require('./accountLoginValidation'));
app.use('/signin', require('./accountSigninValidation'));
app.use('/changeProfile', require('./accountChangeProfile'));
app.use('/changeSprite', require('./accountChangeSprite'));

//for cookie
app.use('/cookie', require('./cookieStatus'));

//game routers
app.use('/game', require('./gameRouter'));
app.use('/playerData', require('./playerData'));
app.use('/gameData', require('./gameData'));

//for 404 pages
app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '../404pages', 'index.html'));
});

const PORT = process.env.PORT;
expressServer.listen(PORT, ()=>{
    console.log('listening to port: ' + PORT);
})