<?php include 'php/logique.php'; ?>

<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.part'; ?>

<?php include 'js/SSblock.js';
$_SESSION['addblock']=$_POST['addblock']; ?>

<body>
<?php $page1='brand'; $page2=$page3=$page4=$page5='void'; include 'src/base.part'; ?>

<?php include 'src/log.part'; ?>

<div class="container-fluid">
     <div class="row-fluid">
          <div class="span2">
               <!--Sidebar content-->
          </div>
          <div class="span10">
   	         <H4> C'est un fait :) </H4>
               <form id="test" name="test" method='post' action="index.php">
               <input type="hidden" name="addblock" id="addblock" value="">
               <input type="hidden" name="exit" value="exit">
               <a href="#" onclick="verify();">Promis !</a>
               </form>
    		</div>
  	</div>
</div>

<!-- <img class="monde" src="img/monde.png" alt="monde"/> -->

<?php include 'src/footer.part';  ?>

</body>
</html>
