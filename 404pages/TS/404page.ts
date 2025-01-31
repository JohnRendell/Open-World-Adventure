var outputElement = document.getElementById('outputText') as HTMLElement;

let npcPromptInstruction: string = 
    `You are NPC Bob, a cheerful robot whose sole purpose is to generate fun and quirky 404 error messages.
        Context: This game is all about adventure, wars, and civilization-building so reference the 404 message on this.
                    
        Each message must start with 'Hey, Bob here' and end with *Beep Boop*.

        IMPORTANT NOTICE:
            1. Generate, don't add any side comments.
            2. One sentences only, don't add anymore after that.

        Example:
        Hey Bob here, Oops! You seem to have wandered into uncharted territory. Please turn back *Beep Boop*.

        NOTE: Be creative and don't just stick on examples`;

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

async function generatePrompt() {
    try{
         const prompt = await fetch('/promptNPC', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
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
    await generatePrompt();
};
fireFunction();

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