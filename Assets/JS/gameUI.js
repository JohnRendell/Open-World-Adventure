//for mobile only
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

function checkDevice() {
    if(window.innerWidth < 1280){
        return 'mobile'
    }
};

function lobbyUI(scene){
    scene.tipLabel = scene.add.text(100, canvasSize.height - 30, "Objects with mouse pointer are interactable, go near it to interact", {
        font: "12px 'Pixelify Sans'",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0).setScrollFactor(0);
    scene.tipLabel.setDepth(10);

    scene.tipLabel.setVisible(checkDevice() === 'mobile');

    //for mobile button movements
    scene.moveLeft = scene.add.image(40, canvasSize.height - 60, 'arrowIcon').setScale(0.2).setAngle(-90);
    scene.moveLeft.setInteractive({ useHandCursor: true });
    scene.moveLeft.on('pointerdown', () => {
        if(isPanelOpen === false && isTalking === false){
            moveLeft = true;
        }
    });
    scene.moveLeft.on('pointerup', () => moveLeft = false);
    scene.moveLeft.on('pointerout', () => moveLeft = false);
    scene.moveLeft.on('pointerupoutside', () => moveLeft = false);
    scene.input.on('pointerup', () => moveLeft = false);

    scene.moveRight = scene.add.image(100, canvasSize.height - 60, 'arrowIcon').setScale(0.2).setAngle(90);
    scene.moveRight.setInteractive({ useHandCursor: true });
    scene.moveRight.on('pointerdown', () => {
        if(isPanelOpen === false && isTalking === false){
            moveRight = true;
        }
    });
    scene.moveRight.on('pointerup', () => moveRight = false);
    scene.moveRight.on('pointerout', () => moveRight = false);
    scene.moveRight.on('pointerupoutside', () => moveRight = false);
    scene.input.on('pointerup', () => moveRight = false);

    scene.moveUp = scene.add.image(73, canvasSize.height - 100, 'arrowIcon').setScale(0.2).setAngle(0);
    scene.moveUp.setInteractive({ useHandCursor: true });
    scene.moveUp.on('pointerdown', () => {
        if(isPanelOpen === false && isTalking === false){
            moveUp = true;
        }
    });
    scene.moveUp.on('pointerup', () => moveUp = false);
    scene.moveUp.on('pointerout', () => moveUp = false);
    scene.moveUp.on('pointerupoutside', () => moveUp = false);
    scene.input.on('pointerup', () => moveUp = false);

    scene.moveDown = scene.add.image(70, canvasSize.height - 30, 'arrowIcon').setScale(0.2).setAngle(180);
    scene.moveDown.setInteractive({ useHandCursor: true });
    scene.moveDown.on('pointerdown', () => {
        if(isPanelOpen === false && isTalking === false){
            moveDown = true;
        }
    });
    scene.moveDown.on('pointerup', () => moveDown = false);
    scene.moveDown.on('pointerout', () => moveDown = false);
    scene.moveDown.on('pointerupoutside', () => moveDown = false);
    scene.input.on('pointerup', () => moveDown = false);

    scene.moveLeft.setScrollFactor(0).setDepth(10).setVisible(checkDevice() === 'mobile');
    scene.moveRight.setScrollFactor(0).setDepth(10).setVisible(checkDevice() === 'mobile');
    scene.moveUp.setScrollFactor(0).setDepth(10).setVisible(checkDevice() === 'mobile');
    scene.moveDown.setScrollFactor(0).setDepth(10).setVisible(checkDevice() === 'mobile');

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
        if(isPanelOpen === false){
            isTalking = true;
            isPanelOpen = true;
            modalStatus('globalChatModal', 'flex', 'modalAnimation');
        }
    });

    socket.on('incrementGlobalMessage', (count)=>{
        scene.button_GlobalBadge.setVisible(true);
        scene.button_GlobalBadgeNotify.setText(count >= 10 ? (10 + "+") : count);
    });

    socket.on('clearGlobalMessageCounter', ()=>{
        scene.button_GlobalBadge.setVisible(false);
    });
}