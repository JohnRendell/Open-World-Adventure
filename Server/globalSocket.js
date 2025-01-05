module.exports = (server)=>{
    server.on('connect', (socket)=>{
        socket.on('globalMessage', (containerID, sender, msg)=>{
            socket.broadcast.emit('globalMessage', containerID, sender, msg);
        });
    });
}