<?php session_start(); include 'microCMS.php'; ?>
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

        <li id="menu-item-4" class="menu-item menu-item-type-custom menu-item-object-custom menu-item-has-children arrow menu-item-4">
            <a class="arrowLink">Vidéos</a>
            <ul class="sub-menu">
                <li id="menu-item-401" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-401"><a class='ajaxLink' id='page_maximize_video' onClick="play_video()">Watermarks</a></li>
            </ul>
        </li>

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

<div id="statusTXT">
    <!-- ...................................................... -->
</div>

<div id="wrapper">

    <div id="homeContener" style="display:none">
        <div id="page_content_wrapper" class="two nopadding gallery">
            <div class="inner">
                <div class="inner_wrapper">
                    <div id="blog_grid_wrapper">
<?php
$nbr=0;

function vignette ($directory,$title,$comment)
{
    static $nbr = 0;    ?>
        <div class='wall_entry type-post post gallery masonry element wall_thumbnail <?php echo($directory); ?>'>
            <a class='arrowLink hiddenTab' onClick='getGallery(<?php echo($nbr); ?>)'>
            <img src='' alt='<?php echo $directory; ?>' class='portfolio_img static'/>
                <div class='mask'>
                    <div class='mask_frame'>
                        <ul class='gallery_img_slides' id='<?php echo($directory); ?>'>

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
<?php
    $nbr++;
}?>

<?php  for ($i = 0; $i < count($_SESSION['box']); $i++)    vignette($_SESSION['box'][$i][0],$_SESSION['box'][$i][1],$_SESSION['box'][$i][2]);  ?>

                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="galeryContener">
        <table id="horizontal_gallery_wrapper" cellspacing="0">
            <tr id="zoneGalery">

            </tr>
        </table>
    </div>

    <div id="contactContener" style="display:none">

        <div style="background-color:#000;">
            <table CELLPADDING="10" CELLSPACING="10" style="width: 90%; margin-left:auto; margin-right:auto;">
                <caption><img width="98%" src="./R.menu.R.jpg"/></caption>
                <thead>
                    <tr style="background-color:#2F3534; color:white; font-family:arial;">
                        <th style="width:33%">COMMUNICATION VISUELLE</th>
                        <th style="width:33%">WEBDESIGN</th>
                        <th style="width:33%">SCENE CONTEMPORAINE</th>
                    </tr>
                </thead>

                <tbody >
                    <tr style="color: #323539; font-family: Helvetica;" align="justify" valign="top">
                        <td><b> En cours de construction </b> Ei mea omnes mandamus consulatu. Sit ut omnium discere, regione nominati scriptorem vix eu,
                        cu ius copiosae indoctum.  Ne sit wisi utinam, vidisse fierent appetere eam cu. Id vim iriure recusabo,
                        quas omnesque at mea, cu dicat qua"erendum disputando vis. Ex sed quaeque fabulas appellantur, legimus nonumes assueverit an
                        ius, ex quo posse meliore disputationi. </td>
                        <td rowspan="2">Est adhuc similique <b> en cours de construction </b> suscipiantur te,  ex accusam fierent comprehensam mei. Ex mel tale case, sed ne suas
                        justo percipitur, fugit vidisse mei eu. Tollit vidisse dolorum ea mel, numquam gubergren sadipscing id eam. Volumus liberavisse per ut,
                        nibh error everti cu sed. Dicit disputando quo ad, veri mazim pro at. Vix eu summo numquam, stet deseruisse
                        has ei. Detracto moderatius eum in, an sadipscing voluptatibus eos. Stet elit senserit vis ea, et tollit postea putent ius, tantas sensibus et mea.
                        Est dico lorem definitiones ex. Per admodum nostrum adipiscing ea. Duo copiosae vulputate
                        sadipscing ex, error commodo nec id, ad eum quando alterum invenire.Sea error dicunt definitiones eu, pri quot oratio quodsi in, usu etiam scribentur id.
                        Reque accumsan vix et, eos in ipsum consulatu sententiae. Fugit dolores voluptua cu per, mel prima commune deleniti ne. Cum fuisset liberavisse ne.</td>
                        <td rowspan="2">Meliore vocibus placerat <b> en cours de construction </b> eos an, sed reque soleat constituto ex, eu
                        pro alii prima urbanitas. Solum lorem epicurei ius te, ad vel esse persius imperdiet.
                        Id fugit voluptaria accommodare eos, pro ex quem nonumy, et affert habemus pro.
                        Noluisse interpretaris sea ut. Ei pri exerci impedit insolens, ex quo explicari principes
                        intellegebat. Quo suas assueverit contentiones te. Mea et tale etiam commune, ne quis vocibus
                        officiis qui, in est bonorum ancillae insolens. Ius virtute definitiones ex, option scaevola
                        vituperatoribus cu his. Per admodum nostrum adipiscing ea. Duo copiosae vulputate
                        sadipscing ex, error commodo nec id, ad eum quando alterum invenire. Nobis volutpat duo in, at pri iracundia vituperatoribus.
                        Habeo vitae urbanitas cum cu. </td>
                    </tr>
                    <tr>
                        <td valign="bottom" style="vertical-allign:bottom;"><img width="100%" src="./carotte.jpg"/></td>
                    </tr>
                    <tr align="center">
                        <td STYLE="font-family: Helvetica; font-size: 24px; color: #B00000; font-weight: bold;">Les carottes sont cuites</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>

                <tfoot align="center">
                    <tr>
                        <td colspan="3" STYLE="font-family: Helvetica; font-size: 15px; color: white; font-weight: bold;">mentions légales</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <div id="videoContener" style="display:none">
        <video id='video' autoplay='true'>
            <source src='' type='video/webm' />
        </video>
    </div>

    <noscript>
        <div class="javaScriptNeeded">Vous devez activer JavaScript pour découvrir mon site.</div>
    </noscript>

</div>

        <div id="toTop" class="withbg">
            <i class="fa  fa-arrow-up"></i>
        </div>
<!------------------------------------------ END OF CONTENT -------------------------------------->

<script type="text/javascript">

var zoneHome   = document.getElementById("blog_grid_wrapper");
var zoneGalery = document.getElementById("zoneGalery");

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

var statusTXT = document.getElementById("statusTXT");
var level;              /* Contient une valeur correspondante à l'endroit ou se trouve l'utilisateur dans le site.
                        0 : Est sur le home
                        1 : Visionnage de gallerie
                        2 : Court-métrages.
                        3 : ContactMe
                        Fullscreen mode : cf ligne 6637 du fichier ./cache/combined.js  */
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
            var video = document.getElementById("video");
            video.style.height = lastHeigth+"px";
        }
    }
    var intervalRefreshMsg = setInterval(function(){verify_height();}, 200);

    return function()
    {};
})();
</script>

    </body>
</html>
