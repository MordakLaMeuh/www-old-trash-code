'use strict';
var Web_RTC = function() {
// Links to DOM functions && debug log:
	//var debugError 	= console;
	//var console	=_DOM_.console.RTCLog;				// -> graphic mode
	//console.log 	= console.log;					// -> console mode

	/* IMPORTANT: Dans la version originale, un file_channel est créé dynamiquement pour chaque nouvel envoi de fichier, celà permet de profiter de l'event onopen de ce channel pour démarrer l'envoi des fichiers.
	   cependant un bug chaffouin est remarqué, qu'il soit seed ou peer, firefox ne sait pas clore correctement un data_Channel quand il est relié à une version de chrome. Une solution facile étant introuvable,
	   on enverra pour 'patcher' un status 'chrome ou pas' au peer, Si le peer a chrome et le seed firefox, les ordres de fermeture de socket seront envoyés au peer. Deux variables vont ainsi être utilisées,
	   is_chrome qui contient true si le client est sur chrome...
	   	seed:				peer:						S	P		closer			Le résultat de is_chrome? est envoyé dans le permier paquet test.
	 (is_chrome) false   --->   (is_chrome)? si true			-------
	 										     true-true  ->	SEED
				   <---	 					     true-false -> 	SEED
				   							    false-true  ->      PEER	- Le peer est informé qu'il va devoir fermer les channels, le seed sera informé de cet état de fait.
				   							    false-false ->	SEED
	   une propriété publique de 'instance' esr bornToClose et indique s'il faut fermer les channels. 																		*/

	// Fonctionne en mode injection de data: //

	var errorHandler = function (err){ console.log(err); }				// Fonction en charge de l'affichage des erreures rencontrées.

	var ICEServers = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};	// Serveur STUN de google. -> TODO PATCH FIREFOX url est devenu urls

// Publics méthodes of Web_RTC Global object:	L'utilisation ici de simples this plutot que de prototypes est justifiée par le fait que l'objet global Web_RTC n'est créer qu'une seule et unique fois.
	var p2p_Session = new Array();	   // L'optimisation mémoire offerte par les prototypes ne serait pas exploitée ici. Plusieurs sous-object prototypés instance SEED ou PEER sont créer dedans.
							   // La politique adoptée ici consiste à conserver la session de partage mais à détruire le flux de data à la fin de chaques utilisations.

	var search_P2P_Session = function(peer) {
		for (var i=0, len=p2p_Session.length; i<len; i++) if (p2p_Session[i].peer == peer) return p2p_Session[i];
		return false;
	}

	this.initializeNewInstance = function(seed,peer,renew)  {
		var session = search_P2P_Session(peer);
		if (session) {
			if (!renew) return "RTC: Utilisation de la session de partage existante avec "+peer+" -> en cas de panne, tape /share /renew "+peer+" pour la renouveler:";
			this.closeSession(peer);
		}
		p2p_Session.push(new seedInstance(seed,peer));
		return "RTC: Création d'une nouvelle session de partage avec "+peer+":";
	}
	this.initializePeerInstance = function(from,to,data) 	{ p2p_Session.push(new peerInstance(from,to,data)); }
	this.launchSeeding = function(from,data) {
		var session = search_P2P_Session(from);
		if (session) {
			console.log('RTC: POST TRAITEMENT DE LA REPONSE');
			session.receaveAnswer(data);
		}
	}
	this.closeSession = function(peer) {
		var session = search_P2P_Session(peer);
		if (session) {
			if (session.bornToClose) {
				(session.file_Channel) && session.file_Channel.close();
				session.data_Channel.close();
			}
			else 	session.data_Channel.send(JSON.stringify	({
				event: 'close',
				flag: true
											}));
			return "RTC: Suppression de session reussie";
		}
		return "RTC: echec de suppression de session";
	}
	this.closeAllSessions = function() {
		for (var i=0, len=p2p_Session.length; i<len; i++) {
			p2p_Session[i].deleteObj();
		}
	}
	this.sendFile = function(file,peer) {
		var session = search_P2P_Session(peer);

		if (session) {
			session.file_List.push.apply(session.file_List,file);
			if (session.ready) {
				session.ready = false;
				session.file = session.file_List[0];
				session.file_List.splice(0,1);
				session.data_Channel.send(JSON.stringify	({
					event: 'meta',
					flag: false,
					fileName	: session.file.name,
					fileSize	: session.file.size,
					fileType	: session.file.type
											}));
			}
			else display('RTC: Transfert en cours, mise en attente de transfert de fichier');
		}
		else display('RTC: transfert impossible -> Aucune session de partage active.\n');
	}
// Private Stuff:
	var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;	// Choisis le constructeur approprié pour PeerConnection selon chrome ou mozilla. PeerConnection est un archétype objet.
	var IceCandidate =   window.RTCIceCandidate || window.mozRTCIceCandidate; 							// Ne pas oublier de proposer les différents noms de prototypes selon le navigateur !
	var RTCSessionDescription = window.RTCSessionDescription|| window.mozRTCSessionDescription;

	var is_chrome = (navigator.userAgent.indexOf("Chrome") > 0)?true:false;
	var options =  	{
		optional:	[
			{RtpDataChannels: !is_chrome},// RtpDataChannels is required if we want to make use of the DataChannels API on Firefox.
			{DtlsSrtpKeyAgreement: true}	// DtlsSrtpKeyAgreement is required for Chrome and Firefox to interoperate.
				]
	};
	var constraints = {				// OfferToReceiveAudio/Video tells the other peer that you would like to receive video or audio from them. 			TODO Not utilised here.
		mandatory: {
			OfferToReceiveAudio: true,
			OfferToReceiveVideo: true
	}};
	var mainDataChannelOptions = {
		negotiated	: true,
		reliable	: true,
		ordered	: true,
		id:1
	}

// MAIN OBJECT INSTANCE SEED <---> PEER
	var instance = function(seed,peer) {
		var self = this;

		this.seed 		= seed;
		this.peer 		= peer;
		this.remoteID   	= null;

		this.pc = new PeerConnection(ICEServers, options);

		this.data_Channel = null;
		this.setDataChannel = function(ref) {
			this.data_Channel = ref;
			this.data_Channel.onopen = function() {
				console.log('RTC: channel id:'+self.data_Channel.id+' with '+self.remoteID+' -> current status:'+self.data_Channel.readyState);
				console.log('RTC: *BinaryType:'+self.data_Channel.binaryType+' *Negociated:'+self.data_Channel.negotiated +' *Protocol:'+self.data_Channel.protocol+' *Ordered:'+self.data_Channel.ordered);

				(self instanceof seedInstance) && self.data_Channel.send(JSON.stringify({
											event: 'test',
											sequence: 0,
											chrome: is_chrome
									    }));
			}
			this.data_Channel.onclose = function() {
				console.log('RTC: channel 0 disable');
				(self.file_Channel) && self.file_Channel.close();
				self.deleteObj();
			}
			this.data_Channel.onerror = function(event) {
				console.log('RTC: EROOR on channel 0:'+event);
			}
			this.data_Channel.onmessage = function(event) {
				self.interpreter_0Chan(event);
			}
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
		this.file_List = new Array();
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
// SEED SUB-PROTOTYPE:
	seedInstance.prototype.createInstance = function() {
		console.log('RTC: __creating instance of seed__');
		var self = this;
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.
			return function(ice){			// Static variable inside event. Count of candidates.
				if(ice.candidate) 	{
					console.log('RTC: Ice gathering from ICE server - '+ice.candidate.candidate);
					self.seedInfo.candidates.push(ice.candidate);
				}
				else
				{
					console.log('RTC: gathering ice:'+self.pc.iceGatheringState);
					console.log('RTC: null candidate detected. Number of ICE candidates:'+self.seedInfo.candidates.length);
					if (self.seedInfo.candidates.length == 0) console.log('RTC: ICE Candidates may be already in browser cache !');

					server.send_RTC('OFFER',self.peer,self.seed,self.seedInfo);
					self.pc.onicecandidate=null;			// Termine une fois pour toute l'event ICE.
				}};
		}();
		this.setDataChannel(this.pc.createDataChannel('main_channel', mainDataChannelOptions));

		this.pc.createOffer(function(offer){	 			//create an offer sdp
			self.pc.setLocalDescription(offer,
			function(){}
			, errorHandler);
			console.log('RTC: native offer='+JSON.stringify(offer));
			self.seedInfo.offer = offer;
		}, errorHandler);								// OR }, errorHandler, constraints); pour la visio-conférence par exemple.

	/* EXPERIMENTAL: Applique Answer puis les candidats. Le tout est arrivé dans le même paquet JSON. */
		this.receaveAnswer = function(data)	{
			console.log('RTC: Answer received from peer:'+JSON.stringify(data));
			var remote = new RTCSessionDescription(data.answer);
			this.pc.setRemoteDescription(remote,function(){
				for (var i=0, len=data.candidates.length; i<len; i++)	{
					self.pc.addIceCandidate(new IceCandidate(data.candidates[i]),function(){},errorHandler);
					console.log('RTC: ice success applied:'+data.candidates[i].candidate);
				}
			},errorHandler);
		}
	}
// PEER SUB-PROTOTYPE:
	peerInstance.prototype.createInstance = function(data) {
		console.log('RTC: __creating instance of peer__');
		var self = this;
									// ATTENTION: La collecte des candidats Ice pour le peer ne se passe dorénavant plus par un paquet NO_MORE.
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.																	// Static variable inside event. Count of candidates.
			return function(ice){
				if(ice.candidate) 	{
					console.log("RTC: local "+ice.candidate.candidate);
					self.peerInfo.candidates.push(ice.candidate);
				}
				else
				{
					server.send_RTC('ANSWER',self.seed,self.peer,self.peerInfo);
					console.log('RTC: GATHERING ICE STATE:'+self.pc.iceGatheringState+' -> sending:'+self.peerInfo.candidates.length+' ICE paquets.');
					self.pc.onicecandidate=null;
			}};
		}();
		/*->  this.pc.ondatachannel = function (event) {console.log('Datachannel echo'); self.setDataChannel(event.channel)};
			Ci dessus, fonction surranée utilisée pour le mode automatique 'negotiated: false' ou le channel coté peer se fait tout seul.
			L'inconvénient de ce mode passif, c'est que je n'arrivais pas à faire plusieurs data channels avec.
			Donc ici, les datachannels so,t faites activement avec la meme ID (il faut faire attention à ce que ce soit la même) */
		this.setDataChannel(this.pc.createDataChannel('main_channel', mainDataChannelOptions));

		console.log('RTC: Offer received'+JSON.stringify(data));

		var remoteDescription = new RTCSessionDescription(data.offer);	// ---> CREATION DE LA REPONSE A L'OFFRE RECUE. (mode automatique)
		this.pc.setRemoteDescription(remoteDescription,function(){
	/* ATTENTION: Fonction de secours permettant au peer de rececvoir les candidats ICE du seed. cas d'offres vide venant de chrome. */
			console.log('RTC: OFFER RECEIVED');
			for (var i=0, len=data.candidates.length; i<len; i++)	{
				var candidat = new IceCandidate(data.candidates[i]);
				console.log('RTC: Apply new remote candidate:'+candidat.candidate);
				self.pc.addIceCandidate(candidat,function(){},errorHandler);
			}
			self.pc.createAnswer(function(answer){
				self.pc.setLocalDescription(answer,
				function(){
					console.log('RTC: Answer transmitted:'+JSON.stringify(answer));
					self.peerInfo.answer = answer;
				//}, errorHandler, constraints);
					}, errorHandler);
			}, errorHandler);
		},errorHandler);
	}

	var masterDeleteToNullObject = function(obj) {							// Méthode APPROXIMATIVE de destruction d'objet, need mutex ? (webworker ?)		// TODO ?!?
		for (var i=0, len=p2p_Session.length; i<len; i++)
		{
			if (obj == p2p_Session[i]) {
				p2p_Session[i] = null;								// null + splice... Is it necessary ?
				p2p_Session.splice(i,1);
				console.log("RTC: Suppression de l'objet:"+i+".nombre d'objets restant:"+p2p_Session.length);
	}}}

	instance.prototype.deleteObj = function() {
		console.log('RTC: Destruction de l\'objet courant');
		this.data_Channel.close();
		this.pc.close();
		this.pc=null;
		for (var key in this) { this[key]=null; }
		masterDeleteToNullObject(this);
	}

	instance.prototype.set_File_Channel = function(ref) {
		var self = this;
		//var received;
		//var oldPart = new Array();
		this.file_Channel = ref;
		this.file_Channel.onopen = function() {
			self.ready = true;
			console.log('RTC: Ouverture du file channel:');
		}
		this.file_Channel.onclose = function() { console.log('RTC: fermeture du file_channel'); }
		this.file_Channel.onerror = function(event) {
			console.log('RTC: file-channel error:'+event);
		}
		this.file_Channel.onmessage = function(event) {
			if (is_chrome) 	self.file.receavedBytes += event.data.byteLength;							// -> FIREFOX
			else 			self.file.receavedBytes += event.data.size;								// -> CHROME

			/*
			if (!self.test) {
				self.received = new window.Blob(self.file_Buffer);
				self.test = true;
			}
			*/
			self.file_Buffer.push(event.data);
			if (self.file.receavedBytes >= self.file.size) {
			//if (self.file.receavedBytes >= self.file.size) {
			//if (((self.file.receavedBytes%240000) == 0) || (self.file.receavedBytes >= self.file.size)) {
				//var received = new window.Blob(self.file_Buffer.slice((self.file_Buffer.length*0.75),self.file_Buffer.length));			// blob limit to 500mo in chrome !
				//received = new window.Blob(oldPart.concat(self.file_Buffer));
				//oldPart = self.file_Buffer;
				//console.log(received.size);

				var received = new window.Blob(self.file_Buffer);

			//	if (self.file.receavedBytes >= self.file.size) DOM.create_New_Window(self.file.name,false,false,false,{'type':'download','file':received,'meta':self.file});
				//if ((self.file.receavedBytes / 240000) == 1) DOM.create_New_Window(self.file.name,false,false,false,{'type':'download','file':received,'meta':self.file});
				//if (!self.test) {

				 DOM.create_New_Window(self.file.name,false,false,false,{'type':'download','file':received,'meta':self.file});
				 //self.test = true;
				//}

				self.file_Buffer = new Array();

				self.data_Channel.send(JSON.stringify	({
					event: 'ack',
					flag: false
											}));
				console.log('RTC: Fichier recu avec succès.');
			}
		}
	}

	instance.prototype.send_File = function() {
		var self = this;

		var reader = new window.FileReader();

		console.log('RTC: Name:'+ this.file.name+' size:'+this.file.size+' type:'+this.file.type+' last modified:'+this.file.lastModifiedDate);
		display("RTC: Démarage de l'envoi du fichier "+this.file.name+"' vers "+this.peer+".\n");

		reader.onload = function(segment) {
			console.log('RTC: Taille du segment émis:'+segment.target.result.byteLength);

			self.file_Channel.send(segment.target.result);

			offset+=chunkSize;
			slice = self.file.slice(offset, offset + chunkSize);

			if (offset < self.file.size) {
				if (self.file_Channel.bufferedAmount <= 16000000) {			//console.log('buffer='+self.file_Channel.bufferedAmount);
					reader.readAsArrayBuffer(slice);
				}
				else
				{
					var timeout = function() {
						console.log('buffer='+self.file_Channel.bufferedAmount);
						if (self.file_Channel.bufferedAmount <= 1000000) 		reader.readAsArrayBuffer(slice);
						else 	setTimeout(function(){timeout()},50);
					}
					console.log('RTC: *** risk of buffer overflow ***');
					timeout();
				}
			}
		}
		var offset = 0;
		var chunkSize = (is_chrome)?64000:128000;					// old version 64000:16000

		var slice = this.file.slice(offset, offset + chunkSize);
		reader.readAsArrayBuffer(slice);
	}

	instance.prototype.interpreter_0Chan = function(frame) {
		var obj = JSON.parse(frame.data);
		switch (obj.event) {
			case 'test':
				if (!obj.sequence) {
					obj.sequence = true;
					if (!obj.chrome && is_chrome) {
						this.bornToClose = true;								// TODO patch communication firefox/chrome pour close() data_Channel.
						console.log('RTC: bornToClose actif pour cette section.');
					}
					obj.chrome = is_chrome;
					this.set_File_Channel(this.pc.createDataChannel('file_Channel', {
							negotiated:true, reliable: true,  id:2
					}));
					this.data_Channel.send(JSON.stringify(obj));
				}
				else 	{
					if (is_chrome || !obj.chrome) {
						this.bornToClose = true;
						console.log('RTC: bornToClose actif pour cette section.');
					}
					this.set_File_Channel(this.pc.createDataChannel('file_Channel', {
							negotiated:true, reliable: true,  id:2
					}));
					display("RTC: Le canal de partage avec "+this.peer+" vient d'être créé.\n");
				}
				break;
			case 'meta':
				if (!obj.flag) {
					if (this.file_Channel) console.log('file_Channel:'+this.file_Channel.readyState+':'+this.file_Channel.bufferedAmount);
					console.log('RTC: reception de meta:'+JSON.stringify(obj));
					// TODO callback confirm.
					this.file = new Object;
					this.file.size = obj.fileSize;
					this.file.receavedBytes = 0;
					this.file.name = obj.fileName;
					this.file.type = obj.fileType;
					this.file_Buffer = [];
					obj.flag = true;
					this.data_Channel.send(JSON.stringify(obj));
				}
				else 	this.send_File();
				break;
			case 'ack':
					display("RTC: Accusé de reception -> "+this.file.name+"' vers "+this.peer+".\n");

					if (this.file_List.length) {
						this.file = this.file_List[0];
						this.file_List.splice(0,1);
						this.data_Channel.send(JSON.stringify	({
							event		: 'meta',
							flag		: false,
							fileName	: this.file.name,
							fileSize	: this.file.size,
							fileType	: this.file.type
													}));
					}
					else this.ready = true;
				break;
			case 'close':
					(this.file_Channel) && this.file_Channel.close();
					this.data_Channel.close();
				break;
			default:
				display("RTC: Paquet incompréhensible recu via le canal 0.\n");
				break;
	}}
/*	window.addEventListener('beforeunload', function () {
		if (session.length) {
			var exitMsg = {
				type: 'EXIT'
			};
			for (var i=0; i<session.length; i++) {
				if (session[i].data_Channel.readyState == 'open') session[i].data_Channel.send(JSON.stringify(exitMsg));
			}
		}
	}, false); */
}

