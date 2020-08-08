'use strict';
var Web_RTC = function() {	
// Links to DOM functions && debug log:
	//var debugError 	= console;		
	//var console	=_DOM_.console.RTCLog;				// -> graphic mode
	//console.log 	= console.log;					// -> console mode
	
	var errorHandler = function (err){ console.log(err); }				// Fonction en charge de l'affichage des erreures rencontrées.
	
	var ICEServers = {iceServers: [{urls: "stun:stun.l.google.com:19302"}]};	// Serveur STUN de google. -> TODO PATCH FIREFOX url est devenu urls	
	
// Publics méthodes of Web_RTC Global object:	L'utilisation ici de simples this plutot que de prototypes est justifiée par le fait que l'objet global Web_RTC n'est créer qu'une seule et unique fois.
	var p2p_Session = new Array();	   // L'optimisation mémoire offerte par les prototypes ne serait pas exploitée ici. Plusieurs sous-object prototypés instance SEED ou PEER sont créer dedans.
	
	var search_P2P_Session = function(peer) {
		for (var i=0; i<p2p_Session.length; i++) if (p2p_Session[i].peer == peer) return p2p_Session[i]; 
		return false;
	}
	
	this.initializeNewInstance = function(seed,peer,renew)  {
		var session = search_P2P_Session(peer);
		if (session) {
			if (!renew) return "Utilisation de la session de partage existante avec "+peer+" -> en cas de panne, tape /share /renew "+peer+" pour la renouveler:";
			session.deleteObj();
		}
		p2p_Session.push(new seedInstance(seed,peer)); 		
		return "Création d'une nouvelle session de partage avec "+peer+":";
	}
	this.initializePeerInstance = function(from,to,data) 	{ p2p_Session.push(new peerInstance(from,to,data)); }
	this.launchSeeding = function(from,data) { 
		var session = search_P2P_Session(from);
		if (session) {
			console.log('POST TRAITEMENT DE LA REPONSE');
			session.receaveAnswer(data);
		}
	}
	this.closeSession = function(peer) {
		var session = search_P2P_Session(peer);
		if (session) {
			session.deleteObj();
			return "Suppression de session reussie";
		}
		return "echec de suppression de session";
	}
	this.closeAllSessions = function() {
		for (var i=0; i<p2p_Session.length; i++) {
			p2p_Session[i].deleteObj();
		}
	} 
	this.sendFile = function(file,peer) {
		var session = search_P2P_Session(peer);
		if (session) {
			session.file = file;
			session.dataChannel.send(JSON.stringify	({
				type: 'meta',
				flag: false,
				fileName	: file.name,
				fileSize	: file.size,
				fileType	: file.type
										}));
		}
		else console.log('transfert impossible');
	}
// Private Stuff:
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
			
		this.dataChannel = null;
		this.setDataChannel = function(ref) {
			this.dataChannel = ref; 
			this.dataChannel.onopen = function() {
				console.log('channel id:'+self.dataChannel.id+' with '+self.remoteID+' -> current status:'+self.dataChannel.readyState);
				console.log('*BinaryType:'+self.dataChannel.binaryType+' *Negociated:'+self.dataChannel.negotiated +' *Protocol:'+self.dataChannel.protocol+' *Ordered:'+self.dataChannel.ordered);
				
				(self instanceof seedInstance) && self.dataChannel.send(JSON.stringify({
											type: 'test',
											sequence: 0
									    }));	
			} 
			this.dataChannel.onclose = function() {console.log('channel 0 disable');}
			this.dataChannel.onerror = function(event) {console.log('EROOR on channel 0:'+event);}
			this.dataChannel.onmessage = function(event) { self.interpreter_0Chan(event); }
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
// SEED SUB-PROTOTYPE:
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
					
					server.send_RTC('OFFER',self.peer,self.seed,self.seedInfo);
					self.pc.onicecandidate=null;			// Termine une fois pour toute l'event ICE.	
				}};
		}();
		this.setDataChannel(this.pc.createDataChannel('main_channel', mainDataChannelOptions));
		
		this.pc.createOffer(function(offer){	 			//create an offer sdp
			self.pc.setLocalDescription(offer, 
			function(){}
			, errorHandler);
			console.log('native offer='+JSON.stringify(offer));
			self.seedInfo.offer = offer;
		}, errorHandler);								// OR }, errorHandler, constraints); pour la visio-conférence par exemple.
			
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
// PEER SUB-PROTOTYPE:
	peerInstance.prototype.createInstance = function(data) {
		console.log('__creating instance of peer__');
		var self = this;	
									// ATTENTION: La collecte des candidats Ice pour le peer ne se passe dorénavant plus par un paquet NO_MORE.
		this.pc.onicecandidate = function(){	// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.																	// Static variable inside event. Count of candidates.
			return function(ice){
				if(ice.candidate) 	{
					console.log("local "+ice.candidate.candidate);
					self.peerInfo.candidates.push(ice.candidate);
				}
				else	
				{	
					server.send_RTC('ANSWER',self.seed,self.peer,self.peerInfo);
					console.log('GATHERING ICE STATE:'+self.pc.iceGatheringState+' -> sending:'+self.peerInfo.candidates.length+' ICE paquets.');						
					self.pc.onicecandidate=null;	
			}};
		}();
		/*->  this.pc.ondatachannel = function (event) {console.log('Datachannel echo'); self.setDataChannel(event.channel)};
			Ci dessus, fonction surranée utilisée pour le mode automatique 'negotiated: false' ou le channel coté peer se fait tout seul.
			L'inconvénient de ce mode passif, c'est que je n'arrivais pas à faire plusieurs data channels avec.
			Donc ici, les datachannels so,t faites activement avec la meme ID (il faut faire attention à ce que ce soit la même) */
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
		
	var masterDeleteToNullObject = function(obj) {							// Méthode APPROXIMATIVE de destruction d'objet, need mutex ? (webworker ?)		// TODO ?!?
		for (var i=0; i<p2p_Session.length; i++) 
		{
			if (obj == p2p_Session[i]) {
				p2p_Session[i] = null;								// null + splice... Is it necessary ?
				p2p_Session.splice(i,1);
				console.log("Suppression de l'objet:"+i+".nombre d'objets restant:"+p2p_Session.length);
	}}}
								
	instance.prototype.deleteObj = function() {
		console.log('Destruction de l\'objet courant');
		this.dataChannel.close();
		this.pc.close();
		this.pc=null;
		for (var key in this) { this[key]=null; } 	
		masterDeleteToNullObject(this);				
	}

	instance.prototype.set_File_Channel = function(ref) {
		var self = this;
		
		this.file_Channel = ref; 
		this.file_Channel.onopen = function() {
			(self instanceof seedInstance) && self.send_File();
		} 
		this.file_Channel.onclose = function() {}
		this.file_Channel.onerror = function(event) {}
		this.file_Channel.onmessage = function(event) {
			if (is_chrome) 	self.file.receavedBytes += event.data.byteLength;							// -> FIREFOX
			else 			self.file.receavedBytes += event.data.size;								// -> CHROME
				  
			self.file_Buffer.push(event.data);					
			if (self.file.receavedBytes >= self.file.size) {
				var received = new window.Blob(self.file_Buffer);			// blob limit to 500mo in chrome !
				new MW('id999',self.file.name,70,30,30,70,'#e74c3c','black',{'type':'image','url':URL.createObjectURL(received),'ratio':true,'opacity':false});
				console.log('stop !');
				
			/*	fileDOM[file.id].href=URL.createObjectURL(received);
				fileDOM[file.id].download = file.name;
				fileDOM[file.id].style.display = 'block';
				
				img.src = fileDOM[file.id].href;						// TODO AJOUT
				document.getElementById('image').appendChild(img);			*/
			}
		}
	}
	
	instance.prototype.send_File = function() {
		var self = this;

		var reader = new window.FileReader();
	
		console.log('Name:'+ this.file.name+' size:'+this.file.size+' type:'+this.file.type+' last modified:'+this.file.lastModifiedDate);
	
		reader.onload = function(segment) {
			console.log('Taille du segment émis:'+segment.target.result.byteLength);

			self.file_Channel.send(segment.target.result);
				
			offset+=chunkSize;
			slice = self.file.slice(offset, offset + chunkSize);
					
			if (offset < self.file.size) {
				if (self.file_Channel.bufferedAmount <= 16000000) {
					console.log('buffer='+self.file_Channel.bufferedAmount);
					reader.readAsArrayBuffer(slice);
				}
				else 
				{
					var timeout = function() {
						console.log('buffer='+self.file_Channel.bufferedAmount);
						if (self.file_Channel.bufferedAmount <= 1000000) 		reader.readAsArrayBuffer(slice);
						else 	setTimeout(function(){timeout()},50);
					}
					console.log('*** risk of buffer overflow ***');
					timeout(); 
				}					
			}
		}
		var offset = 0;
		var chunkSize = (is_chrome)?64000:16000;
      
		var slice = this.file.slice(offset, offset + chunkSize);
		reader.readAsArrayBuffer(slice);
	}

	instance.prototype.interpreter_0Chan = function(data)	{
		var obj = JSON.parse(data.data);
		switch (obj.type) {
			case 'test':
				display(JSON.stringify(obj));
				if (!obj.sequence) {
					obj.sequence = true;
					this.dataChannel.send(JSON.stringify(obj));
				}
				else 	display("Le canal de partage avec "+this.peer+" vient d'être crée.\n");
				break;
			case 'meta':
				if (!obj.flag) {
					display(JSON.stringify(obj));
					// TODO callback confirm.
					this.file = new Object;
					this.file.size = obj.fileSize;
					this.file.receavedBytes = 0;
					this.file.name = obj.fileName;
					this.file.type = obj.fileType;
					this.file_Buffer = [];
					this.set_File_Channel(this.pc.createDataChannel('file_Channel',	{	
							negotiated:true, reliable: true,  id:2
					}));
					obj.flag = true;
					this.dataChannel.send(JSON.stringify(obj));
				}
				else {
					this.set_File_Channel(this.pc.createDataChannel('file_Channel',	{	
							negotiated:true, reliable: true,  id:2
					}));
				}
				break;
			default:
				display("Unknown paquet !\n");
				break;
	}}	
	
/*	window.addEventListener('beforeunload', function () {	
		if (session.length) {
			var exitMsg = {
				type: 'EXIT'
			};
			for (var i=0; i<session.length; i++) {
				if (session[i].dataChannel.readyState == 'open') session[i].dataChannel.send(JSON.stringify(exitMsg));
			}
		}
	}, false); */

	console.log('_RTC_CORE_ successfully loaded.');
}

