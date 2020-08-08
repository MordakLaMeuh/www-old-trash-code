<!DOCTYPE HTML>
<html lang="fr">

<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
   <link href="ttf/DoppioOne-Regular.ttf" rel='stylesheet' type='text/css'>
   <link href="StyleChat.css" rel="stylesheet" type="text/css">
   <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
   <link rel="icon" href="images/favicon.ico" type="image/x-icon" />
   <title>Portail Libre VPN</title>
      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>

<style>
#historique
{
    width:100%;
    height:300px;
    background:#BEF781;
    background-image: url("./images/chatbox_pachyderme.png");
    background-repeat: repeat;
    background-position: center top;
    vertical-align: bottom;
    overflow:auto;
    word-wrap:break-word;    /* Coupe les phrases trop longue en retournant à la ligne. */
    white-space: pre-wrap;
}

#close_button
{
    position:fixed;
    right:20px;
    top:7px;
}

#fullscreen
{
    position:fixed;
    right:20px;
    top:37px;
}

#smallscreen
{
    position:fixed;
    right:20px;
    top:67px;
}

#smallscreen:hover,#fullscreen:hover,#close_button:hover
{
    cursor: url('./images/php_curseur.png'), pointer;
}

</style>

<body>

<div id="historique">       </div>

<script type="text/javascript">
    document.title = "Historique des pachydermes.";

    var history_DOM = document.getElementById("historique");

    function enterFullscreen(element)
    {
        if(element.requestFullScreen)
        {
                element.requestFullScreen();        //fonction officielle du w3c
        }
        else if(element.webkitRequestFullScreen)
        {
                element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  //fonction pour Google Chrome (on lui passe un argument pour autoriser le plein écran lors d'une pression sur le clavier)
        }
        else if(element.mozRequestFullScreen)
        {
                element.mozRequestFullScreen();     //fonction pour Firefox
        }
        else
        {
                alert('Votre navigateur ne supporte pas le mode plein écran, il est temps de passer à un plus récent ;)');
        }
    }

    function exitFullscreen()
    {
        if(document.cancelFullScreen)
        {
                document.cancelFullScreen();            //fonction officielle du w3c
        }
        else if(document.webkitCancelFullScreen)
        {
                document.webkitCancelFullScreen();      //fonction pour Google Chrome
        }
        else if(document.mozCancelFullScreen)
        {
                document.mozCancelFullScreen();         //fonction pour Firefox
        }
    }

    if (1)
    {
        var chatbox_json = JSON.parse(localStorage.getItem("historique"));
        var Z = chatbox_json[0].A;
        var view_history = "";

        for (var i = 1 ; i <= Z; ++i )
        {
                switch (chatbox_json[i].A)   {
                    case "0":
                        view_history += "<br/><span class='light_black'>" + chatbox_json[i].D + " </span><span class='red_txt'>" + chatbox_json[i].U + "</span> : " + chatbox_json[i].M;
                        break;
                    case "1":
                        view_history += "<br/><span class='green_txt'>" + chatbox_json[i].M + " (" + chatbox_json[i].D + ")</span>";
                        break;
                    case "2":
                        view_history += "<br/><span class=\"blue_txt\">"+chatbox_json[i].U+" "+chatbox_json[i].M+"</span>";
                        break;
                    case "3":
                        view_history += "<br/><span class=\"blue_txt\"> Au loin, l'on entend crier un animal...</span>";
                        break;
                    case "4":
                    	view_history += "<br/><span class='light_black'>" + chatbox_json[i].D + "</span> <span class='purple_txt'>(private) </span><span class='red_txt'>" +chatbox_json[i].U+ "</span> : " + chatbox_json[i].M + "</span>";
                    	break;			        }
        }
    }
    else
    {
        view_history = localStorage.getItem("historique");
    }

    history_DOM.innerHTML = "<FORM>" +
    "<INPUT TYPE='BUTTON' VALUE='CLOSE HISTORY' ID='close_button' ONCLICK='window.close()'>" +
    "</FORM>";

    history_DOM.innerHTML += "<button onclick='enterFullscreen(history_DOM);' id='fullscreen'>Plein écran</button>";
    history_DOM.innerHTML += "<button onclick='exitFullscreen(history_DOM);' id='smallscreen'>mini écran</button>";
    history_DOM.innerHTML += view_history;

    function resizeElements()
    {
        history_DOM.style.height=window.innerHeight+'px';
    }

    resizeElements();
    window.onresize = resizeElements;
</script>

</body>
</html>























<?php
 /***  function createCookie(name,value)
    {
        var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }   ***/

        //var num = Math.floor((Math.random() * 1000) + 1);
        //cookie_name = "cookie_" + num;
        //createCookie(cookie_name,view_history);
        //window.open('history.php?name=' + cookie_name, 'HISTORY', config='height=400, width=600, toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, directories=no, status=no')

        /*
function readCookie(name)
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
		{
            return c.substring(nameEQ.length,c.length);
        }
	}
	return "zero";
}*/

//body_DOM.innerHTML = readCookie("< // echo ($_GET['name']); >");
//alert(localStorage.getItem("arbre"));                                             ?>
