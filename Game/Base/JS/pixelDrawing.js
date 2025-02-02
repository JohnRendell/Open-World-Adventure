var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

let currentTool = 'Draw';
let stillDraw = false;
let spriteFileName = 'Sprite Character';
//opening pixel drawing div
function openPixelDrawingDiv() {
    var drawingContainer = document.getElementById('pixelDrawingDiv');
    var outputContainer = document.getElementById('pixelContent');
    let id = 0;
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            id++;
            let color = (i + j) % 2 === 0 ? 'bg-slate-700' : 'bg-slate-500';
            let pixelMaskColor = (i + j) % 2 === 0 ? '#334155' : '#64748b';
            var pixel = document.createElement('div');
            pixel.setAttribute('class', 'flex justify-center items-center w-full h-full ' + color);
            pixel.setAttribute('id', 'pixel-' + id);
            pixel.setAttribute('onclick', `paintPixel('pixel-${id}')`);
            pixel.setAttribute('onmouseover', `paintAlot('pixel-${id}')`);
            var pixelMask = document.createElement('input');
            pixelMask.setAttribute('value', pixelMaskColor);
            pixelMask.setAttribute('type', 'hidden');
            pixel.appendChild(pixelMask);
            drawingContainer.appendChild(pixel);
            //for output
            var pixel_output = document.createElement('div');
            pixel_output.setAttribute('class', 'flex justify-center items-center w-full h-full bg-transparent');
            pixel_output.setAttribute('id', 'output_pixel-' + id);
            outputContainer.appendChild(pixel_output);
        }
    }
}
openPixelDrawingDiv();
//choosing tools
function pickTools(toolType) {
    var pen = document.getElementById('penTool');
    var erase = document.getElementById('eraseTool');
    var picker = document.getElementById('pickerTool');
    switch (toolType) {
        case "Draw":
            pen.style.borderColor = '#1d4ed8';
            erase.style.borderColor = 'transparent';
            picker.style.borderColor = 'transparent';
            break;
        case "Erase":
            erase.style.borderColor = '#1d4ed8';
            pen.style.borderColor = 'transparent';
            picker.style.borderColor = 'transparent';
            break;
        case "Picker":
            picker.style.borderColor = '#1d4ed8';
            pen.style.borderColor = 'transparent';
            erase.style.borderColor = 'transparent';
            break;
    }
    currentTool = toolType;
}
//painting pixel
function paintPixel(pixelID) {
    var _a;
    var currentColorDiv = document.getElementById('colorPicker');
    var pixel = document.getElementById(pixelID);
    var output_pixel = document.getElementById('output_' + pixelID);
    if (currentTool === 'Draw') {
        pixel.style.backgroundColor = currentColorDiv.value;
        output_pixel.style.backgroundColor = currentColorDiv.value;
    }
    if (currentTool === 'Erase') {
        var pixelMask = pixel.children[0];
        pixel.style.backgroundColor = pixelMask.value;
        output_pixel.style.backgroundColor = 'transparent';
    }
    if (currentTool === 'Picker') {
        var currColor = pixel.style.backgroundColor;
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }
        let rgbValues = ((_a = currColor.match(/\d+/g)) === null || _a === void 0 ? void 0 : _a.map(Number)) || [0, 0, 0];
        let hexColor = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
        currentColorDiv.value = hexColor;
    }
}
function paintAlot(pixelID) {
    if (stillDraw) {
        paintPixel(pixelID);
    }
}
//save pixel draw
function savePixel() {
    var div = document.getElementById("pixelContent");
    // Temporarily remove background
    div.style.background = "none";
    html2canvas(div, { backgroundColor: null }).then((canvas) => {
        let resizedCanvas = document.createElement('canvas');
        let ctx = resizedCanvas.getContext("2d");
        resizedCanvas.width = 1600; //800
        resizedCanvas.height = 800; //400
        ctx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
        let imgURL = resizedCanvas.toDataURL("image/png"); // Transparent PNG
        let link = document.createElement("a");
        link.href = imgURL;
        link.download = `${spriteFileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Restore background
        div.style.background = "";
    });
}
//for detecting mouse status
document.addEventListener('mousedown', () => {
    stillDraw = true;
});
document.addEventListener('mouseup', () => {
    stillDraw = false;
});
//TODO: continue this one
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        var pixelDrawingDiv = document.getElementById('pixelDrawingDiv');
        var childColor = [];
        Array.from(pixelDrawingDiv.childNodes).forEach(child => {
            var pixelBackground = child;
            //childColor.push(pixelBackground.style.backgroundColor);
            console.log(pixelBackground.style.backgroundColor);
        });
        /*
        try{
            const setSkinToDefault = await fetch('/gameData/setSkinToDefault', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ skinType: "Front" })
            });
    
            const setSkinToDefault_data = await setSkinToDefault.json() as { message: string }
    
            if(setSkinToDefault_data.message === 'success'){
                alert('done');
            }
        }
        catch(err){
            console.log(err);
        }*/
    });
}
