var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let isOpenLogin = false;
let isOpenSignin = false;
//for login account
function validateAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        var username = document.getElementById('login_userID');
        var password = document.getElementById('login_passID');
        var loginWarningText = document.getElementById('loginWarningTxt');
        try {
            const accountValidate = yield fetch('/login', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ username: username.value, password: password.value })
            });
            const accountValidate_data = yield accountValidate.json();
            if (accountValidate_data.message === 'success') {
                document.getElementById('processingDiv').style.display = 'flex';
                const cookieStatus = yield setCookie(accountValidate_data.username, 'loggedIn');
                let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);
                if (cookieStatus.status && decryptPlayerName) {
                    socket.emit('redirectToBase', decryptPlayerName);
                    socket.emit('playerCount', 1);
                    window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(cookieStatus.encryptUser);
                    localStorage.removeItem('tempPlayerName');
                }
            }
            else {
                loginWarningText.innerText = accountValidate_data.message;
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function validateCreateAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        var username = document.getElementById('signin_userID');
        var password = document.getElementById('signin_passID');
        var confirmPassword = document.getElementById('signin_confirmPassID');
        var signinWarningText = document.getElementById('signinWarningTxt');
        try {
            const accountCreateValidate = yield fetch('/signin', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ username: username.value, confirmPass: confirmPassword.value, password: password.value })
            });
            const accountCreateValidate_data = yield accountCreateValidate.json();
            if (accountCreateValidate_data.message === 'success') {
                document.getElementById('processingDiv').style.display = 'flex';
                const cookieStatus = yield setCookie(accountCreateValidate_data.username, 'loggedIn');
                let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);
                if (cookieStatus.status && decryptPlayerName) {
                    document.getElementById('processingDiv').style.display = 'none';
                    socket.emit('redirectToBase', decryptPlayerName);
                    socket.emit('playerCount', 1);
                    window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(cookieStatus.encryptUser);
                    localStorage.removeItem('tempPlayerName');
                }
            }
            else {
                signinWarningText.innerText = accountCreateValidate_data.message;
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
//for login
document.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        if (isOpenLogin) {
            validateAccount();
        }
        if (isOpenSignin) {
            validateCreateAccount();
        }
    }
});
socket.emit('logoutPlayer');
