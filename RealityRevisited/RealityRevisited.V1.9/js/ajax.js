
function getXMLHttpRequest() {
    var xhr = null;
    if (window.XMLHttpRequest || window.ActiveXObject)  {
        if (window.ActiveXObject)                       {
            try { xhr = new ActiveXObject("Msxml2.XMLHTTP"); }
            catch(e) { xhr = new ActiveXObject("Microsoft.XMLHTTP"); }}
        else { xhr = new XMLHttpRequest(); }}
    else {
        alert("Votre navigateur semble n'avoir aucune capacité AJAX, vous devriez le mettre à jour, non ?");
        return null; }
    return xhr;             }


var getHome = (function()                                   // Génération du home en pure AJAX, résultat différents selon si toutes les images ont été chargées.
{
    var storageHome = "";
    var wentFromHouse;

    function delayHomeCompleteDownloadAndStorage()          // Cas ou la page HOME() est dans le cache.
    {
        corpus.innerHTML = storageHome;
        displayHomePictures(((wentFromHouse==1)?1:0));
    }

    function delayHomeCompleteDownloadWithoutStorage()      // Cas ou toute la page a été téléchargée et que le storage doit être fait.
    {
        corpus.innerHTML = storageHome;
        displayHomePictures(((wentFromHouse==1)?1:0));
    }

    function delayHomeSpeedyMan()                            // Téléchargement de base du home minimal sans les photos en sous-couche
    {
        renewHome++;
        displayHomePictures(((wentFromHouse==1)?1:0));
    }

    return function(fromHouse)
    {
        wentFromHouse = fromHouse;
        document.body.style.background = "#000";
        document.body.className='home page page-id-1762 page-template page-template-gallery_archive-php';

        if (allLoaded == true && storageHome != "")             setTimeout(function(){delayHomeCompleteDownloadAndStorage();},((wentFromHouse==1)?0:500));

        else
        {
            var xhr = getXMLHttpRequest();
            xhr.open("GET", "getHome.php?allImagesLoaded="+allLoaded, false);

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
                {
                    if (allLoaded == true)  setTimeout(function(){ storageHome = xhr.responseText; delayHomeCompleteDownloadWithoutStorage();},((wentFromHouse==1)?0:500));
                    else                    setTimeout(function(){ corpus.innerHTML = xhr.responseText; delayHomeSpeedyMan();},((wentFromHouse==1)?0:500));
                }
            };
            xhr.send(null);
        }
    };
})();

function getGallery(number)
{
    if (directoryName[number].state != true)
    {
        blockDownloadAgent = true;
        statusTXT.innerHTML = "Loading Gallery...";
        var nbrPicture = (number == (directoryName.length-1))?Images.length-directoryName[number].where:directoryName[number+1].where - directoryName[number].where;
        var box = new Array;
        var j = 0;

        for (i=0; i<nbrPicture; i++)
        {
            box[i] = new Image();
            box[i].onload = function(){ j++; };
            box[i].src = Images[directoryName[number].where + i];
        }
        function success()
        {
            if (j == nbrPicture)
            {
                clearInterval(galleyTestLoaded);
                blockDownloadAgent = false;
                setTimeout(function(){if (statusTXT.innerHTML == "loading Gallery...") statusTXT.innerHTML="";},1000);
            }
        }
        var galleyTestLoaded = setInterval(function(){success()},50);
    }

    if (level != 1)
    {
        if (level == 0) ScrollLevel = corpus.scrollTop;
        level=1;
        document.body.className='galleryBodyStyle';              //   galleryBodyStyle single single-galleries postid-1735
        if (blockDownloadAgent == true)                  document.body.style.background = "#000";
    }

    var height_xhr = getXMLHttpRequest();

    height_xhr.open("GET", "getGallery.php?heightResolution="+window.innerHeight+"&gallery="+directoryName[number].name, true);

    height_xhr.onreadystatechange = function()
    {
        if (height_xhr.readyState == 4 && (height_xhr.status == 200 || height_xhr.status == 0))
        {
            corpus.innerHTML = height_xhr.responseText;

            var resolveBugWhiteLineToBottom = document.getElementById("wrapper");
            resolveBugWhiteLineToBottom.scrollTop = 0;

            function renderVisibilityPicture()
            {
                if (blockDownloadAgent == true) return;
                var setVisibility = document.getElementsByClassName("gallery_image_wrapper");
                for (i=0; i<setVisibility.length; i++)     setVisibility[i].style.display = "";
                document.body.style.background = "#fff";
                clearInterval(renderInterval);
            }
            if (blockDownloadAgent == false)    renderVisibilityPicture();
            else var renderInterval = setInterval(function(){renderVisibilityPicture();},100);
        }
    };
    height_xhr.send(null);
}

function play_video()
{
    document.body.style.background = "#000";
    if (level != 2) {
        document.body.className='';
        level=2;    }

    var youtube_xhr = getXMLHttpRequest();

    youtube_xhr.open("GET", "video.php?height="+window.innerHeight, true);

    youtube_xhr.onreadystatechange = function()
    {
        if (youtube_xhr.readyState == 4 && (youtube_xhr.status == 200 || youtube_xhr.status == 0))     corpus.innerHTML = youtube_xhr.responseText;
    };
    youtube_xhr.send(null);
}

function contact()                                 // Ouveture de l'écran me contacter.
{
    document.body.style.background = "#000";
    if (level != 3)
    {
        document.body.className='';
        level=3;
    }
    play_music("medias/Tristan_und_Isolde.mp3",1);

    var contact_xhr = getXMLHttpRequest();
    contact_xhr.open("GET", "contact.php", true);

    contact_xhr.onreadystatechange = function()
    {
        if (contact_xhr.readyState == 4 && (contact_xhr.status == 200 || contact_xhr.status == 0))     corpus.innerHTML = contact_xhr.responseText;
    };
    contact_xhr.send(null);
}
