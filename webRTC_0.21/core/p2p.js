'use strict';
var P2P_Channel = function() {
    /* Links to DOM functions && debug log */
    var console    =_DOM_.console;                // graphic mode
    //console.P2PLog = console.log;            // console mode

    var P2PChannel = function(RTCsession,seed,evt) {
        console.P2PLog('creating instance of P2P channel');
        var self = this;
        this.RTCsession = RTCsession;

        this.seed = (seed)?seed:false;

        this.dataChannelID     ,this.fileChannelID = null;
        this.dataChannel         ,this.fileChannel = null;

        this.setDataChannel = function(ref) {
            this.dataChannel = ref;
            this.dataChannel.onopen = function() {
                console.P2PLog('P2P-DATA channel opened:'+self.dataChannelID);
                self.localChannelLauncher();
            }
            this.dataChannel.onclose = function() {
                console.P2PLog('P2P-DATA channel closed:'+self.dataChannelID);
                self.deleteObj();
            }
            this.dataChannel.onerror = function(event) {
                console.P2PLog('P2P-DATA critical error:'+self.dataChannelID+'/'+event);
            }
            this.dataChannel.onmessage = function(event) {
                console.P2PLog('P2P-DATA received message:'+self.dataChannelID);
                self.interpreterMessage(event.data);
        }}
        this.setFileChannel = function(ref) {
            this.fileChannel = ref;
            this.fileChannel.onopen = function() {
                console.P2PLog('P2P-FILE channel opened:'+self.fileChannelID);
                self.localChannelLauncher();
            }
            this.fileChannel.onclose = function() {
                console.P2PLog('P2P-FILE channel closed:'+self.fileChannelID);
            }
            this.fileChannel.onerror = function(event) {
                console.P2PLog('P2P-FILE critical error:'+self.fileChannelID+'/'+event);
            }
            this.fileChannel.onmessage = function(event) {
                console.P2PLog('P2P-FILE received message:'+self.fileChannelID);
        }}

        this.openConnexionEvent = 0;

        if (this.findDispChannel()) {
            this.deleteObj();
            return;
        }

        this.evt = evt;    // Référence d'un Event transporté depuis file.js, avertit quand les canaux sont ouverts coté seed (msg: HELO)
    }

    P2PChannel.prototype.openP2PChannels = function() {
        this.setDataChannel(this.RTCsession.pc.createDataChannel('data_channel',    {
                            negotiated:true, reliable: true,  id:this.dataChannelID
                                                        }));
        this.setFileChannel(this.RTCsession.pc.createDataChannel('file_channel',    {
                            negotiated:true, reliable: true,  id:this.fileChannelID
        }));
    }

    P2PChannel.prototype.deleteObj  = function() {
        if (this.dataChannelID     && this.RTCsession.P2PChannels) this.RTCsession.P2PChannels[(this.dataChannelID-2)/2] = false;
        if (this.dataChannel     && this.dataChannel.readyState == 'open')     this.dataChannel.close();
        if (this.fileChannel     && this.fileChannel.readyState == 'open')     this.fileChannel.close();
        for (var key in this) this[key]=null;
    }

    P2PChannel.prototype.localChannelLauncher = function() {
        console.P2PLog("ordre d'ouverture recu:"+this.openConnexionEvent);
        this.openConnexionEvent++;
        if (this.openConnexionEvent != 2) return;
        console.P2PLog('TWO channels opened-connexion available.');

        if (this.seed)    this.dataChannel.send(JSON.stringify({
                        type: 'HELO'
        }));
        else            this.RTCsession.dataChannel.send(JSON.stringify({
                        type    : 'P2P_PROPOSED',
                        dataChannelID    : this.dataChannelID,
                        fileChannelID    : this.fileChannelID
        }));
    }

    P2PChannel.prototype.findDispChannel = function() {
        if (this.seed) {        // Celui qui revoit l'ordre d'ouvrir des canaux.
            var i = (this.seed.dataChannelID-2)/2;
            if (this.RTCsession.P2PChannels[i] == false) {    // Cas classique... les canaux sont disponibles.
                this.RTCsession.P2PChannels[i] = true;
                this.dataChannelID=this.seed.dataChannelID;
                this.fileChannelID=this.seed.fileChannelID;
                this.openP2PChannels();
            }
            // Gestion d'un conflit: Si deux ordres d'ouverture de canal sont émis de part et d'autre en même temps entre 2 clients.
            else if ((this.RTCsession.seedInfo)?true:false) { // Brisure de symétrie | Le vrai 'seed' rejette tout simplement le msg
                console.P2PLog('warning: conflit -> Rejet d\'une connexion provenant du \'peer\'.',true);
                return true;
            }
            else { // Pour le 'peer', ses datachannels sont détournées puis sont refaites avec des nouvelles ID.
                console.P2PLog('warning: conflict -> reprogramming channel...',true);
                var debugP2PChannelEntry = _FILE_.getP2PChannelById(this.RTCsession,this.seed.dataChannelID);
                if (debugP2PChannelEntry)    {
                    this.dataChannelID = this.seed.dataChannelID;
                    this.fileChannelID = this.seed.fileChannelID;
                    this.dataChannel      = debugP2PChannelEntry.dataChannel;    // Détournement du dataChannel
                    this.fileChannel     = debugP2PChannelEntry.fileChannel;    // Détournement du fileChannel
                    debugP2PChannelEntry.dataChannel = null;
                    debugP2PChannelEntry.fileChannel = null;
                    //if (this.dataChannel.readyState == 'open')    this.localChannelLauncher();
                    //if (this.fileChannel.readyState == 'open')    this.localChannelLauncher();
                    for (var i=0; i<2; i++) this.localChannelLauncher(); // Consider channels like at worst oppening...
                    debugP2PChannelEntry.openConnexionEvent = 0;         // Réinitialisation du compteur d'ouverture.
                    // Attribution de nouvelles ID aux canaux de la session P2P détournée.
                    for (var i=0; i<debugP2PChannelEntry.RTCsession.P2PChannels.length; i++) {
                        if (debugP2PChannelEntry.RTCsession.P2PChannels[i] == false) {
                                debugP2PChannelEntry.RTCsession.P2PChannels[i] = true;
                                debugP2PChannelEntry.dataChannelID=2*i+2;
                                debugP2PChannelEntry.fileChannelID=debugP2PChannelEntry.dataChannelID+1;
                                debugP2PChannelEntry.openP2PChannels();
                                return false;
                    }}
                    // Cas désespéré ...
                    console.P2PLog('CRITICAL: Aucun socket n\'est disponible; récupération remoteChannel impossible !',true);
                    debugP2PChannelEntry.deleteObj();
                }
                else    {
                    // Cas encore plus désespéré :(
                    console.P2PLog('CRITICAL ERROR -> FATAL DYSFUNCTION OF RTC-SYSTEM !',true);
                    return true;
                }
            }
        }
        else {
            for (var i=0; i<this.RTCsession.P2PChannels.length; i++) {
                if (this.RTCsession.P2PChannels[i] == false) {
                        this.RTCsession.P2PChannels[i] = true;
                        this.dataChannelID=2*i+2;
                        this.fileChannelID=this.dataChannelID+1;
                        this.openP2PChannels();
                        return false;
            }}
            console.P2PLog('warning: Aucun socket n\'est disponible',true);
            return true;
    }}
    /*
            2    ---->    2    file:baba.meuhmeuh                    RESOLUTION
            3    ---->    3                                ---------------------------
                                        Départager la symétrie: choisir un vrai 'seed' selon la session negociation
            2    --------->    (conflit)file:baba.meuhmeuh    -> Le vrai 'seed' peut bouger les 'ports' si besoin est
            3    --------->    (conflit)                -> le non 'seed' doit se soumettre et s'attend à ce que ce soit bougé
                        create: 4
                              5
        (conflit)    <--------    2        file:ungros.lolo
        (conflit)    <--------    3
                Simult°
        create:     4
                5
    */

    P2PChannel.prototype.interpreterMessage = function(data) {
        var obj = JSON.parse(data);
        console.P2PLog(data);
        switch (obj.type) {
            case 'HELO':
                console.P2PLog('datachannel activée');
                if (!this.seed) {
                    this.evt.channel = this;
                    dispatchEvent(this.evt);
                }
                //this.dataChannel.close();
                //this.fileChannel.close();
                break;
            default:
                break;
        }
    }

    P2PChannel.prototype.queryViewFileParts = function() {}
    P2PChannel.prototype.queryPartX        = function() {}
    P2PChannel.prototype.closeInstance        = function() {}

    this.createP2PChannel = function(RTCsession,seed,evt) {
        return new P2PChannel(RTCsession,seed,evt);
    }

    console.log('_P2P_MODULE_ successfully loaded.',1);
}
