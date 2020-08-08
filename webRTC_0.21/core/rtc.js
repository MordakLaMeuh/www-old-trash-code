'use strict';
var webRTC = function() {
	/* Links to DOM functions && debug log */
	var debugError = console;
	//var console	=_DOM_.console.RTCLog;				// graphic mode
	//console.log = console.log;			// console mode

	var errorHandler = function (err){console.alert(err);}	// Fonction en charge de l'affichage des erreures rencontrées

/*********************************************************************************************************************************************************************************************************************/
/******************************************************** MAIN OBJECT WEBSOCKET SERVER *******************************************************************************************************************************/
	var server = function(IP) {
		/* WARNING: 1-L'utilisation de l'API crypto passe forcément pas une page HTTPS sur la dernière version de chrome
		 * 		2-Aucune regression de sécurité n'est possible, si la page source est HTTPS le serveur node doit etre SSL aussi. */
		var serverType = {
			ssl	: false,
			ws	: 'ws:localhost:8080',
			wss	: 'wss://grosdada.eu:8443/'
		};
		var IP=(serverType.ssl || location.protocol == 'https:')?serverType.wss:serverType.ws;

		var socket = new WebSocket(IP);
		this.send2WebSsocket = function(to,from,msg,data) {
			socket.send(JSON.stringify	({					// Envoit d'un candidat spécial NO_MORe lorsque tous les candidats ont été découverts. Important  pour le déclenchement de l'event ICE
				to	: to,
				from  : from,
				msg 	: msg,
				data  : data
							}))
		}
		socket.onerror = function(error) { console.alert('critical warning: Relay System disabled. please configure ICE manually.',2);}
		socket.onopen  = function(){			// Dès que le socket est dispoanible avec le serveur, la première chose que fait le client est d'envoyer HELO.
			socket.send(JSON.stringify({
				msg	: 'HELO'
			}))
		}
		socket.onmessage = function(){
		return function(str){
			var data=JSON.parse(str.data);		// Penser à .data pour lire le contenu de la chaine recue (ou le payload, la charge)

			switch(data.msg) {
				case 'HELO':
					console.log('__HELO FROM SERVER__ :List of peer received:'+data.data.length);
					if (!data.data[0]) {
						console.log('__HELO PROCESS__ : The are no peer :(');
					}
					else {
						for (var i=0; i<data.data.length; i++)
							session[session.length]=new seedInstance(data.to,data.data[i]);
					}
					setLocalUser(data.to);
					break;
				case 'OFFER':
					console.log('__OFFER RECEIVED__ : from '+data.from);
					session[session.length]=new peerInstance(data.from,data.to,data.data);
					break;
				case 'ANSWER':
					console.log('__ANSWER FROM PEER RECEICED__'+data.from);
					for (var i=0; i<session.length; i++)
					{
						if (data.from == session[i].peer) {
							session[i].receaveAnswer(data.data);
							break;
						}
					}
					break;
				default:
					console.log('some stuff received');
					break;
				}
			}
		}();
	}
/*********************************************************************************************************************************************************************************************************************/
/*********************************************** STATICS TOOLS && VARS FOR MAIN INSTANCE OBJECT **********************************************************************************************************************/
	var session = new Array();

	var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;	// Choisis le constructeur approprié pour PeerConnection selon chrome ou mozilla. PeerConnection est un archétype objet.
	var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;								// Ne pas oublier de proposer les différents noms de prototypes selon le navigateur !
	var RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

	var is_chrome = (navigator.userAgent.indexOf("Chrome") > 0)?true:false;
	var options =  	{
		optional:	[
			{RtpDataChannels: !is_chrome},// RtpDataChannels is required if we want to make use of the DataChannels API on Firefox.
			{DtlsSrtpKeyAgreement: true}	// DtlsSrtpKeyAgreement is required for Chrome and Firefox to interoperate.
				]
	};
	/*
	var constraints = {	//OfferToReceiveAudio/Video tells the other peer that you would like to receive video or audio from them.
		mandatory: {

			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true

		}
	};
	*/

	var ICEServers = {iceServers: [{url: "stun:stun.l.google.com:19302"}]};			// Serveur STUN de google.

	var mainDataChannelOptions	= {
		negotiated	: true,
		reliable	: true,
		ordered	: true,
		id:1
	}

	var masterDeleteToNullObject = function(obj) {							// Méthode APPROXIMATIVE de destruction d'objet, need mutex ? (webworker ?)
		for (var i=0; i<session.length; i++)
		{
			if (obj == session[i]) {
				session[i] = null;								// null + splice... Is it necessary ?
				session.splice(i,1);
				console.log('Suppression de l\'objet:'+i+'.nombre d\'objets restant:'+session.length);
			}
		}
	}
/*********************************************************************************************************************************************************************************************************************/
/***************************************************** MAIN OBJECT INSTANCE SEED <---> PEER **************************************************************************************************************************/
	var P2PMaxChannels = 100;

	var instance = function(seed,peer) {
		var self = this;

		this.seed 		= seed;
		this.peer 		= peer;
		this.remoteID   	= null;

		var buffer = new ArrayBuffer(P2PMaxChannels);
		this.P2PChannels = new Uint8Array(buffer);

		this.pc = new PeerConnection(ICEServers, options);

		this.dataChannel = null;
		this.setDataChannel = function(ref) {
			this.dataChannel = ref;
			this.dataChannel.onopen = function() {
				console.log('channel id:'+self.dataChannel.id+' with '+self.remoteID+' -> current status:'+self.dataChannel.readyState);
				console.log('*BinaryType:'+self.dataChannel.binaryType+' *Negociated:'+self.dataChannel.negotiated +
						   ' *Protocol:'+self.dataChannel.protocol+' *Ordered:'+self.dataChannel.ordered);
				var announces = _FILE_.createMultiplesAnnounces();
				console.log('announce status:'+announces);
				if (announces) self.dataChannel.send(announces);

			}
			this.dataChannel.onclose = function() {console.log('channel 0 disable');}
			this.dataChannel.onerror = function(event) {console.log('EROOR on channel 0:'+event);}
			this.dataChannel.onmessage = function(event) { self.interpreterCanal0(event); }
		}
	}
	var peerInstance = function(seed,peer,data) {
		instance.call(this,seed,peer);
		this.remoteID = seed;
		this.peerInfo = {
			answer	: null,
			candidates	: new Array()
		};
		this.createInstance(data);
	}
	var seedInstance = function(seed,peer) {
		instance.call(this,seed,peer)
		this.remoteID = peer;
		this.seedInfo = {
			offer		: null,
			candidates	: new Array()
		};
		this.createInstance();
	}
	seedInstance.prototype = new instance();
	peerInstance.prototype = new instance();

	seedInstance.prototype.constructor = seedInstance;
	peerInstance.prototype.constructor = peerInstance;
/*********************************************************************************************************************************************************************************************************************/
	seedInstance.prototype.createInstance = function() {
		console.log('__creating instance of seed__');
		var self = this;
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.
			return function(ice){			// Static variable inside event. Count of candidates.
				if(ice.candidate) 	{
					console.log('Ice gathering from ICE server - '+ice.candidate.candidate);
					self.seedInfo.candidates.push(ice.candidate);
				}
				else
				{
					console.log('gathering ice:'+self.pc.iceGatheringState);
					console.log('null candidate detected. Number of ICE candidates:'+self.seedInfo.candidates.length);
					if (self.seedInfo.candidates.length == 0) console.log('ICE Candidates may be already in browser cache !');

					SERVER.send2WebSsocket(self.peer,self.seed,'OFFER',self.seedInfo);

					self.pc.onicecandidate=null;			// Termine une fois pour toute l'event ICE.

				}};
			}();
	// OLD ARCHITECHTURE - obsolete ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:

		this.setDataChannel(this.pc.createDataChannel('main_channel', mainDataChannelOptions));

		this.pc.createOffer(function(offer){	 			//create an offer sdp
			self.pc.setLocalDescription(offer,
			function(){}
			, errorHandler);
			console.log('native offer='+JSON.stringify(offer));
			self.seedInfo.offer = offer;
			//}, errorHandler, constraints);
			}, errorHandler);

	/* EXPERIMENTAL: Applique Answer puis les candidats. Le tout est arrivé dans le même paquet JSON. */
		this.receaveAnswer = function(data)	{
			console.log('Answer received from peer:'+JSON.stringify(data));
			var remote = new RTCSessionDescription(data.answer);
			this.pc.setRemoteDescription(remote,function(){
				for (var i=0; i<data.candidates.length; i++)	{
					self.pc.addIceCandidate(new IceCandidate(data.candidates[i]),function(){},errorHandler);
					console.log('ice success applied:'+data.candidates[i].candidate);
				}
			},errorHandler);
		}
	}
/*********************************************************************************************************************************************************************************************************************/
	peerInstance.prototype.createInstance = function(data) {
		console.log('__creating instance of peer__');
		var self = this;

	/* ATTENTION: La collecte des candidats Ice pour le peer ne se passe dorénavant plus par un paquet NO_MORE */
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.																	// Static variable inside event. Count of candidates.
			return function(ice){
				if(ice.candidate) 	{
					console.log("local "+ice.candidate.candidate);
					self.peerInfo.candidates.push(ice.candidate);
				}
				else
				{
					SERVER.send2WebSsocket(self.seed,self.peer,'ANSWER',self.peerInfo);
					console.log('GATHERING ICE STATE:'+self.pc.iceGatheringState+' -> sending:'+self.peerInfo.candidates.length+' ICE paquets.');
					self.pc.onicecandidate=null;

				}};
			}();
		/*->  this.pc.ondatachannel = function (event) {console.log('Datachannel echo'); self.setDataChannel(event.channel)};
			Ci dessus, fonction surranée utilisée pour le mode automatique 'negotiated: false' ou le channel coté peer se fait tout seul.
			L'inconvénient de ce mode passif, c'est que je n'arrivais pas à faire plusieurs data channels avec.
			Donc ici, les datachannels so,t faites activement avec la meme ID (il faut faire attention à ce que ce soit la même) */
		// ! ARCHITECHTURE ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:

		this.setDataChannel(this.pc.createDataChannel('main_channel', mainDataChannelOptions));

		console.log('Offer received'+JSON.stringify(data));
		var remoteDescription = new RTCSessionDescription(data.offer);	// ---> CREATION DE LA REPONSE A L'OFFRE RECUE. (mode automatique)
		this.pc.setRemoteDescription(remoteDescription,function(){
	/* ATTENTION: Fonction de secours permettant au peer de rececvoir les candidats ICE du seed. cas d'offres vide venant de chrome. */
			console.log('OFFER RECEIVED');
			for (var i=0; i<data.candidates.length; i++)	{
				var candidat = new IceCandidate(data.candidates[i]);
				console.log('Apply new remote candidate:'+candidat.candidate);
				self.pc.addIceCandidate(candidat,function(){},errorHandler);
			}
			self.pc.createAnswer(function(answer){
				self.pc.setLocalDescription(answer,
				function(){
					console.log('Answer transmitted:'+JSON.stringify(answer));
					self.peerInfo.answer = answer;
				//}, errorHandler, constraints);
					}, errorHandler);
			}, errorHandler);
		},errorHandler);
	}
/*********************************************************************************************************************************************************************************************************************/
	instance.prototype.deleteObj = function() {
		console.log('Destruction de l\'objet courant');
		this.dataChannel.close();
		this.pc.close();
		this.pc=null;
		for (var key in this) { this[key]=null; }
		masterDeleteToNullObject(this);
	}
/*********************************************************************************************************************************************************************************************************************/
	instance.prototype.sendFile = function(file) {
		var file = file;
		var reader = new window.FileReader();

		console.log('Name:'+ file.name+' size:'+file.size+' type:'+file.type+' last modified:'+file.lastModifiedDate);
		this.send(JSON.stringify	({
			type: 'META',
			fileName    : file.name,
			fileSize	: file.size,
			fileType	: file.type
							}));

		reader.onload = function(segment) {

		}
		var offset = 0;
		if (is_chrome) var chunkSize = 64000;
		else 		   var chunkSize = 16000;

		var slice = file.slice(offset, offset + chunkSize);
		reader.readAsArrayBuffer(slice);
	}
/*********************************************************************************************************************************************************************************************************************/
	instance.prototype.interpreterCanal0 = function(jsonpaquet)
	{
		var obj = JSON.parse(jsonpaquet.data);
		obj.sender = this.remoteID;
		switch (obj.type) {

			case 'MSG':			_DOM_.displayMsg(obj.sender,obj.data);
				break;

			case 'ANNOUNCE':
				var wish = _FILE_.addAnnounce(obj);
				if (wish && wish.length) this.dataChannel.send("{\"type\":\"META-QUERY\",\"fingerprint\":[\""+wish.join('\",\"')+"\"]}");
				break;

			case 'META-QUERY':
				var wish = _FILE_.getMetaData(obj);
				if (wish && wish.length) {
					console.log('sending Meta Data to '+this.remoteID);
					for (var i=0; i<wish.length; i++) {
						wish[i].fileName = wish[i].name;
						wish[i].fileSize = wish[i].size;
						wish[i].fileType = wish[i].type;
					}
					this.dataChannel.send("{\"type\":\"META\",\"data\":"+JSON.stringify(wish)+"}");
				}
				break;

			case 'META':	_FILE_.addRemoteFile(obj);
				break;

			case 'QUERY_HASH':				// obj est passé en référence, la fonction appelée le modifie. (bon à savoir)
				if (_FILE_.queryFileHashTable(obj)) {
					obj.type = 'HASH_TABLE';
					this.dataChannel.send(JSON.stringify(obj));
				}
				break;

			case 'HASH_TABLE':
				console.log('Reception d\'une table da hash complete.');
				if (_FILE_.startPeerDownload(obj))		{}
				else 							console.log('_FILE response -> Fatal error, unknown fingerprint !');
				break;

			case 'P2P_PROPOSED':	_P2P_.createP2PChannel(this,obj);
				break;

			case 'EXIT':		this.deleteObj();
				break;

			default:			console.log('paquet incompréhensible recu...',true);
				break;
		}
	}
/*********************************************************************************************************************************************************************************************************************/
/******************************************************** PUBLICS METHODES OF _RTC_CORE_ ******************************************************************************************************************************/
	this.sendMsg = function(message,user) {
		if (session.length) {
			var obj = JSON.stringify({
				type: 'MSG',
				data: message
			});
			if (user)	{
				for (var i=0; i<session.length; i++) {
					if (session[i].remoteID == user) {
						if (session[i].dataChannel.readyState == 'open') {
							session[i].dataChannel.send(obj);
							return true;
			}}}}
			else
			{
				for (var i=0; i<session.length; i++) {
					if (session[i].dataChannel.readyState == 'open') session[i].dataChannel.send(obj);
				}
				return true;
	}}}

	this.sendAnnounce = function(data) {
		if (!session.length)	return true;
		var obj=JSON.stringify(data);
		for (var i=0; i<session.length; i++) {
			if (session[i].dataChannel.readyState == 'open') session[i].dataChannel.send(obj);
	}}
	this.queryHashForDownload= function(file) {	// WARNING: Consultation de la liste des possesseurs ici; non ?
		for (var i=0; i<session.length; i++) {
			if (session[i].remoteID == file.owner) {
				if (session[i].dataChannel.readyState == 'open') {
					session[i].dataChannel.send(JSON.stringify({
								type		: 'QUERY_HASH',
								fingerprint	: file.fingerprint
					}));
					return false;
				}
		}}
		return true;
	}

	this.createFileChannel = function(seeder,evt) {
		for (var i=0; i<session.length; i++) {
			if (session[i].remoteID == seeder) {
				return _P2P_.createP2PChannel(session[i],false,evt);
			}
		}
	}

	var localUser = false;
	var setLocalUser = function(name) {
		console.log('Setting localUser to '+name);
		localUser = name;
	}
	this.getLocalUser = function() { return localUser; }

	var SERVER;
	this.addServer = function(IP) { SERVER = new server(IP); }

	window.addEventListener('beforeunload', function () {
		if (session.length) {
			var exitMsg = {
				type: 'EXIT'
			};
			for (var i=0; i<session.length; i++) {
				if (session[i].dataChannel.readyState == 'open') session[i].dataChannel.send(JSON.stringify(exitMsg));
			}
		}
	}, false);
/*********************************************************************************************************************************************************************************************************************/
/*********************************************************************************************************************************************************************************************************************/
	console.log('_RTC_CORE_ successfully loaded.',1);
}



/*			if (jsonpaquet.data == '[object ArrayBuffer]' || jsonpaquet.data =='[object Blob]') {		// Firefox - Chrome
			console.log("Got Data Channel Message:"+Object.prototype.toString.call(jsonpaquet.data));

			if (is_chrome) 	file.receavedBytes += jsonpaquet.data.byteLength;					// -> FIREFOX
			else 			file.receavedBytes += jsonpaquet.data.size;						// -> CHROME

			receiveBuffer.push(jsonpaquet.data);

			if (file.receavedBytes >= file.size) {
				var received = new window.Blob(receiveBuffer);			// blob limit to 500mo in chrome !
				receiveBuffer.length=0;

				fileDOM[file.id].href=URL.createObjectURL(received);
				fileDOM[file.id].download = file.name;
				fileDOM[file.id].style.display = 'block';
										}}

	---> PART OF SENDFILE APRES READER ONLOAD :
			console.log('Taille du segment émis:'+segment.target.result.byteLength);
			superOBJ.send(segment.target.result);

			offset+=chunkSize;
			slice = file.slice(offset, offset + chunkSize);

			if (offset < file.size) {
				if (dataChannel.bufferedAmount <= 16000000) {
					console.log('buffer='+dataChannel.bufferedAmount);
					reader.readAsArrayBuffer(slice);
				}
				else
				{
					function timeout() {
						console.log('buffer='+dataChannel.bufferedAmount);
						if (dataChannel.bufferedAmount <= 1000000) 	reader.readAsArrayBuffer(slice);
						else 	setTimeout(function(){timeout()},50);
					}
					console.log('*** risk of buffer overflow ***');
					timeout();
					//setTimeout(function(){reader.readAsArrayBuffer(slice)},80);
				}
			}*/


