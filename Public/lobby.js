let type = 0;

function typeMessageNPC(){
    type++;
    document.getElementById('messageIncrementNPC').innerText = type + '/' + 20;
}

function modalStatus(modalID, status){
    document.getElementById(modalID).style.display = status;
    isTalking = false;
}