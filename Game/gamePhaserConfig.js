// Game configuration
const config = {
    type: Phaser.WEBGL,
    width: canvasSize.width,
    height: canvasSize.height,
    canvas: gameCanvas,
    backgroundColor: '#00BB1F',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [homeBase]
};

//webfont loader
WebFont.load({
    google: {
        families: ['Pixelify Sans']
    }
})

// Initialize the Phaser Game
const game = new Phaser.Game(config);