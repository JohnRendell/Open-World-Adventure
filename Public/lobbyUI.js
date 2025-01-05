function lobbyUI(scene, count){
    //player count Label
    scene.playerCountLabel = scene.add.text(20, 20, "Player Count: " + count, {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
    scene.playerCountLabel.setDepth(5);

    //global chat button
    scene.button_GlobalChatLabel = scene.add.text(0, 0, "Global Chat " + 99 + "+", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5);

    //scene.button_Background = scene.add.rectangle(0, 0, 150, 40, "0x0d6525", 10).setOrigin(0.5);
    scene.button_Background = scene.add.graphics();
    scene.button_Background.fillStyle(0x0d6525, 1);
    scene.button_Background.fillRoundedRect(-75, -20, 150, 40, 10);

    scene.button_GlobalChat = scene.add.container(canvasSize.width - 100, canvasSize.height - 40, [
        scene.button_Background,
        scene.button_GlobalChatLabel
    ]).setScrollFactor(0).setDepth(5).setSize(150, 40);

    scene.button_GlobalChat.setInteractive({ useHandCursor: true });
    scene.button_GlobalChat.on('pointerdown', () => {
        isTalking = true;
        isPanelOpen = true;
        modalStatus('globalChatModal', 'flex', 'modalAnimation');
    });
}