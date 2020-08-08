var WebSocketServer = require("ws").Server;                // Necessite la librairie principale WebSocket.
var port = 8080;

var math = require('math');

var ws = new WebSocketServer({port: port});                // Création et ouverture du socket server.
var ip = require('ip');                                // Librairie indiquant l'IP sur lequel tourne le serveur.

console.log(new Date()+'\nwebRTC server running on ' +ip.address()+':'+port);

clientSocket = new Array();
clientUserList = new Array();

var history = new Array();
var pushHistory = function(msg) {
    history.push(msg);
    if (history.length > 20) history.shift();
}

var send = function(socket,msg,status) {
    socket.send(msg,function ack(error) {
        console.log(status+". ERR status -> "+error);
        if (error) {
            for (var k = 0; k<clientSocket.length; k++) {
                if (clientSocket[k] == socket) {
                    clientSocket.splice(k,1);
                    clientUserList.splice(k,1);
                    break;
                }
            }
        }
    });
}

ws.on('connection', function (client) {                    // Event lorsqu'un client se connecte. mode TCP. SYN ---> SYN ACK -----> ACK

    console.log('__NEW CONNEXION__');

    var newClient = true;

    client.on("message", function (str) {                // Event réception d'un message du client
        console.log(str);

        if (newClient == true)    {
            console.log('new client msg received -> '+str);
            var msg = "► "+str+" vient de se connecter\n";
            pushHistory(msg);

            for (var j=0; j<clientSocket.length; j++)     send(clientSocket[j],msg,"send connected status to "+clientUserList[j]);

            send(client,history.join("")+"\
► Bienvenu "+str+"\n\
"+((clientSocket.length == 0)?"► Vous êtes le seul en ligne":"► "+((clientSocket.length == 1)?"Est":"Sont")+" actuellement en ligne: "+clientUserList.join())+"\n\
► Tapez /status pour voir les personnages connectés ou /cat, /rabbit, /roll ou encore /elephant !\n","welcome msg for "+str);

            clientSocket.push(client);
            clientUserList.push(str);
            newClient = false;
        }
        else
        {
            switch (str) {
                case "/rabbit":
                    str="\n           /\\ /|\n          |||| |\n           \\ | \\\n       _ _ /  @ @\n     /    \\   =>X<=\n   /|      |   /\n   \\|     /__| |\n     \\_____\\ \\__\\\n";
                    break;
                case "/cat":
                    str="\n   .-,        <,`-.__.-'>        \n  / |          )       (         \n  | ;         /_   ^4^  \\_       \n  \\  \\.-~~-.__\\=_  -'- _/=)    \n   \\             `---;`          \n   /     |           |__         \n  /   /    ,    |   /  `~.__      \n  |    .'~..__|    /.' `'~,_)    \n  T  (`  | (  ;   |              \n   \\  \\   '._)  \\  \\_         \n    '._)         ',__)             \n";
                    break;
                case "/elephant":
                    str="\n          __     __\n         /  \\~~~/  \\\n   ,----(     ..    )\n  /      \\__     __/\n /|         (\\ |(\n^ \\   /___\\  /\\|\n   |__|   |__|-\"\n";
                    break;
                case "/status":
                    send(client,"► "+((clientSocket.length == 1)?"Est":"Sont")+" actuellement en ligne: "+clientUserList.join()+"\n","/status request");
                    return;
                case "/roll":
                    var i;
                    for (i=0; i<clientSocket.length; i++) {
                        if (client == clientSocket[i]) break;
                    }
                    var nbr = Math.floor(math.random() * (6 - 0));
                    var msg = clientUserList[i]+" lance un dé de 6 faces et obtient "+nbr+((nbr)?" !\n":" Mouhaha XD\n");
                    pushHistory(msg);
                    for (var j=0; j<clientSocket.length; j++)     send(clientSocket[j],msg,"send dice throw to "+clientUserList[j]);
                    return;
                case "":
                    return;
            }

            for (var i=0; i<clientSocket.length; i++) {
                if (client == clientSocket[i]) {
                    console.log("message received from "+clientUserList[i]+": "+str);
                    var msg = clientUserList[i]+": "+str+"\n";
                    pushHistory(msg);
                    for (var j=0; j<clientSocket.length; j++)     send(clientSocket[j],msg,"send msg to "+clientUserList[j]);
                    break;
                }
            }
        }
    })

    client.on("close", function()
    {
        console.log('__DECONNEXION DETECTED__');

        /*
        for (var i = 0; i < clientSocket.length; i++)
        {
            if (client == clientSocket[i])
            {
                var oldUser = clientUserList[i];
                clientSocket.splice(i, 1);
                clientUserList.splice(i, 1);

                var msg = "► "+oldUser+" vient de se déconnecter !\n";
                pushHistory(msg);

                console.log(msg);

                for (var j = 0; j < clientSocket.length; j++)
                    send(clientSocket[j],msg,"close "+clientUserList[j]);
                break;
            }
        }
        */
    })
});
