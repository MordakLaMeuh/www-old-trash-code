<!DOCTYPE HTML>
<html lang="fr">

<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
 <!--  <link href="iframe.css" rel="stylesheet" type="text/css">  -->
   <link rel="shortcut icon" href="./renardico.png" type="image/x-icon" />
   <link rel="icon" href="./renardico.png" type="image/x-icon" />
   <title>Toolbar</title>
      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>

<style>
* 		{ padding: 0; margin: 0; }
body 		{ position: relative; background:#FFFFFF;}
H1		{ position: absolute; z-index:1;}
/*#framespace	{ position: absolute; }*/
iframe{
   z-index: 50;
   position: absolute;
}
.frame
{
  margin-left: 100px;
  margin-top: 100px;
  width: 300px;
  height: 300px;
}
</style>

<body>
<H1>Ceci est une collection d'IframeS</H1>
<!-- <div id='frameSpace'> -->
    <!-- ........................................................................; -->
<!-- </div> -->

</body>
<script type="text/javascript">

			      /*** MAGIC OBJECT IFRAME - ne fonctionne que si aucune iFrame n'a été déjà préalablement déclarée dans la page ! ***/
var iFrame = (function(){						
    var frameCollection = new Array();						// variable static - tableau d'objet iFrame static faisant réféfence à tous les objets crées.
    var globalCountFrame = -1;							// variable static - Initialisation du nombre de frame. -1 => aucune frame. 0 -> une seule, 1 -> deux frames etc...
  
    function constructor(src,x,y,width,height) {				// CONSTRUCTEUR DE L'OBJET.
      document.body.innerHTML+="<iframe class='frame' src='"+src+"'></iframe>";	// Déclaration d'un iFrame dans le DOM					
  
      var classFrames = document.body.getElementsByTagName("iframe");		// pointeur vers la classe de la frame concerné, utilisé pour modifier les propriétés dans le DOM.
      classFrames = classFrames[classFrames.length-1]; 				// identifiant unique de l'iFrame concerné.
            
      this.setPositionOfFrame = function(x,y,width,height) 		{	// Méthode publique de positionnement de l'iFrame;
	classFrames.style.width  = width   +"px";
	classFrames.style.height = height  +"px";
	classFrames.style.marginLeft  = x  +"px";
	classFrames.style.marginTop   = y  +"px";		}  
      
      this.setSrc = function(src) { classFrames.src=src; }    // Méthode publique du changement de la page affichée dans l'iFrame.
      
      this.returnID = function()  { return "current src:"+classFrames.src; } 	// Méthode publique...
      
     this.decrementeIdentifiant = function()	{ identifiantInDOM --; }	// Méthode publique utilisée par la méthode delete().
      
      this.delete = function()    { 						// Méthode publique de suppression de l'iFrame demandée.
	  
	var temp = document.body.getElementsByTagName("iframe");
	for (var i=0; i<temp.length; i++) { if (classFrames == temp[i]) { alert('meuh');} }
	document.body.removeChild(temp[0]);		// step1: Effacement de l'iFrame à l'écran.			
	if (identifiantInDOM  < globalCountFrame) {				// Vérification si l'iFrame était la dernière. condition: si non 
	  for (var i=identifiantInDOM ; i<globalCountFrame; i++)	{	// boucle engagée pour toutes les iFrames identifiées au dessus de celle que l'on veut supprimer	   
	    console.log("i="+i+" id="+identifiantInDOM +" globalCountFrame="+globalCountFrame); 
	    frameCollection[i]=frameCollection[i+1];				// Copie des objets de niveau supèrieur au niveau juste infèrieur. (re-référencement) 				
	    frameCollection[i].decrementeIdentifiant();				// puisque le DOM a changé avec une iframe en moins, les identifiants des objets de couche supèrieur doivent être décrémenté de un. 
	    console.log("1 itération de boucle pour i="+i); 	}}
	  else 	 console.log("La frame supprimée était la dernière déclarée. nothing to do."); 			      
	  frameCollection[globalCountFrame] = null;				// l'objet le plus haut est déférencé puisque une Frame vient d'être supprimée.
	  globalCountFrame--; 							// Décrémentation du nombre de Frames.
	}
	
      this.setPositionOfFrame(x,y,width,height);				// Positionne l'iFrame selon les coordonnées recues par le construteur.  
      
      globalCountFrame++;								// Incrémentation du compteur du nombre d'iFrame présentes à l'écran.
      frameCollection[globalCountFrame] = this;					// Enrichissement de la collection d'objets de référence par le nouvel objet crée.
      };
    return constructor;								// retourne le constructeur lors de la création d'un nouvel objet
})();

/*** --------------------------------------- MAIN BEGIN -------------------------------------------------- ***/

var toto21=new iFrame('https://css-tricks.com/forums/topic/bring-a-div-on-top-of-the-iframe/',100,100,300,200);
alert("A");
toto21.setPositionOfFrame(200,150,600,250);
console.log("StepA:"+toto21.returnID()); 
var tata=new iFrame('https://css-tricks.com/forums/topic/bring-a-div-on-top-of-the-iframe/',50,50,500,150);
console.log("StepB:"+tata.returnID());
toto21.setSrc('http://duckduckgo.com');
console.log("StepC:"+toto21.returnID());
var titi=new iFrame('http://javascript.info/tutorial/objects',800,120,400,250);
titi.setSrc('http://duckduckgo.com');
toto21.delete();
tata.delete();
var popol=new iFrame('http://duckduckgo.com',100,100,300,200);
toto21=new iFrame('http://javascript.info/tutorial/objects',50,50,500,350);
popol.delete();

</script>
</html>