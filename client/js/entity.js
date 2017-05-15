var entities = {};


function Entity(name, x, y, ID)
{
    this.name = name;
    this.x = x;
    this.y = y;
    this.id = ID;


    // graphics info
    this.g_sprite = null;
    this.g_label = null;

    this.g_label = game.add.text(0, 0, this.name);
    this.g_label.anchor.set(0.5);

    this.g_sprite = game.add.sprite(this.x * 16, this.y * 16, 'player', 1);
    game.physics.enable(this.g_sprite, Phaser.Physics.ARCADE);
    
    this.g_sprite.animations.add('left', [8,9], 10, true);
    this.g_sprite.animations.add('right', [1,2], 10, true);
    this.g_sprite.animations.add('up', [11,12,13], 10, true);
    this.g_sprite.animations.add('down', [4,5,6], 10, true);

    if (this.id == pID)
        game.camera.follow(this.g_sprite);

    this.update = function() {
        // update text
        this.g_label.x = Math.floor(this.g_sprite.x + this.g_sprite.width);
        this.g_label.y = Math.floor(this.g_sprite.y - 10);

        this.g_stop();
    };

    this.next_x = -1;
    this.next_y = -1;

    this.g_stop = function()
    {
        if ( Math.abs(this.next_x - this.g_sprite.x) <= 1 &&
            Math.abs(this.next_y - this.g_sprite.y) <= 1 )
        {
            this.g_sprite.body.velocity.x=0;
            this.g_sprite.body.velocity.y=0;

            this.g_sprite.position.x = this.next_x;
            this.g_sprite.position.y = this.next_y;

            this.x = this.next_x / 16;
            this.y = this.next_y / 16;

            this.next_x = -1;
            this.next_y = -1;

            this.requestMove();
        }
    };

    this.g_move = function(x, y)
    {
        this.g_sprite.play('down');

        game.physics.arcade.moveToXY(this.g_sprite, x * 16 , y * 16);
        this.next_x = x * 16;
        this.next_y = y * 16;

        if (pID == this.id)
            this.checkPortals(x, y);
    };

    this.isMoving = function()
    {
        return this.next_x == -1 && this.next_y == -1;
    };

    this.sendNextReqPos = function()
    {
        connection.send(JSON.stringify({ header: "move", body: { X: follow_path[0].x, Y: follow_path[0].y } }));
        follow_path.shift();
    };

    this.requestMove = function()
    {
        if (follow_path.length > 0)
        {
            if (this.id == pID)
                this.sendNextReqPos();
        }
        else
            this.g_sprite.animations.stop();
    };

    var that = this;
    this.onNewPath= function(path)
    {
        if (path === null)
            return;

        follow_path = path.slice(1,path.length);

        that.sendNextReqPos();
    };

    this.checkPortals = function(x, y)
    {
        if (worldState.map.objects)
        {
            const portals = worldState.map.objects.portals;
            for (i in portals)
                if (portals[i].x / 16 == x && portals[i].y / 16 == y)
                {
                    console.log("change map...");
                    request_map = portals[i].name;
                    game.state.start("loading");
                    return true;
                }
        }
        return false;
    }
}


// Personal ID of the playing player
var pID = 0;
var follow_path = [];