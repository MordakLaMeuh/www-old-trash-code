var webRTC = function() {
	/* Links to DOM functions && debug log */
	var debugError = console;
	var console	=_DOM_.console;				// graphic mode
	//console.RTCLog = console.log;			// console mode

	var errorHandler = function (err){console.alert(err);}	// Fonction en charge de l'affichage des erreures rencontrées

/*********************************************************************************************************************************************************************************************************************/
/******************************************************** MAIN OBJECT WEBSOCKET SERVER *******************************************************************************************************************************/
	var server = function(IP) {
		/* WARNING: 1-L'utilisation de l'API crypto passe forcément pas une page HTTPS sur la dernière version de chrome
		 * 		2-Aucune regression de sécurité n'est possible, si la page source est HTTPS le serveur node doit etre SSL aussi. */
		var serverType = {
			ssl	: true,
			ws	: 'ws://grosdada.eu:8080/',
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
					console.RTCLog('__HELO FROM SERVER__ :List of peer received:'+data.data.length);
					if (!data.data[0]) {
						console.RTCLog('__HELO PROCESS__ : The are no peer :(');
					}
					else {
						for (var i=0; i<data.data.length; i++)
							session[session.length]=new seedInstance(data.to,data.data[i]);
					}
					setLocalUser(data.to);
					break;
				case 'OFFER':
					console.RTCLog('__OFFER RECEIVED__ : from '+data.from);
					session[session.length]=new peerInstance(data.from,data.to,data.data);
					break;
				case 'ANSWER':
					console.RTCLog('__ANSWER FROM PEER RECEICED__'+data.from);
					for (var i=0; i<session.length; i++)
					{
						if (data.from == session[i].peer) {
							session[i].receaveAnswer(data.data);
							break;
						}
					}
					break;
				default:
					console.RTCLog('some stuff received');
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
	var constraints = {	//OfferToReceiveAudio/Video tells the other peer that you would like to receive video or audio from them.
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true
		}
	};
	var ICEServers = {iceServers: [{url: "stun:stun.l.google.com:19302"}]};			// Serveur STUN de google.

	var masterDeleteToNullObject = function(obj) {							// Méthode APPROXIMATIVE de destruction d'objet, need mutex ? (webworker ?)
		for (var i=0; i<session.length; i++)
		{
			if (obj == session[i]) {
				session[i] = null;								// null + splice... Is it necessary ?
				session.splice(i,1);
				console.RTCLog('Suppression de l\'objet:'+i+'.nombre d\'objets restant:'+session.length);
			}
		}
	}
/*********************************************************************************************************************************************************************************************************************/
/***************************************************** MAIN OBJECT INSTANCE SEED <---> PEER **************************************************************************************************************************/
	var instance = function(seed,peer) {
		var SUPER = this;

		this.seed 		= seed;
		this.peer 		= peer;
		this.remoteID   	= null;

		this.pc = new PeerConnection(ICEServers, options);

		this.dataChannelOpen = false;
		this.dataChannel = null;
		this.setDataChannel = function(ref) {
			this.dataChannel = ref;
			this.dataChannel.onopen = function() {console.RTCLog('opening channel 0'); SUPER.dataChannelOpen=true;} // Création des enevements associés au this.dataChannel.
			this.dataChannel.onclose = function() {console.RTCLog('channel 0 disable');}
			this.dataChannel.onerror = function(event) {console.RTCLog('EROOR on channel 0:'+event);}
			this.dataChannel.onmessage = function(event) { SUPER.interpreterCanal0(event); }
		}
	/*** TEST SEQUENCE : ***/
/*
		this.setDataChannel2 = function(ref) {
			this.dataChannel2 = ref;
			this.dataChannel2.onopen = function() {console.RTCLog('opening sendChannel'); SUPER.dataChannelOpen=true;} // Création des enevements associés au this.dataChannel.
			this.dataChannel2.onclose = function() {console.RTCLog('send channel disable'); SUPER.deleteObj(SUPER); }
			this.dataChannel2.onerror = function(event) {console.RTCLog('EROOR on sendChannel :'+event);}
			this.dataChannel2.onmessage = function(event) { console.RTCLog('Reception sur canal 2'); SUPER.interpreterPaquet(event); }
		}*/
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
/*********************************************************************************************************************************************************************************************************************/
	seedInstance.prototype.createInstance = function() {
		console.RTCLog('__creating instance of seed__');
		var SUPER = this;
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.
			return function(ice){			// Static variable inside event. Count of candidates.
				if(ice.candidate) 	{
					console.RTCLog('Ice gathering from ICE server - '+ice.candidate.candidate);
					SUPER.seedInfo.candidates.push(ice.candidate);
				}
				else
				{
					console.RTCLog('gathering ice:'+SUPER.pc.iceGatheringState);
					console.RTCLog('null candidate detected. Number of ICE candidates:'+SUPER.seedInfo.candidates.length);
					if (SUPER.seedInfo.candidates.length == 0) console.RTCLog('ICE Candidates may be already in browser cache !');

					SERVER.send2WebSsocket(SUPER.peer,SUPER.seed,'OFFER',SUPER.seedInfo);

					SUPER.pc.onicecandidate=null;			// Termine une fois pour toute l'event ICE.
				}};
			}();
	// OLD ARCHITECHTURE - obsolete ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:
		this.setDataChannel(this.pc.createDataChannel('main_channel',{
								negotiated:true, reliable: true,  id:0
										}))
	/*** TEST SEQUENCE : ***/
	/*
		this.setDataChannel2(this.pc.createDataChannel('file_channel',{
								negotiated:true, reliable: true,  id:1
										}))									*/

		this.pc.createOffer(function(offer){	 			//create an offer sdp
			SUPER.pc.setLocalDescription(offer,
			function(){}
			, errorHandler);
			console.RTCLog('native offer='+JSON.stringify(offer));
			SUPER.seedInfo.offer = offer;
			}, errorHandler, constraints);

	/* EXPERIMENTAL: Applique Answer puis les candidats. Le tout est arrivé dans le même paquet JSON. */
		this.receaveAnswer = function(data)	{
			console.RTCLog('Answer received from peer:'+JSON.stringify(data));
			var remote = new RTCSessionDescription(data.answer);
			this.pc.setRemoteDescription(remote,function(){
				for (var i=0; i<data.candidates.length; i++)	{
					SUPER.pc.addIceCandidate(new IceCandidate(data.candidates[i]),function(){},errorHandler);
					console.RTCLog('ice success applied:'+data.candidates[i].candidate);
				}
			},errorHandler);
		}
	}
/*********************************************************************************************************************************************************************************************************************/
	peerInstance.prototype.createInstance = function(data) {
		console.RTCLog('__creating instance of peer__');
		var SUPER = this;
	/* ATTENTION: La collecte des candidats Ice pour le peer ne se passe dorénavant plus par un paquet NO_MORE */
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.																	// Static variable inside event. Count of candidates.
			return function(ice){
				if(ice.candidate) 	{
					console.RTCLog("local "+ice.candidate.candidate);
					SUPER.peerInfo.candidates.push(ice.candidate);
				}
				else
				{
					SERVER.send2WebSsocket(SUPER.seed,SUPER.peer,'ANSWER',SUPER.peerInfo);
					console.RTCLog('GATHERING ICE STATE:'+SUPER.pc.iceGatheringState+' -> sending:'+SUPER.peerInfo.candidates.length+' ICE paquets.');
					SUPER.pc.onicecandidate=null;
				}};
			}();
		/*->  this.pc.ondatachannel = function (event) {console.RTCLog('Datachannel echo'); SUPER.setDataChannel(event.channel)};
			Ci dessus, fonction surranée utilisée pour le mode automatique 'negotiated: false' ou le channel coté peer se fait tout seul.
			L'inconvénient de ce mode passif, c'est que je n'arrivais pas à faire plusieurs data channels avec.
			Donc ici, les datachannels so,t faites activement avec la meme ID (il faut faire attention à ce que ce soit la même) */

		this.setDataChannel(this.pc.createDataChannel('main_channel',{	// ! ARCHITECHTURE ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:
					negotiated:true, reliable: true,  id:0
										}))
	/*
		this.setDataChannel2(this.pc.createDataChannel('file_channel',{	// ! ARCHITECHTURE ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:
					negotiated:true, reliable: true,  id:1
										}))
	*/
		console.RTCLog('Offer received'+JSON.stringify(data));
		var remoteDescription = new RTCSessionDescription(data.offer);	// ---> CREATION DE LA REPONSE A L'OFFRE RECUE. (mode automatique)
		this.pc.setRemoteDescription(remoteDescription,function(){
	/* ATTENTION: Fonction de secours permettant au peer de rececvoir les candidats ICE du seed. cas d'offres vide venant de chrome. */
			console.RTCLog('OFFER RECEIVED ------OFFER RECEIVED--------OFFER RECEIVED-------- OFFER RECEIVED--------');
			for (var i=0; i<data.candidates.length; i++)	{
				var candidat = new IceCandidate(data.candidates[i]);
				console.RTCLog('Apply new remote candidate:'+candidat.candidate);
				SUPER.pc.addIceCandidate(candidat,function(){},errorHandler);
			}
			SUPER.pc.createAnswer(function(answer){
				SUPER.pc.setLocalDescription(answer,
				function(){
					console.RTCLog('Answer transmitted:'+JSON.stringify(answer));
					SUPER.peerInfo.answer = answer;
				}, errorHandler, constraints);
			}, errorHandler);
		},errorHandler);
	}
/*********************************************************************************************************************************************************************************************************************/
	seedInstance.prototype.deleteObj = peerInstance.prototype.deleteObj = function(SUPER) {
		console.RTCLog('Destruction de l\'objet courant');
		SUPER.dataChannel.close();
		SUPER.pc.close();
		SUPER.pc=null;
		for (var key in SUPER) { SUPER[key]=null; } 	// WARNING ! Utiliser this à la place d'obj alors que la fonction est lancée par un event ferait un bug, this n'étant pas dans le cas d'event l'objet principal.
		masterDeleteToNullObject(SUPER);
	}		// ATTENTION Ajout de var devant key à tester.
/*********************************************************************************************************************************************************************************************************************/
	seedInstance.prototype.sendHashFile = peerInstance.prototype.sendHashFile = function(data) {
	}

	seedInstance.prototype.sendFile  = peerInstance.prototype.sendFile = function(file) {
		var file = file;
		var reader = new window.FileReader();

		console.RTCLog('Name:'+ file.name+' size:'+file.size+' type:'+file.type+' last modified:'+file.lastModifiedDate);
		this.send(JSON.stringify	({
			rtcDataType: 'META',
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
	/*
	seedInstance.prototype.send  = peerInstance.prototype.send = function(data) {
		if (this.dataChannelOpen == false) { console.RTCLog('data-channel not opened'); return; }
		this.dataChannel.send(data);
	}*/
/*********************************************************************************************************************************************************************************************************************/
	seedInstance.prototype.interpreterCanal0  = peerInstance.prototype.interpreterCanal0 = function(jsonpaquet)
	{
		var data = JSON.parse(jsonpaquet.data);
		switch (data.rtcDataType) {
			case 'META':
				data.owner = this.remoteID;
				_FILE_.addRemoteFile(data);
				console.RTCLog('receved_hash:'+data.fingerprint);	// Waiting fot user decision.
				break;
			case 'ID_CARD_DEMAND':
				data.owner = this.remoteID;
				// Ici c'est commme si data était passé comme référence, la fonction appelée l'enrichit de IDENTITY_CARD, bon à savoir :)
				if (!_FILE_.queryFileHashTable(data)) {				// return value : true->error ; false->valid
					for (var i=0; i<session.length; i++) {
						if (session[i].remoteID == data.owner) {
							if (session[i].dataChannelOpen == false) console.RTCLog('WARNIG; Main data channel closed.');
							else {
								data.rtcDataType = 'HASH_TABLE';
								session[i].dataChannel.send(JSON.stringify(data));
								return false;
							}
						}
					}
					console.RTCLog('Remote client does not exist !');
				}
				else console.RTCLog('fatal error: File not found.');
				break;
			case 'HASH_TABLE':
				data.owner = this.remoteID;
				console.RTCLog('Reception de la table de hash Totale');
				break;
			case 'EXIT':
				this.deleteObj(this);
				break;
			default:
				_DOM_.displayMsg(this.remoteID,data.msg);
				break;
		}
	}

	window.addEventListener('beforeunload', function () {
		if (session.length) {
			var exitMsg = {
				rtcDataType: 'EXIT'
			};
			for (var i=0; i<session.length; i++) {
				if (session[i].dataChannelOpen == false) {}
				else session[i].dataChannel.send(JSON.stringify(exitMsg));
			}
		}
	}, false);
/*********************************************************************************************************************************************************************************************************************/
/******************************************************** PUBLICS METHODES OF _RTC_CORE_ ******************************************************************************************************************************/
	this.sendMsgToAll = function(msg) {								// QUICK METHODE - Bypass session Interface
		if (session.length) {
			for (var i=0; i<session.length; i++) {
				//console.RTCLog('envoi msg');
				if (session[i].dataChannelOpen == false) {}
				else {
					session[i].dataChannel.send(msg);
					//console.RTCLog('envoi msg:'+session[i].dataChannel.readyState+'ordered'+session[i].dataChannel.ordered+'ice:'+session[i].pc.iceConnectionState+session[i].pc.signalingState);
				}
			}
			return false;
		}
		else return true;
	}
	this.sendMetaDataToAll = function(meta) {							// QUICK METHODE - Bypass session Interface
		if (session.length) {
			var i = 0;
			var j = 0;
			for ( i=0; i<session.length; i++) {
				if (session[i].dataChannelOpen == false) {}
				else {
					meta.rtcDataType = 'META';
					session[i].dataChannel.send(JSON.stringify(meta));
					j++;
				}
			}
			if (i != j) return true;
			else 		return false;
		}
		else return true;
	}
	this.transmitDownloadDemand = function (data) {					 	// QUICK METHODE - Bypass session Interface
		for (var i=0; i<session.length; i++) {
			if (session[i].remoteID == data.owner) {
				if (session[i].dataChannelOpen == false) return true;
				else {
					data.rtcDataType = 'ID_CARD_DEMAND';
					session[i].dataChannel.send(JSON.stringify(data));
				}
				return false;
			}
		}
		return true;
	}
	var localUser = false;
	var setLocalUser = function(name) {
		console.RTCLog('Setting localUser to '+name);
		localUser = name;
	}
	this.getLocalUser = function() { return localUser; }

	var SERVER;
	this.addServer = function(IP) { SERVER = new server(IP); }
/*********************************************************************************************************************************************************************************************************************/
/*********************************************************************************************************************************************************************************************************************/
	console.log('_RTC_CORE_ successfully loaded.',1);
}

























/*	seedInstance.prototype.interpreterPaquet  = peerInstance.prototype.interpreterPaquet = function(jsonpaquet)
	{
		if (jsonpaquet.data == '[object ArrayBuffer]' || jsonpaquet.data =='[object Blob]') {					// Firefox - Chrome
			console.RTCLog("Got Data Channel Message:"+Object.prototype.toString.call(jsonpaquet.data));

			if (is_chrome) 	file.receavedBytes += jsonpaquet.data.byteLength;							// -> FIREFOX
			else 			file.receavedBytes += jsonpaquet.data.size;								// -> CHROME

			receiveBuffer.push(jsonpaquet.data);

			if (file.receavedBytes >= file.size) {
				var received = new window.Blob(receiveBuffer);			// blob limit to 500mo in chrome !
				receiveBuffer.length=0;

				fileDOM[file.id].href=URL.createObjectURL(received);
				fileDOM[file.id].download = file.name;
				fileDOM[file.id].style.display = 'block';
										}}
		else						{
			var data = JSON.parse(jsonpaquet.data);
			switch (data.rtcDataType) {
				case 'META':
					data.owner = this.remoteID;
					_FILE_.addRemoteFileIndex(data);
					console.RTCLog('receved_hash:'+data.fingerprint);
					break;
				case 'ID_CARD_DEMAND':
					data.owner = this.remoteID;
					console.RTCLog(JSON.stringify(data));
					break;
		*//* _RTC_CORE_ Semble avoir un accès directe au chat */
		/*		default:
					if (data.msg_type == 'ECHO') {} // console.RTCLog(data.data);
					else _DOM_.displayMsg(this.remoteID,data.msg);
					break;
			}
		}
	}	*/

/* PART OF SENDFILE APRES READER ONLOAD :
			console.RTCLog('Taille du segment émis:'+segment.target.result.byteLength);
			superOBJ.send(segment.target.result);

			offset+=chunkSize;
			slice = file.slice(offset, offset + chunkSize);

			if (offset < file.size) {
				if (dataChannel.bufferedAmount <= 16000000) {
					console.RTCLog('buffer='+dataChannel.bufferedAmount);
					reader.readAsArrayBuffer(slice);
				}
				else
				{
					function timeout() {
						console.RTCLog('buffer='+dataChannel.bufferedAmount);
						if (dataChannel.bufferedAmount <= 1000000) 	reader.readAsArrayBuffer(slice);
						else 	setTimeout(function(){timeout()},50);
					}
					console.RTCLog('*** risk of buffer overflow ***');
					timeout();
					//setTimeout(function(){reader.readAsArrayBuffer(slice)},80);
				}
			}*/
