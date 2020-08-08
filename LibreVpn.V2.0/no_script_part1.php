
 <noscript>
 <?php
    $nb_fichier = 0;   							/*** Sera utilisé comme compteur du nombre de fichiers. ***/
    /*** Routine utilisée pour l'initialisation au stade de la première connexion à la page. ***/
    if (empty ($_SESSION['directory']))
    {
        $_SESSION['directory']="/var/www/.acc_1309_rt8_mv/";
        chdir("/".$_SESSION['directory']);
    }
    else
    {
        chdir("/".$_SESSION['directory']);		/*** Mise dans l'ancien dossier quitté. ***/
        $i=$_GET['file'];
        if ($i != 0)
        {
            $download_file=1;
            echo ('<div class="big_red">"'.$_SESSION['TAB_DIRECTORY'][$i].'"</div><br />');

            $target = ereg_replace("/home/frank", "/var/www/.acc_1309_rt8_mv",$_SESSION['directory']).'/'.$_SESSION['TAB_DIRECTORY'][$i];
            $link = '/var/www/.bank/'.$_SESSION['user_dir'].'/'.$_SESSION['TAB_DIRECTORY'][$i].'';

            symlink($target, $link);

            $link = ereg_replace("/var/www/", "./",$link);

            echo ('<div class="big_red"><a href="'.$link.'" download=\"'.$_SESSION['TAB_DIRECTORY'][$i].'">Téléchargez moi !</a></div>');
        }
        else
        {
            $i=$_GET['dir'];
            if ($i == 0) chdir("./"."../");
            else chdir("./".$_SESSION['TAB_DIRECTORY'][$i]);
        }
    }
    $_SESSION['TAB_DIRECTORY'] = array();
    $_SESSION['directory'] = getcwd();	 /*** Remise à jour du dossier courant. ***/

    /*** Vérification que le dossier minimal est bien /home/frank afin d'éviter les piratages. ***/
    if(ereg ("/home/frank",$_SESSION['directory']) != 1) // REGEX : ereg teste la présence de l'expr. régulière
    {
        $_SESSION['directory'] = "/home/frank";
        chdir("/".$_SESSION['directory']);
    }

    /*** Texte dossier courant. ***/
    if ($download_file == 0)
    {
        echo('<div class="little_red">"'.ereg_replace("home/frank", "",$_SESSION['directory'] ).'"</div>');
    }

    ?>
    </noscript>