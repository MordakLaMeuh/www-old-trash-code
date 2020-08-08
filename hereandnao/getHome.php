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

}?>

        <div id="page_content_wrapper" class="two nopadding gallery">
            <div class="inner">
                <div class="inner_wrapper">
                    <div id="blog_grid_wrapper">

<?php  for ($i = 0; $i < count($box); $i++)    vignette($box[$i][0],$box[$i][1],$box[$i][2]);  ?>

                    </div>
                </div>
            </div>
        </div>


