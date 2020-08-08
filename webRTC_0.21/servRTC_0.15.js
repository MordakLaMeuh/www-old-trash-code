var WebSocketServer = require("ws").Server;				// Necessite la librairie principale WebSocket.
var port = 8080;

var ws = new WebSocketServer({port: port});				// Création et ouverture du socket server.
var ip = require('ip');								// Librairie indiquant l'IP sur lequel tourne le serveur.

console.log(new Date()+'\nwebRTC server running on ' +ip.address()+':'+port);

clientList 		= new Array();
clientSocket 	= new Array();

ws.on('connection', function (client) {					// Event lorsqu'un client se connecte. mode TCP. SYN ---> SYN ACK -----> ACK

	console.log('__NEW CONNEXION__');

	client.on("message", function (str) {				// Event réception d'un message du client
		console.log(str);

		var data = JSON.parse(str);					// Les chaines venant du client sont des fichiers JSON stringifiés, le serveur doit les "parser' pour retrouver les variables contenues dans le flux JSON.
		switch(data.msg) 	{
			case 'HELO':
				console.log('HELO received from client');
				var hexID=(Math.random()*0xFFFFFF<<0).toString(16);
				console.log('générate unique ID:'+hexID);

				client.send("{\"from\":\"SERVER\",\"to\":\""+hexID+"\",\"msg\":\"HELO\",\"data\":[\""+clientList.join('\",\"')+"\"]}");

				clientList.push(hexID);
				clientSocket.push(client);
				break;
			default:
				console.log('MESSAGE RECEIVED from client - mode TRANSMIT');
				for (var i=0; i<clientList.length; i++) {
					if (data.to == clientList[i])
					{
						console.log('target detected:'+clientList[i]);
						clientSocket[i].send(str);
						break;
					}
				}
				break;
			}
	})
	client.on("close", function() {
		console.log('__DECONNEXION DETECTED__');
		for (var i=0; i<clientSocket.length; i++) {
			if (client == clientSocket[i])
			{
				clientList.splice(i,1);
				clientSocket.splice(i,1)
				break;
			}
		}
	})
});

/*	PROTOCOLE INFORMATIQN:
 *
 * 		Client:	HELO					-> Indique au serveur que le client est prêt./ Le serveur lui renvoit une liste des ordinateurs connectés après avoir généré un ID 'unique" pour le client.
 *				OFFER					-> L'offre est envoyé à un client précis, le serveur ne fait que servir de messager ou de postier.
 *				ANSWER				-> Idem, c'est la réponse à l'offre, le serveur n'est qu'un facteur.
 *				CANDIDATE				-> Re-Idem, le serveur porte encore une fois la même casquette.
 *
 * 		Serveur:	HELO					-> Message renvoyé par le serveur contenant la liste des ordinateurs connectés.
 * 				'other'				-> Messages retransmis venant des autres clients.
 *
 * 	VARIABLE UTILISES POUR LA TRANSIMISSION: 		clientlist[]		-> Liste des IDs uniques de chaque client.
 * 									clientSocket[]		-> Liste des pointeurs vers les objects client, pour l'envoi et la reception des données.							*/
/************************************************************************************************************************************************************************************************************/
//	console.log('readyState='+objClient[0].readyState+' OpenStatus='+objClient[0].OPEN);
//	if (nbrClient>0 && (objClient[0].readyState == objClient[0].OPEN)) objClient[0].send(str);
