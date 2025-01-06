function lobbyUI(scene){
    //player count Label
    scene.playerCountLabel = scene.add.text(20, 20, "Player Count:", {
        font: "16px 'Pixelify Sans",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
    scene.playerCountLabel.setDepth(5);

    socket.on('playerCount', (count)=>{
        scene.playerCountLabel.setText('Player Count: ' + count);
    });

    //global chat button
    scene.button_GlobalChatLabel = scene.add.text(0, 0, "Global Chat", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5);

    //global badge increment
    scene.button_GlobalBadgeNotify = scene.add.text(0,0, "0", {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center',
    }).setOrigin(0.5);

    //badge circle
    scene.badgeBackground = scene.add.circle(0, 0, 13, 0xD70040).setOrigin(0.5);

    //badge wrapper
    scene.button_GlobalBadge = scene.add.container(70, 0, [
        scene.badgeBackground,
        scene.button_GlobalBadgeNotify
    ]).setSize(40,40).setVisible(false);
    
    //background for button
    scene.button_Background = scene.add.graphics();
    scene.button_Background.fillStyle(0x0d6525, 1);
    scene.button_Background.fillRoundedRect(-75, -20, 170, 40, 10);

    //container for button chat
    scene.button_GlobalChat = scene.add.container(canvasSize.width - 110, canvasSize.height - 40, [
        scene.button_Background,
        scene.button_GlobalChatLabel,
        scene.button_GlobalBadge
    ]).setScrollFactor(0).setDepth(5).setSize(170, 40);

    scene.button_GlobalChat.setInteractive({ useHandCursor: true });
    scene.button_GlobalChat.on('pointerdown', () => {
        isTalking = true;
        isPanelOpen = true;
        modalStatus('globalChatModal', 'flex', 'modalAnimation');
    });

    socket.on('incrementGlobalMessage', (count)=>{
        scene.button_GlobalBadge.setVisible(true);
        scene.button_GlobalBadgeNotify.setText(count >= 10 ? (10 + "+") : count);
    });

    socket.on('clearGlobalMessageCounter', ()=>{
        scene.button_GlobalBadge.setVisible(false);
    });
}