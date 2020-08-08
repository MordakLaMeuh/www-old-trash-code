var toolbar_Obj = function(ID) {
	var toolbar = ID;						// DOM générale - var. globale.
	var menuItem = toolbar.getElementsByClassName("menuItem")	// DOM générale	- var. globale.
	var itemManager = (function()					// GESTION DE LA BARRE D'OUTIL:
	{
		var unselectedColorItem 	= 'rgb(200, 100, 0)';			// Couleur du menu déssélectionné.
		var selectedColorItem		= 'rgb(255, 255,   0)';			// Couleur du menu selectionné.
		var i;								// Variable à la con.
		var state;								// Aide à renvoyer l'état de la comande, enable or disable.
		var item = new Array();						// Ici seront définies les différentes taches propres à chaque menu
		item[0] = function(state) { console.log("Lancement des routines de l'item 1. - Etat on-off="+state);}
		item[1] = function(state) { console.log("Lancement des routines de l'item 2. - Etat on-off="+state);}
		item[2] = function(state) { console.log("Lancement des routines de l'item 3. - Etat on-off="+state);}
		item[3] = function(state) { console.log("Lancement des routines de l'item 4. - Etat on-off="+state);}

		function selectItem(itemObj){
			for (i=0; i<menuItem.length; i++) if(itemObj == menuItem[i]) break;

			if (itemObj.style.borderColor == unselectedColorItem)	{ itemObj.style.borderColor=selectedColorItem;   state=true;  }
			else									{ itemObj.style.borderColor=unselectedColorItem; state=false; }
			item[i](state);
		}

		for (i=0; i<menuItem.length; i++)	 				// Création des contours des menus selon la couleur unselected et association des events clics de souris.
		{
			menuItem[i].style.borderColor = unselectedColorItem;
			menuItem[i].onclick=function(){selectItem(this)};
		}
		return function(){ /* Ici pourront figurer des fonctions pouvant être appelées par le programme de facon globale et jouant sur les items style unselected All par exemple.*/
			alert("...");
		};
	})();
		/***  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ***/
		//var toolbarWidthLimit=toolbar.offsetWidth; 						// GESTION DE L'ECRAN ET DES EVENTS SOURIS
}
var toolbar = new toolbar_Obj(document.getElementById('toolbar'));