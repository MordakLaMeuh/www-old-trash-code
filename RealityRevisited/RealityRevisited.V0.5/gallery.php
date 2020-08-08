<!DOCTYPE html>
<html lang="en-US">
<?php   // *************************************** SECTION UTILISATEUR ******************************************* //

$favicon = "images/islam.png";
$signature = "";                                                         // Anciennement: Laurent@realityrevisited.eu
$main_picture = "Rwatery.jpg";

$logo_type = "img";                                                      // Peut prendre la valeur "txt".
$logo_txt ="<H3>Reality Revisited</H3>";
$logo_img = "logo.jpg";
$visible_main_logo = false;

$a = array("BLIGHT","BLAST","Sag Negativ Nein");
$b = array("BREAT","BEDROCK","Never the Same Stream");
$c = array("muses","Polhymnie","Precarious theatre");
$d = array("Vigroux","Aucun lieu","Franck Vigroux");
$e = array("MADJUKA","MADJUKA","Scruter les humains");
$f = array("CLEANSED","CLEANSED","Optical Sound");
$g = array("Birth","Madame rêve","un jour, je sourirai moins...");
$h = array("Asphalt","ASPHALT","Urban Metal");
$i = array("Mesmerism","Mesmerism","Fragments d'un discours amoureux");
$j = array("Portraits","Portraits","");
$k = array("TAGS","TAGS","Innovation forcée");

$box = array($a,$b,$c,$d,$e,$f,$g,$h,$i,$j,$k);


class Topic {
    public $title;
    public $ID;
    public $sub;
}

/***
$a = new Topic();   $a->title = 'Portfolio';    $a->ID = 2;
$a->sub = array("Stage","Concerts","Artists","Backroom","Portraits");

$b = new Topic();   $b->title = 'Diaporama';    $b->ID = 3;
$b->sub = array("Fullscreen","Horizontal","PRIVATE");

$menu = array($a,$b);                                       ***/


$a = new Topic();   $a->title = 'Diaporama';    $a->ID = 2;
$a->sub = array("Fullscreen","Backroom");

$menu = array($a);

function vignette ($directory,$title,$comment)
{
?>
            <div class='wall_entry type-post post gallery masonry element'>
                <div class='wall_thumbnail'>
                    <a class='arrowLink hiddenTab' onClick='getGallery("<?php echo $directory; ?>")'>
                        <img src='photos/<?php echo $directory; ?>.jpg' alt='<?php echo $directory; ?>' class='portfolio_img static'/>
                        <div class='mask'>
                            <div class='mask_frame'>
                                <ul class='gallery_img_slides'>
<?php
if($dossier = opendir('photos/'.$directory.''))
{
    while(false !== ($fichier = readdir($dossier)))
    {
        if ($fichier != "." && $fichier != "..")
        {
echo("                                    <li><img src='photos/$directory/$fichier' alt='' class='static'/></li>\n");
        }
    }
}
?>
                                </ul>
                                <div class='mask_image_content hascycle'>
                                    <div class='mask_image_content_frame'>
                                        <h6><?php echo $title; ?></h6>
                                        <span><?php echo $comment; ?></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div><?php
}
// *************************** ROUTINES DE SECURITE & INTRODUCTION DES CONTRAINTES D'AFFICHAGE ******************** //
$trusted=true;

$gallery=strip_tags($_GET[gallery]);
$portfolio=strip_tags($_GET[Portfolio]);
$diaporama=strip_tags($_GET[Diaporama]);

if (($gallery != $_GET[gallery]) || ($portfolio != $_GET[Portfolio]) || ($diaporama != $_GET[Diaporama]))  header('Location: Fy.php');

if ($gallery)
{
    $trusted=false;
    for ($i = 0; $i < count($box); $i++)
    {
        if ($gallery == $box[$i][0])  $trusted=true;
    }
}
if ($trusted == false)      header('Location: Fy.php');

if ($portfolio)
{
    $trusted=false;
    for ($i = 0; $i < count($menu[0]->sub); $i++)
    {
        if ($portfolio == $menu[0]->sub[$i]) $trusted=true;
    }
}
if ($trusted == false)      header('Location: Fy.php');

if ($diaporama)
{
    $trusted=false;
    for ($i = 0; $i < count($menu[1]->sub); $i++)
    {
        if ($diaporama == $menu[1]->sub[$i]) $trusted=true;
    }
}
if ($trusted == false)      header('Location: Fy.php');

?>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

    <title>L'eau de nos muses</title>

    <link rel="shortcut icon" href="<?php echo "$favicon"; ?>" />

    <meta name='robots' content='noindex,follow' />

<!-- Je n'aime pas google ! Tant pis pour les belles polices !
    <link rel='stylesheet' id='google_font0-css'  href='http://fonts.googleapis.com/css?family=Montserrat%3A400%2C700%2C400italic&#038;subset=latin%2Ccyrillic-ext%2Cgreek-ext%2Ccyrillic&#038;ver=4.0.1' type='text/css' media='all' />
    <link rel='stylesheet' id='google_font1-css'  href='http://fonts.googleapis.com/css?family=Alex+Brush%3A400%2C700%2C400italic&#038;subset=latin%2Ccyrillic-ext%2Cgreek-ext%2Ccyrillic&#038;ver=4.0.1' type='text/css' media='all' />
    <link rel='stylesheet' id='google_font2-css'  href='http://fonts.googleapis.com/css?family=Open+Sans%3A400%2C700%2C400italic&#038;subset=latin%2Ccyrillic-ext%2Cgreek-ext%2Ccyrillic&#038;ver=4.0.1' type='text/css' media='all' /> -->

    <link rel='stylesheet' id='combined_css-css'  href='cache/combined.css?ver=1.0' type='text/css' media='all' />
    <link rel='stylesheet' id='fontawesome-css'  href='css/font-awesome.min.css?ver=1.0' type='text/css' media='all' />
    <link rel='stylesheet' id='custom_css-css'  href='templates/custom.css' type='text/css' media='all' />
    <link rel='stylesheet' id='grid-css'  href='css/grid.css?ver=4.0.1' type='text/css' media='all' />

    <script type='text/javascript' src='jquery/jquery.js?ver=1.11.1'></script>
    <script type='text/javascript' src='jquery/jquery-migrate.min.js?ver=1.2.1'></script>

    <meta name="generator" content="MomoPress 0.1" />
    <link rel='canonical' href='' />
    <link rel='shortlink' href='' />
    <style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>
</head>

<!-- Bricolage de derrière les fagots pour rendre invisible la barre de défilement qui est très laide -->
<style>
    .top_bar
    {
        overflow: hidden;
      /*  outline: 1px solid blue; */
    }

    .top_bar_wrapper
    {
        overflow: auto;
        margin-top: 20px;   /* Afin d'éviter que l'image du logo se cogne contre le bord haut de l'écran - marge intèrieur = 20px. */
        margin: 20px;
    }

    .img_size   {}
    #video      {}

    a.ajaxLink  {
        cursor: pointer;
                }

    a.arrowLink {
        cursor: default;
                }
</style>

<?php /**************************** CORPUS PRINCIPAL ***************************************************************/ ?>

<style>
.galleryBodyStyle
{
    overflow-y:hidden;
    background:transparent;
    right:23px;
    padding:0;
    font-size:18px;
    min-height:100%;
    /*opacity:0.3;*/
}

.galleryBodyStyle:hover
{
    background:#fff;
    background: #ffffff;
}

#menu_close_icon,body #menu_close_icon{background:transparent;}
#menu_close_icon:hover,body #menu_close_icon:hover{background:#fff;}
#menu_close_icon {background:#fff;}

/* Fixation du bug du thème original par déplacement de la croix de fermeture */
body.js_nav #menu_close_icon{background:transparent;-webkit-transform:translate(170px,0px);-ms-transform:translate(170px,0px);-moz-transform:translate(170px,0px);-o-transform:translate(170px,0px);transform:translate(170px,0px);}body.js_nav #menu_close_icon:hover{color:transparent !important;}
#menu_close_icon:hover,body[data-style=fullscreen] #menu_close_icon:hover,body[data-style=flow] #menu_close_icon:hover,body[data-style=password] #menu_close_icon:hover,body[data-style=wall] #menu_close_icon:hover,body[data-style=horizontal] #menu_close_icon:hover{background:#fff;}
#menu_title{margin-top:0px;text-transform:uppercase;font-size:9px;font-weight:bold;position:absolute;top:50%;width:100%;text-align:center;}#menu_toggle{font-size:30px;display:block;margin:auto;width:20px;margin-left:18px;height:2px;background:#fff;position:absolute;top:50%;margin-top:-14px;}
#menu_close_icon:hover #menu_toggle,#menu_close_icon:hover #menu_toggle:before,#menu_close_icon:hover #menu_toggle:after{background:#000;}
body.js_nav #menu_toggle{background:transparent !important;}
#menu_toggle:after,#menu_toggle:before{content:'';position:absolute;width:100%;height:2px;background:#fff;left:0;-webkit-transform-origin:center center;-moz-transform-origin:center center;-ms-transform-origin:center center;-o-transform-origin:center center;transform-origin:center center;}
body.js_nav #menu_toggle:before{-webkit-transform:rotate(45deg) translate(4px,9px);-moz-transform:rotate(45deg) translate(3px,8px);-ms-transform:rotate(45deg) translate(3px,8px);-o-transform:rotate(45deg) translate(3px,8px);transform:rotate(45deg) translate(3px,8px);background:#000 !important;}body.js_nav #menu_toggle:after{-webkit-transform:rotate(-45deg) translate(2px,-8px);-moz-transform:rotate(-45deg) translate(3px,-8px);-ms-transform:rotate(-45deg) translate(3px,-8px);-o-transform:rotate(-45deg) translate(3px,-8px);transform:rotate(-45deg) translate(3px,-8px);background:#000 !important;}
#menu_toggle:before,body.js_nav #menu_close_icon:hover #menu_toggle:before{top:-6px;}
#menu_close_icon:hover #menu_toggle:before{top:-10px;}
#menu_toggle:after{bottom:-6px;}
body.js_nav #menu_close_icon #menu_toggle:after{bottom:-9px;}


.homeStyle
{

}

#menu_close_icon
{
    padding: 0px;
    margin: 0px;
}
</style>

<body>
<script>document.body.className='single single-galleries postid-1735 galleryBodyStyle';</script>

    <input type="hidden" id="pp_enable_reflection" name="pp_enable_reflection" value="true"/>
    <input type="hidden" id="pp_enable_right_click" name="pp_enable_right_click" value=""/>
    <input type="hidden" id="pp_enable_dragging" name="pp_enable_dragging" value="true"/>
    <input type="hidden" id="pp_image_path" name="pp_image_path" value="photos/"/>
    <input type="hidden" id="pp_homepage_url" name="pp_homepage_url" value="."/>
    <input type="hidden" id="pp_menu_display" name="pp_menu_display" value=""/>
    <input type="hidden" id="pp_footer_style" name="pp_footer_style" value=""/>


    <div id="menu_close_icon">
        <div id="menu_toggle"></div>
        <div id="menu_title">Menu</div>
    </div>

    <!--Begin Template Menu -->
    <div class="top_bar">

        <div class="top_bar_wrapper">
            <div id="menu_wrapper">
                <!-- Begin logo -->
                <a id="custom_logo" class="logo_wrapper" href=".">
<?php   if ($logo_type == "img")
        {
echo("                    <img src='".$logo_img."' alt='' width='180' height='110'/>");
        }
        else echo $logo_txt;    ?>
                </a>
						<!-- End logo -->

                <!-- Begin main nav -->

                <div id="nav_wrapper">
                    <div class="nav_wrapper_inner">
                        <div id="menu_border_wrapper">
                            <div class="menu-main-menu-container">
                                <ul id="main_menu" class="nav">


    <li id="menu-item-0" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-0">
    <a href="index.php">Home</a>
    </li>

    <li id="menu-item-1" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-1">
    <a class="arrowLink">Gallery</a>
        <ul class="sub-menu">
<?php   if($dossier = opendir('photos'))
        $x=100;
        {
            while(false !== ($fichier = readdir($dossier)))
            {
                if ($fichier != "." && $fichier != ".." && is_dir ("photos/".$fichier.""))
                {
echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-taxonomy menu-item-object-gallerycat menu-item-".$x."'><a class='ajaxLink' onClick='tellHeightResolutionToServer(\"".$fichier."\")'>".$fichier."</a></li>\n");
$x++;           }
            }
        }
?>
        </ul>
    </li>
<?php for ($i = 0; $i < count($menu); $i++)
{
echo ("\n");
?>
    <li id="menu-item-<?php echo $menu[$i]->ID; ?>" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-<?php echo $menu[$i]->ID; ?>">
    <a class="arrowLink"><?php echo $menu[$i]->title; ?></a>
        <ul class="sub-menu">
        <?php
        echo("\n");
        $x=$menu[$i]->ID * 100;
        $y=count($menu[$i]->sub);
        for ($j = 0; $j < $y; $j++)
        {
//echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-post_type menu-item-object-page menu-item-".$x."'><a href='?".$menu[$i]->title."=".$menu[$i]->sub[$j]."'>".$menu[$i]->sub[$j]."</a></li>\n");
echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-post_type menu-item-object-page menu-item-".$x."'><a class='ajaxLink' onClick='switchScreen()'>".$menu[$i]->sub[$j]."</a></li>\n");
$x++;
        }
        ?>
       </ul>
    </li>   <?php   echo("\n");
}           ?>

    <li id="menu-item-4" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-4">
    <a class="arrowLink">Vidéos</a>
        <ul class="sub-menu">
    <!--        <li id="menu-item-400" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-400"><a href="https://vimeo.com/" target=_blank>Fullscreen Vimeo</a></li> -->
            <li id="menu-item-401" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-401"><a class='ajaxLink' onClick="play_video()">Court-métrage</a></li>
        </ul>
    </li>

    <li id="menu-item-5" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-5">
        <a class='ajaxLink' onClick="contact()">CONTACT</a>
    </li>

                        </div>
                    </div>
                </div>
            </div>

            <div class="footer_bar">
                <div class="footer_bar_wrapper">
                    <div id="copyright"><?php echo "$signature"; ?></div>
                </div>
            </div>

        </div>
    </div>
</div>

<style>                     /* ligne 291 de combined.css */
#page_header_bg
{
    width:408px;
    position:fixed;
    top:0;
    left:0;
    height:100%;
    z-index:0;
    -webkit-transition:all 500ms ease;
    transition:all 500ms ease;
    -moz-transition:all 500ms ease;-webkit-font-smoothing:antialiased;
    min-height:100%;
    background-position:center center;
    background-size:cover;

    body.js_nav #page_header_bg{opacity:.2;}
}

body.js_nav #wrapper,body.js_nav #supersized,body.js_nav #imageFlow,body.js_nav .backstretch{-webkit-transform:translate(230px,0px);-ms-transform:translate(230px,0px);-moz-transform:translate(230px,0px);-o-transform:translate(230px,0px);transform:translate(230px,0px);opacity:0.2;}
body.js_nav #page_header_bg {-webkit-transform:translate(230px,0px);-ms-transform:translate(230px,0px);-moz-transform:translate(230px,0px);-o-transform:translate(230px,0px);transform:translate(230px,0px);opacity:1.0;}
</style>
<!-- Begin template #wrapper -->


<!-- Begin template wrapper -->

<div id="wrapper">

    <div class='page_control_static'><a id='page_maximize' href='javascript:tellHeightResolutionToServer()'></a></div>

    <div id="HORIZON_GALLERY">  <!-- LA CLASSE "horizontal_gallery" présente un bug chaffouin... Pour corriger j'ai désactivé avec _fail. -->

<!-------------------------------------------------- etc... etc... etc... ---------------------------------------------------------------->

    </div>

 <script>
    var corpus = document.getElementById("HORIZON_GALLERY");
    var current_gallery;

  //  var galleryScreen =  "<div class='page_control_static'><a id='page_maximize' href='javascript:tellHeightResolutionToServer()'></a></div>";
    var homeScreen = "<div id='page_header_bg' style='background-image:url(<?php echo $main_picture; ?>);'></div>";

    var body = document.body;

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

/*** Fonction de demande de l'affichage d'une galerie précise. ***/
    function tellHeightResolutionToServer(directory)
    {
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

/*** Ouveture de l'écran me contacter. ***/
    function contact()
    {
        document.head.innerHTML="";
        document.body.innerHTML="";

        var contact_xhr = getXMLHttpRequest();

        contact_xhr.open("GET", "contact.php", true);

        contact_xhr.onreadystatechange = function()
        {
            if (contact_xhr.readyState == 4 && (contact_xhr.status == 200 || contact_xhr.status == 0))     document.body.innerHTML = contact_xhr.responseText;
        };
        contact_xhr.send(null);
    }

/*** Fonction de lecture vidéo. ***/
    function play_video()
    {
        document.body.className='';

        document.body.innerHTML="<body><div class='page_control_static'><a class='ajaxLink' id='page_maximize' onClick='switchScreen()'></a></div>";

        enterFullscreen(body);

        var youtube_xhr = getXMLHttpRequest();

        youtube_xhr.open("GET", "video.php?height="+window.innerHeight, true);

        youtube_xhr.onreadystatechange = function()
        {
            if (youtube_xhr.readyState == 4 && (youtube_xhr.status == 200 || youtube_xhr.status == 0))     body.innerHTML += youtube_xhr.responseText;
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

        var video = document.getElementById("video");
        video.style.height = window.innerHeight+"px";

    }

    var FullScreenStatus = false;

/*** Fonction "maison" de redimentionnement plein écran du aux bugs constatés par le thème original. ***/
    function enterFullscreen(element)
    {
        FullScreenStatus = true;
        if(element.requestFullScreen)
        {
                element.requestFullScreen();        //fonction officielle du w3c
        }
        else if(element.webkitRequestFullScreen)
        {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  //fonction pour Google Chrome (on lui passe un argument pour autoriser le plein écran lors d'une pression sur le clavier)
        }
        else if(element.mozRequestFullScreen)
        {
                element.mozRequestFullScreen();     //fonction pour Firefox
        }
        else
        {
                alert('Votre navigateur ne supporte pas le mode plein écran, il est temps de passer à un plus récent ;)');
        }
    }


/*** Sortir du mode plein écran. ***/
    function exitFullscreen()
    {
        FullScreenStatus = false;
        if(document.cancelFullScreen)
        {
                document.cancelFullScreen();            //fonction officielle du w3c
        }
        else if(document.webkitCancelFullScreen)
        {
                document.webkitCancelFullScreen();      //fonction pour Google Chrome
        }
        else if(document.mozCancelFullScreen)
        {
                document.mozCancelFullScreen();         //fonction pour Firefox
        }
    }

/*** fonction de controle fullscreen on/off pour la lecture vidéo. ***/
    function switchScreen()
    {
        if (FullScreenStatus == false)  enterFullscreen(body);
        else                            exitFullscreen();
    }

/*** Fonction backroom ***/
    function backroom()
    {

    }

/*** Activation de la detection auto de la résolution & redimentionnement automatique. ***/
    var intervalRefreshMsg = setInterval(function(){verify_height();}, 500);


    tellHeightResolutionToServer("<?php if ($gallery) echo ($gallery); else echo ($box[0][0]); ?>");
</script>

<script type='text/javascript' src='google_api/js?sensor=false&#038;ver=1.0'></script>

<script type='text/javascript' src='js/jquery.tooltipster.min.js?ver=1.0'></script>
<script type='text/javascript' src='cache/combined.js?ver=1.0'></script>

<!-- <script type='text/javascript' src='js/jquery.mousewheel.min.js?ver=1.0'></script> Génère un bug de la molette de souris affichage gallery-menu. -->
<script type='text/javascript' src='js/horizontal_gallery.js?ver=1.0'></script>

<script type='text/javascript' src='js/jquery.cycle2.min.js?ver=1.0'></script> <!-- Ajout de ces 2 lignes pour plan blod-grid. -->
<script type='text/javascript' src='js/custom_cycle.js?ver=1.0'></script>
</div>

</body>
</html>
