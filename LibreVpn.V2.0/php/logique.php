<?php session_start();

function openSQL()
   {
      try
      {
         $bdd = new PDO('mysql:host=localhost;dbname=librevpn', 'librevpn', 'bdBoudha333Mordak');
      }
      catch (Exception $e)
      {
         die('Erreur : ' . $e->getMessage());
      }
      return $bdd;
   }

if (empty ($_SESSION['LOG']))
{
	$_SESSION['LOG'] = " Bariiii ! Un inconnu par ici ? N'hésites pas à t'inscrire ! ";
}

// MATRICE 1 - Enregistrement
// Un dossier du nom du bonhomme est crée dans ./files
if (empty ($_SESSION['user']) AND !empty ($_POST['userNEW']))
{
  	$userNEW = strip_tags($_POST['userNEW']);
  	/*** Vérifie l'absence de tags PHP et HTML =>strip_tags & l'absence de caractère / => ereg REGEX. ***/
 	if ($_POST['userNEW'] == $userNEW && ereg("/",$userNEW) == FALSE)
   {
  		$pass_1 = strip_tags($_POST['pass_1']);
     	$pass_2 = strip_tags($_POST['pass_2']);
      if ( $pass_1 == $_POST['pass_1'] AND $pass_2 == $_POST['pass_2'] AND $pass_1 == $pass_2 AND !empty ($pass_1))
      {
         // Inscrit données définitives dans la SGBD : droit ++ SI ACTIVATION
       	$bdd = openSQL();

         $reponse=$bdd ->prepare('SELECT * FROM librevpn WHERE client = ? ');
         $reponse->execute(array($userNEW));
         $donnee = $reponse->fetch();

         if (empty ($donnee['client']))                                             // Vérifie que Client n'existe pas deja - ID ?
         {
          	$_SESSION['droit']=1;
            $_SESSION['user']=$userNEW;
            $_SESSION['password']=$pass_1;

            $X=openssl_random_pseudo_bytes(8);
            $X=bin2hex($X);
            $_SESSION['user_id'] = $X;

            $req = $bdd->prepare("INSERT INTO librevpn (client, mail, IP, date, code, password, droit) VALUES(?,?,?,?,?,?,?)");
            $req->execute(array ($_SESSION['user'], "no_mail", $_SERVER['REMOTE_ADDR'], date('Y-m-d'), $X, sha1($_SESSION['password']),1));

            $user = $_SESSION['user'];
            $pass = $_SESSION['password'];

            $_SESSION['LOG'] = '"Salut à toi '.$_SESSION['user'].' ! Tu peux télécharger ton compte VPN ici !"';
        }
        else	$_SESSION['LOG'] = '" Je connais déjà cette personne et ce n\'est pas vous ! Quoique... "';
        }
     	else	$_SESSION['LOG'] = '" Hum, des étranges mots de passe que voilà, dis, tu veux jouer avec moi ? "';
 	}
  	else	 $_SESSION['LOG'] = '" Moi aussi je t\'aime ! "';
}

// MATRICE 2 -> Le client tente de récupérer à nouveau son compte VPN

if (empty ($_SESSION['user']))
{
   if (!empty ($_POST['user']))
   {
      $bdd = openSQL();

      $user=strip_tags($_POST['user']);
      $password=strip_tags($_POST['password']);

      $reponse= $bdd->prepare('SELECT * FROM librevpn WHERE client = ? ');
      $reponse->execute(array($user));
      $donnee = $reponse->fetch();

      if ( $donnee['password'] == sha1($password) AND !empty ($password))
      {
         $_SESSION['user'] = $user;
         $_SESSION['password']=$password;
         $_SESSION['droit']=$donnee['droit'];
         $_SESSION['user_id']=$donnee['code'];
         $_SESSION['LOG'] = '"'.$_SESSION['user'].', tu peux récupérer tes fichiers de configuration ici !"';
      }
      else
      {
      	$_SESSION['LOG'] = '"Vous avez commis une erreur quelque part... Bariiii ! "';
      	header('Location: recovery.php');
      }
   }
}

/*** MATRICE 0 -> DISCONNECT * Reinitialise Varialbes de SESSION à VOID X
if (!empty ($_POST['exit']))
{
   session_destroy();
   session_start();
}	  																						***/
