var a = null;

function messageHandler(event) {
    // On récupère le message envoyé par la page principale
    var messageSent = event.data;
    a = event.data;
    // On prépare le message de retour
    setInterval(function(){console.log(a);},3000);
    var messageReturned = "Bonjour " + messageSent + " depuis un thread séparé !";
    // On renvoit le tout à la page principale
   // while (true) { }
    
    this.postMessage(messageReturned);
}

// On définit la fonction à appeler lorsque la page principale nous sollicite
// équivalent à this.onmessage = messageHandler;
this.addEventListener('message', messageHandler, false);