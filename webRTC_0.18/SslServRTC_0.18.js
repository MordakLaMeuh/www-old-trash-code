"use strict";
var ws_cfg = {
	port: 8443,
	ssl_key: '/home/certificats/grosdada.eu.key',
	ssl_cert: '/home/certificats/grosdada.eu.crt',
	passphrase: 'mordakleboulet'
};

var httpServ = require('https');
var fs = require('fs');
var ip = require('ip');

var app = httpServ.createServer({
	key: fs.readFileSync(ws_cfg.ssl_key),
	cert: fs.readFileSync(ws_cfg.ssl_cert),
	passphrase: ws_cfg.passphrase
}).listen(ws_cfg.port);

var WebSocketServer = require('ws').Server, ws = new WebSocketServer({server: app});

console.log(new Date()+'\nwebRTC server running on ' +ip.address()+':'+ws_cfg.port);

/************************************************************************************************************************************************************************************************************/

var clientList = new Array();
var clientSocket = new Array();

ws.on('connection', function (client) {

	console.log('__NEW CONNEXION__');

	client.on("message", function (str) {
		console.log(str);

		var data = JSON.parse(str);
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
 * 									clientSocket[]		-> Liste des pointeurs vers les objects client, pour l'envoi et la reception des données.
 ************************************************************************************************************************************************************************************************************/
