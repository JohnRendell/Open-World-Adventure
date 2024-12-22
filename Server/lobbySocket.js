module.exports = (server)=>{
    //for connection established
    server.on('connection', (socket)=>{
        console.log('Connected to the socketIO: ' + socket.id);
    });
}