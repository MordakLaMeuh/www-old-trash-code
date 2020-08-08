<?php session_start();

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

    if(preg_match("#[A-Z]|[a-z]#",strip_tags($_POST['login'])))
    {
        $_SESSION['read_line'] = 1;
        $_SESSION['login'] = strip_tags($_POST['login']);
        $login = $_SESSION['login'];

        $connect = openSQL();

    /*** Cherche si l'utilisateur est déjà présent dans la chatbox. ***/
        $reponse=$connect ->prepare('SELECT * FROM connected WHERE user = ? ');
        $reponse->execute(array(($login)));
        $donnee = $reponse->fetch();

        if ($donnee['IP'])      {}
    /*** Inscrit dans la table "connected" le login, l'IP et la date de connection. ***/
        else
        {
            $req = $connect->prepare("INSERT INTO connected (user, IP, time) VALUES(?,?,?)");
            $req->execute(array ($_SESSION['login'],$_SERVER['REMOTE_ADDR'],date("U")));
        }

    /*** Inscrit dans la chatbox la nouvelle d'une connection. ***/
        $bdd = openSQL();
        $req = $bdd->prepare("INSERT INTO chatbox (user, date, msg, autority) VALUES(?,?,?,?)");
        $req->execute(array ("SYSTEM", date("Y-m-d H:i:s",time()), $_SESSION['login']." vient de se connecter.",1));

        echo ($_SESSION['login']);
    }
     else echo ("0");
?>

