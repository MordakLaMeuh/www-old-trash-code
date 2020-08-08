<!DOCTYPE html>
<html lang="en-US">
<?php
include 'microCMS.php';

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
                                <div class='mask_image_content hascycle'>   <!-- post traitement - titres et commentaires -->
                                        <div class='mask_image_content_frame'>
                                        <h6><?php echo $title; ?></h6>
                                        <span><?php echo $comment; ?></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>      <?php

}

//********************************************************* DOCUMENT BEGIN **************************************** //
?>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

    <title>L'eau de nos muses</title>

    <link rel="shortcut icon" href="<?php echo "$favicon"; ?>" />

    <link rel='stylesheet' id='combined_css-css'  href='cache/combined.css?ver=1.0' type='text/css' media='all' />
    <link rel='stylesheet' id='fontawesome-css'  href='css/font-awesome.min.css?ver=1.0' type='text/css' media='all' />
    <link rel='stylesheet' id='custom_css-css'  href='templates/custom.css' type='text/css' media='all' />
    <link rel='stylesheet' id='grid-css'  href='css/grid.css?ver=4.0.1' type='text/css' media='all' />

    <script type='text/javascript' src='jquery/jquery.js?ver=1.11.1'></script>
    <script type='text/javascript' src='jquery/jquery-migrate.min.js?ver=1.2.1'></script>

    <script type='text/javascript' src='cache/combined_hack.js?ver=1.0'></script>
    <script type='text/javascript' src='js/jquery.cycle2.min.js?ver=1.0'></script>
    <script type='text/javascript' src='js/jquery.tooltipster.min.js?ver=1.0'></script>

    <style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>

<!-- Correction de quelques classes précédement définies afin de mieux personaliser le style & fixer quelques bugs inhérents au thème. -->
    <link rel='stylesheet' id='index-css'  href='index.css' type='text/css' media='all' />
</head>

<?php /**************************** CORPUS PRINCIPAL ***************************************************************/ ?>

<body class="home page page-id-1762 page-template page-template-gallery_archive-php" data-style="blog_grid">

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
echo("                    <img src='".$logo_img."' alt='' width='200' height='130'/>");
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
            <a href="">Home</a>
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
echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-taxonomy menu-item-object-gallerycat menu-item-".$x."'><a class='ajaxLink' onClick='getGallery(\"".$box[$i][0]."\")'>".$box[$i][1]."</a></li>\n");
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
//echo("            <li id='menu-item-".$x."' class='menu-item menu-item-type-post_type menu-item-object-page menu-item-".$x."'><a href='?".$menu[$i]->title."=".$menu[$i]->sub[$j]."'>".$menu[$i]->sub[$j]."</a></li>\n");
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
    <!--        <li id="menu-item-400" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-400"><a href="https://vimeo.com/" target=_blank>Fullscreen Vimeo</a></li> onClick="play_video()"-->
                <li id="menu-item-401" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-401"><a class='ajaxLink' id='page_maximize_video' onClick="play_video()">Court-métrage</a></li>
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

<!-- Begin template #wrapper -->

<div id="background_picture">
    <div id="page_header_bg" style="background-image:url(<?php echo $main_picture; ?>);"></div>
</div>

<div id="wrapper">

    <div class='page_control_static'>
        <a id='page_maximize' class='ajaxLink'></a>
    </div>

    <div id="AJAXspace">

<!-- Begin content -->

        <div id="page_content_wrapper" class="two nopadding gallery">
            <div class="inner">
                <div class="inner_wrapper">
                    <div id="blog_grid_wrapper">

<?php  for ($i = 0; $i < count($box); $i++)    vignette($box[$i][0],$box[$i][1],$box[$i][2]);  ?>

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<div id="toTop" class="withbg">
    <i class="fa  fa-arrow-up"></i>
</div>

<script type='text/javascript' src='index.js'></script>                     <!-- Scripts personnels pour la page.                            -->
<script type='text/javascript' src='js/custom_cycle.js?ver=1.0'></script>   <!-- Permet la rotation entres les photos sur l'écran d'acceuil. -->

    </body>
</html>
