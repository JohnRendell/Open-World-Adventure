//for lobby canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

let playerX = window.innerWidth / 2;
let playerY = window.innerHeight / 2;

//offscreen canvas
const offscreenCanvas = document.createElement('canvas');
const offscreenContext = offscreenCanvas.getContext('2d');

// Offscreen canvas size
offscreenCanvas.width = window.innerWidth;
offscreenCanvas.height = window.innerHeight - 5;

//for offscreen only
function drawLobbyOffScreen(){
    const lobby = new Image();
    lobby.src = '/ImageComponents/Lobby/Lobby Hall.png';

    lobby.onload = function () {
        offscreenContext.drawImage(lobby, -300, -400, 1500, 1500);
        drawPlayer(playerX, playerY);
    };
}

function drawLobby(){
    const lobby = new Image();
    lobby.src = '/ImageComponents/Lobby/Lobby Hall.png';

    lobby.onload = function () {
        context.drawImage(lobby, -300, -400, 1500, 1500);
        drawPlayer(playerX, playerY);
    };
}

function drawPlayer(x, y){
    context.fillStyle = 'green';
    context.fillRect(x, y, 50, 50);
}

//player control
function playerMovement(){
    window.addEventListener('keydown', event=>{
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawLobbyOffScreen();

        //moving right
        if(event.code === 'KeyA' || event.code === 'ArrowRight'){
            playerX -= 10;
        }

        //moving left
        if(event.code === 'KeyD' || event.code === 'ArrowLeft'){
            playerX += 10;
        }

        //moving up
        if(event.code === 'KeyW' || event.code === 'ArrowUp'){
            playerY -= 10;
        }

        //moving down
        if(event.code === 'KeyS' || event.code === 'ArrowDown'){
            playerY += 10;
        }

        drawLobby(context);
        drawPlayer(context, playerX, playerY);
    });
}
playerMovement();

window.onload = function(){
    //clear rect every load
    context.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 5;

    drawLobby();
    drawPlayer(playerX, playerY);

    drawLobbyOffScreen();
}