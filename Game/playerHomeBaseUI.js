function homeBaseUI(scene, playerName, playerProfile){
    scene.load.image('playerProfile', playerProfile);

    //player name
    scene.playerNameUI = scene.add.text(100, 5, playerName, {
        font: "16px 'Pixelify Sans'",
        fill: '#ffffff',
        align: 'center'
    }).setOrigin(0.5);

    //player profile
    scene.profileBorder = scene.add.graphics();
    scene.profileBorder.fillStyle(0x0d6525, 1);
    scene.profileBorder.fillRoundedRect(0, -5, 60, 50, 0);

    scene.load.once('complete', ()=>{
        scene.playerProfile = scene.add.image(30, 20, 'playerProfile').setOrigin(0.5).setDisplaySize(45,40);

        //player UI container
        scene.playerUIContainer = scene.add.container(20, 60, [
            scene.profileBorder,
            scene.playerProfile,
            scene.playerNameUI
        ]).setDepth(5).setScrollFactor(0);
    });

    scene.load.start();
}