function lobbyUI(scene){
    //player count Label
    scene.playerCountLabel = scene.add.text(20, 20, "Player Count: 0", {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
}