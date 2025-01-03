function lobbyUI(scene, count){
    //player count Label
    scene.playerCountLabel = scene.add.text(20, 20, "Player Count: " + count, {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
    scene.playerCountLabel.setDepth(5);
}