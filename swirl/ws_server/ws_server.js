var WebSocketServer = require("ws").Server;                // Necessite la librairie principale WebSocket.

var port = 8081;

var math = require('math');

var ws = new WebSocketServer({port: port});                // Création et ouverture du socket server.
var ip = require('ip');                                // Librairie indiquant l'IP sur lequel tourne le serveur.

console.log(new Date()+'\nwebRTC server running on ' +ip.address()+':'+port);

// Globals clients variables:
clientSocket     = new Array();
clientUserList    = new Array();

// History management:
var history = new Array();
var pushHistory = function(msg) {
    history.push(msg);
    if (history.length > 20) history.shift();
}

// Normal routines to send messages:
var send = function(socket,type,msg,status) {
    socket.send(JSON.stringify    ({
                type: type,
                data: msg
                        }),function ack(error) {
        console.log(status+". ERR status -> "+error);
        if (error)    {
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
// Special message from server, manage password, error messages... :
var inform = function(socket,key,value,status) {
    var obj = {};
    obj.type = 'SERVER'
    obj[key] = value;
    socket.send(JSON.stringify(obj),function ack(error) {
        console.log(status+". ERR status -> "+error);
        if (error)    {
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
    var password = false;

    var newClient = true;
    client.on("message", function (str) {                // Event réception d'un message du client
        console.log('new msg received:'+str);

// SEQUENCE I -> Preliminary test if is a real JSON message:
        if (/^[\],:{}\s]*$/.test(str.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
            console.log('True JSON.');
            var obj = JSON.parse(str);
        }
        else {
            console.log("that string is not a JSON !");
            return;
        }
// SEQUENCE II -> Password negociation:
        if (password) {
            if (obj.data == 'les carottes sont cuites') {
                console.log('accepted password');
                inform(client,'password',true,'password accepted');
                password = false;
            }
            else console.log('incorrect password:'+obj.data);
            return;
        }
// SEQUENCE III -> Real Begin of communication:
        switch (obj.type) {
    // Administration tools:
            case 'ADMIN':

                break;
            case 'CHAT':
    // Register login:
                if (newClient == true)
                {
                    console.log('new client msg received -> '+obj.data);

                    for (var i=0; i<clientUserList.length; i++) {                // vérification si le nom du client n'est pas déjà enregistré.
                        if (obj.data == clientUserList[i]) {
                            inform(client,'kick',true,'already registered');
                            return;
                        }
                    }
                    var msg = "► "+obj.data+" vient de se connecter\n";
                    pushHistory(msg);


                    for (var j=0; j<clientSocket.length; j++) {
                        send(clientSocket[j],"CHAT",msg,"send connected status to "+clientUserList[j]);
                        inform(clientSocket[j],'new',new Array(obj.data),'server');                // TODO EFFET DE BORD POSSIBLE, il se peut que par l'aspect assynchrone de send, la list client soit en avance.
                    }

                    send(client,"CHAT",history.join("")+"\
► Bienvenu "+obj.data+"\n\
"+((clientSocket.length == 0)?"► Vous êtes le seul en ligne":"► "+((clientSocket.length == 1)?"Est":"Sont")+" actuellement en ligne: "+clientUserList.join())+"\n\
► Tapez /status pour voir les personnages connectés ou /cat, /rabbit, /roll ou encore /elephant !\n","welcome msg for "+obj.data);

                    inform(client,'name',obj.data,'server inform proper name');
                    inform(client,'new',clientUserList,'server inform client list');

                    clientSocket.push(client);
                    clientUserList.push(obj.data);
                    newClient = false;
                }
    // Normal conversation:
                else
                {
                    var str;
                    switch (obj.data) {
                        case "/rabbit":
                            obj.data="\n           /\\ /|\n          |||| |\n           \\ | \\\n       _ _ /  @ @\n     /    \\   =>X<=\n   /|      |   /\n   \\|     /__| |\n     \\_____\\ \\__\\\n";
                            break;
                        case "/cat":
                            obj.data="\n   .-,        <,`-.__.-'>        \n  / |          )       (         \n  | ;         /_   ^4^  \\_       \n  \\  \\.-~~-.__\\=_  -'- _/=)    \n   \\             `---;`          \n   /     |           |__         \n  /   /    ,    |   /  `~.__      \n  |    .'~..__|    /.' `'~,_)    \n  T  (`  | (  ;   |              \n   \\  \\   '._)  \\  \\_         \n    '._)         ',__)             \n";
                            break;
                        case "/elephant":
                            obj.data="\n          __     __\n         /  \\~~~/  \\\n   ,----(     ..    )\n  /      \\__     __/\n /|         (\\ |(\n^ \\   /___\\  /\\|\n   |__|   |__|-\"\n";
                            break;
                        case "/nao":
                            obj.data="\n    /\\                  ,'|\no--'O `.               /  /\n`--.   `-----------._,' ,'\n    \\              ,---'\n    ) )    _,--(  |\n    /,^.---'    )/\\\\\n    ((   \\\\    ((  \\\\\n     \\)   \\)    \\) (/\n";
                            break;
                        case "/status":
                            send(client,"CHAT","► "+((clientSocket.length == 1)?"Est":"Sont")+" actuellement en ligne: "+clientUserList.join()+"\n","/status request");
                            return;
                        case "/roll":
                            var i;
                            for (i=0; i<clientSocket.length; i++) {
                                if (client == clientSocket[i]) break;
                            }
                            var nbr = Math.floor(math.random() * (6 - 0));
                            var msg = clientUserList[i]+" lance un dé de 6 faces et obtient "+nbr+((nbr)?" !\n":" Mouhaha XD\n");
                            pushHistory(msg);
                            for (var j=0; j<clientSocket.length; j++)     send(clientSocket[j],"CHAT",msg,"send dice throw to "+clientUserList[j]);
                            return;
                        case "":
                            return;
                    }
                    for (var i=0; i<clientSocket.length; i++) {
                        if (client == clientSocket[i]) {
                            console.log("message received from "+clientUserList[i]+": "+obj.data);
                            var msg = clientUserList[i]+": "+obj.data+"\n";
                            pushHistory(msg);
                            for (var j=0; j<clientSocket.length; j++)     send(clientSocket[j],"CHAT",msg,"send msg to "+clientUserList[j]);
                            break;
                        }
                    }
                }
                break;
    // RTC retransmission paquet protocol:
            default:
                for (var i=0; i<clientSocket.length; i++) {
                    if (client == clientSocket[i]) console.log("message received from "+clientUserList[i]+": "+obj.data);
                    break;
                }
                for (var i=0; i<clientSocket.length; i++) {
                    if (clientUserList[i] == obj.to) {
                        console.log('Retransmission successfull type:'+obj.type+' from:'+obj.from+' to:'+obj.to);
                        clientSocket[i].send(str);
                        return;
                    }
                }
                console.log('Retransmission IMPOSSIBLE type:'+obj.type+' from:'+obj.from+' to:'+obj.to);
                break;
            }
    })
// END OF SEQUENCE Deconnexion:
    client.on("close", function() {
        console.log('__DECONNEXION DETECTED__');
        for (var i=0; i<clientSocket.length; i++) {
            if (client == clientSocket[i])
            {
                var oldUser = clientUserList[i];
                clientSocket.splice(i,1);
                clientUserList.splice(i,1);

                var msg = "► "+oldUser+" vient de se déconnecter !\n";
                pushHistory(msg);

                console.log(msg);

                for (var j=0; j<clientSocket.length; j++) {
                    send(clientSocket[j],"CHAT",msg,"close "+clientUserList[j]);
                    inform(clientSocket[j],'out',oldUser,'server');
                }
                break;
            }
        }
    })
});



