'use strict';
var mainFILE = function() {
    /* Links to DOM functions */
    var console    =_DOM_.console;
    var fileTab    =_DOM_.fileTab;                // graphic mode
    //console.fileLog = console.log;            // console mode

/*********************************************************************************************************************************************************************************************************************/
/******************************************** Gestion de l'affichage de la liste des fichiers: ATTENTION utilise div fileTab *****************************************************************************************/
    var fileObject = function(file) {
        this.ownerList        = new Array();
        if (file.owner && !file.name)    {            // --> Reception d'une simple annonce.
            this.file = new Object();
            this.file.fingerprint = file.fingerprint;
            this.ownerList.push(file.owner);
            this.file.owner = this.ownerList[0];
            return;
        }
        this.file = file;

        this.status = 'LOCAL';
        this.ownerList.push(_RTC_CORE_.getLocalUser());    // WARNING Si la logique _RTC_CORE_ change, il faudra changer ici !
        this.file.owner = this.ownerList[0];
        console.fileLog('incoming file \''+this.file.name+'\' size:'+this.file.size+' fingerprint:'+this.file.fingerprint+' seg_size:'+this.file.seg_size+' status:'+this.status);
        this.initialize();
    }

    fileObject.prototype.setMetaData = function(data) {
        this.file.seg_size    = data.seg_size;
        this.file.name         = data.fileName;
        this.file.size          = data.fileSize;
        this.file.type        = data.fileType;
        this.status            = 'REMOTE';
        this.initialize();
    }

    fileObject.prototype.initialize = function() {
        var self = this;
        this.IDENTITY_CARD = new Array();

        this.deleteEntry      = null;
        this.statusEntry   = null;
        this.nameEntry     = null;

        var fileA         = document.createElement('a');
        var fileP         = document.createElement('p');
        var fileDiv        = document.createElement('div')

        fileA.className         = 'sharingButton';
        fileP.innerHTML          = this.file.name;

        fileDiv.className        = 'deleteFile';
        fileDiv.innerHTML         = 'DEL'

        fileDiv.onclick       = function(e) { self.delete(); return false; }

        if (!this.file.fingerprint) {
            fileA.innerHTML         = 'LOCAL';
            fileA.href            = URL.createObjectURL(this.file);
            fileA.download          = '';
            fileA.onclick        = function(e) { self.generateHash(self.file); return false;}
        }
        else
        {
            fileA.innerHTML         = 'REMOTE';
            fileA.onclick        = function(e) { self.downloadFile(); return false;}
        }
        this.deleteEntry         = fileTab.utilize().appendChild(fileDiv);
        this.statusEntry       = fileTab.utilize().appendChild(fileA);
        this.nameEntry         = fileTab.utilize().appendChild(fileP);

        fileTab.refreshWindow();
    }

/* List of fileObject prototypes: Tous les prototypes semblent evoluer dans des contextes différents. util° of this. && var [...] */
    fileObject.prototype.stateSeed = function() {
        this.status = 'SEED';
        this.statusEntry.innerHTML = 'SEED';
        this.statusEntry.classList.remove("generatingHash");
        this.statusEntry.style.color = '#FFA500';
        this.statusEntry.onclick = null;
    }
    fileObject.prototype.stateHash = function() {
        this.statusEntry.innerHTML = 'GENERATING HASH';
        this.statusEntry.classList.add("generatingHash");
    }
    fileObject.prototype.downloadFile = function () {
        this.createAnnounce();
        if (!_RTC_CORE_.queryHashForDownload(this.file))    console.fileLog('_RTC_CORE_ response -> Transmission de la demande de download');
        else                                     console.fileLog('_RTC_CORE_ response -> warning: seed is out !',true);
    }
    fileObject.prototype.fullFileReceived = function() {
        var self = this;

        this.statusEntry.innerHTML         = 'LOCAL';
        this.statusEntry.href            = URL.createObjectURL(this.file);
        this.statusEntry.download          = '';

        this.deleteEntry  = statusEntry.parentNode.insertBefore(document.createElement('div'), this.statusEntry);

        this.deleteEntry.className        = 'deleteFile';
        this.deleteEntry.innerHTML         = 'DEL'
        this.deleteEntry.onclick           = function(e) { self.delete(); return false; }
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
        }}
        fileTab.refreshWindow();
    }
    fileObject.prototype.createAnnounce = function() {
        var obj = {
            type        : 'ANNOUNCE',
            owner        :  _RTC_CORE_.getLocalUser(),
            fingerprint    : [this.file.fingerprint]    // WARNING: Envoi d'une seule annonce, mise entre crochet -> length=1
        }
        if (!_RTC_CORE_.sendAnnounce(obj))        console.fileLog('Sending announce of \''+this.file.name+'\' to broadcast.');
        else                            console.fileLog('_RTC_CORE_ response -> Nobody is here !',true);
    }
    /******************************************************************************************************************************/
    /*                        fONCTIONS DE GÉNÉRATIONS DES fingerprint                                    */
    var is_crypto = window.crypto && window.crypto.subtle && window.crypto.subtle.digest;
    var buffer_size = 1024*1024;

    var fastHashGenerating =  function(file) {
        console.fileLog('fast cryptographic api sha256 prototype enable');
        var self=this;
        file.seg_size = buffer_size;
        this.stateHash();
        var reader = new FileReader();
        reader.onload = function(event) {
            window.crypto.subtle.digest({name: "SHA-256"}, event.target.result)
            .then(function(hash) {
                var hexString = '', hashResult = new Uint8Array(hash);

                for (var i = 0; i < hashResult.length; i++) {
                    hexString += ("00" + hashResult[i].toString(16)).slice(-2);
                }
                self.IDENTITY_CARD.push(hexString);
                console.fileLog(hexString);

                currentSegment++;
                if ( currentSegment < requireSegment) {
                    begin+=buffer_size;
                    end+=buffer_size;
                    reader.readAsArrayBuffer(file.slice(begin,end));
                }
                else {
                    window.crypto.subtle.digest({name: "SHA-256"}, new TextEncoder("utf-8").encode(self.IDENTITY_CARD.join()))
                    .then(function(hash) {
                        var hexString = '', hashResult = new Uint8Array(hash);

                        for (var i = 0; i < hashResult.length; i++) {
                            hexString += ("00" + hashResult[i].toString(16)).slice(-2);
                        }
                        self.file.fingerprint = hexString;
                        console.fileLog('global fingerprint: '+self.file.fingerprint);
                        self.stateSeed();
                        self.createAnnounce();
                    });
                    return false;
            }})
            .catch(function(error) {
    /* Recente version de chrome: si la page n'est pas SSL, l'api cryptographic plantera d'ou la regression planifiée ici. */
                console.fileLog(error,true);
                console.fileLog('regression de l\'api cryptographic !',true);
                self.IDENTITY_CARD = new Array();
                fileObject.prototype.generateHash = slowHashGenerating;
                self.generateHash(self.file);
            });
        }
        var requireSegment = Math.ceil(file.size/buffer_size);
        var currentSegment = 0;
        var begin     = 0;
        var end     = buffer_size;
        console.fileLog('GENERATE IDENTITY CARD of '+file.name+' SIZE:'+file.size+' '+requireSegment+' segments finded.');

        reader.readAsArrayBuffer(file.slice(begin,end));
    }

    var slowHashGenerating = function(file) {
        console.fileLog('slow manual worker sha256 prototype enable');
        var self=this;
        file.seg_size = buffer_size;
        this.stateHash();

        var worker = new Worker('file/sha256/sha256Worker.js');
        var reader = new FileReader();

        reader.onload = function (event)     { worker.postMessage(event.target.result, [event.target.result]); };

        var handle_hash_block = function (event) {
            console.fileLog(event.data);
            self.IDENTITY_CARD.push(event.data);

            block.currentSegment++;
            if (block.currentSegment < block.requireSegment) {
                var begin = block.currentSegment*buffer_size;
                var end = begin + buffer_size;
                if (end > file.size)            end = file.size;

                reader.readAsArrayBuffer(file.slice(begin, end));
            }
            else {
                var lastSha256Work = function(event) {
                    self.file.fingerprint = event.data;
                    console.fileLog('global fingerprint: '+self.file.fingerprint);
                    worker.terminate();
                    self.stateSeed();
                    self.createAnnounce();
                }
                worker.removeEventListener('message', handle_hash_block);
                worker.addEventListener('message', lastSha256Work);
                var preCondensat = new TextEncoder("utf-8").encode(self.IDENTITY_CARD.join());
                worker.postMessage(preCondensat.buffer,[preCondensat.buffer]);
        }};
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

    /******************************************************************************************************************************/
    /*                        fONCTIONS CREATE PEER INSTANCE (se chargent du dl du fichier)                    */

    var currentEventID = 0;
    fileObject.prototype.createPeerInstance = function (file) {
            this.IDENTITY_CARD        = file.IDENTITY_CARD.slice(0);
            this.status                = 'DOWNLOADING';
            this.statusEntry.innerHTML     = 'DOWNLOADING';
            this.statusEntry.className    = 'downloading';

            var self = this;
            this.channels = new Array();

            var eventID = currentEventID;
            currentEventID++;

            var Xchan = document.createEvent('Event');
            Xchan.initEvent(eventID, true, true);

            var runningChannel = function(obj) {
                console.fileLog('Event triggered -> Seeds channels available.');
                for (var i=0; i<self.channels.length; i++) {
                    if (self.channels[i] == obj.channel)     {
                        // EXCHANGE PART FILES
                        // DEMARAGE DE LA SEQUENCE DE TELECHARGEMENT
                        console.fileLog('Association Event<-->Channel réussie.');
                        console.fileLog('P2P system blocked for sécurity reasons by Mordak.',true);
                }}
                //removeEventListener('waitForChannel', runningChannel, false);
            }

            addEventListener(eventID,runningChannel);

            for (var i=0; i<this.ownerList.length; i++) {
                this.channels.push(_RTC_CORE_.createFileChannel(this.ownerList[i],Xchan));
            }

            console.fileLog('createPeerInstance: Got '+this.channels.length+' peers channels');

    /* WARNING Utilisation d'un objet channel */
            //var channel = _RTC_CORE_.returnP2PChannel(file.owner);
            //channel.open();
            //channel.close();                                        */


            /* channel.open();        -> Procède à l'ouverture du channel.
             * channel.querySegment(x);     -> envoi ordre via le canal 0 d'envoyer un segement donné.
             * channel.close();        -> Demande fermeture du canal au seed.
             *
             */
    //Object { owner: "33af2d", fingerprint: "383fa9211634038c89a7daae1ebd81842e70e57f2e0f60fecd2a236a7cd7185b", rtcDataType: "HASH_TABLE", IDENTITY_CARD: Array[1] }
    }

/*********************************************************************************************************************************************************************************************************************/
/****************************************************** PUBLICS METHODES OF _FILE_ ***********************************************************************************************************************************/

    var fileList = new Array();

    this.getP2PChannelById = function (session, id) {    // Methode de secours en cas de conflit de canaux: demande simultanées P2P.
        for (var i=0; i<fileList.length; i++) {
            for (var j=0; j<fileList[i].channels.length; j++) {
                if (fileList[i].channels[j].dataChannelID == id && fileList[i].channels[j].RTCsession == session) {
                    return fileList[i].channels[j];
    }}}}
    /* WARNING Pour fonctionner la liste des fichiers 'fileList' ainsi que celle des canaux 'channels' doivent être cohérentes.
     *     -> OKAY pour "fileList'
     *     -> A FAIRE pour 'channels' ~~ event de destruction du channel ?!? */

    this.startPeerDownload = function(file) {
        for (var i=0; i<fileList.length; i++) {
            if (file.fingerprint == fileList[i].file.fingerprint)    {
                fileList[i].createPeerInstance(file);
                return true;
    }}}

    this.queryFileHashTable = function(file) {
        for (var i=0; i<fileList.length; i++) {
            if (file.fingerprint == fileList[i].file.fingerprint)    {
                file.IDENTITY_CARD = fileList[i].IDENTITY_CARD;
                return true;
    }}}

    this.createMultiplesAnnounces = function() {
        var announce = new Array();
        for (var i=0; i<fileList.length; i++) {
            if (fileList[i].status == 'SEED' || fileList[i].status == 'DOWNLOADING')    announce.push(fileList[i].file.fingerprint);
        }
        if (announce.length)    return "{\"type\":\"ANNOUNCE\",\"owner\":\""+_RTC_CORE_.getLocalUser()+"\",\"fingerprint\":[\""+announce.join('\",\"')+"\"]}";
        return false;
    }

    this.addAnnounce = function(data) {        // {{'type':'announce'}{'owner':'B7CD15'}{'fingerprint':'fg44','fa8k','ijkn'}}
        var token = false;
        var wish = new Array();
        for (var i=0; i<data.fingerprint.length; i++) {
            for (var j=0; j<fileList.length; j++) {
                if (fileList[j].file.fingerprint == data.fingerprint[i]) {
                    for (var k=0; k<fileList[j].ownerList.length; k++) {
                        if (fileList[j].ownerList[k] == data.owner)     {
                            console.fileLog('announce-> KNOWN FILE -User'+data.owner+' knowed too');
                            token = true;
                            break;
                    }}
                    if (token == true) break;
                    fileList[j].ownerList.push(data.owner);
                    console.fileLog('announce-> KNOWN FILE -Add user '+data.owner+' into the ownerList');
                    token = true;
                    break;
            }}
            if (token == true) { token=false; continue; }

            console.fileLog('announce-> NEW file:Creating new object of REMOTE && Asking for MetaData.');
            var file = {
                fingerprint    : data.fingerprint[i],
                owner        : data.owner
            }
            fileList.push(new fileObject(file));    // Penser à ajouter l'owner de base dans l'ownerList interne au fichier.
            wish.push(data.fingerprint[i]);
        }
        if (wish.length > 0) return wish;
    }

    this.getMetaData = function(data) {
        var wish = new Array();
        for (var i=0; i<data.fingerprint.length; i++) {
            for (var j=0; j<fileList.length; j++)     {
                if (data.fingerprint[i] == fileList[j].file.fingerprint)    wish.push(fileList[j].file);
        }}
        if (wish.length) return wish;
    }

    this.addLocalFile = function(files)
    {
        for (var i=0; i<fileList.length; i++) {
            if (fileList[i].file.name == files[0].name) {
                console.fileLog(files[0].name+' existe déjà dans la base de donnée.',true);
                if (fileList[i].status == 'LOCAL' || fileList[i].status == 'SEED') return;

                // WARNING: Proposer vérification du hash
                console.fileLog('négociation possible',true);
                return;
        }}
        fileList.push(new fileObject(files[0]));
    }

    this.addRemoteFile = function(files) {
        var token = false;
        for (var i=0; i<files.data.length; i++) {
            console.fileLog('Remote reception of \"'+files.data[i].fileName+'\"');
            for (var j=0; j<fileList.length; j++) {
                if (files.data[i].fingerprint == fileList[j].file.fingerprint) {
                    if (fileList[j].file.seg_size)     {
                        for (var k=0; k<fileList[j].ownerList.length; k++) {
                            if (files.sender == fileList[j].ownerList[k]) {
                                console.fileLog('SENDER already in ownlerList.');
                                token = true;
                                break;
                        }}
                        if (token == true) break;
                        console.fileLog('Meta exists already. Set one new entry in OwnerList:'+files.sender);
                        fileList[j].ownerList.push(files.sender);
                        token = true;
                        break;
                    } else {
                        console.fileLog('Meta-Data received from:'+files.sender);
                        fileList[j].setMetaData(files.data[i]);
                        token = true;
                        break;
            }}}
            if (token == true) { token=false; continue; }
            console.fileLog('No solicited file received\''+files.data[i].fileName+'\' !',true);
    }}

/*********************************************************************************************************************************************************************************************************************/
/*********************************************************************************************************************************************************************************************************************/
    console.log('_FILE_ system successfully loaded.',1);
}
