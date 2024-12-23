let playerCount = 0;

socket.on('connect', ()=>{
    function guestID(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }

    let playerName = 'Guest_' + guestID(5);
    if(!localStorage.getItem('tempPlayerName')){
        localStorage.setItem('tempPlayerName', playerName);
    }
    socket.emit('playerConnected', localStorage.getItem('tempPlayerName'));
    socket.emit('spawnPlayer', localStorage.getItem('tempPlayerName'));
});

socket.on('playerCount', (count)=>{
    playerCount = count;
});