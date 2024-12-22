var socketPhaser = new Phaser.Scene("Socket Phaser");

socketPhaser.create = function(){
    const mainLobby = this.scene.get('Game Lobby');

    //TODO: fix this, not getting the centerworld on other class, suggestion setter and getter
    const centerWorldWidth = mainLobby.centerWorld.width;
    const centerWorldHeight = mainLobby.centerWorld.height;
    
    socket.on('spawnPlayer', ()=>{
        //spawn smoke for other player
        this.playerSmoke = this.add.sprite(centerWorldWidth, centerWorldHeight - 50, "spawn_smoke").setOrigin(0.5);
        this.playerSmoke.setDisplaySize(2, 5);
        this.playerSmoke.setDepth(2);

        //animation for spawn effect
        this.anims.create({
            key: 'spawnDust_player', 
            frames: this.anims.generateFrameNumbers('spawnEffect', { start: 0, end: 8 }),
            frameRate: 12, 
            repeat: 0
        });

        this.playerSmoke.play('spawnDust_player');
        this.playerSmoke.on('animationcomplete', ()=>{
            this.playerSmoke.destroy();
        });
    });
}