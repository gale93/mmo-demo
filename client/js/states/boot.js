var cursors;

var bootState ={
    preload: function()
    {
        game.stage.backgroundColor = "#444444";
      
        //Load Images
        game.load.spritesheet('player', 'gfx/spaceman.png', 16, 16);
        game.load.image('tiles', 'gfx/tiles.png');


        //Load maps
        game.load.tilemap("map", "maps/map.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("indoor", "maps/indoor.json", null, Phaser.Tilemap.TILED_JSON);   
    },

    create: function()
    {
        cursors = game.input.keyboard.createCursorKeys();
        connection = connect();
    }
};