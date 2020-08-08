
/******											BASIC WEBRTC SERVER 	[ NODE.JS ]								*******/

var WebSocketServer = require("ws").Server;				// Necessite la librairie principale WebSocket.
var port = 8000;

var ws = new WebSocketServer({port: port});				// Création et ouverture du socket server.				
var ip = require('ip');								// Librairie indiquant l'IP sur lequel tourne le serveur.

console.log(new Date()+'\nwebRTC server running on ' +ip.address()+':'+port);

var nbrClient=-1;
var objClient=[];
var currentOffer=null;

ws.on('connection', function (client) {					// Event lorsqu'un client se connecte. mode TCP. SYN ---> SYN ACK -----> ACK

	nbrClient++;  
	objClient[nbrClient]=client;						// Tableau de référence aux clients.
	objClient[nbrClient].id=nbrClient;					// D'une certaine manière, id est un attribue du pseudo-objet objClient
	console.log("Browser connected: indice_client="+client.id)
   
	client.on("message", function (str) {				// Event réception d'un message du client
		var data = JSON.parse(str);					// Les chaines venant du client sont des fichiers JSON stringifiés, le serveur doit les "parser' pour retrouver les variables contenues dans le flux JSON.
		switch(data.msg_type) 	{									
			case 'HELO':			
				client.hello=true;				// (enregistrement du client comme ayant salué. nécéssaire pour éviter un bug mineur de double envois de 'make offer'
				console.log('HELO received from '+client.id);
				if (client.id == 0)	{			// Client.id[0] est le 'main',on va dire le 'seed', c'est lui qui créer l'offre et les envoit.
					console.log('sending order MAKE OFFER');
					client.send(JSON.stringify({
						msg_type : "MAKE OFFER",
						data     : "I am your server."
						}))
								}
				else				{
					console.log('sending current offer');
					if (currentOffer != null)   {
						console.log('currentOffer disponible.');
						client.send(JSON.stringify({		// Avant d'être envoyée, une chaine doit être évidemment stringifiés pour être ensuite exploitée par le client.
						msg_type : "OFFER",
						data     : currentOffer
						}));
					}
					else 				{
						console.log('* ALERT * - currentOffer=null');
						// Mise en place de l'evenement.
									}
								}
				break;
			case 'OFFER':
				console.log('OFFER receveived from '+client.id);
				if (client.id == 0)	{
					console.log('correct ID:0');
					currentOffer=data.data;
					if (nbrClient > 0)	{
						console.log('fast connected client detected. Double offer possible.');			// Bug mineur prévisible, le paquets peut etre envoyé 2 fois car le nouveau client dit HELO.
						console.log(nbrClient);
						for (var i=1; i<=nbrClient; i++)	{
							if (objClient[i].hello==true) objClient[i].send(JSON.stringify	({		// Fixed avec client.hello
													msg_type : "OFFER",
													data     : currentOffer
																		}))
												}
						client.send(JSON.stringify	({
							msg_type : "INFO",
							data     : "Clients quikly connected, imminente connexion."
											}))
								}
					else 			{
						client.send(JSON.stringify	({
							msg_type : "INFO",
							data     : "Offer received, waiting for clients."		// Normal Behavior for just one peer connected. It called 'seed'
											}))
						
								}
								}
				else	console.log('ERROR: ignored offer from '+client.id);
				break;
			case 'ANSWER':
				console.log('ANSWER received from '+client.id);
				if (client.id != 0)	{
					objClient[0].send(JSON.stringify	({
						msg_type : "ANSWER",
						data     : data.data
										}))
								}
				else 			      {
					console.log('ERROR: ignored answer from'+client.id)
					client.send(JSON.stringify	({
						msg_type : "INFO",
						data     : "Fatal error, you can't send answer."
										}))
								}
				break;
			case 'CANDIDATE':												// Retransmission au client 0
				console.log('Receved candidate from '+client.id);
				if (client.id != 0)	{
					console.log('retransmitting candidates...');
					objClient[0].send(JSON.stringify	({
						msg_type : "CANDIDATE",
						data     : data.data
										}))
						
								}
				else		console.log('Client at 0 can\'t send ice candidates.');		// Les candidats du client 0 sont actuellement rejetés, considérés comme innutiles.
				break;
			default:
				console.log('ERROR: uncomprehensible stuff received from '+client.id);				// En cas d'abus et de non-respect de la structure, la connexion est fermée !
				client.close();							// Fermeture de la connexion.
				break;	
			}
		})
	
	client.on("close", function() {							// Event une connexion s'est fermée. Client parti ou viré du serveur.
		currentOffer=null;
		console.log('Démontage de session. ID='+client.id+' indice client='+nbrClient);

		if (client.id < nbrClient) 	{						// Décrémentation futile, de facon à ce que les ID partent toujours de 0 jusqu'au nombre de clients connectés.
			for (var i=client.id; i<nbrClient; i++) 			{ 
				console.log('boucle de suppression. i='+i); 
				objClient[i]=objClient[i+1]; objClient[i].id=i;	}
				
			if (client.id == 0)		{					// Dans ce cas, le seed est parti, une demande est envoyée au client 1 de passer 0 et de créer une nouvelle offre.
				console.log('FATAL EXCEPTION: seed is gone. sending order MAKE OFFER to [1]');
								}
							}
		else if (client.id == 0)	console.log('seed is renewing connexion.');
		    
		if (nbrClient > 0)	{
			objClient[0].send(JSON.stringify	({
					msg_type : "RESET",
					data     : "MAKE OFFER"
										}))
						}
		
		objClient[nbrClient]=null;	nbrClient--;				// Détruit la référence au dernier client et décrémente le nombre de clients connectés.
	})
});
	
/*	PROTOCOLE INFORMATIQN:
 * 
 * 		Client:	HELO					-> Indique au serveur que le client est prêt.
 *				OFFER					-> Envoit une offre au serveur.			(cas 'seed' )
 *				ANSWER				-> Répond à l'offre précédemment envoyée.		(cas 'peer' )
 *				CANDIDATE				-> Le client envoit ses ICE CANDIDATE, ses différentes IP découvertes gràce à un serveur STUN; elles seront retransmises au 'seed'
 * 
 * 		Serveur:	MAKE OFFER				-> Ordonne au client 0 ou 'seed' de créer une offfre.
 * 				OFFER					-> Envoit aux autres clients l'offre du client 0 (qui est mémorisée temporairement dans le serveur. Enregistré dans la var 'currentOffer' (via .data)
 * 				ANSWER				-> Demande au client de répondre à l'offre que le serveur envoit dans .data	
 * 				CANDIDATE				-> Le serveur informe qu'il transmet un ICE CANDIDAT au client - ce paquet va pour l'instant au client 0 ou 'seed'
 * 				INFO					-> Simple informatique allant au client. contenu dans .data aussi.
 * 
 * 	VARIABLE UTILISES POUR LA TRANSIMISSION: 		msg_type		-> Contient l'ordre ou la demande.
 * 									data			-> contient ds informatiques necessaires pour réponde à ces demandes.


/************************************************************************************************************************************************************************************************************/
//	console.log('readyState='+objClient[0].readyState+' OpenStatus='+objClient[0].OPEN);
//	if (nbrClient>0 && (objClient[0].readyState == objClient[0].OPEN)) objClient[0].send(str);
