//npcGreet('npcConversationDiv', 'Hi i am Bimbo, a seller of various weapons and other stuff.');

let validateUser;

async function checkCookie(){
    const getUserToken = await fetch('/cookie/getCookie', {
        method: "POST",
        headers: {
            "Accept": "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify({ guaranteedAccess: true })
    });

    const getUserToken_Data = await getUserToken.json();

    if(getUserToken_Data.message === 'no cookie'){
        alert('Cookie expired');
        //window.location.href = '/lobby';
    }
    else{
        validateUser = getUserToken_Data.decryptPlayerName;
    }
}

async function loadProfile(playerName){
    try{
        const getPlayerProfile = await fetch('/playerData/playerProfile', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ playerName: playerName })
        });

        const getPlayerProfile_data = await getPlayerProfile.json();

        if(getPlayerProfile_data.message === 'success'){
            socket.emit('loadPlayerData', getPlayerProfile_data.username, getPlayerProfile_data.profile);
        }
    }
    catch(err){
        console.log(err);
    }
}

window.onload = 
        checkCookie(), 
        setTimeout(()=>{
            loadProfile(validateUser)
        }, 1000);