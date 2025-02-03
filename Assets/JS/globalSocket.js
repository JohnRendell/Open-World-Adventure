let globalMessageCounter = 0;
let npcPromptInstruction;

socket.on('globalMessage', (containerID, receiver, userProfile, msg)=>{
    globalMessageCounter++;
    var container = document.getElementById(containerID);

    if(container){
        if(document.getElementById(receiver + '_tempMessage')){
            document.getElementById(receiver + '_tempMessage').remove();
        }
        var wrapperContainer = document.createElement('div');
        wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
        container.appendChild(wrapperContainer);

        var messageWrapper = document.createElement('div');
        messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-2 rounded-lg bg-white m-2');
        wrapperContainer.appendChild(messageWrapper);

        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'flex items-center flex-row gap-2');
        messageWrapper.appendChild(wrapper);

        var profile = document.createElement('img');
        profile.setAttribute('class', 'rounded-full w-[2rem] h-[2rem]');
        profile.setAttribute('src', userProfile);
        profile.setAttribute('alt', receiver + ' Profile');
        wrapper.appendChild(profile);

        var sender = document.createElement('p');
        sender.setAttribute('class', 'font-PixelifySans text-sm text-black text-left font-bold');
        sender.appendChild(document.createTextNode(receiver));
        wrapper.appendChild(sender);

        var textContent = document.createElement('p');
        textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left');
        textContent.appendChild(document.createTextNode(msg));
        messageWrapper.appendChild(textContent);

        container.scrollTo(0, container.scrollHeight);

        socket.emit('incrementGlobalMessage', globalMessageCounter);
    }
});

//passing the prompt
socket.on('NPCPrompt', (prompt)=>{
    npcPromptInstruction = prompt;
});

//while user is typing
socket.on('userTyping', (user)=>{
    whileTyping('globalContainerDiv', user + '_tempMessage');
});