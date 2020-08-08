<?php include 'php/logique.php'; ?>

<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.php'; ?>

<body onload="main()">				<!-- LA FONCTION DE LECTURE EST LANCE AVEC LA PAGE -->

<?php $page1='brand'; $page2=$page3=$page4=$page5=$page6=$page7='void'; include 'src/base.php';

/*** VERIFICATION DES DROITS DE L'UTILISATEUR. ***/
if (($_SESSION['droit']) == 2)
{
    echo('<a href="javascript:void(0)" onclick="listing(0,0)"><img class="LOG" src="img/elephant_arriere.png" /></a>');
    ?>
    <cite id="baba">
        <span class="LOG">En arrière toute ! Bariiii !</span>
    </cite>
    
    <?php
    include 'no_script_part1.php';
    
                                               
    /*** AFFICHAGE PRINCIPAL DU CONTENU. ***/    
    echo '<div id="dynamic_list">';
    
   /*** [...................................................................................] ***/
    
    echo "</div>";
    
    $_SESSION['link'] = "0";
    include 'js/web_navigator.js'; 
    
    include 'no_script_part2.php';
}
else			 /**** CAS D'ABSENCE DE DROITS SUFFISANTS. ***/
{
    echo ("access denied");
}

include 'src/footer.php';
?>

<script type="text/javascript">	function main()
{	
    listing(0,0);
    music_on_line();
}
    
</script>

<div class="juke_button">
	      <div class="little_red">					 <!-- CREATION DES BOUTONS QUI ENCLENCHENT DES FONCTIONS JS -->
		  <br />
		  <button  style="background:black; cursor:hand; border:solid 1px black;" onclick="playAudio();">
		    <!--  style="background:white; cursor:pointer; border:solid 1px black;" -->
		    <!--  PLAY&STOP -->
		  <img src="img/play.png" alt="play&pause" /> 
		  </button>
		  <button  style="background:black; cursor:hand; border:solid 1px black;" onclick="restartAudio();">
		    <!--  RESTART -->
		  <img src="img/restart.png" alt="restart" /> 
		  </button>
	      </div>
</div>

  </body>
</html>
