<?php

include 'microCMS.php';

// *************************** ROUTINES DE SECURITE & INTRODUCTION DES CONTRAINTES D'AFFICHAGE ******************** //
$trusted=true;

$gallery=strip_tags($_GET[gallery]);

if (($gallery != $_GET[gallery]))   header('Location: Fy.php');

if ($gallery)
{
    $trusted=false;
    for ($i = 0; $i < count($box); $i++)
    {
        if ($gallery == $box[$i][0])  $trusted=true;
    }
}
if ($trusted == false)      header('Location: Fy.php');

//********************************************************* DOCUMENT BEGIN **************************************** //
function slide ($directory)
{
    if($dossier = opendir('photos/'.$directory.'')) //class='horizontal_gallery_img
    {
echo("
                <td>
                    <div class='gallery_image_wrapper'>
                        <img src='photos/".$directory.".jpg' alt='' class='img_size'/>
                    </div>
                </td>");

        while(false !== ($fichier = readdir($dossier)))
        {
            if ($fichier != "." && $fichier != "..")
            {   ?>
                <td>
                    <div class="gallery_image_wrapper">
                        <img src="photos/<?php echo "".$directory."/".$fichier.""; ?>" alt=""  class="img_size"/>
	    	    	</div>
                </td>   <?php
            }
        }
    }
}
?>

<style>
.img_size
{
    height: <?php echo ($_GET['heightResolution']); ?>px;
}

body.js_nav #wrapper,body.js_nav #supersized,body.js_nav #imageFlow,body.js_nav .backstretch{-webkit-transform:translate(250px,0px);-ms-transform:translate(250px,0px);-moz-transform:translate(250px,0px);-o-transform:translate(250px,0px);transform:translate(250px,0px);opacity:0.2;}

#page_header_bg
{
    display:none;
}
</style>

<table id="horizontal_gallery_wrapper" cellspacing="0">
    <tbody>
        <tr>
            <?php slide($gallery); ?>
        </tr>
    </tbody>
</table>






