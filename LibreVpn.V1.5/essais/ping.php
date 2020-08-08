<?php session_start(); ?>

<?php
if (!empty ($_POST['exit']))
{
   $_SESSION['test']=0;
}  
?>

<!DOCTYPE HTML>
<html lang="fr">

<script>
function send()
{
	
} 	
function getXMLHttpRequest()
{
	var xhr = null;
	
	if (window.XMLHttpRequest || window.ActiveXObject)
	{
		if (window.ActiveXObject)
		{
			try
		   {
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} 
			catch(e)
			{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} 
		else 
		{
			xhr = new XMLHttpRequest(); 
		}
	} 
	else
	{
		alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
		return null;
	}	
	return xhr;
}
document.write("SCRIPT 1 VALID");	
</script>

<script>
var xhr = getXMLHttpRequest();
document.write("SCRIPT 2 VALID");
xhr.open("GET", "pong.php?xSS=1", true);
xhr.send(null);
</script>

<?php echo "La valeur test est : ".$_SESSION['test'].""; ?>

<form id="test" name="test" method='post' action="ping.php">
<input type="submit" value="Je teste !"/>
</form>

<form method="post" action="ping.php">
<input type="submit" name="exit" value="RESET">
</form>