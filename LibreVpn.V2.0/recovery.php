<?php include 'php/logique.php'; ?>

<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.php'; ?>

<body>

<?php $page3='brand'; $page1=$page2=$page4=$page5=$page6=$page7='void'; include 'src/base.php'; ?>

    <?php include 'src/log.php'; ?>

       <div class="container-fluid">
            <div class="row-fluid">
                <div class="span2">
                     <!--Sidebar content-->
                </div>
                <div class="span10">
               	<?php
    					if (empty ($_SESSION['user']))
       				{	?>
                     <H3></H3>
                     <form name="connection" method='post' action="direct_vpn.php">
                     <?php
                          if (($_SESSION['droit']) == 1)
                          {  ?>
                             Le code d'activation : <input type="text" name="code" size="25"><br /> <?php
                          }
                          else
                          {  ?>
                             <H5>Le nom de votre compte     : <input type="text" name="user" size="25">	  </H5>
                             <H5>Votre password             : <input type="text" name="password" size="25"></H5> <?php
                          }  ?>
                          <br />
                          <input type="submit" value="Se connecter."/>
                      </form>
                 <?php
              	  }
              	  else
              	  {
              	  		echo("no accessible");
              	  }	?>

                 </div>
           </div>
     </div>

<img class="monde" src="img/monde.png" alt="monde"/>

<!-- <?php include 'src/footer.part';  ?>  -->

</body>
</html>
