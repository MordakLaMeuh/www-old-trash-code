"use strict";
var toolbar_Obj = function(ID) {
	var toolbar = ID;
	var item = new Array();						// Ce tableau contiendra les différents objets tool:

	var unselectedColor = 'rgb(200, 100, 0)';
	var selectedColor   = 'rgb(255, 255, 0)';

	var tool = function(element)					// Objet tool, contient des informations sur l'élément, la fonction associée et le statut.
	{
		var element = element;
		element.style.borderColor = unselectedColor;

		var status  = false;
		var effect  = function(){};

		var launcher = function() {
			status = !status;
			element.style.borderColor = status?selectedColor:unselectedColor;
			effect(status);
		}

		var event_Type = null;

		var createListener	= function()			{ element.addEventListener	(event_Type,launcher,false); }
		var removeListener	= function()			{ element.removeEventListener	(event_Type,launcher,false); }

		this.assignFunction	= function(type,arg)	{
			if (event_Type != null)	removeListener();
			event_Type = type;
			effect = arg;
			createListener();
	}}

	var assignItems = (function() {					// Execution imédiate: Permet de libérer menuItem de la mémoire.
		var menuItem = toolbar.getElementsByTagName("img");
		if (!menuItem.length)		{ console.error("TOOLBAR.JS ALERT: Aucune icone pour une barre d'outil."); return; };
		for (var i=0; i<menuItem.length; i++)
		{
			if (! menuItem[i].classList.contains('menuItem')) menuItem[i].classList.add('menuItem');
			item.push(new tool(menuItem[i]));
		}
	})();

	this.setFunction = function(location,type,arg) {		// Méthode PUBLIQUE d'assignation d'un item à une fonction particulière et son 'event'.
		if (location > (item.length-1))	{ console.error("TOOLBAR.JS ALERT: Aucune icone disponible pour la fonction associée."); return; };
		item[location].assignFunction('click',arg);
	}

	// EXAMPLE INSIDE TOOLBAR_OBJ
/*	item[0].assignFunction('click',function(status){
		console.log("Lancement des routines de l'item 1. - Etat on-off="+status);
	});									       */
}
var toolbar = new toolbar_Obj(document.getElementById('toolbar'));	// Création d'un objet toolbar:

// EXAMPLE OUTSIDE TOOLBAR_OBJ
toolbar.setFunction(0,'click',function(status){
		console.log("Lancement des routines de l'item 1. - Etat on-off="+status);
		console.log("ne fait rien...");
	});
