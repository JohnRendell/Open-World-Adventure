var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var validateUser;
var loggedInURL;
var userType;
var userProfile;
var playerHealthPoints;
function countPlayer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield fetch('/gameData', {
                method: "GET",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
            });
            const countData = yield count.json();
            if (countData.message === 'success') {
                socket.emit('passCountData', countData.playerCount);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function getCookie() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getUserToken = yield fetch('/cookie/getCookie', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ guaranteedAccess: true })
            });
            const getUserToken_Data = yield getUserToken.json();
            if (getUserToken_Data.message === 'success') {
                loggedInURL = getUserToken_Data.encryptPlayerName;
                validateUser = getUserToken_Data.decryptPlayerName;
                userType = getUserToken_Data.userType;
                yield loadProfile();
            }
            else {
                alert('Cookie expired');
                window.location.href = '/lobby';
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function checkValidUrl() {
    function replaceUnderscoreWithSlash(inputString) {
        return inputString.replace(/_/g, '/');
    }
    if (userType === 'loggedIn') {
        let url = window.location.href;
        let splitUrl = url.split('/');
        let checkPlayerNameURL = splitUrl[5];
        try {
            let validatePlayerNameLoggedIn = CryptoJS.AES.decrypt(replaceUnderscoreWithSlash(checkPlayerNameURL), 'token').toString(CryptoJS.enc.Utf8);
            if (!validatePlayerNameLoggedIn) {
                window.location.href = '/Invalid_URL';
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
function loadProfile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const getPlayerProfile = yield fetch('/playerData/playerProfile', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ playerName: validateUser })
            });
            const getPlayerProfile_data = yield getPlayerProfile.json();
            if (getPlayerProfile_data.message === 'success') {
                //add player profile and sprites
                if (document.getElementById('playerProfileID') && document.getElementById('prevSprite0') && document.getElementById('prevSprite1') && document.getElementById('prevSprite2') && document.getElementById('prevSprite3') && document.getElementById('prevSprite4') && document.getElementById('prevSprite5') && document.getElementById('guestDiv') && document.getElementById('playerDiv')) {
                    const playerProfileIDElement = document.getElementById('playerProfileID');
                    playerProfileIDElement.src = getPlayerProfile_data.profile;
                    //walking
                    const prevSprite0Element = document.getElementById('prevSprite0');
                    const prevSprite1Element = document.getElementById('prevSprite1');
                    const prevSprite2Element = document.getElementById('prevSprite2');
                    const prevSprite3Element = document.getElementById('prevSprite3');
                    const prevSprite4Element = document.getElementById('prevSprite4');
                    const prevSprite5Element = document.getElementById('prevSprite5');
                    prevSprite0Element.src = getPlayerProfile_data.frontSprite; //front
                    prevSprite1Element.src = getPlayerProfile_data.backSprite; //back
                    prevSprite2Element.src = getPlayerProfile_data.sideSprite; //sides
                    //attacking
                    prevSprite3Element.src = getPlayerProfile_data.attackFrontSprite; //front
                    prevSprite4Element.src = getPlayerProfile_data.attackBackSprite; //back
                    prevSprite5Element.src = getPlayerProfile_data.attackSideSprite; //sides
                    document.getElementById('guestDiv').style.display = userType === 'guest' ? 'flex' : 'none';
                    document.getElementById('playerDiv').style.display = userType === 'guest' ? 'none' : 'flex';
                }
                userProfile = getPlayerProfile_data.profile;
                if (getPlayerProfile_data.playerHealthPoints <= 0) {
                    socket.emit('heal', getPlayerProfile_data.username);
                }
                playerHealthPoints = getPlayerProfile_data.playerHealthPoints;
                socket.emit('loadSprites', getPlayerProfile_data.frontSprite, getPlayerProfile_data.backSprite, getPlayerProfile_data.sideSprite, getPlayerProfile_data.attackSideSprite, getPlayerProfile_data.attackFrontSprite, getPlayerProfile_data.attackBackSprite);
                socket.emit('loadPlayerData', getPlayerProfile_data.username, getPlayerProfile_data.profile);
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
//to upload new profile
function changeProfile() {
    var profileFileID = document.getElementById('profileChangeID');
    profileFileID.addEventListener('change', (event) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        document.getElementById('validatingDiv').style.display = 'flex';
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        const formData = new FormData();
        if (!file) {
            console.error('No file selected');
            return;
        }
        formData.append('image', file);
        const uploadProfile = yield fetch('/changeProfile', {
            method: "POST",
            body: formData
        });
        const uploadProfile_data = yield uploadProfile.json();
        if (uploadProfile_data.message === 'success') {
            document.getElementById('validatingDiv').style.display = 'none';
            var profilePlayerID = document.getElementById('playerProfileID');
            profilePlayerID.src = uploadProfile_data.link;
            socket.emit('updateProfile', uploadProfile_data.link, uploadProfile_data.deleteHash, game_PlayerName);
        }
    }));
}
//upload skin
//TODO: investigate this, the query got fired two times
function changeSkin(id, imageID, query) {
    var uploadSpriteFile = document.getElementById(id);
    uploadSpriteFile.addEventListener('change', (event) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const image = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        const loadingDiv = document.getElementById('validatingDiv');
        loadingDiv.style.display = 'flex';
        if (!image) {
            return;
        }
        const formData = new FormData();
        formData.append('image', image);
        const uploadSprites = yield fetch('/changeSprite', {
            method: "POST",
            body: formData
        });
        const uploadSprites_data = yield uploadSprites.json();
        if (uploadSprites_data.message === 'success') {
            localStorage.setItem(imageID, uploadSprites_data.link);
            const imageDisplay = document.getElementById(imageID);
            imageDisplay.src = uploadSprites_data.link;
            loadingDiv.style.display = 'none';
            socket.emit('loadNewSprite', game_PlayerName, imageID, localStorage.getItem(imageID), query);
        }
    }));
}
//download piskel template
function piskelTemp() {
    const url = [
        { link: '/ImageComponents/Templates for players/Front Template.piskel', name: 'Front Template.piskel' },
        { link: '/ImageComponents/Templates for players/Back Template.piskel', name: 'Back Template.piskel' },
        { link: '/ImageComponents/Templates for players/Side Template.piskel', name: 'Side Template.piskel' },
        { link: '/ImageComponents/Templates for players/Back Attack punch.piskel', name: 'Back Attack punch.piskel' },
        { link: '/ImageComponents/Templates for players/Front Attack punch.piskel', name: 'Front Attack punch.piskel' },
        { link: '/ImageComponents/Templates for players/Side Attack punch.piskel', name: 'Side Attack punch.piskel' }
    ];
    for (let i = 0; i < url.length; i++) {
        let a = document.createElement('a');
        a.setAttribute('href', url[i]['link']);
        a.setAttribute('download', url[i]['name']);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
//going base outside
function goingOutside() {
    window.location.href = '/Game/BaseOutside/' + replaceSlashWithUnderscore(loggedInURL ? loggedInURL : validateUser);
}
//going back to base
function backToBase() {
    if (playerHealthPoints <= 0) {
        playerHealthPoints = 100;
        socket.emit('heal', game_PlayerName);
    }
    window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(loggedInURL ? loggedInURL : validateUser);
}
//opening account modal
function openAccountModal() {
    var loggedInMode = document.getElementById('accUpdateLoggedIn');
    var guestMode = document.getElementById('accUpdateGuest');
    loggedInMode.style.display = userType === 'guest' ? 'none' : 'flex';
    guestMode.style.display = userType === 'guest' ? 'flex' : 'none';
    const accountSettingVal = document.getElementById('accSetting_userID');
    accountSettingVal.value = validateUser;
}
//updating account
function updateAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        var warningTxt = document.getElementById('accSetting_warningTxt');
        var username = document.getElementById('accSetting_userID');
        var currentPassword = document.getElementById('accSetting_passID');
        var newPassword = document.getElementById('accSetting_newPassID');
        if (username && currentPassword && newPassword) {
            try {
                const changeAcc = yield fetch('/playerData/changeAcc', {
                    method: "POST",
                    headers: {
                        "Accept": "Application/json",
                        "Content-Type": "Application/json"
                    },
                    body: JSON.stringify({ currentName: game_PlayerName, username: username.value, currentPassword: currentPassword.value, newPassword: newPassword.value })
                });
                const changeAcc_data = yield changeAcc.json();
                if (changeAcc_data.message === 'success') {
                    const loadingDiv = document.getElementById('validatingDiv');
                    loadingDiv.style.display = 'flex';
                    const cookieStatus = yield setCookie(changeAcc_data.username, 'loggedIn');
                    if (cookieStatus.status) {
                        loadingDiv.style.display = 'none';
                        alert('Account Updated');
                        yield getCookie();
                        socket.emit('updateAcc', changeAcc_data.username);
                        const accUserID = document.getElementById('accSetting_userID');
                        const accPassID = document.getElementById('accSetting_passID');
                        const accNewPassID = document.getElementById('accSetting_newPassID');
                        accUserID.value = "";
                        accPassID.value = "";
                        accNewPassID.value = "";
                    }
                }
                else {
                    warningTxt.innerText = changeAcc_data.message;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            warningTxt.innerText = 'Fields cannot be empty';
        }
    });
}
//heal player
function healPlayer() {
    document.getElementById('validateDiv').style.display = 'flex';
    socket.emit('heal', game_PlayerName);
}
//logout
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        setOutWorld(true);
        socket.emit('gameOutside_playerDisconnect', game_PlayerName);
        socket.emit('game_playerDisconnect', game_PlayerName);
        window.location.href = '/lobby';
    });
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield getCookie(),
            yield countPlayer(),
            checkValidUrl();
    });
};
