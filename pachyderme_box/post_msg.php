<?php session_start();

    if (! $_SESSION['login']) return;

/*** Fonction de base d'ouverture sécurisée de la base de donnée. ***/
    function openSQL()
    {
        try
        { /***          	                             nom DB         user            MDP        ***/
            $bdd = new PDO('mysql:host=localhost;dbname=pachyderme_box', 'pachyderme', 'bdBoudha333Mordak');
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        return $bdd;
    }

    $bdd = openSQL();

/*** Mes messages standards arrivent ici selon une méthode POST, ajax envoit ?txt=informations au PHP.  ***/
    if ($_POST['txt'])
    {
    // Enleve tous les tags HTML à l'exception d'img, le tag php disparait aussi. S'il ne reste rien ensuite, annuler l'inscription du message...
    // ... insère aussi des balises <br/> pour tous les sauts de lignes.

        if (! trim($_POST['txt'])) return;

        $txt = htmlentities($_POST['txt']);

        $req = $bdd->prepare("INSERT INTO chatbox (user, target, date, msg, autority) VALUES(?,?,?,?,?)");
    /*** Vérifie s'il s'agit d'un message addressé au système avec un / ou si c'est un message de base. ***/
        if (preg_match("#^/#",$txt))
        {
            /*** Fonction de lancement des dés. ***/
            if (preg_match("#^/roll#",$txt))
            {
                $X = rand(0,6);
                if ($X == 0) $Y=" Mouhaha XD !";
                $req->execute(array ($_SESSION['login'], "", date("Y-m-d H:i:s",time()),"lance les dés et obtient un ".$X." !".$Y."",2));
            }
            /*** Inscription du changement de nom. ***/
            else if (preg_match("#^/nick#",$txt))
            {
                $NEW_NAME = preg_replace("#^/nick#","",$txt);                              /*** Vérifie préfixe /nick/  ***/
                if (preg_match("#[A-Z]|[a-z]#",$NEW_NAME)) /*** Vérifie que la chaine contienne au moins une lettre, min ou maj. ***/
                {
                    /*** Etape I : Suppression de toutes les occurences du précédent login dans la table connected. ***/
                    $connect = openSQL();
                    $reponse=$connect ->prepare('DELETE FROM connected WHERE user = ? ');
                    $reponse->execute(array($_SESSION['login']));
                    $result = $reponse->fetch(); // fetch permet d'executer la commande sur toutes les lignes concernées.

                    $_SESSION['login'] = trim($NEW_NAME);

                    /*** Etape II : Inscription dans la base de donnée commune, chatbox qu'un nouveau client vient de se connecter. ***/
                    $req->execute(array ("SYSTEM", "", date("Y-m-d H:i:s",time()), $NEW_NAME." vient de se connecter.",1));

                    /*** Etape III : Inscription dans la base de donnée connected du nouveau login, IP & le moment de sa connection. ***/
                    $reponse = $connect->prepare("INSERT INTO connected (user, IP, time) VALUES(?,?,?)");
                    $reponse->execute(array ($_SESSION['login'],$_SERVER['REMOTE_ADDR'],date("U")));

                    $arr[0] = array('U' => $NEW_NAME, 'M' => 1, 'D' => NULL, 'A' => 0); // Signal A == 0 signifie spécial, U contient le login, et M flag à 1 !
                    echo (json_encode($arr));
                    return;                         /*** Sortie directe du code PHP ! ***/
                }
            }
            /*** Fonction qui sert à envoyer un son d'animal à autrui ! ***/
            else if (preg_match("#^/kick#",$txt))
            {
                $NAME = preg_replace("#^/kick#","",$txt);
                if (preg_match("#[A-Z]|[a-z]#",$NAME)) /*** Vérifie que la chaine contienne au moins une lettre, min ou maj. ***/
                {
                    $req->execute(array ($_SESSION['login'], "", date("Y-m-d H:i:s",time()),$NAME,3));
                }
            }
            /*** Gestion de la déconnection standard. ***/
            else if (preg_match("#^/exit#",$txt))
            {
                /*** Suppression de toutes les occurences du précédent login dans la table connected. ***/
                $connect = openSQL();
                $reponse=$connect ->prepare('DELETE FROM connected WHERE user = ? ');
                $reponse->execute(array($_SESSION['login']));
                $result = $reponse->fetch();

                $req->execute(array ("SYSTEM", "", date("Y-m-d H:i:s",time()),$_SESSION['login']." vient de nous quitter !",1));

                session_destroy();

                $arr[0] = array('U' => NULL, 'M' => NULL, 'D' => NULL, 'A' => 0); // Signal A == 0 signifie EXIT NOW !
                echo (json_encode($arr));
                return;                         /*** Sortie directe du code PHP ! ***/
            }
            else if (preg_match("#^/secret#",$txt))
            {
                ereg("([[:graph:]]+) ([[:graph:]]+)", $txt, $regs);

                $msg = preg_replace("#^".$regs[1]." ".$regs[2]."#","",$txt);

                $connect = openSQL();

                $reponse=$connect ->prepare('SELECT * FROM connected WHERE user = ? ');
                $reponse->execute(array($regs[2]));
                $donnee = $reponse->fetch();

                $arr[0] = array('U' => "SYSTEM", 'M' => "count", 'D' => NULL, 'A' => 1);

                if ($donnee['IP'])
                {
                    if (trim($msg))
                    {
                        $req->execute(array ($_SESSION['login'], $regs[2], date("Y-m-d H:i:s",time()),$msg,4));
                        $arr[1] = array('U' => "SYSTEM", 'M' => "Votre message a bien été porté à \"".$regs[2]."\".", 'D' => date("Y-m-d H:i:s",time()), 'A' => "1");
                    }
                    else
                    {
                        $arr[1] = array('U' => "SYSTEM", 'M' => "Un message privé bien vide non ?", 'D' => date("Y-m-d H:i:s",time()), 'A' => "1");
                    }
                }
                else
                {
                    $arr[1] = array('U' => "SYSTEM", 'M' => "Ce destinataire doit certainement se cacher ! \"".$regs[2]."\", c'est bien lui ?", 'D' => date("Y-m-d H:i:s",time()), 'A' => "1");
                }
                echo (json_encode($arr));
                return;
            }
            /*** Default d'erreur sur la fonction choisie. ***/
            //else $req->execute(array ($_SESSION['login'], "", date("Y-m-d H:i:s",time()),$txt,0));
        }
        /*** Execution classique d'un message. ***/
        else
        {
           // $txt = nl2br(str_replace(" ", "&nbsp;",$txt));
            $req->execute(array ($_SESSION['login'], "", date("Y-m-d H:i:s",time()),$txt,0));
        }
    }
/*** Compte le nombre de lignes présentes dans la base de donnée.
     Utilisation de l'objet $bdd créer par new PDO.          ***/
    $req = 'SELECT `ID` FROM `chatbox` ORDER BY `ID` DESC LIMIT 1';
    $result = $bdd->query($req);
    $columns = $result->fetch();
    $number_line = $columns['ID'];

    $j = 0;
/*** Affichage du ou des nouveaux messages. ***/
    if ($number_line >= $_SESSION['read_line'])
    {
        $diff_line = $number_line - $_SESSION['read_line'] + 1;

        $arr[0] = array('U' => "SYSTEM", 'M' => "count", 'D' => NULL, 'A' => $diff_line);

        $reponse=$bdd ->prepare('SELECT * FROM chatbox WHERE ID = ? '); /*** Méthode anti-injection SQL grade 0 ***/

        for ($i = 1; $i<=$diff_line; $i++)
        {
            $reponse->execute(array($_SESSION['read_line'] +$i +$j -1));                                        // retenir array comme indispensable.
            $donnee = $reponse->fetch();

            if ($donnee['autority'] != 4)   $arr[$i] = array('U' => $donnee['user'], 'M' => $donnee['msg'], 'D' => $donnee['date'], 'A' => $donnee['autority']);
            else
            {
                if (trim($donnee['target']) == trim($_SESSION['login']))
                {
                    $arr[$i] = array('U' => $donnee['user'], 'M' => $donnee['msg'], 'D' => $donnee['date'], 'A' => $donnee['autority']);
                }
                else
                {
                    $i--;
                    $j++;
                    $diff_line--;
                }
            }
        }

        $_SESSION['read_line'] = $number_line + 1;

        if ($diff_line != 0)
        {
            $arr[0]['A'] = $diff_line;

            echo (json_encode($arr));
            return;                                         /*** Quitte le script PHP avant le fin. ***/
        }
    }
    echo("0");
?>

<?php
/***  $pdo = new PDO( "mysql:host=localhost;dbname=chatbox", "librevpn", "bdBoudha333Mordak", array(
      PDO::MYSQL_ATTR_FOUND_ROWS => true
      ) );

     $query = $pdo->prepare( "UPDATE chatbox set user = 'username' where ID > 1" );
     $query->execute();
     echo $query->rowCount();
                                                                                            ***/
?>



