<?php session_start();

# if (!empty ($_POST['exit']))
# {
#   session_destroy();
#   session_start();
# }

if (!empty ($_POST['addblock']))
{
   $_SESSION['addblock'] = 0;
}

if (!empty ($_POST['merci']))
{
	session_destroy();
	header('Location: http://www.veteransduwifi.com/index.php');
}
?>

<?php include 'src/header.part'; ?> 

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr" dir="ltr">

<head>
   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
   <title>Vétérans du Wifi</title>
   <link rel="stylesheet" type="text/css" href="css/Air.css" />              
   <link rel="stylesheet" type="text/css" href="../style/imports/pms.css" /> 
<!--[if lte IE 6]><script type="text/javascript" src="style/imports/minmax.js"></script><![endif]-->
   <link rel="alternate" type="application/rss+xml" href="../extern.php?action=feed&amp;type=rss" title="Flux RSS des discussions actives" />
   <style type="text/css">.gid1 {color: #AA0000; font-weight: bold} .gid2 {color: #00AA00; font-weight: bold} .gid4 {color: #110BC0} .gid5 {font-weight: bold} .gid6 {color: #EC7BAF; font-weight: bold} .gid7 {color: #671471; font-weight: bold} .gid12 {color: #BD8D46; font-weight: bold} .gid8 {color: #FF4900; font-weight: bold} </style>
   </head>
 
<body>
<div id="s660"></div>
<script type="text/javascript" src="js/SSblock.js"></script>
<div id="punindex" class="pun">
<div class="top-box"><div><!-- Top Corners --></div></div>
<div class="punwrap">
<div id="brdheader" class="block">
		<div id="brdtitle" class="inbox">
			<h1><a href="index.php">Vétérans du Wifi</a></h1>
			<div id="brddesc"><p><span>Expérience du net sans fil</span></div>
		</div>
		<div id="brdmenu" class="inbox">
			<ul>
				<li id="navindex" class="isactive"><a href="../index.php">Accueil</a></li>
				<li id="navuserlist"><a href="../userlist.php">Liste des membres</a></li>
				<li id="navextra1"><a href="http://www.veteransduwifi.com/chat/index.php">ChatBox</a></li>
				<li id="navrules"><a href="../misc.php?action=rules">Règles</a></li>
				<li id="navsearch"><a href="../search.php">Recherche</a></li>
				<li id="navprofile"><a href="../profile.php?id=3">Profil</a></li>
				<li id="navpm"><a href="../pms_inbox.php"><acronym title="Messages Privés">MP</acronym></a></li>
				<li id="navadmin"><a href="../admin_index.php">Administration</a></li>
				<li id="navlogout"><a href="../login.php?action=out&amp;id=3&amp;csrf_token=a57b7702dde396af0d60ba5bac2ab5594bfa7faf">Déconnexion</a></li>
			</ul>
		</div>
	


		<?php include 'src/base.part'; ?>

		<?php               
		if ($_SESSION['addblock'] != 1)
		{
   		?>
   		<form id="test" name="captchme" method='post' action="index2.php">
   		<?php
   		require_once('captchme-lib.php');
   		$publicKey = "9ce53c13adb22897384245e96dd3992971d37ea572e447924cfebad661fa9315";
   		$privateKey = "57904c8297bf60a2be3c205516741cf3557f14f0eb65b5a98379e2acde64d0a4";
   		$authenKey = "2e9538c75ccbc75af8e7f5bdbe33e40b54d6316d63e7d1ac8ae2f42b677910c4";
   		# Reponse des services Captchme
   		$response = null;
   		# Code erreur
   		$error = null;     
   		if (isset($_POST["captchme_response_field"])) 
   		{
      		$remoteIp = $_SERVER['REMOTE_ADDR'];
      		# Controle du captcha
      		$response = captchme_verify 
            		      ($privateKey,
                  		 $_POST["captchme_challenge_field"],
                   		$_POST["captchme_response_field"],
                   		$remoteIp,
                   		$authenKey);
      		if ($response->is_valid)
      		{ 
         		$_SESSION['capchat']=true; ?>
         		<div class="container-fluid">
         	  		<div class="row-fluid">
           	      	 <div class="span2">
             	           <!--Sidebar content-->
           		   	 </div>
            	    	 <div class="span10">
                     	  <H4>"Voici vos identifiants SFR Hotspot"</H4>
                          Login : Frank<br />
                          Pass  : FrankBlero :)<br /><br />
                          <input type="submit" name="merci" value="Merci !"/>
                     	  </form>
                   	 </div>
              		 </div>
         		</div>    
         		<?php                                
      		}
      		else
      		{
         		$error = $response->error;
      		}      
   		}    
   		if (! $response->is_valid)
   		{
      		?> 
      		<!-- MEDIA QUERY QUASI OBLIGE ICI POUR PETITES RESOLUTIONS -->
     			<div id="publinotice">
           		<H4>"Mon royaume pour un captcha !"</H4>
           		Vous devez compléter le captcha si vous voulez vraiment recevoir vos IDs. Surtout, n'hésitez pas à baisser le volume, si vous trouvez le son bien trop fort.
      		</div>           
      		<div id="publicapchat">    
      			<?php // Génération du Capchat
           		echo captchme_generate_html($publicKey, $error); ?>             
           		<input type="submit" value="Valider"/>
           		</form>                               
      		</div> <?php          
   		}
		}
		else 
		{  ?>
   		<div class="container-fluid">
        		<div class="row-fluid">
            	 <div class="span2">
                	  <!--Sidebar content-->
             	 </div>
            	 <div class="span10">
                	<H4>"Vous devez désactiver addblocks... Afin que notre site puisse survivre !"</H4>
                  <form name="detection" method="post" action="index2.php">
                  <input type="hidden" name="addblock" id="addblock" value="réiinit">
                  <input type="submit" value="J'ai compris..."/>
        				</form>  
             	</div>
        		</div>
   		</div>         
   		<?php	
		}
		?>

		<!-- <img class="monde" src="img/monde.png" alt="monde"/> -->      
   
                  
		<?php # include 'src/footer.part';  ?> 
		<div id="brdfooter" class="block">
			<h2><span>Pied de page des forums</span></h2>
			<div class="box">
				<div id="brdfooternav" class="inbox">
					<div class="conr">
						<p id="feedlinks"><span class="rss"><a href="../extern.php?action=feed&amp;type=rss">Flux RSS des discussions actives</a></span></p>
						<p id="poweredby">Propulsé par <a href="http://fluxbb.org/">FluxBB</a></p>
					</div>
				<div class="clearer"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="end-box">
      <div>
         <!-- Bottom corners -->
     	</div>
	</div>
</div>

</body>
</html>
