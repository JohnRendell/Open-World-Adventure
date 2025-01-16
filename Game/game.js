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

    if(getUserToken_Data.message === 'success'){
        validateUser = getUserToken_Data.decryptPlayerName;
    }
    else{
        alert('Cookie expired');
        //window.location.href = '/lobby';
    }
}

function checkValidUrl(){
    function replaceUnderscoreWithSlash(inputString) {
        return inputString.replace(/_/g, '/');
    }

    let url = window.location.href;
    let splitUrl = url.split('/')
    let checkPlayerNameURL = splitUrl[5];

    //TODO: investigate this one
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

            //add player profile
            document.getElementById('playerProfileID').src = getPlayerProfile_data.profile;
            socket.emit('loadPlayerData', getPlayerProfile_data.username, getPlayerProfile_data.profile);
        }
    }
    catch(err){
        console.log(err);
    }
}

//to upload new profile
function changeProfile(){
    var profileFileID = document.getElementById('profileChangeID');

    profileFileID.addEventListener('change', async (event)=>{
        document.getElementById('validatingDiv').style.display = 'flex';

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        const uploadProfile = await fetch('/changeProfile', {
            method: "POST",
            body: formData
        });

        const uploadProfile_data = await uploadProfile.json();

        if(uploadProfile_data.message === 'success'){
            alert(file.name);
            document.getElementById('validatingDiv').style.display = 'none';
        }
    });
}

//download piskel template
function piskelTemp(){
    const url = [
        { link: '/ImageComponents/Templates for players/Front Template.piskel', name: 'Front Template.piskel' },
        { link: '/ImageComponents/Templates for players/Back Template.piskel', name: 'Back Template.piskel' },
        { link: '/ImageComponents/Templates for players/Side Template.piskel', name: 'Side Template.piskel'}
    ]

    for(let i = 0; i < url.length; i++){
        let a = document.createElement('a');
        a.setAttribute('href', url[i]['link']);
        a.setAttribute('download', url[i]['name']);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

window.onload = 
        checkCookie(),
        checkValidUrl(),
        setTimeout(()=>{
            loadProfile(validateUser)
        }, 2000);