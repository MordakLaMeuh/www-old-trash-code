<img src="elephantrun.jpg.gif" align="center" width=80 height=50 />
<?php
$email = $_POST['mail'];

$point = strpos($email,".");
$aroba = strpos($email,"@");

$a = $_POST['var1'];
$b = $_POST['var2'];
$client = $_POST['var3'];
$c=$a+$b;

if($point=='')
{
echo "Votre email doit comporter un <b>point</b>";
}
  elseif($aroba=='')
  {
    echo "Votre email doit comporter un <b>'@'</b>";
  }
  else
  {
    print("<center>La solution vous a ete discretement envoyee par E-Mail => $email");
    exec("bash mail.bash $email $c");
    exec("sudo bash autoclient.bash $client $email");
    echo "</br>";
    echo "I am ";
    echo exec('whoami');
    echo "</br>";
    echo exec('pwd');
 }
?>

