<?php session_start();

    if (! $_SESSION['login']) return;

    function openSQL()
    {
        try
        { /***                                       nom DB         user            MDP        ***/
            $bdd = new PDO('mysql:host=localhost;dbname=pachyderme_box', 'pachyderme', 'bdBoudha333Mordak');
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        return $bdd;
    }

    $bdd = openSQL();

    $actual_time = date("U");
    $limit_time = $actual_time - 120;
    $login = $_SESSION['login'];

/* Cherche dans la base de donnée sur l'utilisateur $SESSION['login'] est inscrit. */
    $reponse=$bdd ->prepare('SELECT * FROM connect WHERE user = ? ');
    $reponse->execute(array($login));
    $donnee = $reponse->fetch();

    if ($donnee['IP'])  /* INSCRIT : Update de son Time de présence. */
    {
        $req = "UPDATE connect SET date ='".$actual_time."' WHERE user = '".$login."'";
        $result = $bdd->query($req);
    }
    else                /* NON-INSCRIT : Création de sa ligne dans la BDD */
    {
        $req = $bdd->prepare("INSERT INTO connect (user, IP, date) VALUES(?,?,?)");
        $req->execute(array ($_SESSION['login'],$_SERVER['REMOTE_ADDR'],date("U")));
    }

/* Suppressionde tous les clients dont le temp a expiré. */
    $req = "DELETE FROM connect WHERE date < '".$limit_time."'";
    $result = $bdd->query($req);

 /*   SET @count = 0;                           PERMET DE RETRIER LES ID DE LA PAGE.
    UPDATE `chatbox` SET `chatbox`.`ID` = @count:= @count + 1;
    ALTER TABLE `chatbox` AUTO_INCREMENT = 1; */

/* ALTER TABLE `chatbox` ENGINE=MYISAM; CHANGE LE TYPE DE TABLE VERS MYISAM */


/* Suprression de la colone ID */
    $req = 'ALTER TABLE connect DROP COLUMN ID';
    $result = $bdd->query($req);

/* Recréation de la colone ID */
    $req = 'ALTER TABLE connect ADD ID INT UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (ID)';
    $result = $bdd->query($req);

/* Compte du nombre de connectés. */
    $req = 'SELECT COUNT(*) AS number_line FROM connect';
    $result = $bdd->query($req);
    $columns = $result->fetch();
    $number_line = $columns['number_line'];

/* Affichage des clients connectés. */
    for ($i = 1; $i <= $number_line; $i++)
    {
        $reponse=$bdd ->prepare('SELECT * FROM connect WHERE ID = ? ');
        $reponse->execute(array($i));
        $donnee = $reponse->fetch();

        if ($i != $number_line) echo($donnee['user'].", ");
        else                    echo($donnee['user']." ");
    }
?>
