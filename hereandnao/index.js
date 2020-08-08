
    var corpus = document.getElementById("AJAXspace");
    var background_picture = document.getElementById("background_picture");

    var level=0;            /* Contient une valeur correspondante à l'endroit ou se trouve l'utilisateur dans le site.
                               0 : Est sur le home
                               1 : Visionnage de gallerie
                               2 : Court-métrages.
                               3 : ContactMe                                                                        */

/* Fullscreen mode : cf ligne 6637 du fichier ./cache/combined.js  */

    function getXMLHttpRequest() {
        var xhr = null;
        if (window.XMLHttpRequest || window.ActiveXObject)  {
            if (window.ActiveXObject)                       {
                try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); }
                catch(e) { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }}
            else { xhr = new XMLHttpRequest(); }}
        else {
            alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
            return null; }
        return xhr;             }

/*** Génération du home en pure AJAX. ***/
    function getHome()
    {
   //   if (level != 0)                 /* Exception pour la gestion d'un bug de firefox lors de la boucle -home-->home etc... à observer ! */
        {   document.body.className='home page page-id-1762 page-template page-template-gallery_archive-php';
            level=0;
        }
        var xhr = getXMLHttpRequest();

        xhr.open("GET", "getHome.php", true);

        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
            {
                corpus.innerHTML = xhr.responseText;
                display_home();
                slide();
            }
        };
        xhr.send(null);
    }

/*** Fonction de demande de l'affichage d'une galerie précise. ***/

    var current_gallery;
    function getGallery(directory)
    {
        if (level != 1)
        {   document.body.className='single single-galleries postid-1735 galleryBodyStyle';
            level=1;
        }

        if (directory) current_gallery=directory;

        var height_xhr = getXMLHttpRequest();

        if (!directory)      height_xhr.open("GET", "getGallery.php?heightResolution="+window.innerHeight+"&gallery="+current_gallery, true);
        else                 height_xhr.open("GET", "getGallery.php?heightResolution="+window.innerHeight+"&gallery="+directory, true);

        height_xhr.onreadystatechange = function()
        {
            if (height_xhr.readyState == 4 && (height_xhr.status == 200 || height_xhr.status == 0))
            {
                corpus.innerHTML = height_xhr.responseText;
            }
        };
        height_xhr.send(null);
    }

/*** Fonction de lecture vidéo. ***/
    function play_video()
    {
        if (level != 2)
        {   document.body.className='';
            level=2;
        }

        var youtube_xhr = getXMLHttpRequest();

        youtube_xhr.open("GET", "video.php?height="+window.innerHeight, true);

        youtube_xhr.onreadystatechange = function()
        {
            if (youtube_xhr.readyState == 4 && (youtube_xhr.status == 200 || youtube_xhr.status == 0))     corpus.innerHTML = youtube_xhr.responseText;
        };
        youtube_xhr.send(null);
    }


    var activeAudio=false;
    var music_ambiance = document.createElement("Audio");
/*** Ouveture de l'écran me contacter. ***/
    function contact()
    {
        if (level != 3)
        {
            document.body.className='';
            level=3;
        }

        if (activeAudio == false)    play_music(music_ambiance,"medias/blondie.mp3",1);
        activeAudio = true;

        var contact_xhr = getXMLHttpRequest();
        contact_xhr.open("GET", "contact.php", true);

        contact_xhr.onreadystatechange = function()
        {
            if (contact_xhr.readyState == 4 && (contact_xhr.status == 200 || contact_xhr.status == 0))     corpus.innerHTML = contact_xhr.responseText;
        };
        contact_xhr.send(null);
    }

/*** Fonction appelée pèriodiquement pour réajuster les images et la vidéo à la résolution d'écran. ***/
    function verify_height()
    {
        var elements = document.getElementsByClassName("img_size");
        for (var i=0 ; i<elements.length ; i++)
        {
            elements[i].style.height = window.innerHeight+"px";
        }
        if (level == 3)
        {
            var imgContact = document.getElementsByClassName("img_size_contact");
            imgContact[i].style.height = window.innerHeight+"px";
            imgContact[i].style.width = window.innerWidth+"px";

        /*    var Ximg = 1280 * (window.innerHeight/731);
            if (Ximg > window.innerWidth)
            {
                var a =  Ximg - window.innerWidth;
                var wrapper = document.getElementById("wrapper");
                wrapper.style.marginLeft = "-" + a + "px";
            } */
        }

        if (level == 2)
        {
            var video = document.getElementById("video");
            video.style.height = window.innerHeight+"px";
        }

    }

 /*** LECTURE STANDARD D'UN FICHIER SON : var, source et lopp. ***/
    function play_music(music,src,loop)
    {
        music.src = src;
        music.volume = 1;
        music.play();					  /*** Lancement de la méthode play de l'objet music de type "Audio" ***/
    }

    var intervalRefreshMsg = setInterval(function(){verify_height();}, 000);

