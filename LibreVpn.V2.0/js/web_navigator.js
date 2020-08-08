
<script type="text/javascript">

var music;						// Variables persistantes tant que l'on reste sur la même page.
var onPlaying;

function getXMLHttpRequest()
{
    var xhr = null;
    if (window.XMLHttpRequest || window.ActiveXObject)
    {
        if (window.ActiveXObject)
        {
            try
            {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch(e)
            {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        else
        {
            xhr = new XMLHttpRequest();
        }
    }
    else
    {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    return xhr;
}


function listing(ID,type)
    {
	var xhr = getXMLHttpRequest();

	console.log("Affichage: " + ID );
	xhr.open("GET", "list_request.php?ID=" + ID +"&type=" +type, true);

	xhr.onreadystatechange = function(  )
	{
	    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
	    {
		var navig_DOM = document.getElementById("dynamic_list");
		navig_DOM.innerHTML = xhr.responseText;

		var xhr_link = getXMLHttpRequest();
		xhr_link.open("GET", "send_link.php", true);

		xhr_link.onreadystatechange = function(  )
		{
		    if (xhr_link.readyState == 4 && (xhr_link.status == 200 || xhr_link.status == 0))
		    {
			if (xhr_link.responseText != "1")
			{
			   break_audio();
			   music_on_line(xhr_link.responseText);
			   onPlaying = 1;
			}
		    }
		};
		xhr_link.send(null);
	    }
	};
	xhr.send(null);
}

function music_on_line(link)				// Fonction au lancement de la page si le fichier pointé est un MP3
    {
       music = document.createElement("Audio");       // Créer un objet 'music' de type Audio, Il y a type Video aussi...
       music.id = "sound";			        // Attribut une ID sound à l'objet music, utile pour le retrouver & le CSS
       // music.src = "radio.m3u";

       music.src = link;

       document.body.appendChild( music );	    	// Spécifie que la musique est un enfant direct de BODY
       music.volume = 1.0;
       music.loop = true;

       music.play();					 // Lancement de la méthode play de l'objet music de type "Audio"
    }

function break_audio()
    {
	music.pause();
	document.body.removeChild( music );
	music = null;
    }

function playAudio()
    {
        if (window.HTMLAudioElement)												 // Check for audio element support.
        {
            try
            {
                if (onPlaying == 1)
                {
                    onPlaying = 0;
                    music.pause();
                }
                else
                {
                    music.volume = 1.0;
                    music.loop = true;
                    onPlaying = 1;
                    music.play();
                }
            }
            catch (e)
            {
                if(window.console && console.error("Error:" + e));		// Fail silently but show in F12 developer tools console
            }
        }
    }

function restartAudio()
    {
        if (window.HTMLAudioElement)
        {
            try
            {
                <?php // music = document.getElementById("sound"); ?>
                music.currentTime = 0;
                music.volume = 1.0;
                music.loop = true;
                onPlaying = 1;
                music.play();
            }
            catch (e)
            {
                if(window.console && console.error("Error:" + e));
            }
        }
    }

</script>
