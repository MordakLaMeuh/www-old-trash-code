<?php session_start();

function openSQL()
   {
      try
      {
         $bdd = new PDO('mysql:host=localhost;dbname=user', 'mordak', 'bdBoudha333Mordak');;
      }
      catch (Exception $e)
      {
         die('Erreur : ' . $e->getMessage());
      }
      return $bdd;
   }

// MATRICE 0 -> DISCONNECT * Reinitialise Varialbes de SESSION à VOID X
if (!empty ($_POST['exit']))
{
   session_destroy();
   session_start();
}

if (!empty ($_POST['addblock']))
{
	$_SESSION['addblock'] = 0;
}

if (empty ($_SESSION['LOG']))
{ $_SESSION['LOG'] = " Un inconnu par ici ? N'hésites pas à t'inscrire ! "; }

// MATRICE 1 - Enregistrement
if (empty ($_SESSION['mail']))                // => SESSION['mail'] inexistant DONC non inscrit
{
   if (!empty ($_POST['mail']))                     // => Trigger si client a "posté" son email
   {  $email = strip_tags($_POST['mail']);
      $point = strpos($email,".");
      $aroba = strpos($email,"@");
      if ($point!='' AND $aroba!='' AND $email == ($_POST['mail']))
      {  $userNEW = strip_tags($_POST['userNEW']);
         if ($_POST['userNEW'] == $userNEW AND !empty ($userNEW))
         {  $passwd = strip_tags($_POST['passwd']);
            $passvf = strip_tags($_POST['passvf']);
            if ( $passwd == $_POST['passwd'] AND $passvf == $_POST['passvf'] AND $passwd == $passvf AND !empty ($passwd))
            {
               // Inscrit données définitives dans la SGBD : droit ++ SI ACTIVATION

               $bdd = openSQL();
               $reponse=$bdd ->prepare('SELECT * FROM client WHERE client = ? ');
               $reponse->execute(array($userNEW));
               $donnee = $reponse->fetch();
               if (empty ($donnee['client']))                                             // Vérifie que Client n'existe pas deja - ID ?
               {
                  $reponse=$bdd ->prepare('SELECT * FROM client WHERE mail = ? ');
                  $reponse->execute(array($email));
                  $donnee = $reponse->fetch();
                  if (empty ($donnee['mail']))                                            // Vérfifie que Email n'exite pas déjà - ID ?
                  {
                     $_SESSION['mail']=$email;
                     $_SESSION['droit']=1;
                     $_SESSION['user']=$userNEW;
                     $_SESSION['password']=$passwd;

                     $X=openssl_random_pseudo_bytes(8);
                     $X=bin2hex($X);

                     $req = $bdd->prepare("INSERT INTO client (IP, client, password, mail, code, droit, date) VALUES(?,?,?,?,?,?,?)");
                     $req->execute(array ($_SERVER['REMOTE_ADDR'], $_SESSION['user'], sha256($_SESSION['password']), $_SESSION['mail'], $X, 1, date('Y-m-d')));

                     $user = $_SESSION['user'];
                     $pass = $_SESSION['password'];
                     $mail = $_SESSION['mail'];
                     exec("sudo bash code.bash $user $pass $X $mail");
                     $_SESSION['LOG'] = '" Vous venez de recevoir un email avec le code d\'activation - saisissez-le. Il peut etre dans vos spams et courriers indésirables."';
                  }
                  else
                  { $_SESSION['LOG'] = '" Vous avez deja un comtpe associé à cet email ! Sorry. "';
                  header('Location: inscription.php');  }}
               else
               { $_SESSION['LOG'] = '" Je connais déjà cette personne et ce n\'est pas vous ! Quoique... "';
               header('Location: inscription.php');  }}                                                 // FERMETURE SGBD ?
            else
            { $_SESSION['LOG'] = '" Hum, un client étrange que voilà, dis, tu veux jouer avec moi ? "';
            header('Location: inscription.php');   }}
         else
         { $_SESSION['LOG'] = '" Moi aussi je t\'aime ! "'; 
         header('Location: inscription.php');  }}
      else
      { $_SESSION['LOG'] = '" Un email à faire frémir de peur une mouche, tu veux jouer avec moi ? "';
        header('Location: inscription.php');   }
   }
}

// MATRICE 2 -> Le client tente de se connecter à son compte.

if (empty ($_SESSION['user']))
{
   if (!empty ($_POST['user']))
   {
      $bdd = openSQL();
      $user=strip_tags($_POST['user']);
      $password=strip_tags($_POST['password']);

      $reponse= $bdd->prepare('SELECT * FROM client WHERE client = ? ');
      $reponse->execute(array($user));
      $donnee = $reponse->fetch();

      if ( $donnee['password'] == sha256($password) AND !empty ($password))
      {
         $_SESSION['user'] = $user;
         $_SESSION['password']=$password;
         $_SESSION['mail']=$donnee['mail'];
         $_SESSION['droit']=$donnee['droit'];
         $_SESSION['LOG'] = 'Salut à toi '.$_SESSION['user'].'!';
      }
      else
      {
      $_SESSION['LOG'] = '"Comme quoi tout le monde peut se tromper ! Bariiii ! "';
      // Fonction closeSGBD ?
      }
   }
}

// MATRICE 3 -> OCTROIT DE DROITS SUPPLEMENTAIRES : Code venant d'etre tapé et password actif $_SESSION['USER'] est sencé etre rempli.
if (!empty ($_POST['code']) AND !empty ($_SESSION['password']))
{                                                                 // SE SOUVENIR PRESENCE DE $_CODE POUR N'importe QUEL CHANGEMENTS DE DROITS
   $bdd = openSQL();
   $reponse = $bdd->prepare('SELECT * FROM client WHERE client = ? ');
   $reponse->  execute(array($_SESSION['user']));
   $donnee = $reponse->fetch();

   if ($_SESSION['droit'] == 1)
   {
      $code=strip_tags($_POST['code']);
      if ($donnee['code'] == $code)
      {
         $req = $bdd->prepare('UPDATE client SET droit = 2 WHERE client = ?');
         $req->execute(array($_SESSION['user']));
         $_SESSION['droit'] = 2;
         $_SESSION['LOG'] = 'Bariiii ! '.$_SESSION['user'].'" Il ne reste plus qu\'à profiter de mon chouette VPN ! "';
      }
      else
      {
         $_SESSION['LOG'] = '" Tu sais quoi ? J\'ai besoin du bon code d\'activation là. "';
      }
   }
   else
   {
      // ICI PEUVENT VENIR D'AUTRES CONDITIONS A D'AUTRES DROITS 2, 3 ,4 |...] 999
   }
   // CLOSE-SGBD ?
}

// MATRICE 4 -> ACCES a l'envoi du compte.                                                 - Ya un droit, des chiffres, elePHPhant peut envoyer le mail.

if (!empty ($_POST['var1']) AND !empty ($_POST['var2']) AND ($_SESSION['droit']) == 2)
{
   $a = (int) $_POST['var1'];
   $b = (int) $_POST['var2'];
   $c=$a+$b;
   $_SESSION['LOG'] = 'Bariiii ! '.$_SESSION['user'].'" A ta boite mail, tu y trouveras TON certificat VPN ! "';
}

?> 
