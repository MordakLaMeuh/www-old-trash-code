"use strict";
var mouseFonctions = (function() {			/*** FONCTION CONFIGUREE POUR TOUJOURS RENVOYER LA DIV COURANTE	***/
	
	var _isGecko=window.Event?1:0; 	// navigateurs Gecko ou IE -- console.log('_isGecko vaut:'+_isGecko);

	var mouseConstructor = function(){
		self = this;
		this.mouseLeft = false;
		this.mouse_X = null;
		this.mouse_Y = null;
		this.element = null;
		this.id = null;
		this.class = null;
		
		var evalMouse = function(e) {
			var element=_isGecko?e.target:event.srcElement;		 //objet sous la souris				
				
			self.element = element;
			self.id = element.parentNode.id;
			self.class = element.className;
			self.mouse_X = e.pageX;
			self.mouse_Y = e.pageY;
			//console.log('Xmouse='+self.mouse_X +' Ymouse='+self.mouse_Y+' ID:'+self.id+' parentClass:'+self.class);
			
			for (var i=0; i<item.length; i++) 	item[i].usage(e);		// -> Déplacement d'éléments: Fonctions chargées dans item[i].usage
		}
		console.log('activation de la détection souris');
		document.addEventListener('mousemove',evalMouse,false);
		
		window.addEventListener('mouseup',function(){self.mouseLeft=false;},false);
		window.addEventListener('mousedown',function(){self.mouseLeft=true;},false);
		
		// Rajout des commandes essentielles pour le déplacement d'éléments:
		var item = new Array();
		var itemObj = { element: window,
				diff_X: 0,
				diff_Y: 0,
				usage: function(e){} 	};
		
		this.activeMovefunction = function(element){
			item.push(Object.create(itemObj));
			item[item.length-1].element = element;
			item[item.length-1].diff_X = this.mouse_X-element.offsetLeft;
			item[item.length-1].diff_Y = this.mouse_Y-element.offsetTop;
			item[item.length-1].usage = function(e){
							this.element.style.left = (e.pageX - this.diff_X) +'px';	// l'utilisation des 'this' ici renvoit aux variable de 
							this.element.style.top  = (e.pageY - this.diff_Y) +'px';	// ... l'objet précedemment crée par 'Object.create' 
			};
		}
		this.stopMoveFunction = function(element){
			for (var i=0; i<item.length; i++) { if (item[i].element == element) item.splice(i,1); break; }
		}
		// Fin de la définition de l'objet()
	}
	return mouseConstructor;
})();
var mouse = new mouseFonctions();