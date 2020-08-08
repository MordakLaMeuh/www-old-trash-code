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

<!DOCTYPE HTML>
<html lang="fr">


<head>
<?php # include 'src/header.part'; ?>
<meta charset=utf-8>
<link href="html5.css" rel="stylesheet" type="text/css"> 
</head>
 
<body>
<div id="s660"></div>
<script type="text/javascript" src="js/SSblock.js"></script>

<div id="content">

<?php include 'src/base.part'; ?>

<?php               
if ($_SESSION['addblock'] != 1)
{
   ?>
   <form id="test" name="captchme" method='post' action="index.php">

<p><center>	<b><br><br><br><br><br><br><br><br>Bonjour, l'identifiant visiteur du <?php
echo date('d/m');?> au <?php
echo date('d/m',strtotime('+1 days'));
?> est :</b></p><p> Pour voir le mot de passe merci de remplir le captcha </p>
						
							
							
    <form method='post'>
   <?php
   require_once('captchme-lib.php');
   $publicKey = "bfb46a607ff775c13d84826389ef7c78283e8f464932459d8776f40d34216ffe";
   $privateKey = "ab7d35e252a145b2872379d27679e6de7b206691f9994a127ac59fd6cb607944";
   $authenKey = "46a68b52afce32a0d951a2eb96f4323de49c54459692e9929499ddac9f62805c";
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
                        login : Frank<br />
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
           <H4>"Mon royaume pour un Capchat !"</H4>
           Vous vous devez de completer le capchat si vous voulez vraiment recevoir vos IDs, surtout, n'hésitez pas à baisser le volume, si vous trouvez le son bien trop fort.
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
                  <form name="detection" method="post" action="index.php">
                  <input type="hidden" name="addblock" id="addblock" value="réiinit">
                  <input type="submit" value="J'ai compris..."/>
        				</form>  
             </div>
        </div>
   </div>         
   <?php	
}
?>
<dl class="action">
<dt>Format <code>*.m3u</code></dt>
<dd>
<audio controls> 
  <source src="ushuaia.wav" />
  <p class="warning">Le format *.wav n'est pas pris en charge par votre navigateur</p>
</audio>
</dd>
</dl>



<img class="monde" src="img/monde.png" alt="monde"/>      

<?php include 'src/footer.part';  ?> 

</div>
</body>
</html>
