<?php session_start();

    if (! $_SESSION['login']) return;

    function openSQL()
    {
        try
        { /***                                       nom DB         user            MDP        ***/
            $bdd = new PDO('mysql:host=localhost;dbname=chatbox', 'librevpn', 'bdBoudha333Mordak');
        }
        catch (Exception $e)
        {
            die('Erreur : ' . $e->getMessage());
        }
        return $bdd;
    }

    $login="abcd";

    $bdd = openSQL();

    $req = $bdd->prepare("INSERT INTO connect (user, IP, date) VALUES(?,?,?)");
    $req->execute(array ($login,$_SERVER['REMOTE_ADDR'],date("U")));

    echo("meuuh".date("U"));

    ?>
