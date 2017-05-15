var worldState =
{
    pointer: null,
    map: null,
    backgroundLayer: null,
    foregroundLayer: null,

    preload: function()
    {
    },

    create: function ()
    {
        this.map = game.add.tilemap(current_map);
        this.map.addTilesetImage('tiles');

        this.backgroundLayer = this.map.createLayer('background');
        this.foregroundLayer = this.map.createLayer('foreground');

        //(this.map.setCollisionByExclusion([0], true, this.foregroundLayer);

        this.backgroundLayer.resizeWorld();

        loadMapData();
        this.pointer = new Pointer();
    },

    update: function()
    {
        // local changes
        //game.physics.arcade.collide(entities[pID].g_sprite, this.foregroundLayer);

        // updagte all entities ( needed ? )
        for (var i in entities)
            entities[i].update();
    },

    render: function()
    {
    },

};