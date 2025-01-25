var validateUser;
var loggedInURL;
var userType;
var userProfile;

async function getCookie(){
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
        loggedInURL = getUserToken_Data.encryptPlayerName;
        validateUser = getUserToken_Data.decryptPlayerName;
        userType = getUserToken_Data.userType;
    }
    else{
        alert('Cookie expired');
        window.location.href = '/lobby';
    }
}

function checkValidUrl(){
    function replaceUnderscoreWithSlash(inputString) {
        return inputString.replace(/_/g, '/');
    }

   if(userType === 'loggedIn'){
        let url = window.location.href;
        let splitUrl = url.split('/')
        let checkPlayerNameURL = splitUrl[5];

        try{
            let validatePlayerNameLoggedIn =  CryptoJS.AES.decrypt(replaceUnderscoreWithSlash(checkPlayerNameURL), 'token').toString(CryptoJS.enc.Utf8);

            if(!validatePlayerNameLoggedIn){
                window.location.href = '/Invalid_URL';
            }
        }
        catch(err){
            console.log(err);
        }
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

            //add player profile and sprites
            if(document.getElementById('playerProfileID') && document.getElementById('prevSprite0') && document.getElementById('prevSprite1') && document.getElementById('prevSprite2') && document.getElementById('prevSprite3') && document.getElementById('prevSprite4') && document.getElementById('prevSprite5') && document.getElementById('guestDiv') && document.getElementById('playerDiv')){
                document.getElementById('playerProfileID').src = getPlayerProfile_data.profile;

                //walking
                document.getElementById('prevSprite0').src = getPlayerProfile_data.frontSprite; //front
                document.getElementById('prevSprite1').src = getPlayerProfile_data.backSprite; //back
                document.getElementById('prevSprite2').src = getPlayerProfile_data.sideSprite; //sides

                //attacking
                document.getElementById('prevSprite3').src = getPlayerProfile_data.attackFrontSprite; //front
                document.getElementById('prevSprite4').src = getPlayerProfile_data.attackBackSprite; //back
                document.getElementById('prevSprite5').src = getPlayerProfile_data.attackSideSprite; //sides

                document.getElementById('guestDiv').style.display = userType === 'guest' ? 'flex' : 'none';
                document.getElementById('playerDiv').style.display = userType === 'guest' ? 'none' : 'flex';
            }
            userProfile = getPlayerProfile_data.profile;
            playerHealthPoints = getPlayerProfile_data.playerHealthPoints;

            socket.emit('loadSprites', getPlayerProfile_data.frontSprite, getPlayerProfile_data.backSprite, getPlayerProfile_data.sideSprite, getPlayerProfile_data.attackSideSprite, getPlayerProfile_data.attackFrontSprite, getPlayerProfile_data.attackBackSprite);

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
            document.getElementById('validatingDiv').style.display = 'none';
            document.getElementById('playerProfileID').src = uploadProfile_data.link;
            socket.emit('updateProfile', uploadProfile_data.link, uploadProfile_data.deleteHash, game_PlayerName);
        }
    });
}

//upload skin
//TODO: investigate this, the query got fired two times
function changeSkin(id, imageID, query){
    var uploadSpriteFile = document.getElementById(id);

    uploadSpriteFile.addEventListener('change', async (event)=>{
        const image = event.target.files[0];

        document.getElementById('validatingDiv').style.display = 'flex';
        const formData = new FormData();
        formData.append('image', image);

        const uploadSprites = await fetch('/changeSprite', {
            method: "POST",
            body: formData
        });

        const uploadSprites_data = await uploadSprites.json();

        if(uploadSprites_data.message === 'success'){
            localStorage.setItem(imageID, uploadSprites_data.link);
            document.getElementById(imageID).src = uploadSprites_data.link;

            document.getElementById('validatingDiv').style.display = 'none';
            socket.emit('loadNewSprite', game_PlayerName, imageID, localStorage.getItem(imageID), query);
        }
    });
}

//download piskel template
function piskelTemp(){
    const url = [
        { link: '/ImageComponents/Templates for players/Front Template.piskel', name: 'Front Template.piskel' },
        { link: '/ImageComponents/Templates for players/Back Template.piskel', name: 'Back Template.piskel' },
        { link: '/ImageComponents/Templates for players/Side Template.piskel', name: 'Side Template.piskel'},
        { link: '/ImageComponents/Templates for players/Back Attack punch.piskel', name: 'Back Attack punch.piskel'},
        { link: '/ImageComponents/Templates for players/Front Attack punch.piskel', name: 'Front Attack punch.piskel'},
        { link: '/ImageComponents/Templates for players/Side Attack punch.piskel', name: 'Side Attack punch.piskel'}
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

//going base outside
function goingOutside(){
    window.location.href = '/Game/BaseOutside/' + replaceSlashWithUnderscore(loggedInURL ? loggedInURL : validateUser);
}

//going back to base
function backToBase(){
    window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(loggedInURL ? loggedInURL : validateUser);
}

//opening account modal
function openAccountModal(){
    var loggedInMode = document.getElementById('accUpdateLoggedIn');
    var guestMode = document.getElementById('accUpdateGuest');

    loggedInMode.style.display = userType === 'guest' ? 'none' : 'flex';
    guestMode.style.display = userType === 'guest' ? 'flex' : 'none';

    document.getElementById('accSetting_userID').value = validateUser;
}

//updating account
async function updateAccount() {
    var warningTxt = document.getElementById('accSetting_warningTxt');
    var username = document.getElementById('accSetting_userID').value;
    var currentPassword = document.getElementById('accSetting_passID').value;
    var newPassword = document.getElementById('accSetting_newPassID').value;

    if(username && currentPassword && newPassword){
        try{
            const changeAcc = await fetch('/playerData/changeAcc', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ currentName: game_PlayerName, username: username, currentPassword: currentPassword, newPassword: newPassword })
            });

            const changeAcc_data = await changeAcc.json();

            if(changeAcc_data.message === 'success'){
                document.getElementById('validatingDiv').style.display = 'flex';
                const cookieStatus = await setCookie(changeAcc_data.username, 'loggedIn');

                if(cookieStatus.status){
                    document.getElementById('validatingDiv').style.display = 'none';
                    alert('Account Updated');

                    await getCookie();
                    socket.emit('updateAcc', changeAcc_data.username);

                    document.getElementById('accSetting_userID').value = "";
                    document.getElementById('accSetting_passID').value = "";
                    document.getElementById('accSetting_newPassID').value = "";
                }
            }
            else{
                warningTxt.innerText = changeAcc_data.message;
            }
        }
        catch(err){
            console.log(err);
        }
    }
    else{
        warningTxt.innerText = 'Fields cannot be empty';
    }
}

//logout
function logout(){
    socket.emit('gameOutside_playerDisconnect');
    socket.emit('redirectToBase', game_PlayerName);
    window.location.href = '/lobby';
}

window.onload = async function(){
    await getCookie(),
    checkValidUrl(),
    loadProfile(validateUser);
}
        