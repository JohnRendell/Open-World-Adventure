class lobbyScene extends Phaser{
    preload(){
        this.load.image('lobby', '/ImageComponents/Lobby/Lobby Hall.png');
    }

    create(){
        this.create.image(0, 0, 'lobby');
    }
}

const size = {
    width: 500,
    height: 500
}

const config = {
    type: Phaser.WEBGL,
    width: size.width,
    height: size.height,
    canvas: gameCanvas
}

const game = new Phaser(config);