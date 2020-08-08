
    var corpus = document.getElementById("AJAXspace");
    var background_picture = document.getElementById("background_picture");
    var home_ajax = document.getElementById("blog_grid_wrapper");

    var current_gallery;
    var activeVideo = false;
    var activeAudio = false;
    var FullScreenStatus = false;
    var body = document.body;
    var enterOnGalerie = false;

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

/***  Switche du body sur le mode Horizontal Gallery. ***/
    function switchToHorizontalMode() {
        document.body.className='single single-galleries postid-1735 galleryBodyStyle';
        }


/*** Fonction de demande de l'affichage d'une galerie précise. ***/
    function getGallery(directory)
    {
        activeVideo = false;

        if (enterOnGalerie == false)
        {
            switchToHorizontalMode();
            enterOnGalerie = true;
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

    var done = false;
    function getHome()
    {
        var xhr = getXMLHttpRequest();

        xhr.open("GET", "getHome.php", false);

        xhr.onreadystatechange = function()
        {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
            {
                home_ajax.innerHTML = xhr.responseText;
                if (done == false)
                {
                    gros_lolo();
                    done = true;
                }
                else gros_lolo_2();
            }
        };
        xhr.send(null);
    }

    var music_ambiance = document.createElement("Audio");
/*** Ouveture de l'écran me contacter. ***/
    function contact()
    {
        enterOnGalerie = false;
        background_picture.innerHTML = "";
        activeVideo = false;
        document.body.className='';

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

/*** Fonction de lecture vidéo. ***/
    function play_video()
    {
        background_picture.innerHTML = "";
        document.body.className='';
        enterOnGalerie = false;

        var youtube_xhr = getXMLHttpRequest();

        youtube_xhr.open("GET", "video.php?height="+window.innerHeight, true);

        youtube_xhr.onreadystatechange = function()
        {
            if (youtube_xhr.readyState == 4 && (youtube_xhr.status == 200 || youtube_xhr.status == 0))     corpus.innerHTML = youtube_xhr.responseText;
            activeVideo = true;
        };
        youtube_xhr.send(null);
    }

/*** Fonction appelée pèriodiquement pour réajuster les images et la vidéo à la résolution d'écran. ***/
    function verify_height()
    {
        var elements = document.getElementsByClassName("img_size");
        for (var i=0 ; i<elements.length ; i++)
        {
            elements[i].style.height = window.innerHeight+"px";
        }

        if (activeVideo)
        {
            var video = document.getElementById("video");
            video.style.height = window.innerHeight+"px";
        }

    }

/*** Fonction backroom ***/
    function backroom()
    {

    }

 /*** LECTURE STANDARD D'UN FICHIER SON : var, source et lopp. ***/
    function play_music(music,src,loop)
    {
        music.src = src;
        music.volume = 1;
        music.play();					  /*** Lancement de la méthode play de l'objet music de type "Audio" ***/
    }
/*** Activation de la detection auto de la résolution & redimentionnement automatique. ***/
    var intervalRefreshMsg = setInterval(function(){verify_height();}, 500);
    //getHome();
