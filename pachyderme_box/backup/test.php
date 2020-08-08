<?php session_start(); ?>

<!DOCTYPE HTML>
<html lang="fr">

<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
   <link href="../ttf/DoppioOne-Regular.ttf" rel='stylesheet' type='text/css'>
   <link href="StyleChat.css" rel="stylesheet" type="text/css">
   <link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon" />
   <link rel="icon" href="../img/favicon.ico" type="image/x-icon" />
   <title>Portail Libre VPN</title>
      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>

<body>
<?php
$str = 'Un \'apostrophe\' en <strong>gras</strong>';

// Affiche : Un 'apostrophe' en &lt;strong&gt;gras&lt;/strong&gt;
echo htmlentities($str);

// Affiche : Un &#039;apostrophe&#039; en &lt;strong&gt;gras&lt;/strong&gt;
echo htmlentities($str, ENT_QUOTES);

echo ("<br/>");

$str = "gros      tas";
$str = str_replace(" ", "&nbsp;", $str);
echo $str;
?>
</body>
</html>
