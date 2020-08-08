<script type="text/javascript">

    var music;							// Variables persistantes tant que l'on reste sur la même page.
    var onPlaying;
    function music_on_line()		// Fonction au lancement de la page si le fichier pointé est un MP3
    {
        <?php if (ereg(".mp3",$link))
        {
            ?>
            music = document.createElement("Audio");    // Créer un objet 'music' de type Audio, Il y a type Video aussi...
            music.id = "sound";								  // Attribut une ID sound à l'objet music, utile pour le retrouver & le CSS
            music.src = <?php echo "\"$link\"";
            ?>;
            document.body.appendChild( music );			  // Spécifie que la musique est un enfant direct de BODY
            music.volume = 1.0;
            music.loop = true;
            onPlaying = 1;
            music.play();										  // Lancement de la méthode play de l'objet music de type "Audio"
            <?php
        }
        else
        {
            ?> var baba = document.getElementById("baba");
            baba.innerHTML += "meuhmeuh";
            <?php   // Ecrit meugmeuh dans cite :)
            echo ("document.body.innerHTML += 'Not a MP3 !';");
        }   ?>
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
