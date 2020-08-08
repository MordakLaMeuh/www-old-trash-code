
<?php
    session_start();

    header("Content-Type: text/plain"); // il s'agit juste de texte brut (text/plain).

    $id=(isset($_GET["ID"])) ? $_GET["ID"] : NULL;
    $type=(isset($_GET["type"])) ? $_GET["type"] : NULL;

    //echo ("ID=".$id." &type=".$type);

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
        if ($type == 1)
        {
            $download_file=1;
            echo ('<div class="big_red">"'.$_SESSION['TAB_DIRECTORY'][$id].'"</div><br />');

            $target = ereg_replace("/home/frank", "/var/www/.acc_1309_rt8_mv",$_SESSION['directory']).'/'.$_SESSION['TAB_DIRECTORY'][$id];
            $link = '/var/www/.bank/'.$_SESSION['user_dir'].'/'.$_SESSION['TAB_DIRECTORY'][$id].'';

            // echo ($target); echo ("<br />"); echo ($link);
            symlink($target, $link);

            $link = ereg_replace("/var/www/", "./",$link);

            echo ('<div class="big_red"><a href="'.$link.'" download=\"'.$_SESSION['TAB_DIRECTORY'][$id].'">Téléchargez moi !</a></div>');

            if (ereg(".mp3",$link)) $_SESSION['link'] = $link;
        }
        else
        {
            if ($id == 0) chdir("./"."../");
            else chdir("./".$_SESSION['TAB_DIRECTORY'][$id]);
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

    //echo("dossier = ".$_SESSION['directory']);

    echo '<div id="navigator"><ul>';

    if($dossier = opendir($_SESSION['directory']))
    {
        /*** Lecture du dossier courant à l'aide du pointeur. ***/
        while(false !== ($_SESSION['TAB_DIRECTORY'][$nb_fichier] = readdir($dossier)))
        {
            /*** Exclusion sélective. ***/
            if($_SESSION['TAB_DIRECTORY'][$nb_fichier] != 'index.php' && $_SESSION['TAB_DIRECTORY'][$nb_fichier] != '.' && $_SESSION['TAB_DIRECTORY'][$nb_fichier] != '..' && substr($_SESSION['TAB_DIRECTORY'][$nb_fichier],0,1) != ".")
            {
                $nb_fichier++;
            }
        }
        /*** Trie le tableau des fichiers selon l'ordre croissant en ignorant MAj/Min. ***/
        usort($_SESSION['TAB_DIRECTORY'],"strcasecmp");

        for ($i = 1; $i <= $nb_fichier; $i++)
        {
            /*** Teste si nous sommes en présence d'un fichier ou d'un dossier. ***/
            /*** REGEX : ereg replace remplace un l'expression régulière I par l'expression II dans III renvoit string. ***/
            if (filetype('./'. $_SESSION['TAB_DIRECTORY'][$i]) == "dir" )
            {
		$type=0;
                echo '<span class="plain_blue"><li><a href="javascript:void(0)" onclick="listing('.$i.','.$type.')" class="dir">' . $_SESSION['TAB_DIRECTORY'][$i] . '</a></li></span>';
            }
            else
            {
		$type=1;
		echo '<span class="plain_green"><li><a href="javascript:void(0)" onclick="listing('.$i.','.$type.')" class="file">' . $_SESSION['TAB_DIRECTORY'][$i] . '</a></li></span>';
	    }
        }
    }
    else
    {
      echo("Erreure JS de derrière les fagots... sorry ;(");
    }

    echo "</ul></div>";

    echo ('<h5>Nombre d\'éléments au total :<span class="plain_red">'.$nb_fichier.'</span></h5>')
?>