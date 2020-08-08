
<?php   
   }
        
  if (!empty ($_SESSION['user']))
  {
     if ($_SESSION['droit'] == 2)
     {
     	  if ($_SESSION['addblock'] != 1)
     	  {
            if (empty ($c))
            {  ?>
            <form id="test" name="captchme" method='post' action="index.php">
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
                                    <H4>"Je fais le calcul puis je vous offre un super compte VPN !"</H4>
                                    Entre le premier chiffre  : <input type="text" name="var1" size="25"><br />
                                    Entre le second chiffre   : <input type="text" name="var2" size="25"><br />
                                    <input type="submit" value="Calcul elePHPant"/>
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
                   Vous vous devez de completer le capchat si vous voulez vraiment recevoir votre compte VPN, surtout, n'hésitez pas à baisser le volume, si vous trouvez le son bien trop fort.
             </div>
             <div id="publicapchat">    <?php
                  // Génération du Capchat
                  echo captchme_generate_html($publicKey, $error); ?>
             <!-- *** VERSION ANCIEN FORMULAIRE qui execute une fonction ***                  
                  <input type="hidden" name="addblock" id="addblock" value="">
                  <a href="#" onclick="verify();">Valider</a>              -->
                  <input type="submit" value="Valider"/>
                  </form>                               
             </div>                     <?php
             }
             ?>   
        <?php
        }
        else
        {  ?>
           <img src="img/elephant.gif" align="center" width=80 height=50 />
           <?php
           $mail = $_SESSION['mail'];
           $user = $_SESSION['user'];
           exec("sudo bash calcul.bash $mail $c");
           exec("sudo bash envoi.bash $user $mail");
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
                       <H4>"Vous devez désactiver addblocks... pour que ce VPN gratuit puisse survivre !"</H4>
                       <form name="detection" method="post" action="index.php">
                       <input type="hidden" name="addblock" id="addblock" value="réiinit">
                       <input type="submit" value="J'ai compris..."/>
        					  </form>  
                  </div>
             </div>
        </div>         
        <?php	
     }
     }
  }					
?>