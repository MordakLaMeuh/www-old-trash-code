<?php include 'microCMS.php';

// Routine de sécurité de base...
if ($_GET['allImagesLoaded'] != "false" && $_GET['allImagesLoaded'] != "true")   header('Location: Fy.php');

$nbr=0;

function vignette ($directory,$title,$comment)
{
    static $nbr = 0;    ?>
            <div class='wall_entry type-post post gallery masonry element'>
                <div class='wall_thumbnail <?php echo($directory); ?>'>
                    <a class='arrowLink hiddenTab' onClick='getGallery(<?php echo($nbr); ?>)'>
                        <img src='photos/<?php echo $directory; ?>.jpg' alt='<?php echo $directory; ?>' class='portfolio_img static'/>
                        <div class='mask'>
                            <div class='mask_frame'>
                                <ul class='gallery_img_slides' id='<?php echo($directory); ?>'>
<?php
if ($_GET['allImagesLoaded'] == "true")
{
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
    $nbr++;
}?>

<style>
#wrapper
{
    overflow-x:hidden;
    overflow-y:scroll;
}
</style>
        <div id="page_content_wrapper" class="two nopadding gallery">
            <div class="inner">
                <div class="inner_wrapper">
                    <div id="blog_grid_wrapper">

<?php  for ($i = 0; $i < count($_SESSION['box']); $i++)    vignette($_SESSION['box'][$i][0],$_SESSION['box'][$i][1],$_SESSION['box'][$i][2]);  ?>

                    </div>
                </div>
            </div>
        </div>





