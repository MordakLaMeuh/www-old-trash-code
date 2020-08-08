<?php					/*** CREATE NEW DATABASE ***/	
function createDatabase($host,$masterUser,$masterPassword,$dbName,$dbUser,$dbPassword) {
    try {
        $dbh = new PDO("mysql:host=$host", $masterUser, $masterPassword);

        $dbh->exec("CREATE DATABASE `$dbName`;
                CREATE USER '$dbUser'@'localhost' IDENTIFIED BY '$dbPassword';
                GRANT ALL ON `$dbName`.* TO '$dbUser'@'localhost';
                FLUSH PRIVILEGES;") 
        /*or die("SAME DATABASE ALREADY EXIST: ".print_r($dbh->errorInfo(), true))*/		;
        echo(print_r($dbh->errorInfo()));
        echo("<br>DATA ALREADY EXIST<br>");

    } catch (PDOException $e) {
        die("DB ERROR SQL: ". $e->getMessage());
    }}
    
$host="localhost"; 
$root="root"; 
$root_password="toto21"; 
$user='mordak';
$pass='toto21';
$db="bookmark"; 
$table="mordak";
 
createDatabase($host,$root,$root_password,$db,$user,$pass);

echo("<br>Titre:".$_POST['title']);
echo("<br>Url:".$_POST['url']);
echo("<br>commentaires:".$_POST['comment']);

function openSQL($user,$pass,$dbName) {
  try
  { /***                                       nom DB         user            MDP        ***/
    $bdd = new PDO('mysql:host=localhost;dbname='.$dbName, $user, $pass);
  }
  catch (Exception $e)
  {
    die('Erreur : ' . $e->getMessage());
  }
  return $bdd;}

$bdd = openSQL($user,$pass,$db);

function createTable($bdd,$user,$password,$tableName) {
try {
    $bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "CREATE TABLE ".$tableName." (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(80),
    url VARCHAR(150),
    comment VARCHAR(500),
    date TIMESTAMP
    )";
    // use exec() because no results are returned
    $bdd->exec($sql);
    echo "<br>Table MyGuests created successfully";
    }
catch(PDOException $e)
    {
    echo $sql . "<br>" . $e->getMessage();
    }
    return $sql;}

$sql=createTable($bdd,$user,$pass,$table);

function regData($bdd,$table) {
  $req = $bdd->prepare("INSERT INTO ".$table." (title, url, comment, date) VALUES(?,?,?,?)");
  $req->execute(array ($_POST['title'], $_POST['url'], $_POST['comment'], date("Y-m-d H:i:s",time())));
}

regData($bdd,$table);

function readData($bdd,$table) {
  $reponse=$bdd ->prepare('SELECT * FROM '.$table.' WHERE id = ? ');
  $reponse->execute(array(1));                                        // retenir array comme indispensable.
  $donnée = $reponse->fetch();
  
  echo("<br><br>Résultat de la lecture :". $donnée['comment']);
}


readData($bdd,$table);

  echo("<br>END");
?>

