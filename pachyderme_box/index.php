<?php session_start(); ?>

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

<body onload="main()">
<!--
    <div id="charlie">
	<img src="charlie.png" height="85px" alt="charlie" />
    </div>
-->
    <div id="contener_header">
        <H1>Espace de communication des pachydermes.</H1>

        <div id="play_pause_button">               </div>
    </div>

    <div id="contener_medium">
        <div id="identified_status">         </div>
    </div>

    <div id="identification_area">       </div>

    <div id='chatbox'>                   </div>

    <div id="send_line">                 </div>

    <div id="contener_footer">

        <div id="send_box">                  </div>

        <div id="display_hide_date_button">  </div>

        <div id="user_list">                 </div>
    </div>

    <div id="cover">                         </div>

    <div id="history_space">                </div>

    <noscript><H5> You must have Javascript actif on this computer :( </H5></noscript>

    <?php include ("ajax.js"); /*** INCLUSION DU COEUR EN JAVA SCRIPT ***/ ?>

    <?php   if (empty ($_SESSION['login']))
            {   ?>

                <script type="text/javascript">
                    document.getElementById("chatbox").style.display='none';
                    display_login_id();
                </script>
    <?php   }
            else
            {
                $_SESSION['read_line'] = 1;
                ?>
                <script type="text/javascript">
                    document.getElementById("chatbox").style.display='block';
                    display_all_stuff("<?php echo ($_SESSION['login']);?>");
                </script>
    <?php   }   ?>

    <script type="text/javascript">
        function main() {document.title = "Pachydermes box.";}
    </script>

</body>
</html>
