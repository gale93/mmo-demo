//const ipaddress = "192.168.25.18:9393";
//const ipaddress = "95.253.102.181:9393";
const ipaddress = "127.0.0.1:9393";

var game = new Phaser.Game(40*16, 30*16, Phaser.AUTO, "canvas");

game.state.add("boot", bootState);
game.state.add("login", loginState);
game.state.add("loading", loadingState);
game.state.add("world", worldState);

game.state.start("boot");