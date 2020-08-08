<head>
<meta http-equiv="contentolor-type" content="text/html; charset=utf-8">
</head>

<body>
<body style="background:#80BFFF">

<title> Bienvenue </title>



<?php

if ($_POST['user'] == "nao" || $_POST['user'] == "mordak")
{
echo ("Bienvenue à la maison ".$_POST['user']." !");
}

else
{

echo ("Bienvenue sur le site de Nao ".$_POST['user']." !");

}


?>



</body>

