import { CryptoJS, replaceSlashWithUnderscore, setCookie, socket } from "./global";

let isOpenLogin: boolean = false;
let isOpenSignin: boolean = false;

//for login account
async function validateAccount(){
    var username = document.getElementById('login_userID') as HTMLInputElement;
    var password = document.getElementById('login_passID') as HTMLInputElement;
    var loginWarningText = document.getElementById('loginWarningTxt') as HTMLElement;

    try{
        const accountValidate: Response = await fetch('/login', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ username: username.value, password: password.value })
        });

        const accountValidate_data: { message: string, username: string } = await accountValidate.json();

        if(accountValidate_data.message === 'success'){
            document.getElementById('processingDiv')!.style.display = 'flex';

            const cookieStatus = await setCookie(accountValidate_data.username, 'loggedIn');

            let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            if(cookieStatus.status && decryptPlayerName){
                socket.emit('redirectToBase', decryptPlayerName);
                socket.emit('playerCount', 1);
                window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(cookieStatus.encryptUser);
                localStorage.removeItem('tempPlayerName');
            }
        }
        else{
            loginWarningText.innerText = accountValidate_data.message;
        }
    }
    catch(err){
        console.log(err);
    }
}

async function validateCreateAccount(){
    var username = document.getElementById('signin_userID') as HTMLInputElement;
    var password = document.getElementById('signin_passID') as HTMLInputElement;
    var confirmPassword = document.getElementById('signin_confirmPassID') as HTMLInputElement;
    var signinWarningText = document.getElementById('signinWarningTxt') as HTMLElement;

    try{
        const accountCreateValidate = await fetch('/signin', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ username: username.value, confirmPass: confirmPassword.value,  password: password.value })
        });

        const accountCreateValidate_data = await accountCreateValidate.json();

        if(accountCreateValidate_data.message === 'success'){
            document.getElementById('processingDiv')!.style.display = 'flex';

            const cookieStatus = await setCookie(accountCreateValidate_data.username, 'loggedIn');

            let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);

            if(cookieStatus.status && decryptPlayerName){
                document.getElementById('processingDiv')!.style.display = 'none';
                socket.emit('redirectToBase', decryptPlayerName);
                socket.emit('playerCount', 1);
                window.location.href = '/Game/Base/' + replaceSlashWithUnderscore(cookieStatus.encryptUser);

                localStorage.removeItem('tempPlayerName');
            }
        }
        else{
            signinWarningText.innerText = accountCreateValidate_data.message;
        }
    }
    catch(err){
        console.log(err);
    }
}

//for login
document.addEventListener("keypress", function(event) {
    if (event.key === 'Enter') {
        if(isOpenLogin){
            validateAccount();
        }
        if(isOpenSignin){
            validateCreateAccount();
        }
    }
});

socket.emit('logoutPlayer');