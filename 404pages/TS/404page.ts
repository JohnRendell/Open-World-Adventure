import { socket, npcPromptInstruction } from './global';

socket.emit('NPCPrompt', 'bob404');

var outputElement = document.getElementById('outputText') as HTMLElement;

async function finishedOutput(word: string){
    let colors = ['#3cd402', '#46ff00'];
    let colorIndex: number = 0;

    var cursor = document.createElement('span') as HTMLSpanElement;
    cursor.setAttribute('id', 'cursorID');
    cursor.appendChild(document.createTextNode("▮"));
    
    setInterval(()=>{
        colorIndex = 1 - colorIndex;

        const span =  document.getElementById('cursorID') as HTMLSpanElement;
        span.style.color = colors[colorIndex];
    }, 500);

    outputElement.innerText = word;
    outputElement.appendChild(cursor);
}

async function prompt() {
    try{
         const prompt = await fetch('/promptNPC', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ prompt: 'generate', instruction: npcPromptInstruction })
        });

        const prompt_data = await prompt.json() as { message: string, output: string };

        if(prompt_data.message == 'success'){
            var txt: string = prompt_data.output;
            var i: number = 0;
            var speed: number = 20;
            var displayedText: string = "";

            function typeEffect(){
                if (i < txt.length) {
                    displayedText += txt.charAt(i);
                    
                    outputElement.innerText = displayedText + "▮";
                    i++;
                    setTimeout(typeEffect, speed);
                }
                else{
                    finishedOutput(txt);
                }
            }
            typeEffect();
        }
    }
    catch(err){
        console.log(err);
    }
}

async function fireFunction(){
    await prompt();
}
setTimeout(fireFunction, 500);

function goToLobby(){
    window.location.href = "/lobby";
}

let colors = ['#3cd402', '#46ff00'];
let colorIndex: number = 0;

setInterval(()=>{
    colorIndex = 1 - colorIndex;

    const button =  document.getElementById('lobbyBtn') as HTMLButtonElement;
    button.style.color = colors[colorIndex];
}, 1000);