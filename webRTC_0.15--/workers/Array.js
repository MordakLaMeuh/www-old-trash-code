function messageHandler(event) {
	
    var uInt8View = new Uint8Array(event.data);
    console.log(uInt8View.length);
    console.log(uInt8View[12345]);
    // On récupère le message envoyé par la page principale
    //var messageSent = event.data;
    //var messageReturned = "Bonjour " + messageSent + " depuis un thread séparé !";
    // On renvoit le tout à la page principale
   // while (true) { }
    //console.log(event.data);
    //var A = new Array();
    //A = event.data;
	//console.log(A.length);
    //console.log(event.data.length);
    //this.postMessage(messageReturned);
    //console.log(uInt8View);
    this.postMessage(uInt8View.buffer, [uInt8View.buffer]);
    //console.log(uInt8View);
}

// On définit la fonction à appeler lorsque la page principale nous sollicite
// équivalent à this.onmessage = messageHandler;
this.addEventListener('message', messageHandler, false);