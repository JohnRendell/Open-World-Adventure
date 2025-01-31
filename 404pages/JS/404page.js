var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

socket.emit('NPCPrompt', 'bob404');
var outputElement = document.getElementById('outputText');
function finishedOutput(word) {
    return __awaiter(this, void 0, void 0, function* () {
        let colors = ['#3cd402', '#46ff00'];
        let colorIndex = 0;
        var cursor = document.createElement('span');
        cursor.setAttribute('id', 'cursorID');
        cursor.appendChild(document.createTextNode("▮"));
        setInterval(() => {
            colorIndex = 1 - colorIndex;
            const span = document.getElementById('cursorID');
            span.style.color = colors[colorIndex];
        }, 500);
        outputElement.innerText = word;
        outputElement.appendChild(cursor);
    });
}
function prompt() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prompt = yield fetch('/promptNPC', {
                method: "POST",
                headers: {
                    "Accept": "Application/json",
                    "Content-Type": "Application/json"
                },
                body: JSON.stringify({ prompt: 'generate', instruction: npcPromptInstruction })
            });
            const prompt_data = yield prompt.json();
            if (prompt_data.message == 'success') {
                var txt = prompt_data.output;
                var i = 0;
                var speed = 20;
                var displayedText = "";
                function typeEffect() {
                    if (i < txt.length) {
                        displayedText += txt.charAt(i);
                        outputElement.innerText = displayedText + "▮";
                        i++;
                        setTimeout(typeEffect, speed);
                    }
                    else {
                        finishedOutput(txt);
                    }
                }
                typeEffect();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
function fireFunction() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prompt();
    });
}
setTimeout(fireFunction, 500);
function goToLobby() {
    window.location.href = "/lobby";
}
let colors = ['#3cd402', '#46ff00'];
let colorIndex = 0;
setInterval(() => {
    colorIndex = 1 - colorIndex;
    const button = document.getElementById('lobbyBtn');
    button.style.color = colors[colorIndex];
}, 1000);
