var mainFILE = function() {
	/* Links to DOM functions */
	var console	=_DOM_.console;
	var fileTab	=_DOM_.fileTab;				// graphic mode
	//console.fileLog = console.log;			// console mode
		
/*********************************************************************************************************************************************************************************************************************/
/******************************************** Gestion de l'affichage de la liste des fichiers: ATTENTION utilise div fileTab *****************************************************************************************/
	var fileObject = function(file) {		
		this.deleteEntry 	 	= null;
		this.statusEntry   	= null;			
		this.nameEntry     	= null;	
	
		this.file				= file;
		this.IDENTITY_CARD 		= new Array();
		this.file.fingerprint		= (file.fingerprint)?file.fingerprint:false;
		this.file.owner			= (file.owner)?file.owner:false;
		
		this.createElements();
				
		/*("{\"from\":\"SERVER\",\"to\":\""+hexID+"\",\"msg\":\"HELO\",\"data\":[\""+IDENTITY_CARD.join('\",\"')+"\"]}")*/
	
		fileTab.refreshWindow();
	}
/* List of fileObject prototypes: Tous les prototypes semblent evoluer dans des contextes différents. util° of this. && var [...] */
	fileObject.prototype.stateSeed = function() {
		this.statusEntry.innerHTML = 'SEED';
		this.statusEntry.classList.remove("generatingHash");
		this.statusEntry.style.color = '#FFA500';
		this.statusEntry.onclick = null; 
	}
	fileObject.prototype.stateHash = function() {
		this.statusEntry.innerHTML = 'GENERATING HASH';
		this.statusEntry.classList.add("generatingHash");
	}
	fileObject.prototype.createElements = function () {
		var SUPER = this;
		
		var fileA 		= document.createElement('a');
		var fileP	 	= document.createElement('p');
		var fileDiv		= document.createElement('div') 
			
		fileA.className 		= 'sharingButton';
		fileP.innerHTML  		= this.file.name;
			
		fileDiv.className		= 'deleteFile';
		fileDiv.innerHTML	 	= 'DEL'
			
		fileDiv.onclick   	= function(e) { SUPER.delete(); return false; }	
				
		if (!this.file.fingerprint) {
			fileA.innerHTML 		= 'LOCAL';
			fileA.href			= URL.createObjectURL(this.file);
			fileA.download  		= '';
			fileA.onclick		= function(e) { SUPER.generateHash(SUPER.file); return false;}
		}
		else
		{
			fileA.innerHTML 		= 'REMOTE';
			fileA.onclick		= function(e) { SUPER.downloadFile(); return false;}
		}			
		this.deleteEntry 		= fileTab.utilize().appendChild(fileDiv);	
		this.statusEntry   	= fileTab.utilize().appendChild(fileA);
		this.nameEntry     	= fileTab.utilize().appendChild(fileP);
	}
	fileObject.prototype.downloadFile = function () {
		var obj = {
			owner 	: this.file.owner,
			fingerprint	: this.file.fingerprint
		}
		if (_RTC_CORE_.transmitDownloadDemand(obj))	console.fileLog('_RTC_CORE_ response -> warning: seed is out !',true);
		else 								console.fileLog('_RTC_CORE_ response -> Transmission de la demande de download');
	}
	fileObject.prototype.fullFileReceived = function() {
		var SUPER = this;
		
		this.statusEntry.innerHTML 		= 'LOCAL';
		this.statusEntry.href			= URL.createObjectURL(this.file);
		this.statusEntry.download  		= '';
			
		this.deleteEntry  = statusEntry.parentNode.insertBefore(document.createElement('div'), this.statusEntry);
					
		this.deleteEntry.className		= 'deleteFile';
		this.deleteEntry.innerHTML	 	= 'DEL'
		this.deleteEntry.onclick   		= function(e) { SUPER.delete(); return false; }		
	}
	fileObject.prototype.delete = function() {
		this.nameEntry.remove();
		this.statusEntry.remove();
		this.deleteEntry.remove();
		for (var key in this) { this[key]=null; }
		for (var i=0; i<fileList.length; i++) {
			if (fileList[i] == this) {
				console.fileLog('Suppression d\'un fichier validée.')
				fileList.splice(i,1);
				break;
			}
		}
		fileTab.refreshWindow();
	}
	fileObject.prototype.sendMetaData = function() {
		if (_RTC_CORE_) {
			var obj = {
				name: this.file.name,    
				size: this.file.size,
				type: this.file.type,
				fingerprint: this.file.fingerprint };
			if (_RTC_CORE_.sendMetaDataToAll(obj))	console.fileLog('_RTC_CORE_ response -> Nobody is here !',true);
			else 							console.fileLog('_RTC_CORE_ response -> Transmission des méta données effectuée');
		}
		else	console.fileLog('_RTC_CORE_ DOWN: unable to send meta-data',2);
	}
	
	/******************************************************************************************************************************/
	/*						fONCTIONS DE GÉNÉRATIONS DES fingerprint									*/
	var is_crypto = window.crypto && window.crypto.subtle && window.crypto.subtle.digest;
	var buffer_size = 1024*1024;
	
	var fastHashGenerating =  function(file) {
		console.fileLog('fast cryptographic api sha256 prototype enable');
		var SUPER=this;
		this.stateHash();
		var reader = new FileReader();
		reader.onload = function(event) {
			window.crypto.subtle.digest({name: "SHA-256"}, event.target.result)
			.then(function(hash) {
				var hexString = '', hashResult = new Uint8Array(hash);

				for (var i = 0; i < hashResult.length; i++) {
					hexString += ("00" + hashResult[i].toString(16)).slice(-2);
				}
				SUPER.IDENTITY_CARD.push(hexString);
				console.fileLog(hexString);
				
				currentSegment++;
				if ( currentSegment < requireSegment) {
					begin+=buffer_size; 
					end+=buffer_size;
					reader.readAsArrayBuffer(file.slice(begin,end));
				}
				else {
					window.crypto.subtle.digest({name: "SHA-256"}, new TextEncoder("utf-8").encode(SUPER.IDENTITY_CARD.join()))
					.then(function(hash) {
						var hexString = '', hashResult = new Uint8Array(hash);

						for (var i = 0; i < hashResult.length; i++) {
							hexString += ("00" + hashResult[i].toString(16)).slice(-2);
						}
						SUPER.file.fingerprint = hexString;
						console.fileLog('global fingerprint: '+SUPER.file.fingerprint);
						SUPER.stateSeed();
						SUPER.sendMetaData(file);
					});
					return false;
				}
			})
			.catch(function(error) {
	/* Recente version de chrome: si la page n'est pas SSL, l'api cryptographic plantera d'ou la regression planifiée ici. */
				console.fileLog(error,true);
				console.fileLog('regression de l\'api cryptographic !',true);
				SUPER.IDENTITY_CARD = new Array();
				fileObject.prototype.generateHash = slowHashGenerating;
				SUPER.generateHash(SUPER.file);
			});
		}
		var requireSegment = Math.ceil(file.size/buffer_size);
		var currentSegment = 0;
		var begin 	= 0;
		var end 	= buffer_size;
		console.fileLog('GENERATE IDENTITY CARD of '+file.name+' SIZE:'+file.size+' '+requireSegment+' segments finded.');

		reader.readAsArrayBuffer(file.slice(begin,end));
	}	
	
	var slowHashGenerating = function(file) {
		console.fileLog('slow manual worker sha256 prototype enable');
		var SUPER=this;
		this.stateHash();
			
		var worker = new Worker('file/sha256/sha256Worker.js');
		var reader = new FileReader();

		reader.onload = function (event) 	{ worker.postMessage(event.target.result, [event.target.result]); };
	
		var handle_hash_block = function (event) {
			console.fileLog(event.data);
			SUPER.IDENTITY_CARD.push(event.data);
			
			block.currentSegment++;
			if (block.currentSegment < block.requireSegment) {
				var begin = block.currentSegment*buffer_size;
				var end = begin + buffer_size;
				if (end > file.size)			end = file.size;	
				
				reader.readAsArrayBuffer(file.slice(begin, end));
			}
			else {
				var lastSha256Work = function(event) {
					SUPER.file.fingerprint = event.data;
					console.fileLog('global fingerprint: '+SUPER.file.fingerprint);
					worker.terminate();
					SUPER.stateSeed();
					SUPER.sendMetaData(file);
				}
				worker.removeEventListener('message', handle_hash_block);
				worker.addEventListener('message', lastSha256Work);
				var preCondensat = new TextEncoder("utf-8").encode(SUPER.IDENTITY_CARD.join());
				worker.postMessage(preCondensat.buffer,[preCondensat.buffer]);
			}
		};
		worker.addEventListener('message', handle_hash_block);

		var block = {
			'file_size' : file.size,
			'requireSegment' : (Math.ceil(file.size/buffer_size)),
			'currentSegment' : 0,
		};
		var end = (block.currentSegment+1)*buffer_size;
		if (end > file.size) end = file.size; 
		console.fileLog('GENERATE IDENTITY CARD of '+file.name+' SIZE:'+file.size+' '+block.requireSegment+' segments finded.');
			
		reader.readAsArrayBuffer(file.slice(0, end));
	}
	
	fileObject.prototype.generateHash = (is_crypto)?fastHashGenerating:slowHashGenerating;
	
/*********************************************************************************************************************************************************************************************************************/
/****************************************************** PUBLICS METHODES OF _FILE_ ***********************************************************************************************************************************/
	
	var fileList = new Array();
	
	this.queryFileHashTable = function(file) {
		for (var i=0; i<fileList.length; i++) {
			if (file.fingerprint == fileList[i].file.fingerprint)	{
				file.IDENTITY_CARD = fileList[i].IDENTITY_CARD;
				return false;
			}
		}
		return true;
	}

	this.addLocalFile = function(files) 
	{	
		console.fileLog(files.length+' files selected. name:'+files[0].name);
		fileList.push(new fileObject(files[0]));
	}
	
	this.addRemoteFile = function(file) { fileList.push(new fileObject(file)); }
/*********************************************************************************************************************************************************************************************************************/
/*********************************************************************************************************************************************************************************************************************/
	console.log('_FILE_ system successfully loaded.',1);
}	