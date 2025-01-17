// Game configuration
const config = {
    type: Phaser.CANVAS,
    width: canvasSize.width,
    height: canvasSize.height,
    canvas: gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [gameLobby]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);