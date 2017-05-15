var loginState =
{
    randomString: function(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },

    create: function () {
        var name = prompt("Please enter your name", this.randomString(6, 'abcdefghijklmnopqrstuvwxyz'));
        if(name)
            connection.send(JSON.stringify({ header: "login", body: {N: name, P: "NotYet"} }));
    },

    update: function() {

    },

    render: function() {

    },

};