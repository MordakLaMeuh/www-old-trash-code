<?php include 'microCMS.php';

// *************************** ROUTINES DE SECURITE & INTRODUCTION DES CONTRAINTES D'AFFICHAGE ******************** //
$trusted=true;

$gallery=strip_tags($_GET[gallery]);

if (($gallery != $_GET[gallery]) || (!$gallery))   header('Location: Fy.php');

$trusted=false;
for ($i = 0; $i < count($_SESSION['box']); $i++)
{
    if ($gallery == $_SESSION['box'][$i][0])  $trusted=true;
}

if ($trusted == false)      header('Location: Fy.php');

//********************************************************* DOCUMENT BEGIN **************************************** //
function slide ($directory)
{
    if($dossier = opendir('photos/'.$directory.'')) //class='horizontal_gallery_img
    {
echo("
                <td class='gallery_image_wrapper'>
                        <img src='photos/".$directory.".jpg' alt='' class='img_size'/>
                </td>");

        while(false !== ($fichier = readdir($dossier)))
        {
            if ($fichier != "." && $fichier != "..")
            {   ?>
                <td class="gallery_image_wrapper" style='display:none;'>
                    <img src="photos/<?php echo "".$directory."/".$fichier.""; ?>" alt=""  class="img_size"/>
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

body.js_nav #wrapper,body.js_nav #supersized,body.js_nav #imageFlow,body.js_nav .backstretch{-webkit-transform:translate(230px,0px);-ms-transform:translate(230px,0px);-moz-transform:translate(230px,0px);-o-transform:translate(230px,0px);transform:translate(230px,0px);opacity:0.2;}

#page_header_bg { display:none; }
#wrapper
{
    overflow-x:scroll;
    overflow-y:hidden;
}
#homeIcon { visibility:visible; }
</style>

<table id="horizontal_gallery_wrapper" cellspacing="0">
    <tr>
        <?php slide($gallery); ?>
    </tr>
</table>






