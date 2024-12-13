//for lobby canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

function draw(){
    const lobby = new Image();
    lobby.src = '/ImageComponents/Lobby/Lobby Hall.png';

    lobby.onload = function () {
        context.drawImage(lobby, 0, 0, 1000, 1000);
    };
}

window.onload = function(){
    draw();
}
