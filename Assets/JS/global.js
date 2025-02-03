function replaceSlashWithUnderscore(inputString) {
    return inputString.replace(/\//g, '_');
}

function whileTyping(containerID, tempID){
    if(document.getElementById(tempID) === null){
        var container = document.getElementById(containerID);
        var wrapperContainer = document.createElement('div');
        wrapperContainer.setAttribute('id', tempID);
        wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
        container.appendChild(wrapperContainer);

        var messageWrapper = document.createElement('div');
        messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-white m-2');
        wrapperContainer.appendChild(messageWrapper);

        var loadingWrapper = document.createElement('div');
        loadingWrapper.setAttribute('class', 'typing-indicator');

        for(let i = 0; i < 3; i++){
            var span = document.createElement('span');
            loadingWrapper.appendChild(span);
        }
        messageWrapper.appendChild(loadingWrapper);
    }
}

function whileWaitingForMessage(){
    socket.emit('userTyping', loggedIn_playerName);
}

function npcGreet(containerID, greetMsg){
    var container = document.getElementById(containerID);
    var wrapperContainer = document.createElement('div');
    wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
    container.appendChild(wrapperContainer);

    var messageWrapper = document.createElement('div');
    messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-2 rounded-lg bg-white m-2');
    wrapperContainer.appendChild(messageWrapper);

    var textContent = document.createElement('p');
    textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left');
    textContent.appendChild(document.createTextNode(greetMsg));
    messageWrapper.appendChild(textContent);

    container.scrollTo(0, container.scrollHeight);
}

function typeMessage(incrementID, inputID, max){
    var input = document.getElementById(inputID);

    const valueCount = input.value.length;
    document.getElementById(incrementID).innerText = valueCount + '/' + max;
}

function modalStatus(modalID, status, animationName){
    document.getElementById(modalID).style.display = status;

    if(animationName){
        document.getElementById(modalID + '_panel').style.animation = `${animationName} 1s forwards`;
    }
}

function showPass(inputPassID, checkBoxID){
    var checkBox = document.getElementById(checkBoxID);
    var password = document.getElementById(inputPassID);

    if(checkBox.checked){
        password.type = "text";
    }
    else{
        password.type = "password";
    }
}

function playGame(containerID){
    isTalking = false;
    isPanelOpen = false;

   if(containerID){
        const container = document.getElementById(containerID);

        while (container.hasChildNodes()) {
            container.removeChild(container.firstChild);
        }
   }
}

function resetGlobalMessageCounter(){
    globalMessageCounter = 0;
    socket.emit('clearGlobalMessageCounter');
}

function messageSend(containerID, inputID, incrementID, max, isNPC){    
   try{
        var container = document.getElementById(containerID);
        var messageInput = document.getElementById(inputID);
        var incrementText = document.getElementById(incrementID);

        if(container && messageInput && incrementText && messageInput.value){
            var wrapperContainer = document.createElement('div');
            wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-end');
            container.appendChild(wrapperContainer);

            var messageWrapper = document.createElement('div');
            messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-2 rounded-lg bg-slate-300 m-2');
            wrapperContainer.appendChild(messageWrapper);

            if(!isNPC){
                var wrapper = document.createElement('div');
                wrapper.setAttribute('class', 'flex items-center flex-row gap-2');
                messageWrapper.appendChild(wrapper);

                var profile = document.createElement('img');
                profile.setAttribute('class', 'rounded-full w-[2rem] h-[2rem]');
                profile.setAttribute('src', userProfile);
                profile.setAttribute('alt', loggedIn_playerName + ' Profile');
                wrapper.appendChild(profile);

                var sender = document.createElement('p');
                sender.setAttribute('class', 'font-PixelifySans text-sm text-black text-left font-bold');
                sender.appendChild(document.createTextNode(loggedIn_playerName));
                wrapper.appendChild(sender);
                
                socket.emit('globalMessage', containerID, loggedIn_playerName, userProfile, messageInput.value);
            }

            var textContent = document.createElement('p');
            textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left');
            textContent.appendChild(document.createTextNode(messageInput.value));
            messageWrapper.appendChild(textContent);

            if(isNPC){
                whileTyping(containerID, 'tempMessage');
                promptNPC(messageInput.value, container.id, npcPromptInstruction);
            }

            document.getElementById(inputID).value = "";
            incrementText.innerText = 0 + '/' + max;

            container.scrollTo(0, container.scrollHeight);
        }
   } catch(err){
        console.log(err);
   }
}

function replaceTitle(titleID, replacement){
    document.getElementById(titleID).innerText = replacement;
}

function togglePanel(panelAID, panelBID){
    document.getElementById(panelAID).style.display = 'flex';
    document.getElementById(panelBID).style.display = 'none';
}

//prompt for NPC (Gemini AI)
async function promptNPC(promptMsg, containerID, systemInstruction){
    try{
        const prompt = await fetch('/promptNPC', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ prompt: promptMsg, instruction: systemInstruction })
        });

        const prompt_data = await prompt.json();

        const promptMessage = (result)=>{
            var container = document.getElementById(containerID);
            var wrapperContainer = document.createElement('div');
            wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
            container.appendChild(wrapperContainer);

            var messageWrapper = document.createElement('div');
            messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-white m-2');
            wrapperContainer.appendChild(messageWrapper);

            var textContent = document.createElement('p');
            textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left');
            textContent.appendChild(document.createTextNode(result));
            messageWrapper.appendChild(textContent);

            container.scrollTo(0, container.scrollHeight);
        }

        if(prompt_data.message == 'success'){
            document.getElementById('tempMessage').remove();
            promptMessage(prompt_data.output);
        }
    }
    catch(err){
        console.log(err);
    }
}

//setting cookie
async function setCookie(value, userType){
    try{
        const setCookie = await fetch('/cookie/setCookie', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ username: value, userType: userType })
        });

        const setCookie_data = await setCookie.json();

        return { status: setCookie_data.message === 'success' ? true : false, encryptUser: setCookie_data.message === 'success' ? setCookie_data.encryptUser : null };
    }
    catch(err){
        console.log(err);
    }
}