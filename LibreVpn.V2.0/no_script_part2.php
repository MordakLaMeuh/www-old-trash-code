<noscript>
<?php

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
                echo '<span class="plain_blue"><li><a href="/web_navigator.php?dir='.$i.'" class="dir">' . $_SESSION['TAB_DIRECTORY'][$i] . '</a></li></span>';
            }
            else
            {
               echo '<span class="plain_green"><li><a href="/web_navigator.php?file='.$i.'" class="file">' . $_SESSION['TAB_DIRECTORY'][$i] . '</a></li></span>';
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
    </noscript>