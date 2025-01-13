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

function checkValidUrl(){
    function replaceUnderscoreWithSlash(inputString) {
        return inputString.replace(/_/g, '/');
    }

    let url = window.location.href;
    let splitUrl = url.split('/')
    let checkPlayerNameURL = splitUrl[5];

    try{
        let validatePlayerNameGuest =  CryptoJS.AES.decrypt(replaceUnderscoreWithSlash(checkPlayerNameURL), 'tempPlayerName').toString(CryptoJS.enc.Utf8);

        let validatePlayerNameLoggedIn =  CryptoJS.AES.decrypt(replaceUnderscoreWithSlash(checkPlayerNameURL), 'token').toString(CryptoJS.enc.Utf8);

        if(!validatePlayerNameLoggedIn && !validatePlayerNameGuest){
            window.location.href = '/Invalid_URL';
        }
    }
    catch(err){
        console.log(err);
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
            playerName = getPlayerProfile_data.username;
            socket.emit('loadPlayerData', getPlayerProfile_data.username, getPlayerProfile_data.profile);
        }
    }
    catch(err){
        console.log(err);
    }
}

window.onload = 
        checkCookie(),
        checkValidUrl(),
        setTimeout(()=>{
            loadProfile(validateUser)
        }, 1000);