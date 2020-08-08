
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

function vignette2 ($directory,$title,$comment)
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

//********************************************************* DOCUMENT BEGIN **************************************** //
?>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

    <title>L'eau de nos muses</title>

    <link rel="shortcut icon" href="<?php echo "$favicon"; ?>" />

    <script type='text/javascript' src='jquery/jquery.js?ver=1.11.1'></script>
    <script type='text/javascript' src='jquery/jquery-migrate.min.js?ver=1.2.1'></script>

    <link rel='stylesheet' id='combined_css-css'  href='cache/combined.css?ver=1.0' type='text/css' media='all' />
    <script type='text/javascript' src='js/jquery.tooltipster.min.js?ver=1.0'></script>
    <script type='text/javascript' src='cache/combined_hack_2.js?ver=1.0'></script>
    <script type='text/javascript' src='cache/combined_hack_3.js?ver=1.0'></script>

    <style type="text/css">.recentcomments a{display:inline !important;padding:0 !important;margin:0 !important;}</style>

<!-- Correction de quelques classes précédement définies afin de mieux personaliser le style & fixer quelques bugs inhérents au thème. -->
    <link rel='stylesheet' id='index-css'  href='index.css' type='text/css' media='all' />
</head>

<?php /**************************** CORPUS PRINCIPAL ***************************************************************/ ?>

<body class="home page page-id-1762 page-template page-template-gallery_archive-php" data-style="blog_grid">

<div id="wrapper">

    <div id="AJAXspace">

        <div id="page_content_wrapper" class="two nopadding gallery">


            <div class="inner">
                <div class="inner_wrapper" id="gre">
                    <div id="blog_grid_wrapper" style="overflow: scroll;">

<?php // for ($i = 0; $i < count($box); $i++)    vignette($box[$i][0],$box[$i][1],$box[$i][2]);  ?>

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<script type='text/javascript' src='index.js'></script>                     <!-- Scripts personnels pour la page.                            -->
<script>
var intervalhome = setInterval(function(){getHome();}, 20000);
alert("debut de cycle assynchrone");
</script>

<!-- <script type='text/javascript' src='js/custom_cycle.js?ver=1.0'></script>   <!-- Permet la rotation entres les photos sur l'écran d'acceuil. -->
    </body>
</html>
