"use strict";
var externScrollbar = function(ID,ratioHeight,ScrollBarwidth,symetric_H,symetric_W) {	
// ID			ID de la div dont il faut ajouter une scrollBar
// ratioHeight		Taille de la scrollBar en fonction de la taille de la div(ratio 1 = identique)
// ScrollBarwidth:	Largeur de la scrollBar en fonction du View Width
// symetric_H:		Alignement de la scrollBar par rapport à la hauteur de la div concerné (1 = ratio hauteur identique)
// symetric_W:		La scrollbar entre ou sort de la DIV, 0 la met juste contre à droite, un chiffre négatif dedans et opposé (s'exprime en View Width)
// ATTENTION 		Utilisation de mouseLeft de l'objet mouse.

	var self = this;
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
	
	this.contextRatio = ratioHeight;
	this.symetric_H = symetric_H;				// ATTENTION Non utilisé ici, exprimerait si l'allignement entre la div et la scrollBar est 'parfait' 
	
	this.window = ID;
	this.window.className += ' hideOverflow';
	
	this.scrollDiv = document.createElement('div');
	this.scrollDiv.className = 'contextScrollbar';
	
	this.window.parentNode.insertBefore(this.scrollDiv, this.window);
	
	this.scroller	= document.createElement('div');
	this.scroller.className= 'contextMiddle';
	this.scroller 	= this.scrollDiv.appendChild(this.scroller);
	
	/* DETERMINE WIDTH VALUE && SET WIDTH PROPOTIONS*/											// Initial Width Ratio 
	this.scrollDiv.style.width = this.scroller.style.width = ScrollBarwidth+'vw';// this.scrollBarPixelSize+'px';
	this.scrollDiv.style.left = ((this.window.offsetLeft+this.window.offsetWidth)/window.innerWidth*100)+symetric_W+'vw';
	
	this.refresh();
	
	// ATTENTION BUG -> Comme les éléments dans la DIV ont des transitions de 0.5s, un nouvel appel à refresh est executé après 0.5s au cas ou !
	// Il se peut en effet que les éléments n'aient pas fini leurs 'translations' après le redimentionnement fenetre.
	// ORIGINAL: window.addEventListener('resize', function(){self.refresh();}, false);
	window.addEventListener('resize', function(){self.refresh(); setTimeout(function(){self.refresh();},500);}, false);
	this.window.addEventListener(mousewheelevt, function(e) {self.MouseWheelHandler(e);}, false);
	this.window.addEventListener('scroll', function(e) { self.scrolling();}, false);
	
	var localMouseLeft = false;
	this.scrollDiv.addEventListener('mousedown',	function(e){self.moveCursor(e); localMouseLeft = true;},false);
	this.scrollDiv.addEventListener('mousemove',	function(e){if (mouse.mouseLeft==true) self.moveCursor(e);},false);
	window.addEventListener('mousemove',		function(e){if (mouse.mouseLeft==true && localMouseLeft==true) self.moveCursor(e); else localMouseLeft = false;},false);
}

// ATTENTION: refresh doit être impérativement utilisé après l'ajout ou la suppression d'éléments dans la div, se qui peut la redimentionner.
// Un little refresh devrait être fait.
externScrollbar.prototype.refresh	   	= function() {
	this.ComputedStyle = window.getComputedStyle(this.window,null).getPropertyValue("height");
	if (this.ComputedStyle.match(/\d+\.\d/g)) 		this.realPixelHeight = Math.round(this.ComputedStyle.match(/\d+\.\d/g)[0]);
	else 							this.realPixelHeight = this.ComputedStyle.match(/\d+/g)[0];		
			
	this.scrollDiv.style.height     = this.realPixelHeight*this.contextRatio+'px';
	this.scrollDiv.style.top = (this.window.offsetTop+this.realPixelHeight*((1-this.contextRatio)/2))+'px';
	
	this.scrollDiv.style.display=(this.realPixelHeight<this.window.scrollHeight?'block':'none');
	this.scrollHeight = this.realPixelHeight*this.contextRatio;
	if (this.scrollHeight > 0)   	this.scroller.style.height = this.realPixelHeight / this.window.scrollHeight * 100+'%'; 
	else 				this.scroller.style.height = '0px'; 
	
	this.scrolling();
}

externScrollbar.prototype.scrolling = function () { 			   
	var ratio = (this.contextRatio*this.realPixelHeight) / this.window.scrollHeight;
			
	this.scroller.style.top = (0 + this.window.scrollTop * ratio) + 'px';
			
	var math = Math.floor(this.window.scrollTop/this.window.scrollHeight*256);
	this.scroller.style.backgroundColor='rgb('+math+', 0, '+(255-math)+')';
}

externScrollbar.prototype.MouseWheelHandler = function(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	this.window.scrollTop+=(delta >0?-20:20);	
}

externScrollbar.prototype.moveCursor = function(e) {  // Partie '-(this.scroller.offsetHeight/2);' pour un fonctionnement agréable pointant sur la partie centrake du scroller.
	var pageY = e.pageY-1-(this.scroller.offsetHeight/2);		

	var H = this.window.offsetTop +  (this.realPixelHeight*(1-this.contextRatio)/2); 
	var T = this.realPixelHeight - (this.realPixelHeight*(1-this.contextRatio));
	var scrollHeight = this.window.scrollHeight;
	this.window.scrollTop=((pageY-H)/T)*scrollHeight;
}