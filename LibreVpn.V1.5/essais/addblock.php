<?php 
header("Content-Type: text/plain");

if (!empty ($_POST['exit']))
{
session_destroy();
}

if(isset($_GET['addblock']))
 {
 	$_SESSION['addblock']=$_GET['addblock'];
	echo "Valeur Addblock = ".$_SESSION['addblock']."";
 }
else
 {
	echo "Mauvaise saisie";
 }
?>