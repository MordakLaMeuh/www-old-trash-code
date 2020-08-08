<?php
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

$bdd = openSQL();


 /*   $req = 'SELECT COUNT(*) AS number_line FROM chatbox';
    $result = $bdd->query($req);
    $columns = $result->fetch();
    $number_line = $columns['number_line']; */

    $req = 'SELECT `ID` FROM `chatbox` ORDER BY `ID` DESC LIMIT 1';
    $result = $bdd->query($req);
    $columns = $result->fetch();
    $number_line = $columns['ID'];

   // echo ($result);
    echo ("bananas".$number_line);
?>
