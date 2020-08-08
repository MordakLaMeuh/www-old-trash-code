<?php include 'php/logique.php'; ?>

<!DOCTYPE HTML>
<html lang="fr">

<?php include 'src/header.php'; ?>

<!-- <audio controls>
  <source src="son.mp3" />
  <p class="warning">Le format *.ogg n'est pas pris en charge par votre navigateur</p>
</audio>   -->

<body>

<a href="https://naomail.eu" id="nuts"></a>
<a href="https://www.grosdada.eu" id="linux"></a>

<?php $page1='brand'; $page2=$page3=$page4=$page5=$page6=$page7='void'; include 'src/base.php'; ?>

<h3 class="text-center">LibreVPN, un concept de discrétion par hotspot....</h3>

<div class="container-fluid">
      <div class="row-fluid">
           <div class="span2">
                 <!--Sidebar content-->
           </div>
           <H6 class="span7">
                 Internet via les hotspots est quelque chose de facilement accessible. Partout ou presque, il est possible de surfer, de taper ses mails, etc,etc...
                 Mais quid de la sécurité ? En effet, lorsqu'on se connecte à un hotspot,les <b>données transitent en clair.</b> Pas très rassurant, n'est-ce pas ?
	              C'est à ce niveau que le LibreVPN intervient. En effet, le VPN( Virtual Private Network) va créer une sorte de tunnel crypté entre votre machine et le serveur VPN, le notre donc.<br>
                 Une fois dans ce tunnel, il est extrêmement difficile de surveiller, espionner ou pirater. Tous les échanges entre votre machine (qui possède un certificat unique, créé à la volée lors de l'inscription et d'une durée limitée) et le serveur sont cryptés.<br>
                 <br>
	              <img src="img/Libre-vpn.jpg" class="img-polaroid" alt="pirate"/>
	              <br><br>
	              Vous voulez faire un achat sur le net et vous hésitez à mettre votre N° CB? Passez par le LibreVPN... Vous voulez jouer on-line et votre Hotspot ne l'autorise pas? Passez par le LibreVPN...¹<br>
                 <br>¹ sous certaines conditions
           </H6>
      </div>
</div>

<?php  	if (empty ($_SESSION['user']))
         {  ?>
				<form method="post" action="index.php">
   				<br />
   				<H3 class="text-center">
   					<a href=direct_vpn.php>Je suis intéressé !</a>
   				</H3>
				</form>
	<?php } ?>

<?php include 'src/footer.php'; ?>

</body>

</html>
