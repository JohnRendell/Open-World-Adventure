const gameUI = new Phaser.Scene("Game UI");
gameUI.create = function(){
    //player count Label
    this.playerCountLabel = this.add.text(20, 20, "Player Count: 0", {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
}