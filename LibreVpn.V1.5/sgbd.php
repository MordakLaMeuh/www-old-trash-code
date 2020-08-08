<H3>La fameuse SGBD => Super Grande Base de Donnee.</H3>
<?php
try
{
    $bdd = new PDO('mysql:host=localhost;dbname=user', 'mordak', 'bdBoudha333Mordak');
}

catch (Exception $e)
{
        die('Erreur : ' . $e->getMessage());
}

$reponse = $bdd->query('SELECT * FROM client');

while ($donnees = $reponse->fetch())
{
?>
    <p>
    <br /><STRONG><em><?php echo 'client : '.$donnees['client'].''; ?></em></STRONG>
    <br /><em><?php echo 'mail : '.$donnees['mail'].''; ?></em>
    <br /><em><?php echo 'IP : '.$donnees['IP'].''; ?></em>
    <br /><em><?php echo 'date : '.$donnees['date'].''; ?></em>
    <br /><em><?php echo 'code activation : '.$donnees['code'].''; ?></em>
    <br /><em><?php echo 'password : '.$donnees['password'].''; ?></em>
    <br /><em><?php echo 'droit : '.$donnees['droit'].''; ?></em>
    </p>
<?php
}

$reponse->closeCursor();
?>
