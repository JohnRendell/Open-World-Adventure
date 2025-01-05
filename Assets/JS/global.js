function npcGreet(containerID, greetMsg){
    var container = document.getElementById(containerID);
    var wrapperContainer = document.createElement('div');
    wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
    container.appendChild(wrapperContainer);

    var messageWrapper = document.createElement('div');
    messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-blue-500 m-2');
    wrapperContainer.appendChild(messageWrapper);

    var textContent = document.createElement('p');
    textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left text-wrap');
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
        document.getElementById(modalID + '_panel').style.animation = `${animationName} 2s forwards`;
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

function messageSend(containerID, inputID, incrementID, max, isNPC){
    let decryptPlayerName = CryptoJS.AES.decrypt(localStorage.getItem('tempPlayerName'), 'tempPlayerName').toString(CryptoJS.enc.Utf8);
    
    var container = document.getElementById(containerID);
    var messageInput = document.getElementById(inputID);
    var incrementText = document.getElementById(incrementID);

    if(container && messageInput && incrementText && messageInput.value){
        var wrapperContainer = document.createElement('div');
        wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-end');
        container.appendChild(wrapperContainer);

        var messageWrapper = document.createElement('div');
        messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-blue-300 m-2');
        wrapperContainer.appendChild(messageWrapper);

        if(!isNPC){
            var sender = document.createElement('p');
            sender.setAttribute('class', 'font-PixelifySans text-sm text-black text-right font-bold');
            sender.appendChild(document.createTextNode(decryptPlayerName + '(You)'));
            messageWrapper.appendChild(sender);
        }

        var textContent = document.createElement('p');
        textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left text-wrap');
        textContent.appendChild(document.createTextNode(messageInput.value));
        messageWrapper.appendChild(textContent);

        if(isNPC){
            promptNPC(messageInput.value, container.id, npcPromptInstruction);
        }
        else{
            socket.emit('globalMessage', containerID, decryptPlayerName, messageInput.value);
        }

        document.getElementById(inputID).value = "";
        incrementText.innerText = 0 + '/' + max;

        container.scrollTo(0, container.scrollHeight);
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
            messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-blue-500 m-2');
            wrapperContainer.appendChild(messageWrapper);

            var textContent = document.createElement('p');
            textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left text-wrap');
            textContent.appendChild(document.createTextNode(result));
            messageWrapper.appendChild(textContent);

            container.scrollTo(0, container.scrollHeight);
        }

        if(prompt_data.message == 'success'){
            promptMessage(prompt_data.output);

            let loginOutput = prompt_data.output;

            if(loginOutput.substring(0, 5) === 'LOGIN'){
                modalStatus('rupertDialog', 'none', null);
                modalStatus('loginDiv', 'flex', 'modalAnimation');
            }

            if(loginOutput.substring(0, 5) === 'GUEST'){
                modalStatus('rupertDialog', 'none', null);
                modalStatus('guestDiv', 'flex', 'modalAnimation');
            }
        }
        else{
            var container = document.getElementById(containerID);
            var wrapperContainer = document.createElement('div');
            wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
            container.appendChild(wrapperContainer);

            var messageWrapper = document.createElement('div');
            messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-blue-500 m-2');
            wrapperContainer.appendChild(messageWrapper);

            var textContent = document.createElement('p');
            textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left text-wrap');
            textContent.appendChild(document.createTextNode('Let me catch my breath you dummy'));
            messageWrapper.appendChild(textContent);

            container.scrollTo(0, container.scrollHeight);
        }
    }
    catch(err){
        console.log(err);
    }
}