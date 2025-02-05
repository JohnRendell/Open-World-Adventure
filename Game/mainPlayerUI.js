function homeBaseUI(scene){
    //player profile
    scene.profileBorder = scene.add.graphics();
    scene.profileBorder.fillStyle(0x0d6525, 1);
    scene.profileBorder.fillRoundedRect(0, -5, 60, 50, 0);

    //heart icon
    scene.heartIcon = scene.add.image(80, 10, 'heartIcon').setDisplaySize(30,30);

    //player health bar
    scene.playerHealthContainer = scene.add.graphics();
    scene.playerHealthContainer.fillStyle(0x402e2d, 1);
    scene.playerHealthContainer.fillRoundedRect(100, 0, 100, 20, 5);

    scene.playerHealth = scene.add.graphics();
    scene.playerHealth.fillStyle(0xeb281a, 1);
    scene.playerHealth.fillRoundedRect(100, 0, playerHealthPoints, 20, 5);

    //meat icon
    scene.meatIcon = scene.add.image(80, 40, 'meatIcon').setDisplaySize(30, 30);

    //player hunger bar
    scene.playerHungerContainer = scene.add.graphics();
    scene.playerHungerContainer.fillStyle(0x4d4747, 1);
    scene.playerHungerContainer.fillRoundedRect(100, 30, 100, 20, 5);

    scene.playerHunger = scene.add.graphics();
    scene.playerHunger.fillStyle(0x752b2b, 1);
    scene.playerHunger.fillRoundedRect(100, 30, 100, 20, 5);

    //player inventory bag
    scene.playerInventory = scene.add.image(checkDevice() === 'mobile' ? canvasSize.width - 60 : 940, 0, 'inventoryIcon').setDisplaySize(80,80).setScrollFactor(0);

    scene.playerInventory.setInteractive({ useHandCursor: true });
    scene.playerInventory.on('pointerdown', ()=>{
        if(isPanelOpen === false){
            isTalking = true;
            isPanelOpen = true;
            modalStatus('inventoryModal', 'flex', 'modalAnimation');
        }
    });

    //player gem
    scene.playerGem = scene.add.text(20, 60, 'Gem: ' + playerGem, {
            font: "16px 'Pixelify Sans",
            fill: "#ffffff",
            align: "center"
        });

    //player settings
    scene.playerSetting = scene.add.sprite(checkDevice() === 'mobile' ? canvasSize.width - 150 : 850, 0, 'settingIcon').setDisplaySize(80,80).setScrollFactor(0);
    scene.playerSetting.setInteractive({ useHandCursor: true });
    scene.playerSetting.on('pointerdown', () => {
        if(isPanelOpen === false){
            isPanelOpen = true;
            isTalking = true;
            modalStatus('settingModal', 'flex', 'modalAnimation');
        }
    });

    scene.load.once('complete', ()=>{
        scene.playerProfile = scene.add.image(30, 20, 'playerProfile').setOrigin(0.5).setDisplaySize(45,40);

        //player UI container
        scene.playerUIContainer = scene.add.container(20, 60, [
            scene.profileBorder,
            scene.playerProfile,
            scene.heartIcon,
            scene.playerHealthContainer,
            scene.playerHealth,
            scene.meatIcon,
            scene.playerHungerContainer,
            scene.playerHunger,
            scene.playerGem,
            scene.playerSetting,
            scene.playerInventory
        ]).setDepth(5).setScrollFactor(0);
    });

    scene.load.start();
}