var easystar = new EasyStar.js();

function Pointer()
{
    this.g_handle = game.add.graphics();
    this.g_handle.lineStyle(2, 0xffffff, 1);
    this.g_handle.drawRect(0, 0, 16, 16);

    this.getTileProperties = function()
    {
        var x = worldState.foregroundLayer.getTileX(game.input.activePointer.worldX);
        var y = worldState.foregroundLayer.getTileY(game.input.activePointer.worldY);

        var tile = worldState.map.getTile(x, y, worldState.foregroundLayer);

        console.log("[" + x + " " + y + "]: ", tile != null );
        
        this.calc_path(x, y);
    };

    this.update = function()
    {
        easystar.calculate();

        this.g_handle.x = worldState.foregroundLayer.getTileX(game.input.activePointer.worldX) * 16;
        this.g_handle.y = worldState.foregroundLayer.getTileY(game.input.activePointer.worldY) * 16;
    };

    this.calc_path = function(x,y)
    {
        var map = game.cache.getTilemapData(current_map).data.layers[1];
        var grid = [];
        for (var i = 0; i <= map.height; i++)
            grid[i] = map.data.slice(0 + (i * map.width) , map.width + (i * map.width));

        easystar.setGrid(grid);
        easystar.setAcceptableTiles([0]);

        easystar.findPath(entities[pID].x, entities[pID].y, x, y, entities[pID].onNewPath);
    }


    game.input.addMoveCallback(this.update, this);
    game.input.onDown.add(this.getTileProperties, this);
}