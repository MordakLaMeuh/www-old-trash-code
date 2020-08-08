<?php include 'microCMS.php'; ?>
<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

    <title>RealityRevisited</title>
    <link rel="shortcut icon" href="<?php echo "$favicon"; ?>" />

    <link rel='stylesheet' id='fontawesome-css'  href='css/font-awesome.min.css' type='text/css' media='all' />
    <link rel='stylesheet' id='custom_css-css'  href='css/custom.css' type='text/css' media='all' />
    <link rel='stylesheet' id='combined_css-css'  href='css/combined.css' type='text/css' media='all' />
    <link rel='stylesheet' id='index-css'  href='css/index.css' type='text/css' media='all' />
    <link rel='stylesheet' id='grid-css'  href='css/grid.css' type='text/css' media='all' />

    <script type='text/javascript' src='jquery/jquery.js'></script>
    <script type='text/javascript' src='jquery/jquery-migrate.min.js'></script>

    <script type='text/javascript' src='js/combined_hack.js'></script>

    <script type='text/javascript' src='js/startup_tools.js'></script>

    <script type='text/javascript' src='js/ajax.js'></script>
    <script type='text/javascript' src='js/controls.js'></script>
    <script type='text/javascript' src='js/tools.js'></script>
    <script type='text/javascript' src='js/preloadAndDisplay.js'></script>
    <script type='text/javascript' src='js/loadAllStuff.js'></script>
</head>

<body ondragstart="return false;" ondrop="return false;" class="home page page-id-1762 page-template page-template-gallery_archive-php" data-style="blog_grid" onload="loadAllStuff()">

<input type="hidden" id="pp_enable_right_click" name="pp_enable_right_click" value="false"/>

<!-------------------------------------------------- DEFINITION DU MENU DEROULANT -------------------------------------------------->

<div id="menu_close_icon">
    <div id="menu_toggle"></div>
    <div id="menu_title">Menu</div>
</div>

<div class="top_bar">

    <div class="top_bar_wrapper">
        <div id="menu_wrapper">
            <a id="custom_logo" class="logo_wrapper" href=".">
<?php   if ($logo_type == "img")
        {
echo("                    <img src='".$logo_img."' alt='' width='200' height='130'/>");
        }
        else echo $logo_txt;    ?>
            </a>

            <div id="nav_wrapper">
                <div class="nav_wrapper_inner">
                    <div id="menu_border_wrapper">
                        <div class="menu-main-menu-container">

    <ul id="main_menu" class="nav">

        <li id="menu-item-0" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-0">
            <a onClick='getHome(0)' class='ajaxLink'>Home</a>
        </li>

        <li id="menu-item-1" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-1">
            <a class="arrowLink">Gallery</a>
            <ul class="sub-menu">
<?php   if($dossier = opendir('photos'))
        $x=100; $i=0;
        {
            while(false !== ($fichier = readdir($dossier)))
            {
                if ($fichier != "." && $fichier != ".." && is_dir ("photos/".$fichier.""))
                {
echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-taxonomy menu-item-object-gallerycat menu-item-".$x."'><a class='ajaxLink' onClick='getGallery(".$i.")'>".$_SESSION['box'][$i][1]."</a></li>\n");
$x++;   $i++;   }
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
echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-post_type menu-item-object-page menu-item-".$x."'><a class='ajaxLink' id='page_maximize_fullscreen'>".$menu[$i]->sub[$j]."</a></li>\n");
$x++;
        }
        ?>
            </ul>
        </li>   <?php   echo("\n");
}           ?>
<!--
        <li id="menu-item-4" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-4">
            <a class="arrowLink">Vidéos</a>
            <ul class="sub-menu">
                <li id="menu-item-401" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-401"><a class='ajaxLink' id='page_maximize_video' onClick="play_video()">Court-métrage</a></li>
            </ul>
        </li>               -->

        <li id="menu-item-5" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-5">
            <a class='ajaxLink' onClick="contact()">CONTACT</a>
        </li>
    </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    <!------------------------------------ BEGIN MAIN CONTENT ------------------------------------>

<div id="background_picture">
    <noscript>
        <div id='page_header_bg' style='background-image:url(<?php echo $main_picture; ?>);'></div>
    </noscript>
</div>

<a id="homeIcon" class='ajaxLink' onClick='getHome(1)'>
    <img src="images/Icon-House.gif" alt="maison">
</a>

<div class='page_control_static'>
    <a id='page_maximize' class='ajaxLink'></a>
</div>

<div id="wrapper">

    <noscript>
        <div class="javaScriptNeeded">Vous devez activer JavaScript pour découvrir mon site.</div>
    </noscript>

</div>

<div id="toTop" class="withbg">
    <i class="fa  fa-arrow-up"></i>
</div>

<div id="statusTXT">
    <!-- ...................................................... -->
 </div>

<!------------------------------------------ END OF CONTENT -------------------------------------->

<script type="text/javascript">

function directory(name, where, state) {      // => Champ des différents dossiers, emplacements des photos, nom & état télécharg& ou non.
  this.name = name;
  this.where = where;
  this.state = state;
}
var directoryName = new Array();
var directoryNumber = 0;                      // => Exprime le numéro du dossier courant en téléchargement.
                                              // => PHP envoit à JS tous les noms des fichiers photos dans ./photos., toutes stockés dans un tableau Images en JS
var Images = new Array(<?php
    $numeroImage = 0;
    $emplacementImage = array();
    $nbrDirectory = count($_SESSION['box']);
    for ($i=0; $i<$nbrDirectory; $i++)
    {
        $emplacementImage[$i] = $numeroImage;
        if($dossier = opendir('photos/'.$_SESSION['box'][$i][0].''))
        {
            while(false !== ($fichier = readdir($dossier)))
            {
                if ($fichier != "." && $fichier != "..")
                {
                    echo("\"photos/".$_SESSION['box'][$i][0]."/".$fichier."\",");
                    $numeroImage++;
                }
            }
        }
    }
echo ("\"\");\nImages.pop();\n");
$i=0;
for($i=0; $i<$nbrDirectory; $i++)
{
    echo ("directoryName[$i]=new directory; directoryName[$i].where=".$emplacementImage[$i]."; directoryName[$i].name=\"".$_SESSION['box'][$i][0]."\";\n");
}
 ?>

var logoIMG = <?php echo ("\"$logo_img\""); ?>;
var mainPicture = <?php echo ("\"$main_picture\""); ?>;

var allLoaded = false;                        // => True lorsque toutes les photos ont été chargées.
var blockDownloadAgent = false;               // => True lorsque qu'une demande de galerie concerne des photos pas encores chargés, change la prio du téléchargement.

var corpus = document.getElementById("wrapper");
var statusTXT = document.getElementById("statusTXT");
var level;              /* Contient une valeur correspondante à l'endroit ou se trouve l'utilisateur dans le site.
                        0 : Est sur le home
                        1 : Visionnage de gallerie
                        2 : Court-métrages.
                        3 : ContactMe
                        Fullscreen mode : cf ligne 6637 du fichier ./cache/combined.js  */
var renewHome = 0;
var ScrollLevel = 0;

InitControls();

var verifyHeight = (function()
{
    var lastHeigth = window.innerHeight;

    function verify_height()                          // Fonction appelée pèriodiquement pour réajuster les images et la vidéo à la résolution d'écran.
    {
        if (window.innerHeight != lastHeigth)
        {
            lastHeigth = window.innerHeight;
            var elements = document.getElementsByClassName("img_size");
            for (var i=0 ; i<elements.length ; i++)     elements[i].style.height = (lastHeigth +0)+"px";
        }
        if (level == 2)
        {
            var video = document.getElementsByClassName("video");
            if (video.length > 0)   video[0].style.height = lastHeigth+"px";
        }
    }
    var intervalRefreshMsg = setInterval(function(){verify_height();}, 200);

    return function()
    {};
})();
</script>

    </body>
</html>
