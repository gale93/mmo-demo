var connection;

function connect()
{
    var conn = new WebSocket("ws://"+ ipaddress +"/ws");

    conn.onopen = function() {
        console.log("connection opened.");
        game.state.start("login", false);
    };

    conn.onmessage = function(event) {
        parseIncomingData(JSON.parse(event.data));
    };

    conn.onclose = function() {
        console.log("connection closed.");
        game.state.start("boot", false);
    };

    conn.onerror = function() {
        console.log("connection closed.");
        game.state.start("boot", false);
    };

    return conn;
}



function parseIncomingData(msg)
{
    if (msg.Header != "move")
        console.log(msg);
    
    data = msg.Body;
    switch (msg.Header)
    {
        case "login":
            pID = data.ID;
            request_map = data.Map;
            game.state.start("loading");
            break;
        case "player_list":
            map_data = data;
            loading_map = false;
            break;
        case "player_join":
            entities[data.ID] = new Entity(data.Name, data.X, data.Y, data.ID);
            break;
        case "player_left":
            entities[data].g_sprite.destroy();
            entities[data].g_label.destroy();

            delete entities[data];
            break;
        case "move":
            entities[data.ID].g_move(data.X, data.Y);
            break;
        default:
            break;
    }
}