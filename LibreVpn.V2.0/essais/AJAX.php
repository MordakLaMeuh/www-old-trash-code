
<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.php'; ?>

<body>

<H5>Ce sont des choses qui arrivent !</H5>

<div id="baba">
<?php echo "hello !" ?>
</div>

<script>
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
            } catch(e)
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

var truc = document.createElement("div");
truc.id = "test";
truc.style.width = "200px";
truc.style.height = "200px";
truc.style.border = "1px solid red";
truc.style.backgroundColor = "blue";

</script>

<script>
function clic(a)
{
  document.body.appendChild( truc );

var banane = document.getElementById( "test" );
banane.style.backgroundColor = "yellow";
  document.body.appendChild( banane );
  var xhr = getXMLHttpRequest();

  xhr.open("GET", "inout.php?variable1=" + a, true);
  alert("inout.php?variable1=" + a);

  xhr.onreadystatechange = function()
  {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
	var monDOM = document.getElementById("baba");
        alert("OK:" + xhr.responseText); // C'est bon \o/
               // document.body.innerHTML += xhr.responseText; // Données textuelles récupérées
               monDOM.innerHTML = xhr.responseText;
   }
};

xhr.send(null);
}


</script>

<?php
  echo ('<div class="big_red"><a href="javascript:void(0)" onclick="clic(\'toto\')">Téléchargez moi !</a></div>');
?>




</body>