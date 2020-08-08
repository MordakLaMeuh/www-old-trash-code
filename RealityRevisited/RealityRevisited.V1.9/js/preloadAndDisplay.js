
var displayHomePictures = (function()
{
    // Enoncé des variables statiques.............
    var slide = (function()
    {
        // Enoncé des variables statiques.............
        var pictureMap;
        var renew = false;

        var i = 0;
        var interval = setInterval(function()
        {                                                                                    console.log(pictureMap);
            if (!pictureMap || pictureMap.length == 0 || level !=0)     return;
            if (renew)
            {
                renew = false;                                                               console.log("Protocole Renew invoqué de derrière les fagots");
                i=0;
                for (x=0; x<pictureMap.length; x++) pictureMap[x].style.opacity = 0;
            }
            if (i == 0 || i >= pictureMap.length)
            {
                i=0;                                                                         console.log("EXCEPTION value of i ="+i);
                pictureMap[pictureMap.length-1].style.opacity = 0;
                pictureMap[0].style.opacity = 1;
            }
            else
            {
                pictureMap[i].style.opacity = 1;                                             console.log("ELSE value of i ="+i);
                pictureMap[(i-1)].style.opacity = 0;
            }
            i++;
        },2000);

        return function()
        {
            jQuery('.wall_thumbnail').hover(function()
            {                                                                                console.log("slideAll hover detecté");
                jQuery(this).find('.gallery_img_slides').addClass('active');

                pictureMap = (this).getElementsByTagName("li");
                renew = true;                                                                console.log("slide all - picture-map:"+ pictureMap+" of "+pictureMap.length);
            }, function()
            {
                jQuery(this).find('.gallery_img_slides').removeClass('active');              console.log("Déselection de la galerie courante");
                selectedGalery = "";
                pictureMap = "";
            });
        };
    })();

    return function(housing)
    {                                                                                       console.log("DisplayHome State I: ENTER");
        jQuery(document).ready(function() {
            "use strict";

            var windowWidth = jQuery(window).width();
            var $window = jQuery(window);
            var jQueryblogcontainer = jQuery('#blog_grid_wrapper');
            var blogGridColumn = 2;

            function reBlogLayout() {
                var currentContainerWidth = jQueryblogcontainer.width();
                if (jQueryblogcontainer.hasClass('vertical')) {
                    var blogGridColumn = 1;
                } else {
                    var blogGridColumn = 2;
                    if (jQuery(window).width() < 480) {
                        blogGridColumn = 1;
                    } else if (jQuery(window).width() >= 480 && jQuery(window).width() < 1400) {
                        blogGridColumn = 2;
                    } else if (jQuery(window).width() >= 1400 && jQuery(window).width() < 1900) {
                        blogGridColumn = 3;
                    } else if (jQuery(window).width() >= 1900 && jQuery(window).width() < 2000) {
                        blogGridColumn = 4;
                    } else {
                        blogGridColumn = 5;
                    }
                }
                var masonryOpts = {
                    columnWidth: parseInt(currentContainerWidth / blogGridColumn)
                };
                jQueryblogcontainer.isotope({
                    resizable: false,
                    itemSelector: '.post.type-post',
                    masonry: masonryOpts
                }).isotope();
            }                                                                               console.log("DisplayHome State II: Pré-rebloging");
            reBlogLayout();                                                                 console.log("DisplayHome State III: rebloging done, configure visibility...");
            if (housing == 1)       {           // STYLE : Quand clic sur la maison, les vignettes apparaissent en même temps, et non, les uns après les autres ...
                                                // ... et la barre de défilement Y est mise là ou l'utilisateur l'avait laissé.
                jQuery('#blog_grid_wrapper').children('.post.type-post').each(function(index, value) {
                    jQuery(this).addClass('visibleSpeedyRabbit');
                });
                corpus.scrollTop = ScrollLevel;
            }
            else                    {
            jQuery('#blog_grid_wrapper').children('.post.type-post').each(function(index, value) {
                jQuery(this).addClass('animated' + (index + 1));
                jQuery(this).addClass('visible');
            });                     }                                                       console.log("DisplayHome State IV: Visibility OK, configure smart-resize");

            $window.smartresize(reBlogLayout);                                              console.log("DisplayHome State V: smart-resize SUCCESS");

            level = 0;                                                                      console.log("DisplayHome State VI: Appel de slide()");
            slide();                                                                        console.log("DisplayHome State VII: Slide() success exit.");
        });
    };
 })();
