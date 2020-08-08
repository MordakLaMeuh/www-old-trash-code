<div class="page-header">
   <h1 class="text-center"><strong>LibreVPN</strong></h1>
           <h3 class="text-center">LE VPN gratuit, c'est maintenant !</h3>
<!--       <h5 class="text-center">(base de donnée et A.I. php désactivée pour des raisons de sécurité.)</h5> -->
<!--       <h5 class="text-center">(Maintenance en cours, VPN seulement fonctionnel sur le réseau Free, pour l'instant...)</H5> -->
<!--       <img src="img/elephant.gif" class="elePHPhant" alt="elePHPant"/>   -->
</div>

<div id="navbar">
	<ul>
               <li> <a class=<?php echo $page1; ?> href="index.php">LibreVPN</a> </li>
               <?php  	if (empty ($_SESSION['user']))
        		   {  ?>
         	      <li> <a class=<?php echo $page2; ?> href="direct_vpn.php">Obtenir un compte vpn.</a> </li>
            	  	<li> <a class=<?php echo $page3; ?> href="recovery.php">Se connecter.</a> </li>
         <?php }
					else
					{  ?>
						<li> <a class=<?php echo $page2; ?> href="direct_vpn.php">Mon compte VPN.</a> </li>
			<?php	}  ?>
               <li> <a class=<?php echo $page4; ?> href="cgu.php">C.G.U.</a> </li>
               <li> <a class=<?php echo $page5; ?> href="install.php">Comment l'installer.</a> </li>

               <?php
               if (($_SESSION['droit']) == 2)
               {  ?>
							<li>
							<a class=<?php echo $page6; ?> href="web_navigator.php">Juke Box</a>
							</li>
						<?php
            	}  ?>
            	<li> <a class=<?php echo $page7; ?> href="exit.php">EXIT</a> </li>
     </ul>
</div>


<br>
<br />