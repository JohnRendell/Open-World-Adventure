let globalMessageCounter = 0;
let npcPromptInstruction;

socket.on('globalMessage', (containerID, receiver, msg)=>{
    globalMessageCounter++;
    var container = document.getElementById(containerID);

    if(container){
        var wrapperContainer = document.createElement('div');
        wrapperContainer.setAttribute('class', 'w-full h-fit flex justify-start');
        container.appendChild(wrapperContainer);

        var messageWrapper = document.createElement('div');
        messageWrapper.setAttribute('class', 'w-[10rem] h-fit p-4 rounded-lg bg-blue-500 m-2');
        wrapperContainer.appendChild(messageWrapper);

        var sender = document.createElement('p');
        sender.setAttribute('class', 'font-PixelifySans text-sm text-black text-left font-bold');
        sender.appendChild(document.createTextNode(receiver));
        messageWrapper.appendChild(sender);

        var textContent = document.createElement('p');
        textContent.setAttribute('class', 'font-PixelifySans text-sm text-black text-left text-wrap');
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