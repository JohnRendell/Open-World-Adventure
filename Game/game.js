npcGreet('npcConversationDiv', 'Hi i am Bimbo, a seller of various weapons and other stuff.');

let loggedIn_playerName;

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
        //alert('Cookie expired');
        //window.location.href = '/lobby';
    }
    else{
        loadProfile(getUserToken_Data.decryptPlayerName);
    }
}
window.onload = checkCookie()

async function loadProfile(playerName){
    try{
        const getPlayerProfile = await fetch('/playerData/playerProfile', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ username: playerName })
        });

        const getPlayerProfile_data = await getPlayerProfile.json();

        if(getPlayerProfile_data.message === 'success'){
            loadPlayerName = playerName;
            loadPlayerProfile = getPlayerProfile_data.profile;
        }
    }
    catch(err){
        console.log(err);
    }
}