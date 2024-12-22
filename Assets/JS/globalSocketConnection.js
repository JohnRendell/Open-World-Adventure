const socket = io();

socket.on('connect', ()=>{
    alert('Client connected');
})