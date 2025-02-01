import html2canvas from "html2canvas";

let currentTool: string = 'Draw';
let stillDraw: boolean = false;

//opening pixel drawing div
function openPixelDrawingDiv(){
    var drawingContainer = document.getElementById('pixelDrawingDiv') as HTMLElement;
    var outputContainer = document.getElementById('pixelContent') as HTMLElement;

    let id: number = 0;
        
    for(let i: number = 0; i < 20; i++){
        for(let j: number = 0; j < 20; j++){
            id++;
            let color: string = (i + j) % 2 === 0 ? 'bg-slate-700' : 'bg-slate-500';
            let pixelMaskColor: string = (i + j) % 2 === 0 ? '#334155' : '#64748b'
            
            var pixel = document.createElement('div');
            pixel.setAttribute('class', 'flex justify-center items-center w-full h-full ' + color);
            pixel.setAttribute('id', 'pixel-' + id);
            pixel.setAttribute('onclick', `paintPixel('pixel-${id}')`);
            pixel.setAttribute('onmouseover', `paintAlot('pixel-${id}')`);

            var pixelMask = document.createElement('input');
            pixelMask.setAttribute('value', pixelMaskColor);
            pixelMask.setAttribute('type', 'hidden');
            pixel.appendChild(pixelMask)

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
function pickTools(toolType: string){
    var pen = document.getElementById('penTool') as HTMLElement;
    var erase = document.getElementById('eraseTool') as HTMLElement;
    var picker = document.getElementById('pickerTool') as HTMLElement;

    switch(toolType){
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
function paintPixel(pixelID: string){
    var currentColorDiv = document.getElementById('colorPicker') as HTMLInputElement;
    var pixel = document.getElementById(pixelID) as HTMLElement;
    var output_pixel = document.getElementById('output_' + pixelID) as HTMLElement;

    if(currentTool === 'Draw'){
        pixel.style.backgroundColor = currentColorDiv.value;
        output_pixel.style.backgroundColor = currentColorDiv.value;
    }
    if(currentTool === 'Erase'){
        var pixelMask = pixel.children[0] as HTMLInputElement;
        pixel.style.backgroundColor = pixelMask.value;
        output_pixel.style.backgroundColor = 'transparent';
    }
    if(currentTool === 'Picker'){
        var currColor: string = pixel.style.backgroundColor;

        function componentToHex(c: number) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r:number, g:number, b:number) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        let rgbValues =  currColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
        let hexColor = rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);

        currentColorDiv.value = hexColor;
    }
}

function paintAlot(pixelID: string){
    if(stillDraw){
        paintPixel(pixelID);
    }
}

//save pixel draw
function savePixel() {
    var div = document.getElementById("pixelContent") as HTMLElement;

    // Temporarily remove background
    div.style.background = "none";

    html2canvas(div, { backgroundColor: null }).then((canvas) => {
        let imgURL = canvas.toDataURL("image/png"); // Transparent PNG
        let link = document.createElement("a");
        link.href = imgURL;
        link.download = "pixel-art.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Restore background
        div.style.background = "";
    });
}

//for detecting mouse status
document.addEventListener('mousedown', ()=>{
    stillDraw = true;
});

document.addEventListener('mouseup', ()=>{
    stillDraw = false;
});