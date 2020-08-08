var webRTC = function() {
	/* Links to DOM functions */
	var console=DOM.console;
	var chat=DOM.displayMsg;

	/* BEGIN */
	console.log('Connexion to serveur:');

	var socket = new WebSocket('ws://naomail.eu:8000/');
	var session = new Array();
	
	var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;	// Choisis le constructeur approprié pour PeerConnection selon chrome ou mozilla. PeerConnection est un archétype objet.
	var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;								// Ne pas oublier de proposer les différents noms de prototypes selon le navigateur !
	var RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;

	var is_chrome = (navigator.userAgent.indexOf("Chrome") > 0)?true:false;
	var options =  	{
		optional:	[
			{RtpDataChannels: !is_chrome},		
			{DtlsSrtpKeyAgreement: true}
				]	
	};
	var send2WebSsocket = function(to,from,msg,data) {
		socket.send(JSON.stringify	({					// Envoit d'un candidat spécial NO_MORe lorsque tous les candidats ont été découverts. Important  pour le déclenchement de l'event ICE
				to	: to,
				from  : from,
				msg 	: msg,
				data  : data
							}))	
	}
	var servers = {iceServers: [{url: "stun:stun.l.google.com:19302"}]};			// Serveur STUN de google.
		
	var errorHandler = function (err){console.error(err);}					// Fonction en charge de l'affichage des erreures rencontrée.?=
		
	var masterDeleteToNullObject = function(obj) {							// Méthode APPROXIMATIVE de destruction d'objet, need mutex ? (webworker ?)
		for (i=0; i<session.length; i++) 
		{
			if (obj == session[i]) {
				session[i] = null;								// null + splice... Is it necessary ?
				session.splice(i,1);
				console.log('Suppression de l\'objet:'+i+'.nombre d\'objets restant:'+session.length);
			}	
		}
	}
	
	this.sendMsgToAll = function(msg) {
		for (i=0; i<session.length; i++) {
			session[i].send(msg);
		}
	}
	this.sendMetaDataToAll = function(file) {
		for (i=0; i<session.length; i++) {
			session[i].sendFile(file);
		}
	}
	
	socket.onmessage = function(){
		
		return function(str){
			console.log(str);
			var data=JSON.parse(str.data);		// Penser à .data pour lire le contenu de la chaine recue (ou le payload, la charge)
			
			switch(data.msg) {
				case 'HELO':
					console.log('__HELO FROM SERVER__ :List of peer received:'+data.data.length);
					if (!data.data[0]) {
						console.log('__HELO PROCESS__ : The are no peer :(');
						return;
					}
					else {
						for (var i=0; i<data.data.length; i++) {
							session[session.length]=new instance('banane',data.to,data.data[i]);
						}
					}
					break;
				case 'OFFER':
					console.log('__OFFER RECEIVED__ : from '+data.from);
					session[session.length]=new instance('banane',data.from,data.to,data.data);
					break;
				case 'ANSWER':
					console.log('__ANSWER FROM PEER RECEICED__'+data.from);
					for (var i=0; i<session.length; i++)
					{
						if (data.from == session[i].getPeer()) {
							session[i].receaveAnswer(data.data);
							break;
						}
					}
					break;
				case 'CANDIDATE':
					for (var i=0; i<session.length; i++)
					{
						if (data.from == session[i].getPeer()) {
							session[i].applyAllCandidates(data.data);
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
				
	socket.onopen=function(){								// Dès que le socket est dispoanible avec le serveur, la première chose que fait le client est d'envoyer HELO.
		socket.send(JSON.stringify({
			msg	: 'HELO'
			}))}
/*********************************************************************************************************************************************************************************************************************/
	var instance = function(channel,seed,peer,data) {
	
		var seed = seed;
		var peer = peer;
		this.getPeer = function() {return peer;}
			
		var pc = new PeerConnection(servers, options);
			
		var dataChannelOpen = false;
		var dataChannel = null;
		var setDataChannel = function(ref) {
			dataChannel = ref; 
			dataChannel.onopen = function() {console.log('opening sendChannel'); dataChannelOpen=true;}		// Création des enevements associés au this.dataChannel.	
			dataChannel.onclose = function() {console.log('send channel disable'); deleteObj(); }
			dataChannel.onerror = function(event) {console.log('EROOR on sendChannel :'+event);}
			dataChannel.onmessage = function(event) { interpreterPaquet(event); }		
	/*		this.dataChannel.onopen 	= function() {console.log('Ouverture du data Channel'+event);  echoSending=setInterval(function(){send(JSON.stringify	({
							msg_type: 'ECHO',
							data    : 'echo'
										}));},1000)};	// Keep datachannel open (chrome specialy) }	// Keep datachannel open (chrome specialy) */
		}
		var superOBJ = this;			// superOBJ désigne l'objet au cas ou this ne fait par référence à lui-même. (cas des events)
/*********************************************************************************************************************************************************************************************************************/
		if(!data)							/*** CAS DU POSITIONNEMENT EN SEED ***/
		{
			console.log('__creating instance of seed__');
			pc.candidateList = new Array;
				
			pc.sendIcePaquetsEvent = document.createEvent('Event');					// *** Définition de l'évent d'envoi des IPs stun/ice collectées. ***
			pc.sendIcePaquetsEvent.initEvent('IceSending', true, true);
			pc.sendIcePaquetsListener = function () {
				console.log('EVENT TRIGGERED: All_Candidates_Receved_for_send_offer. Envoi de:'+JSON.stringify(pc.localDescription));
				send2WebSsocket(peer,seed,'OFFER',pc.localDescription);			
				removeEventListener('IceSending', pc.sendIcePaquetsListener);
			};
			
			pc.IceCollectionEvent = document.createEvent('Event');					// *** Définition de l'évent d'application des paquets ICE collecté pour l'enregistrement de la réponse ICE ***
			pc.IceCollectionEvent.initEvent('iceCollect', true, true);
			
			var iceCollecting = (function () {
				var eventLaunched=0;
			
				pc.iceCollectionListener = function () {
					eventLaunched++;
					if ( eventLaunched != 2 ) { console.log ('All ice event triggered; Launcher Insuffisant'); return; }
					
					eventLaunched=0;
					console.log('* ALL_ICE_COLLECTED_EVENT TRIGGERED *');
					if (pc.candidateList.length == 0) 	console.log('____NO_ICE_CANDIDATE____');
					else						console.log('Recovery List contain '+pc.candidateList.length+' ice candidates.');
					for (var i=0; i<pc.candidateList.length; i++)	{ 
						pc.addIceCandidate(pc.candidateList[i],function(){},errorHandler);
						console.log('ice success applied:'+pc.candidateList[i].candidate);
													}
					removeEventListener('iceCollect', pc.iceCollectionListener, false);
				};
			})()
			
			pc.onicecandidate = function(){								// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.
				var numberOfCandidates=0;																		// Static variable inside event. Count of candidates.
				return function(ice){
					if(ice.candidate) 	{
						console.log(ice.candidate.candidate);
						numberOfCandidates++;
					}
					else	
					{	
						console.log('gathering ice:'+pc.iceGatheringState);						// ATTENTION 	GOOGLE CHROME n'envoi( aucun ICE candidat dans son offre. (ils seront envoyés (a coté) ici. 
						console.log('null candidate detected. Number of ICE candidates:'+numberOfCandidates);			// Il semble que celà devienne la même chose avec les nouvelles version de firefox.
						if (numberOfCandidates==0) console.log('ICE Candidates may be already in browser cache !');  
						pc.onicecandate=null;							// Termine une fois pour toute l'event ICE.
						
						dispatchEvent(pc.sendIcePaquetsEvent);	// pc.mode=offer quand le serveur a demandé de créer une offre. un event est déclenché dans ce cas, ne se fait
																				// qu'une fois que TOUS les candidats ICE ont été pris en compte 
					}};
				}();
				
			setDataChannel(pc.createDataChannel('hulk',{			// ! ARCHITECHTURE ! SEUL le 'seed' va créer le datachannel, le 'peer' ne fera que l'utiliser dans l'autre sens:
								reliable: true
										}))								
			pc.createOffer(function(offer){	 					//create an offer sdp
				pc.setLocalDescription(offer, 
				function(){}
				, errorHandler);
				console.log('native offer='+JSON.stringify(offer));
			
				addEventListener('IceSending', pc.sendIcePaquetsListener);
				}, errorHandler);
				
			addEventListener('iceCollect', pc.iceCollectionListener);	// Préparation à l'écoute des candidats ICe qui viendront avec la réponse du peer.
				
			this.receaveAnswer = function(data)	{
				var remote = new RTCSessionDescription(data);
				pc.setRemoteDescription(remote,function(){
					console.log('Answer received:'+JSON.stringify(data)); 
					dispatchEvent(pc.IceCollectionEvent);			// Double EVENT, l'autre consiste à attendre l'enregistrement en dur de la réponse du peer.
					},errorHandler);
			}
			this.applyAllCandidates = function(data) {
				if (data == 'NO_MORE')	{
					console.log('Reception du paquet NO_MORE ice candidate');
					dispatchEvent(pc.IceCollectionEvent);			// Double EVENT, l'un consiste à attendre la réception d'un paquet CANDIDATE  'NO_MORE'.
									}
				else	{
					pc.candidateList[pc.candidateList.length] = new IceCandidate(data);
					console.log('CANDIDATE: Saving_remote_candidates:'+pc.candidateList[pc.candidateList.length-1].candidate);
					}
			}
			var deleteObj = function() {
				console.log('__Destruction de l\'objet courant__');
				dataChannel.close();
				pc.close();
				removeEventListener('IceSending', pc.sendIcePaquetsListener, false);
				removeEventListener('iceCollect', pc.iceCollectionListener, false);
				pc=null;
				for (key in superOBJ)	{ superOBJ[key]=null;}		// WARNING ! Utiliser this à la place d'obj alors que la fonction est lancée par un event ferait un bug, this n'étant pas dans le cas d'event l'objet principal.
				masterDeleteToNullObject(superOBJ);
			}	
		}
/*********************************************************************************************************************************************************************************************************************/
		else							/*** CAS DU POSITIONNEMENT EN PEER ***/
		{
			console.log('__creating instance of peer__');
			pc.onicecandidate = function(){								// EVENT candidats recus du serveur STUN, ne peux etre déclencher que par une création d'offre ou une demande d'answer à l'offre.
				var numberOfCandidates=0;																		// Static variable inside event. Count of candidates.
				return function(ice){
					if(ice.candidate) 	{
						console.log("peer:"+ice.candidate.candidate);
						numberOfCandidates++;

						send2WebSsocket(seed,peer,'CANDIDATE',ice.candidate);
					}
					else	
					{
						send2WebSsocket(seed,peer,'CANDIDATE','NO_MORE');
						
						console.log('peer: gathering ice:'+pc.iceGatheringState);						// ATTENTION 	GOOGLE CHROME n'envoi( aucun ICE candidat dans son offre. (ils seront envoyés (a coté) ici. 
						console.log('peer: null candidate detected. Number of ICE candidates:'+numberOfCandidates);			// Il semble que celà devienne la même chose avec les nouvelles version de firefox.  
						pc.onicecandate=null;							// Termine une fois pour toute l'event ICE.
					}};
				}();
			
			pc.ondatachannel = function (event) {										 	// (cas peer) Création des evenements associés au channel pour le peer
				setDataChannel(event.channel)
			};
			
			var remoteDescription = new RTCSessionDescription(data);			// ---> CREATION DE LA REPONSE A L'OFFRE RECUE. (mode automatique)
			pc.setRemoteDescription(remoteDescription,function(){},errorHandler);		
			pc.createAnswer(function(answer){
				pc.setLocalDescription(answer,
				function(){
					console.log('Envoi de:'+JSON.stringify(answer));
					send2WebSsocket(seed,peer,'ANSWER',answer);
					console.log('Native Answer='+JSON.stringify(answer));
				}, errorHandler);}, errorHandler);		
				
			var deleteObj = function() {
				console.log('Destruction de l\'objet courant');
				dataChannel.close();
				pc.close();
				pc=null;
				for (key in superOBJ) { superOBJ[key]=null; } 	// WARNING ! Utiliser this à la place d'obj alors que la fonction est lancée par un event ferait un bug, this n'étant pas dans le cas d'event l'objet principal.
				masterDeleteToNullObject(superOBJ);
				
			}
		}
/*********************************************************************************************************************************************************************************************************************/
			
		this.send  = function(data) {
			if (dataChannelOpen == false) { console.log('data-channel not opened'); return; }
			dataChannel.send(data); 
		}
			
		var file = new Object;
		//var downloadDiv = document.getElementById('downloadedFiles');
		var receiveBuffer = [];
		var fileDOM = new Array;
			
		var interpreterPaquet = function(jsonpaquet)		
		{
			if (jsonpaquet.data == '[object ArrayBuffer]' || jsonpaquet.data =='[object Blob]') {					// Firefox - Chrome
				console.log("Got Data Channel Message:"+Object.prototype.toString.call(jsonpaquet.data));
					
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
						
				if (data.rtcDataType == 'META')		{
					console.log('Extraction des meta données:');
					file.name = data.fileName;
					file.size = data.fileSize;
					file.type = data.fileType;
					file.receavedBytes = 0;
					console.log('Received meta-data:'+file.name+' size:'+file.size+' type:'+file.type);
						
					file.id = fileDOM.length;
					DOM.displayFile(file.name);
				}
				else 	{
					if (data.msg_type == 'ECHO') {} // console.log(data.data);
					else chat('bonobo',data.msg);
											}}
		}
			
		this.sendFile = function(file) {
		
			//var file = fileList[0];
			var file = file;
			var reader = new window.FileReader();
		
			console.log('Name:'+ file.name+' size:'+file.size+' type:'+file.type+' last modified:'+file.lastModifiedDate);
			superOBJ.send(JSON.stringify	({
				rtcDataType: 'META',
				fileName    : file.name,
				fileSize	: file.size,
				fileType	: file.type
								}));
		/*
			reader.onload = function(segment) {
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
				}
			}	*/
			var offset = 0;
			if (is_chrome) var chunkSize = 64000;
			else 		   var chunkSize = 16000;
		
			var slice = file.slice(offset, offset + chunkSize);
			//reader.readAsArrayBuffer(slice);
		}	
	}
/*********************************************************************************************************************************************************************************************************************/
}