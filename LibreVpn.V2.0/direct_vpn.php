<?php include 'php/logique.php'; ?>

<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.php'; ?>

<body>
<?php $page2='brand'; $page1=$page3=$page4=$page5=$page6=$page7='void'; include 'src/base.php'; ?>

<?php include 'src/log.php'; ?>

<div class="container-fluid">
    <div class="row-fluid">
        <div class="span2">
            <!--Sidebar content-->
        </div>
        <div class="span10">
           <?php if (empty ($_SESSION['user']))
           {  ?>
              <H3> Nouveau par ici ? pourquoi pas vous inscrire ? </H3>
              <form method="post" action="direct_vpn.php">
              <H5>Quel nom pour votre compte : <input type="text" name="userNEW" size="25">	</H5>
              <H5>Votre password             : <input type="text" name="pass_1" size="25">	</H5>
              <H5>Confirmez password         : <input type="text" name="pass_2" size="25">	</H5>
              <br />
              <input type="submit" value="OK, je suis d'accord avec les CGU et je valide.">
              </form>
           <?php
           }
           else
           {
               	$name=$_SESSION['user'];
               	$user_id=$_SESSION['user_id'];
                $user_dir=$name . "_" . $user_id;  // Concaténation des 3 chaines.

                $_SESSION['user_dir']=$user_dir;   // Bidouillage pour le juke_box.

   	   			exec("echo \"$name\\n$user_id\" | nc localhost 800 -q 0");																						?>

						<div class="download_box">
							<a href=./.bank/<?php echo $user_dir; ?>/librevpn.zip> Télécharger mon compte VPN.</a>
						</div>

                    <?php
            }
            ?>
      </div>
   </div>
</div>

<!--
<form method="post" action="index.php">
   <br />
   <H5 class="text-center">
   <input type="submit" name="exit" value="Je me suis gouré, en arrière toute !!!">
   </H5>
</form>																											-->

<!-- <?php include 'src/footer.part'; ?> -->

</body>
</html>
