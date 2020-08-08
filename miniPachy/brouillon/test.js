'use strict';
var MW = (function() {
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

	var zIndexMin = 1;	// Utilisé par la méchanique rudimentaire de mise en background des fenetres. 	cf. backToBackRoom()
	var zIndexMax = 0;	// Utilisé par la méchanique rudimentaire de mise en avant des fenetres. 		cf. putForward()

	var resizeEvent = false;
	var resizeTimer = 100;
	var resizeAllWindows = function() {
		console.log('MW: Resize All Windows -> resizeEvent:'+resizeEvent);
		resizeEvent = false;

		var i = 0;
		for (i; i<windowRef.length; i++) windowRef[i].resize();
	}
	window.onresize = function() {
			if (resizeEvent == false) {
				resizeEvent = true;
				setTimeout(resizeAllWindows,resizeTimer);
	}}

	var windowRef = new Array();

	var MudulableWindowConstructor = function(id,titleWindow,positionX,positionY,sizeX,sizeY,color,background,opacity) {

		windowRef.push(this);

        	this.id		= id;						// utilisé un peu partout pour le débugage
		this.opacity 	= opacity;					// necessaire pour la fonction de mise en opacité pleine des fenetres. utilisé aussi dans setProperty()

		this.borderSize		= 0.5;				// Predefined -> necessaire pour beaucoups de calculs de fenetre. utilisé aussi dans setProperty()
		this.titleTxtColor	= 'black';				// Predefined
		this.headerHeight 	= 3;				    	// Predefined

		(this.main = document.getElementById(id))?this.assign():this.create();
		this.setProperty(titleWindow,positionX,positionY,sizeX,sizeY,color,background);

		var obj = this;

		// fonction privée de mise en avant de la fenetre.
		var putForward = function() {
			zIndexMax++;
			obj.main.style.zIndex = zIndexMax;
		}
		putForward();

		// Fonction de selection globale des fenetres: Elle est déclenchée pour TOUS les events précis définis ci-dessous, return FALSE n'est donc pas nécessaire pour ces sous-events. (ici false est déjà retourné)
		this.main.onmousedown = function(e) {
			console.log('MW main.onmousedown event: selection globale de la fenetre -> Augmentation du Zindex pour toute la fenetre. target '+((e.target.id)?'ID='+e.target.id+' ':'')+((e.target.tagName)?'TAG='+e.target.tagName+' ':'')+((e.target.className)?'CLASS='+e.target.className+'':''));
			putForward();
			if ((e.target.tagName == 'INPUT') || (e.target.id == 'chatTab'))	return true;			// exception pour le chat (mettre en place une liste)
			else											return false;			// return false bloque les events habituelles du navigateur.
		}

		// Gestions des différents mouvements et redimentionnements de la fenetre provoqués par la souris.
		this.diffX = this.diffY = this.temp = null;
		this.topSpace.onmousedown = function(e) {
			obj.moveBegin(e);
			mouseMoveFunction = function(e) {
				obj.moveCurrent(e);
			}
			mouseUpFunction = function() {
				obj.moveEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		this.mouseBottomDiv.onmousedown = function(e) {
			obj.bottomResizeBegin(e);
			mouseMoveFunction = function(e) {
				obj.bottomResizeCurrent(e);
				if (obj.video) obj.resizeVideo();
				if (obj.img)   obj.resizeImage();
			}
			mouseUpFunction = function() {
				obj.bottomResizeEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		this.mouseLeftDiv.onmousedown = function(e) {
			console.log(obj.mouseLeftDiv);
			if (minimizeState) { console.log('MW: leftDiv mouseDown event -> Disable Minimize'); minimizeState = false; }
			obj.leftResizeBegin(e);
			mouseMoveFunction = function(e) {
				obj.leftResizeCurrent(e);
				if (obj.video) obj.resizeVideo();
				if (obj.img)   obj.resizeImage();
			}
			mouseUpFunction = function() {
				obj.leftResizeEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		this.mouseRightDiv.onmousedown = function(e) {
			if (minimizeState) { console.log('MW: rightDiv mouseDown event -> Disable Minimize'); minimizeState = false; }
			obj.rightResizeBegin(e);
			mouseMoveFunction = function(e) {
				obj.rightResizeCurrent(e);
				if (obj.video) obj.resizeVideo();
				if (obj.img)   obj.resizeImage();
			}
			mouseUpFunction = function() {
				obj.rightResizeEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		this.bottomLeftDiv.onmousedown = function(e) {
			obj.bottomResizeBegin(e);
			obj.leftResizeBegin(e);
			mouseMoveFunction = function(e) {
				obj.bottomResizeCurrent(e);
				obj.leftResizeCurrent(e);
				if (obj.video) 	obj.resizeVideo();
				if (obj.img)	obj.resizeImage();
			}
			mouseUpFunction = function() {
				obj.bottomResizeEnd();
				obj.leftResizeEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		this.bottomRightDiv.onmousedown = function(e) {
			obj.bottomResizeBegin(e);
			obj.rightResizeBegin(e);
			mouseMoveFunction = function(e) {
				obj.bottomResizeCurrent(e);
				obj.rightResizeCurrent(e);
				if (obj.video) obj.resizeVideo();
				if (obj.img)   obj.resizeImage();
			}
			mouseUpFunction = function() {
				obj.bottomResizeEnd();
				obj.rightResizeEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
		}}
		//this.footer.onmousedown = function() { if(minimizeState) { console.log('MW: footer mouseDown event -> Disable Minimize'); minimizeState = false; }}


		this.close.onmousedown = function() {
			console.log('MW: Close');
			transitionToken++;
			obj.main.style.transitionProperty = 'opacity';
			obj.main.style.transitionDuration = '0.4s';
			obj.main.style.opacity='0';
			obj.video && obj.video.pause();
		}
		var fullOpacity = false;
		this.opacityButton.onmousedown = function() {
			obj.body.style.opacity = (fullOpacity = !fullOpacity)?1:obj.opacity;
		}
		this.hideHeader.onmousedown = function() {
			console.log('MW: Déclenchement du HeaderMaskSystem:');
		}
		// Gestion des deux boutons, MAXIMIZE et MINIMIZE: (important: Afin de garantir un ajustement classique des fenetres, minimize passe à false lors d'un clic sur footer, leftDiv ou rightDiv cf. plus haut.)
		var minimizeState = false;
		var maximizeState = false;
		this.lastTop, this.lastLeft, this.lastHeight, this.lastWidth = null;
		this.minimize.onmousedown = function() {
			console.log('MW: Minimize');
			transitionToken++;
			obj.main.style.transitionProperty = 'width,height,top,left';
			obj.main.style.transitionDuration = '0.1s';
			if (!minimizeState) {
				if (!maximizeState) {
					obj.lastTop = obj.main.offsetTop/window.innerHeight*100;
					obj.lastLeft = obj.main.offsetLeft/window.innerWidth*100;
					obj.lastHeight = obj.main.offsetHeight/window.innerHeight*100;
					obj.lastWidth = obj.main.offsetWidth/window.innerWidth*100;
					obj.main.style.height = (obj.headerHeight + obj.borderSize)+'vh';
					obj.conteiner.style.height = '0px';
					obj.mouseBottomDiv.style.display = obj.bottomLeftDiv.style.display = obj.bottomRightDiv.style.display = 'none'; // enter minimize - Désactictivation des champs de redimentionnement.

					// Routines de redimentionnement minimal de la taille horizontale de la fenetre:
					var i = obj.header.getElementsByTagName('svg').length*(obj.headerHeight/100*window.innerHeight);
					var minimalWidth = ((obj.title.offsetWidth+i)/window.innerWidth*100)+2;
					obj.main.style.width = minimalWidth +'vw';
					obj.main.style.left = (obj.lastLeft + obj.lastWidth - minimalWidth)+'vw';
				}
				else {
					obj.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;					// TODO Patch: il y a mieux que innerHTML pour changer d'icone.

					obj.leftDiv.style.width = obj.rightDiv.style.width = obj.footer.style.height = obj.borderSize+'vh';
					obj.conteiner.style.height = (100 - obj.headerHeight - obj.borderSize)+'vh';
					maximizeState = false;
				}
			}
			else {
				obj.main.style.height = obj.lastHeight+'vh';
				obj.main.style.width = obj.lastWidth+'vw';
				obj.main.style.top = obj.lastTop+'vh';
				obj.main.style.left = obj.lastLeft+'vw';
				obj.conteiner.style.height = (obj.lastHeight - obj.headerHeight  - obj.borderSize)+'vh';
				obj.mouseBottomDiv.style.display = obj.bottomLeftDiv.style.display = obj.bottomRightDiv.style.display = 'block';	// quit minimize: Réactivcation des champs de redimentionnement souris.
			}
			minimizeState = !minimizeState;
		}
		this.maximize.onmousedown = function() {
			if (obj.video) 	obj.video.style.display='none';
			if (obj.img)	obj.img.style.display='none';
			console.log('MW: Maximize');
			transitionToken++;
			obj.main.style.transitionProperty = 'width,height,top,left';
			obj.main.style.transitionDuration = '0.1s';

			if (!maximizeState) {
				if (!minimizeState) {
					obj.lastTop = obj.main.offsetTop/window.innerHeight*100;
					obj.lastLeft = obj.main.offsetLeft/window.innerWidth*100;
					obj.lastHeight = obj.main.offsetHeight/window.innerHeight*100;
					obj.lastWidth = obj.main.offsetWidth/window.innerWidth*100;
				}
				else {
					minimizeState = false;
					obj.mouseBottomDiv.style.display = obj.bottomLeftDiv.style.display = obj.bottomRightDiv.style.display = 'block'; // TODO quit minimize: Réactivation des champs de redimentionnement souris.
				}
				obj.switchToFullscreen();
			}
			else  obj.quitFullscreen();

			maximizeState = !maximizeState;
		}

	// afin d'éviter les déclenchements multiples, chaque méthode engendrant une ou plusieurs transitions, tel maximize ou minimize, se voit attribue un transitionToken, dès que la première transition est terminée, à ce moment
	// les autres doivent l'être tout autant, UN SEUL CALCUL est opéré, le transitionToken est supprimé et les autres traisitions arrivant ensuites ne trouveront pas de tokens pour etre claculées.
		var transitionToken = 0;					// TODO possible to get prototype : apparement NON !
		var endOfTransition = function(e) {
			if (transitionToken > 0) {
				console.log("MW endOfTransition(e) private function: consume one token, Detected transition -> "+e.propertyName);
				transitionToken--;
				obj.main.style.transitionProperty = 'none';
				if (e.propertyName == 'opacity') obj.main.style.display = 'none';
				if (obj.video) {
					obj.resizeVideo();
					obj.video.style.display='block';
				}
				if (obj.img) {
				 	obj.resizeImage();
					obj.img.style.display='block';
				}
				if (obj.customContent) {
					obj.body.style.fontSize = (obj.conteiner.offsetHeight/20)+'px';				// TODO Ajout expérimental.
				}
			}
			else console.log('MW endOfTransition(e) private function: No one token.');
		}

		obj.main.addEventListener("transitionend",endOfTransition,false);

		this.activeScrolling = function() {
			this.body.addEventListener(mousewheelevt, function(e) {
				var e = window.event || e; // old IE support
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				obj.body.scrollTop -= delta*20;
				console.log(obj.id);
			}, false);
		}
	}
	return MudulableWindowConstructor;
})();
// MW -> Prototypes de base:
MW.prototype.utilize = function() {				// (EN)utilize <--> (FR)exploiter	cf. To utilize a woman (c. Idiocraty)
	return this.body;
}

MW.prototype.changeColor	= function() {}			// TODO Fonction pouvant trouver son utilité.
MW.prototype.changeOpacity	= function() {}		    	// TODO Fonction pouvant trouver son utilisé.

// Fonctions de redimentionnement évennementiel des fenetres.

MW.prototype.switchToFullscreen = function() {
	this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE_INVERSE").innerHTML;		// TODO Patch: il y a mieux que innerHTML pour changer d'icone.

	this.main.style.height = '100vh';
	this.main.style.width = '100vw';
	this.main.style.top = this.main.style.left ='0px';

	this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = '0px';
	this.conteiner.style.height = (100 - this.headerHeight)+'vh';

	this.mouseRightDiv.style.right = (3*this.borderSize)+'vh';							// TODO patch mouseRightDiv (puisqu'elle est relative à une div en float left qui perd son width lors de maximize)
}
MW.prototype.quitFullscreen = function () {
	this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;			// TODO Patch: il y a mieux que innerHTML pour changer d'icone.

	this.main.style.height = this.lastHeight+'vh';
	this.main.style.width = this.lastWidth+'vw';
	this.main.style.top = this.lastTop+'vh';
	this.main.style.left = this.lastLeft+'vw';

	this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = this.borderSize+'vh';
	this.conteiner.style.height = (this.lastHeight - this.headerHeight - this.borderSize)+'vh';

	this.mouseRightDiv.style.right = (2*this.borderSize)+'vh';							// TODO patch mouseRightDiv
}

MW.prototype.resize = function() {
	this.video && this.resizeVideo();
	this.img && this.resizeImage();
	this.customContent && (this.body.style.fontSize=(this.conteiner.offsetHeight/20)+'px');		// TODO Ajout expérimental.
}

//  Prototypes de création primordiale des fenêtres:

MW.prototype.assign = function() {
	console.log('MW: Assign existed window -> '+this.id);
																	// TODO HeaderMaskSystem -> this.headerMask = this.main.getElementsByClassName('MWHeaderMask')[0]
	this.header = this.main.getElementsByClassName("MWHeader")[0];

		this.topSpace = this.header.getElementsByClassName('MWTitle')[0];

		this.hideHeader 		= document.getElementById("MW_SVG_HEADERLESS").cloneNode(true);
		this.opacityButton 	= document.getElementById("MW_SVG_OPACITY").cloneNode(true);
		this.close 			= document.getElementById("MW_SVG_CLOSE").cloneNode(true);
		this.maximize 		= document.getElementById("MW_SVG_MAXIMIZE").cloneNode(true);
		this.minimize 		= document.getElementById("MW_SVG_MINIMIZE").cloneNode(true);

		this.hideHeader.classList.remove('MW_Svg_Hidden');
		this.opacityButton.classList.remove('MW_Svg_Hidden');
		this.close.classList.remove('MW_Svg_Hidden');
		this.maximize.classList.remove('MW_Svg_Hidden');
		this.minimize.classList.remove('MW_Svg_Hidden');

		this.header.insertBefore(this.close, this.topSpace);
		this.header.insertBefore(this.minimize, this.topSpace);
		this.header.insertBefore(this.maximize, this.topSpace);
		this.header.insertBefore(this.opacityButton, this.topSpace);
		this.header.insertBefore(this.hideHeader, this.topSpace);

	this.conteiner = this.main.getElementsByClassName("MWConteiner")[0];
		this.leftDiv = this.conteiner.getElementsByClassName("MWLeft")[0];
			this.mouseLeftDiv = this.leftDiv.getElementsByClassName("MWMouseSideDiv")[0];
		this.rightDiv = this.conteiner.getElementsByClassName("MWRight")[0];
			this.mouseRightDiv = this.rightDiv.getElementsByClassName("MWMouseSideDiv")[0];
		this.body = this.conteiner.getElementsByClassName("MWBody")[0];

	this.footer = this.main.getElementsByClassName("MWFooter")[0];
		this.bottomDiv = this.footer.getElementsByClassName("MWBottom")[0];
		this.mouseBottomDiv = this.footer.getElementsByClassName("MWMouseBottomDiv")[0];
		this.bottomLeftDiv = this.footer.getElementsByClassName("MWLeftBottom")[0];
		this.bottomRightDiv = this.footer.getElementsByClassName("MWRightBottom")[0];
}
MW.prototype.create = function() {
	console.log('MW: Create new window -> '+this.id);

	this.main = document.createElement('div');
	this.main.id = this.id;
	this.main.className = 'MW';
	document.getElementsByTagName('body')[0].appendChild(this.main);

	this.header = document.createElement('div');
	this.header.className = 'MWHeader';
	this.main.appendChild(this.header);
		this.hideHeader 		= document.getElementById("MW_SVG_HEADERLESS").cloneNode(true);
		this.opacityButton 	= document.getElementById("MW_SVG_OPACITY").cloneNode(true);
		this.close 			= document.getElementById("MW_SVG_CLOSE").cloneNode(true);
		this.maximize 		= document.getElementById("MW_SVG_MAXIMIZE").cloneNode(true);
		this.minimize 		= document.getElementById("MW_SVG_MINIMIZE").cloneNode(true);

		this.hideHeader.classList.remove('MW_Svg_Hidden');
		this.opacityButton.classList.remove('MW_Svg_Hidden');
		this.close.classList.remove('MW_Svg_Hidden');
		this.maximize.classList.remove('MW_Svg_Hidden');
		this.minimize.classList.remove('MW_Svg_Hidden');

		this.topSpace = document.createElement('div');
		this.topSpace.className = 'MWTitle';

		this.header.appendChild(this.close);
		this.header.appendChild(this.minimize);
		this.header.appendChild(this.maximize);
		this.header.appendChild(this.opacityButton);
		this.header.appendChild(this.hideHeader);
		this.header.appendChild(this.topSpace);

	this.conteiner = document.createElement('div');
	this.conteiner.className = 'MWConteiner';
	this.main.appendChild(this.conteiner);
		this.leftDiv = document.createElement('div');
			this.mouseLeftDiv = document.createElement('div');
			this.mouseLeftDiv.className = 'MWMouseSideDiv';
		this.rightDiv = document.createElement('div');
			this.mouseRightDiv = document.createElement('div');
			this.mouseRightDiv.className = 'MWMouseSideDiv';
		this.body = document.createElement('div');
		this.leftDiv.className = 'MWLeft MWSideDiv';
		this.rightDiv.className = 'MWRight MWSideDiv';
		this.body.className = 'MWBody';
		this.conteiner.appendChild(this.leftDiv);
			this.leftDiv.appendChild(this.mouseLeftDiv);
		this.conteiner.appendChild(this.rightDiv);
			this.rightDiv.appendChild(this.mouseRightDiv);
		this.conteiner.appendChild(this.body);

	this.footer = document.createElement('div');
	this.footer.className = 'MWFooter';
	this.main.appendChild(this.footer);
		this.bottomLeftDiv = document.createElement('div');
		this.bottomRightDiv = document.createElement('div');
		this.bottomDiv = document.createElement('div');
		this.mouseBottomDiv = document.createElement('div');
		this.bottomLeftDiv.className='MWLeftBottom MWMouseSideBottomDiv';
		this.bottomRightDiv.className='MWRightBottom MWMouseSideBottomDiv';
		this.bottomDiv.className='MWBottom';
		this.mouseBottomDiv.className='MWMouseBottomDiv';
		this.footer.appendChild(this.bottomDiv);
		this.footer.appendChild(this.mouseBottomDiv);
		this.footer.appendChild(this.bottomLeftDiv);
		this.footer.appendChild(this.bottomRightDiv);
}
MW.prototype.setProperty = function(titleWindow,positionX,positionY,sizeX,sizeY,color,background)
{
	this.main.style.left = positionX+'vw';
	this.main.style.top = positionY+'vh';
	this.main.style.width = sizeX+'vw';
	this.main.style.height = sizeY+'vh';

												// TODO HeaderMaskSystem -> this.headerMask.style.height = this.header.style.height = this.headerHeight+'vh';
	this.header.style.height = this.headerHeight+'vh';

	this.title = document.createElement('span');
	this.topSpace.appendChild(this.title);
	var txtNode = document.createTextNode(titleWindow);

	this.title.appendChild(txtNode);
	this.header.style.color = this.close.style.color = this.minimize.style.color = this.maximize.style.color = this.titleTxtColor;

	this.conteiner.style.height = (sizeY - this.headerHeight - this.borderSize)+'vh';

	this.body.style.backgroundColor = background;
	this.body.style.opacity	= this.opacity;

	this.topSpace.style.backgroundColor = this.bottomDiv.style.backgroundColor = this.leftDiv.style.backgroundColor = this.rightDiv.style.backgroundColor = color;

	this.footer.style.height = this.leftDiv.style.width = this.rightDiv.style.width = this.borderSize+'vh';

	this.bottomLeftDiv.style.width = this.bottomRightDiv.style.width = this.bottomLeftDiv.style.height = this.bottomRightDiv.style.height = (5*this.borderSize)+'vh';
	this.bottomLeftDiv.style.bottom = this.bottomRightDiv.style.bottom = (8*this.borderSize)+'vh';

	this.mouseRightDiv.style.right = (2*this.borderSize)+'vh';
	this.mouseRightDiv.style.width = this.mouseLeftDiv.style.width = (3*this.borderSize)+'vh';

	this.mouseBottomDiv.style.height = (3*this.borderSize)+'vh';
	this.mouseBottomDiv.style.bottom = (3*this.borderSize)+'vh';
}

// Ensemble de prototypes permettant le redimentionnement et le repositionnement des fenetres selon l'utilisation faite de la souris:

MW.prototype.moveBegin = function(e) {
	console.log('MW: start moving');
	this.diffX = e.pageX - this.main.offsetLeft;
	this.diffY = e.pageY - this.main.offsetTop;
}
MW.prototype.moveCurrent = function(e) {
	var newTop 	= -this.diffY + e.pageY;
	var newLeft = -this.diffX + e.pageX;
	if (newTop < 0) newTop   = 0;
	if (newLeft < 0) newLeft = 0;
	if (newTop > (window.innerHeight - this.main.offsetHeight)) newTop = (window.innerHeight - this.main.offsetHeight);
	if (newLeft > (window.innerWidth  - this.main.offsetWidth))  newLeft = (window.innerWidth - this.main.offsetWidth);
	this.main.style.top = newTop+"px";
	this.main.style.left = newLeft+"px";
}
MW.prototype.moveEnd = function() {
	console.log("MW: stop moving");
      this.main.style.top = (this.main.offsetTop/window.innerHeight*100)+"vh";	// Conversion finale en VH et VW, BUG conversion overflow barre de scroll actives dans certaines résolutions
      this.main.style.left = (this.main.offsetLeft/window.innerWidth*100)+"vw";
}

MW.prototype.bottomResizeBegin = function(e) {
	console.log("MW: start resizing bottom Tab");
	this.diffY = e.pageY - this.main.offsetHeight;
}
MW.prototype.bottomResizeCurrent = function(e) {
	var newHeight = -this.diffY + e.pageY;
	if (newHeight < (this.header.offsetHeight + 100)) 	newHeight = this.header.offsetHeight + 100;
	if ((newHeight + this.main.offsetTop) > window.innerHeight) newHeight = window.innerHeight - this.main.offsetTop;
	this.main.style.height = newHeight+"px";
	// TODO UPGRADE: Afin d'integrer au mieux la fonction de disparition du titre/header, permis par un jeu de mise à 0 de headerHeight, l'ancienne capture de la hauteur du header dans l'équation est remplacée
	// par une expression de hauteur relative à headerHeight, ce dernier étant exprimé en VH, une conversion express en pixel est nécessaire -> (this.headerHeight/100*window.innerHeight)
	// berfore: this.conteiner.style.height = (newHeight-this.header.offsetHeight-this.footer.offsetHeight)+"px";
	this.conteiner.style.height = (newHeight-(this.headerHeight/100*window.innerHeight)-this.footer.offsetHeight)+"px";

	if (this.customContent) this.body.style.fontSize = (newHeight/20)+'px';				// TODO Ajout expérimental pour customContent et la taille des polices relatives VH/EM.
}
MW.prototype.bottomResizeEnd = function() {
	console.log("MW: stop resizing bottom");
	this.main.style.height 		= (this.main.offsetHeight/window.innerHeight*100)+"vh";
	this.conteiner.style.height 	= (this.conteiner.offsetHeight/window.innerHeight*100)+"vh";
}

MW.prototype.leftResizeBegin = function(e) {
	console.log("MW: start resizing left Tab");
	this.diffX = e.pageX - this.main.offsetLeft;
	this.temp = this.main.offsetLeft + this.main.offsetWidth;
}
MW.prototype.leftResizeCurrent = function(e) {
	var newLeft = -this.diffX + e.pageX;
	if (newLeft < 0) 				newLeft = 0;
	if (newLeft > (this.temp - 100)) 	newLeft = this.temp - 100;
	this.main.style.left = newLeft+"px";
	this.main.style.width = (this.temp-this.main.offsetLeft)+"px";
}
MW.prototype.leftResizeEnd = function() {
	console.log("MW: stop resizing left tab");
	this.main.style.left	= (this.main.offsetLeft/window.innerWidth*100)+"vw";
	this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
}

MW.prototype.rightResizeBegin = function(e) {
	console.log("MW: start resizing right Tab");
	this.diffX = e.pageX - (this.main.offsetLeft + this.main.offsetWidth);
	this.temp = this.main.offsetLeft;
}
MW.prototype.rightResizeCurrent = function(e) {
	var newRight = -this.diffX + e.pageX;
	if (newRight > window.innerWidth) 	newRight = window.innerWidth;
	if (newRight < (this.temp + 100))	newRight = this.temp + 100;
	this.main.style.width = (newRight - this.temp)+"px";
}
MW.prototype.rightResizeEnd = function() {
	console.log("MW: stop resizing right tab");
	this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
}

// Définition des outils de proportion pout les images et les vidéos.

MW.prototype.resizeImage = function() {
	if (this.proportionsRespected) {
		if (this.img.classList.contains('MWImgFull')) {
			console.log('MW.resizeImage() Switch to propotionned image -> Suppression de la classe MWImgFull');
			this.img.classList.remove("MWImgFull");
		}
		var ratioWindow 	= this.body.offsetWidth/this.body.offsetHeight;
		var ratioImage	= this.img.width/this.img.height;
		if (ratioImage > ratioWindow) {
			if (this.imageRatioCmp || this.breakResolution) {
				console.log('MW.resizeImage() New image/window ratio detected (respected proportions) RATIO_IMAGE > RATIO_WINDOW');
				this.imageRatioCmp = this.breakResolution = false;
				this.img.style.width = '100%';
				this.img.style.left = '0px';
				this.img.style.removeProperty('height');
				this.img.style.position = 'relative';
			}
			var actualImageHeight = this.img.height*(this.body.offsetWidth/this.img.width);
			this.img.style.top = ((this.body.offsetHeight-actualImageHeight)/2)+'px';
		}
		else {
			if (!this.imageRatioCmp || this.breakResolution) {
				console.log('MW.resizeImage() New image/window ratio detected (respected proportions) RATIO_IMAGE < RATIO_WINDOW');
				this.imageRatioCmp = true;
				this.breakResolution = false;
				this.img.style.height = '100%';
				this.img.style.top = '0px';
				this.img.style.removeProperty('width');
				this.img.style.position = 'relative';
			}
			var actualImageWidth = this.img.width*(this.body.offsetHeight/this.img.height);
			this.img.style.left = ((this.body.offsetWidth-actualImageWidth)/2)+'px';
		}
	}
	else	{
		if (!this.img.classList.contains('MWImgFull'))
		{
			console.log('MW.resizeImage() Full window image resize -> Attribution de la classe MWImgFull');
			this.img.style.removeProperty('position');
			this.img.className = 'MWImgFull';
		}
	}
}
MW.prototype.resizeVideo = function() {
	var ratioWindow 	= this.body.offsetWidth/this.body.offsetHeight;
	var ratioVideo	= this.video.videoWidth/this.video.videoHeight;
	if (ratioVideo > ratioWindow) {
		if (this.proportionsRespected) {
			if (this.videoRatioCmp) {
				console.log('MW.resizeVideo() New video/window ratio detected (respected proportions) RATIO_VIDEO > RATIO_WINDOW');
				this.videoRatioCmp = false;
				this.video.style.width = '100%';
				this.video.style.left = '0px';
				this.video.style.removeProperty('height');
				this.video.style.removeProperty('transform');
			}
			var actualVideoHeight = this.video.videoHeight*(this.body.offsetWidth/this.video.videoWidth);
			this.video.style.top = ((this.body.offsetHeight-actualVideoHeight)/2)+'px';
		}
		else	{
			if (this.videoRatioCmp) {
				console.log('MW.resizeVideo() New video/window ratio detected (full window video) RATIO_VIDEO > RATIO_WINDOW');
				this.videoRatioCmp = false;
				this.video.style.left = this.video.style.top = '0px';
				this.video.style.width = '100%';
				this.video.style.removeProperty('height');
			}
			var actualVideoHeight = this.video.videoHeight*this.body.offsetWidth/this.video.videoWidth;
			var scaleY = this.body.offsetHeight/actualVideoHeight;
		 	//console.log("MW: Real vid proportions -> Width="+this.video.videoWidth+" Height="+this.video.videoHeight+". Actual video height (relative to window width):"+actualVideoHeight+" -> scaleY:"+scaleY);
			this.video.style.transform="scaleY("+scaleY+")";
		}
	}
	else	{
		if (this.proportionsRespected) {
			if (!this.videoRatioCmp) {
				console.log('MW.resizeVideo() New video/window ratio detected (respected proportions) RATIO_VIDEO < RATIO_WINDOW');
				this.videoRatioCmp = true;
				this.video.style.height = '100%';
				this.video.style.removeProperty('top');
				this.video.style.removeProperty('transform');
			}
			var actualVideoWidth = this.video.videoWidth*(this.body.offsetHeight/this.video.videoHeight);
			this.video.style.width = actualVideoWidth+'px';
			this.video.style.left = ((this.body.offsetWidth-actualVideoWidth)/2)+'px'
		}
		else	{
			if (!this.videoRatioCmp) {
				console.log('MW.resizeVideo() New video/window ratio detected (full window video) RATIO_VIDEO < RATIO_WINDOW');
				this.videoRatioCmp = true;
				this.video.style.left = this.video.style.top = '0px';
				this.video.style.height = '100%';
				this.video.style.removeProperty('width');
			}
			var actualVideoWidth = this.video.videoWidth*this.body.offsetHeight/this.video.videoHeight;
			var scaleX = this.body.offsetWidth/actualVideoWidth;
		 	//console.log("MW: Real vid proportions -> Width="+this.video.videoWidth+" Height="+this.video.videoHeight+". Actual video width (relative to window height):"+actualVideoWidth+" -> scaleY:"+scaleX);
			this.video.style.transform="scaleX("+scaleX+")";
}}}
MW.prototype.setPropotionsTool = function(proportionnedState)
{

	this.proportionTool = document.getElementById("MW_SVG_PROPORTIONS").cloneNode(true);
	this.proportionTool.classList.remove('MW_Svg_Hidden');

	this.header.insertBefore(this.proportionTool, this.topSpace);				// var insertElement = parentElement.insertBefore(nouvelElement, refElement)

	var obj = this;
	this.proportionsRespected = proportionnedState;

	if (this.video) {
		var ratioWindow 	= this.body.offsetWidth/this.body.offsetHeight;
		var ratioVideo	= this.video.videoWidth/this.video.videoHeight;
		this.videoRatioCmp = ((this.video.videoWidth/this.video.videoHeight) > (this.body.offsetWidth/this.body.offsetHeight))?true:false;		// stimulation redimentionnement.
		this.resizeVideo();
	}
	if (this.img) {
		this.breakResolution = true;
		this.resizeImage();
	}

	this.proportionTool.addEventListener('mousedown', function(){
		obj.proportionsRespected = !obj.proportionsRespected;

		if (obj.video) {
			obj.videoRatioCmp = !obj.videoRatioCmp; 																 // stimulation redimentionnement.
			obj.resizeVideo();
		}
		if (obj.img) {
			obj.breakResolution = true;
			obj.resizeImage();
		}
	},false);
}

// Methodes appelées selon le type de média utilisé dans la fenetre.

MW.prototype.singleVideo = function(url,proportionnedState) {
	var obj = this;
	var proportionnedState = proportionnedState;
	this.video = document.createElement('video');

	var videoControls = document.createElement('div');
	videoControls.className = 'videoControls';
	this.conteiner.appendChild(videoControls);


	this.videoControlsTimeline = document.createElement('div');
	this.videoControlsTimeline.className = 'videoControlsTimeline';
	this.videoControlsConteiner = document.createElement('div');
	this.videoControlsConteiner.className = 'videoControlsConteiner';
	videoControls.appendChild(this.videoControlsTimeline);
	videoControls.appendChild(this.videoControlsConteiner);


	this.videoPlayIcon = document.getElementById("MW_SVG_VIDEO_PLAY").cloneNode(true);
	this.videoPauseIcon = document.getElementById("MW_SVG_VIDEO_PAUSE").cloneNode(true);
	this.videoMuteIcon = document.getElementById("MW_SVG_VIDEO_SOUND").cloneNode(true);
	this.videoPlayIcon.classList.remove('MW_Svg_Hidden');
	this.videoPauseIcon.classList.remove('MW_Svg_Hidden');
	this.videoMuteIcon.classList.remove('MW_Svg_Hidden');
	this.videoControlsConteiner.appendChild(this.videoPlayIcon);
	this.videoControlsConteiner.appendChild(this.videoPauseIcon);
	this.videoControlsConteiner.appendChild(this.videoMuteIcon);

	var A = document.createElement('div');
	A.className='videoTest';
	this.videoControlsTimeline.appendChild(A);

	this.video.addEventListener('loadedmetadata', function() {
		obj.setPropotionsTool(proportionnedState);
		obj.video.play();
		obj.main.style.opacity = 1;
	},false);

	this.video.src = url;
	this.video.className = 'MWVid';
	this.video.type = 'video/mp4';			// TODO Est-ce que le type de la vidéo se définit vraiment ainsi en JS ?
	this.body.appendChild(this.video);


	this.videoPlayIcon.onmousedown = function() { obj.video.play();	console.log('video time:'+obj.video.currentTime);	}					// Colorized lorsque qu'active
	this.videoPauseIcon.onmousedown = function() { obj.video.pause(); 	}
	this.videoMuteIcon.onmousedown = function() { obj.video.volume = (obj.video.volume)?0:1; }

	this.video.ontimeupdate = function() {
		A.style.width=(obj.video.currentTime/obj.video.duration*100)+'%';
	}
	this.videoControlsTimeline.onmousedown = function(e) {
		var diffX = e.pageX - obj.videoControlsTimeline.offsetLeft;
		var exp = diffX / obj.videoControlsTimeline.offsetWidth;
		obj.video.currentTime = exp * obj.video.duration;
	}
}

MW.prototype.singleImage = function(url,proportionnedState) {
	var obj = this;
	this.img = document.createElement('img');
	this.img.src = url;
	this.img.onload = function() {
		obj.setPropotionsTool(proportionnedState);
		obj.body.appendChild(obj.img);
		obj.main.style.opacity = 1;
	}
}
MW.prototype.iframe = function(url) {
	this.iframe = document.createElement('iframe');
	this.iframe.className = 'MWIframe';
	this.iframe.src = url;
	this.iframe.frameBorder = 0;
	this.body.appendChild(this.iframe);
	this.main.style.opacity = 1;
}
MW.prototype.rawText = function(msg) {
	this.body.innerHTML = msg;
	this.activeScrolling();
	this.main.style.opacity = 1;
}
MW.prototype.setCustomContent = function() {
	this.customContent = true;
	this.main.style.opacity = 1;
}

// General DOM -> Spécific fonctions (Dépendances de MW):

var mouseMoveFunction = function() {}
document.onmousemove = function(e) {
	mouseMoveFunction(e);
	//return false;							// TODO suppression expérimentale
}

var mouseUpFunction = function() {}
document.onmouseup = function(e) {
	mouseUpFunction(e);
	return false;
}