
var current_map = "";
var request_map = "";
var loading_map = false;
var map_data = null;


var loadingState =
{
    create: function () {
        loading_map = true;
        entities = {};
        connection.send(JSON.stringify({ header: "to_map", body: request_map }));
        console.log("loading map...");
    },

    update: function() {
        if (!loading_map)
        {
            current_map = request_map;
            game.state.start("world");
        }
            
    },

    render: function() {

    },

};

function loadMapData()
{
    data = map_data;
    entities = {};
    for (var i in data)
        entities[data[i].ID] = new Entity(data[i].Name, data[i].X, data[i].Y, data[i].ID);
        
    loading_map = false;
    data = {};
}
