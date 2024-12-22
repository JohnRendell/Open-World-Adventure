const players = [];

module.exports = (server)=>{
    //for connection established
    server.on('connection', (socket)=>{
        console.log('Connected to the socketIO: ' + socket.id);
        
        if(!players.includes(socket.id)){
            players.push(socket.id);
        }
        console.table(players);
        socket.broadcast.emit('spawnPlayer');
    });
}