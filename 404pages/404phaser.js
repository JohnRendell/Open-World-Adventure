async function prompt(textResponse) {
    try{
        let bobNotFOundTextSystemInstruct = 
                `
                You are NPC Bob, a cheerful robot whose sole purpose is to generate fun and quirky 404 error messages.
                
                Each message should be one to two sentences and must end with *Beep Boop*.

                Guidelines:
                    1. Generate, don't add any side comments.
                    2. Just one or two sentences only.

                Example 1:
                Oops! You seem to have wandered into uncharted territory. Please turn back *Beep Boop*.
                
                Example 2:
                This path leads to nowhere. Let's get back on track! *Beep Boop*.
                
                Example 3:
                You’ve discovered the void! Too bad there’s nothing here. Back to reality? *Beep Boop*.

                NOTE: Be creative and don't just stick on examples
                
                `;
         const prompt = await fetch('/promptNPC', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({ prompt: 'generate', instruction: bobNotFOundTextSystemInstruct })
        });

        const prompt_data = await prompt.json();

        if(prompt_data.message == 'success'){
            var i = 0;
            var txt = prompt_data.output;
            var speed = 30;
            var displayedText = "";

            function typeEffect() {
                if (i < txt.length) {
                    displayedText += txt.charAt(i);
                    textResponse.setText(displayedText);
                    i++;
                    setTimeout(typeEffect, speed);
                }
            }
            typeEffect();
        }
    }
    catch(err){
        console.log(err);
    }
}

class notFoundClass extends Phaser.Scene{
    preload(){
        this.load.spritesheet('Bob', '/ImageComponents/404 Images/404 Bob.png', {
            frameWidth: 9600 / 5,
            frameHeight: 1920 / 1
        });
    }

    create(){
        this.bob = this.physics.add.staticSprite(window.innerWidth / 2, window.innerHeight / 2, 'Bob').setOrigin(0.5).setDisplaySize(800, 900);

        this.anims.create({
            key: 'Bob anim',
            frames: this.anims.generateFrameNumbers('Bob', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        this.bob.play('Bob anim');

        this.promptText = this.add.text((window.innerWidth / 2) + 10, (window.innerHeight / 2) - 150, '...', {
            font: "16px 'Pixelify Sans'",
            fill: '#06402b',
            align: 'left',
            wordWrap: { width: 200, useAdvancedWrap: true }
        }).setOrigin(0.5);

        prompt(this.promptText);

        this.button = this.add.text((window.innerWidth / 2) + 14, (window.innerHeight / 2) - 70, 'Click this to go in lobby', {
            font: "16px 'Pixelify Sans'",
            fill: '#46ff00',
            align: 'center'
        }).setOrigin(0.5);

        this.button.setInteractive({ useHandCursor: true });
        this.button.on('pointerdown', ()=>{
            window.location.href = '/lobby';
        })

        let colors = ['#3cd402', '#46ff00'];
        let colorIndex = 0;

        setInterval(()=>{
           colorIndex = 1 - colorIndex;
            this.button.setColor(colors[colorIndex])
        }, 1000);
    }
}

// Game configuration
const config = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xffffff,
    canvas: gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [notFoundClass]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);