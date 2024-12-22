//for login account
async function validateAccount(){
    var username = document.getElementById('login_userID');
    var password = document.getElementById('login_passID');
    var loginWarningText = document.getElementById('loginWarningTxt');

    try{
        const accountValidate = await fetch('/login', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ username: username.value, password: password.value })
        });

        const accountValidate_data = await accountValidate.json();

        if(accountValidate_data.message == 'success'){
            loginWarningText.innerText = accountValidate_data.message;
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
    var username = document.getElementById('signin_userID');
    var password = document.getElementById('signin_passID');
    var confirmPassword = document.getElementById('signin_confirmPassID');
    var signinWarningText = document.getElementById('signinWarningTxt');

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

        if(accountCreateValidate_data.message == 'success'){
            signinWarningText.innerText = accountCreateValidate_data.message;
        }
        else{
            signinWarningText.innerText = accountCreateValidate_data.message;
        }
    }
    catch(err){
        console.log(err);
    }
}

npcGreet('npcConversationDiv', 'Hi i am Rupert, are you going to login or play as guest? If you have any question you can ask anything.');