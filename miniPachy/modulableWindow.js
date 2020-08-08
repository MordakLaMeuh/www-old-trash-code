/*
OBJECT NAME: Modular Window (abrev. MW)
OBJECT GOAL: DOM UPGRADE with many resizable/modulable Windows, like a OS desktop. achivement: 20%
TODO -> Gestion précise de la taille des polices utilisées dans les fenetres contenant du texte. em dans la feuille css exprime une grandeur de poilice relative à celle du parent.	10%
TODO -> Mode d'affichage des images dans le respect des proportions.		STATE -> OK
TODO -> Mode d'affichage des vidéos dans le respect des proportions.		STATE -> OK
TODO -> Désign controls de la lecture vidéo.							10%
TODO -> Désigned scrollings Bars.
TODO -> FULL opacity fonction										STATE -> OK
TODO -> Back to Backroom fonction, Z-index devient minimum pour affichage en arrière plan.
TODO -> ToolBar de controle central des fenetres.
TODO -> Download bouton for images.
TODO -> Affichage discret du header dans le mode plein écran en full opacity.
TODO -> Full opacity mode et bouton									STATE -> OK

TODO URGENT -> Redimentionnement auto lors d'un changement de la taille de la fenetre du navigateur	STATE ->OK			DIFFICILE -> Apparement pris en charge voir plutot la taille du texte avec maximize)
			le trigger transition est déclenché lors du redimentionnement des fentres, les vidéos et les images sonr 'risizées' à la fin de la transition
			Les iframe prennent automatiquement les bonnes dimentions et les textes exprimés en vh/em voient leurs polices changer de taille.
			MW.prototype.bottomResizeCurrent = function(e) {	[...] 		//this.body.style.fontSize = (newHeight/20)+'px';				// Ajout expérimental.
			Cette instruction augmente la taille de la police selon la taille du window.body
			invention de la super classe customContent. Répétion de la meme ligne dans endoftransisition et resizeBottomCurrent !		STATE -> OK
TODO URGENT -> Minimize -> Tenir compte du nombre de boutons sur la barre HEADER											STATE -> OK
TODO URGENT -> BUG CHAMP INPUT DETECTE
var mouseMoveFunction = function() {}
document.onmousemove = function(e) {
	mouseMoveFunction(e);
	//return false;							// suppression expérimentale			AGISSEMENT ICI !
}																								STATE -> OK (à tester cependant)
TODO URGENT -> Quand la fenetre est sous minimize, désactiver les champs de resize qui se mettent devant les boutons.					STATE -> OK
TODO URGENT -> En mode fullScreen, mauvais positionnement de mouseLeftDiv												STATE -> OK

TODO URGENT -> fenetre minimizées, soucis de taille du texte quand la taille de la fenetre du navigateur diminue.

Image proportions: -> bouton keep proportions R
* Un appui sur une image non proportionné va modifier la hauteur et conserver la longueur, si la hauteur est à son max par rapport à la position de la fenetre, la longueur de l'image diminuera jusq'à etre en adéquation
avec une hauteur affichable.
* Tant que l'état de l'image est proportionné, toutes modifications de la taille de la fenetre aura comme conséquence de laisser une image proportionné, des espaces transparant vont se créer, l'image doit cependant toujours
rester centrée.
* Un autre appui sur le bouton KEEP proportion fera que l'image se déproportionnera et s'étirera sur toute la taille de la fenetre.
				
* Idem pour la vidéo.
*/
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

	var MudulableWindowConstructor = function(id,titleWindow,positionX,positionY,sizeX,sizeY,color,background,borderSize,opacity) {
	
		windowRef.push(this);
	
        	this.id		= id;
		this.titleWindow  = titleWindow;
		this.positionX	= positionX;
		this.positionY	= positionY;
		this.sizeX 		= sizeX;
		this.sizeY 		= sizeY;
		this.color		= color;
		this.background	= background;
		this.borderSize	= borderSize;
		this.opacity 	= opacity;

		this.titleTxtColor = 'black';					// TODO default:Predefined
		this.headerHeight  = 3;				    		// TODO default:Predefined

		var obj = this;
		this.main = document.getElementById(id);
		if (this.main) 		this.assign(id);
		else				this.create(id);

		this.changeColor		= function() {}			// TODO
		this.changeOpacity	= function() {}		    	// TODO

		var putForward = function() {
			zIndexMax++;
			obj.main.style.zIndex = zIndexMax;
		}
		putForward();

		this.main.onmousedown = function(e) {
			console.log('MW main.onmousedown event: selection globale de la fenetre -> Augmentation du Zindex pour toute la fenetre. target '+((e.target.id)?'ID='+e.target.id+' ':'')+((e.target.tagName)?'TAG='+e.target.tagName+' ':'')+((e.target.className)?'CLASS='+e.target.className+'':''));
			putForward();
			if ((e.target.tagName == 'INPUT') || (e.target.id == 'chatTab'))	return true;			// exception pour le chat (mettre en place une liste)
			else						return false;								// return false bloque les events habituelles du navigateur.
		}

		this.diffX = this.diffY = this.temp = null;
		this.topSpace.onmousedown = function(e) {
			obj.moveBegin(e);
			mouseMoveFunction = function(e) {
				obj.moveCurrent(e);
			}
			mouseUpFunction = function() {
				obj.moveEnd();
				mouseMoveFunction = mouseUpFunction = function() {}
			}
			return false;
		}
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
			}
			return false;
		}

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
			}
			return false;
		}
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
			}
			return false;
		}
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
			}
			return false;
		}
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
			}
			return false;
		}
		//this.footer.onmousedown = function() { if(minimizeState) { console.log('MW: footer mouseDown event -> Disable Minimize'); minimizeState = false; }}

		this.close.onmousedown = function() {
			console.log('MW: Close');
			transitionToken++;
			obj.main.style.transitionProperty = 'opacity';
			obj.main.style.transitionDuration = '0.4s';
			obj.main.style.opacity='0';
			if (obj.video) obj.video.pause();
		}

		var fullOpacity = false;
		this.opacityButton.onmousedown = function() {
			obj.body.style.opacity = (fullOpacity = !fullOpacity)?1:obj.opacity;
		}
		
		
/* TODO -> headerMaskSystem
		var headerMaskTransition = function() {
			if (true) {
				console.log('MW: Anéantissement du Header terminé.');
				obj.header.classList.remove('MWHeader');
				obj.header.classList.add('MWHeaderHided');
			}
			else {
				//obj.topSpace.style.backgroundColor = obj.color;																// TODO test
				//obj.header.style.color = obj.close.style.color = obj.minimize.style.color = obj.maximize.style.color = obj.background;				// TODO test
			}
		}

		obj.headerMask.addEventListener("transitionend",headerMaskTransition,false);

		var oldHeaderHeight = 0;		
		this.hideHeader.onmousedown = function() {
			if (!oldHeaderHeight) {
				obj.main.style.transitionProperty = 'height';												// -> Héritage de ces propriétés de translation à tous les enfants.
				obj.main.style.transitionDuration = '0.5s';
				obj.headerMask.style.height = '0px';													// -> engendre une diminution progressive de la taille du header 
				obj.conteiner.style.height = ((obj.conteiner.offsetHeight/window.innerHeight*100) + obj.headerHeight)+'vh';		// -> augmente progressivement la taille du conteneur
			
				obj.topSpace.style.backgroundColor = 'transparent';	// TODO Une transition de couleur serait souhaitable ici.																
				obj.header.style.color = obj.close.style.color = obj.minimize.style.color = obj.maximize.style.color = 'white';	// TODO Idem
				
				obj.leftDiv.style.width = obj.rightDiv.style.width = obj.footer.style.height = '0px';
				obj.mouseRightDiv.style.right = (3*obj.borderSize)+'vh';				
			}
			else {
				obj.main.style.transitionProperty = 'height';
				obj.main.style.transitionDuration = '0.5s';
				obj.headerMask.style.height = oldHeaderHeight+'vh';
				obj.header.classList.remove('MWHeaderHided');
				obj.header.classList.add('MWHeader');
				obj.headerHeight = oldHeaderHeight;
				obj.conteiner.style.height = ((obj.conteiner.offsetHeight/window.innerHeight*100) - obj.headerHeight)+'vh';
				oldHeaderHeight = 0;
			}
		}
*/

this.hideHeader.onmousedown = function() {
	console.log('MW: Déclenchement du HeaderMaskSystem:');
}


// Gestion des deux boutons, MAXIMIZE et MINIMIZE: (important: Afin de garantir un ajustement classique des fenetres, minimize passe à false lors d'un clic sur footer, leftDiv ou rightDiv cf. plus haut.)
		var minimizeState = false;
		var maximizeState = false;
		var lastTop, lastLeft, lastHeight, lastWidth = null;

		this.minimize.onmousedown = function() {
			console.log('MW: Minimize');
			transitionToken++;
			obj.main.style.transitionProperty = 'width,height,top,left';
			obj.main.style.transitionDuration = '0.1s';
			if (!minimizeState) {
				if (!maximizeState) {
					lastTop = obj.main.offsetTop/window.innerHeight*100;
					lastLeft = obj.main.offsetLeft/window.innerWidth*100;
					lastHeight = obj.main.offsetHeight/window.innerHeight*100;
					lastWidth = obj.main.offsetWidth/window.innerWidth*100;
					obj.main.style.height = (obj.headerHeight + obj.borderSize)+'vh';
					obj.conteiner.style.height = '0px';
					obj.mouseBottomDiv.style.display = obj.bottomLeftDiv.style.display = obj.bottomRightDiv.style.display = 'none'; // enter minimize - Désactictivation des champs de redimentionnement.

					// Routines de redimentionnement minimal de la taille horizontale de la fenetre:
					var i = obj.header.getElementsByTagName('svg').length*(obj.headerHeight/100*window.innerHeight);
					var minimalWidth = ((obj.title.offsetWidth+i)/window.innerWidth*100)+2;
					obj.main.style.width = minimalWidth +'vw';
					obj.main.style.left = (lastLeft + lastWidth - minimalWidth)+'vw';
				}
				else {
					obj.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;					// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
				
					obj.leftDiv.style.width = obj.rightDiv.style.width = obj.footer.style.height = obj.borderSize+'vh';
					obj.conteiner.style.height = (100 - obj.headerHeight - obj.borderSize)+'vh';
					maximizeState = false;
				}
			}
			else {
				obj.main.style.height = lastHeight+'vh';
				obj.main.style.width = lastWidth+'vw';
				obj.main.style.top = lastTop+'vh';
				obj.main.style.left = lastLeft+'vw';
				obj.conteiner.style.height = (lastHeight - obj.headerHeight  - obj.borderSize)+'vh';
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
					lastTop = obj.main.offsetTop/window.innerHeight*100;
					lastLeft = obj.main.offsetLeft/window.innerWidth*100;
					lastHeight = obj.main.offsetHeight/window.innerHeight*100;
					lastWidth = obj.main.offsetWidth/window.innerWidth*100;
				}
				else {
					minimizeState = false;
					obj.mouseBottomDiv.style.display = obj.bottomLeftDiv.style.display = obj.bottomRightDiv.style.display = 'block'; // TODO quit minimize: Réactivation des champs de redimentionnement souris.
				}
				switchToFullscreen();
			}
			else  quitFullscreen();

			maximizeState = !maximizeState;
		}

		var switchToFullscreen = function() {
			obj.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE_INVERSE").innerHTML;							// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
		
			obj.main.style.height = '100vh';
			obj.main.style.width = '100vw';
			obj.main.style.top = obj.main.style.left ='0px';

			obj.leftDiv.style.width = obj.rightDiv.style.width = obj.footer.style.height = '0px';
			obj.conteiner.style.height = (100 - obj.headerHeight)+'vh';

			obj.mouseRightDiv.style.right = (3*obj.borderSize)+'vh';	// TODO 7dbfb54f-aa62-4e3e-ad72-798438d45de7patch mouseRightDiv (puisqu'elle est relative à une div en float left qui perd son width lors de maximize)
		}
		var quitFullscreen = function () {
			obj.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;								// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
		
			obj.main.style.height = lastHeight+'vh';
			obj.main.style.width = lastWidth+'vw';
			obj.main.style.top = lastTop+'vh';
			obj.main.style.left = lastLeft+'vw';

			obj.leftDiv.style.width = obj.rightDiv.style.width = obj.footer.style.height = obj.borderSize+'vh';
			obj.conteiner.style.height = (lastHeight - obj.headerHeight - obj.borderSize)+'vh';

			obj.mouseRightDiv.style.right = (2*obj.borderSize)+'vh';	// TODO patch mouseRightDiv
		}

	// afin d'éviter les déclenchements multiples, chaque méthode engendrant une ou plusieurs transitions, tel maximize ou minimize, se voit attribue un transitionToken, dès que la première transition est terminée, à ce moment
	// les autres doivent l'être tout autant, UN SEUL CALCUL est opéré, le transitionToken est supprimé et les autres traisitions arrivant ensuites ne trouveront pas de tokens pour etre claculées.
		var transitionToken = 0;
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
		/*
		this.special = function() {
			// Conversion liste des arguments en véritable objet Array, ici, c'est pour pouvoir appliquer un listage des arguments via join(). `args = Array.prototype.slice.call(arguments);`
			console.log("MW: special methode called -> args:"+Array.prototype.slice.call(arguments).join());
			for (var i=0; i<arguments.length; i++) {
				switch (arguments[i]) {
					case 'fullScreen':
						console.log('MW: special methode called -> Apply FullScreen');
						maximizeState = true;
						lastTopMax = this.positionY;
						lastLeftMax = this.positionX;
						lastHeightMax = this.sizeY;
						lastWidthMax = this.sizeX;
						switchToFullscreen();
						break;
					default:
						console.log('MW: special methode called -> Default');
						break;
				}
			}
		}*/

		this.activeScrolling = function() {
			this.body.addEventListener(mousewheelevt, function(e) {
				var e = window.event || e; // old IE support
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				obj.body.scrollTop -= delta*20;
			}, false);
		}
	}
	return MudulableWindowConstructor;
})();
// MW -> Prototypes de base:
MW.prototype.utilize = function() {				// (EN)utilize <--> (FR)exploiter	cf. To utilize a woman
	return this.body;
}

MW.prototype.resize = function() {
	if (this.video) {
		this.resizeVideo();
	}
	if (this.img) {
	 	this.resizeImage();
	}
	if (this.customContent) {
		this.body.style.fontSize = (this.conteiner.offsetHeight/20)+'px';				// TODO Ajout expérimental.
	}
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

	this.setProperty();
}
MW.prototype.create = function(id) {
	console.log('MW: Create new window -> '+id);

	this.main = document.createElement('div');
	this.main.id = id;
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

	this.setProperty();;
}
MW.prototype.setProperty = function()
{
	this.main.style.left = this.positionX+'vw';
	this.main.style.top = this.positionY+'vh';
	this.main.style.width = this.sizeX+'vw';
	this.main.style.height = this.sizeY+'vh';

												// TODO HeaderMaskSystem -> this.headerMask.style.height = this.header.style.height = this.headerHeight+'vh';
	this.header.style.height = this.headerHeight+'vh';
	
	this.title = document.createElement('span');
	this.topSpace.appendChild(this.title);
	var txtNode = document.createTextNode(this.titleWindow);

	this.title.appendChild(txtNode);
	this.header.style.color = this.close.style.color = this.minimize.style.color = this.maximize.style.color = this.titleTxtColor;

	this.conteiner.style.height = (this.sizeY - this.headerHeight - this.borderSize)+'vh';
	
	this.body.style.backgroundColor = this.background;
	this.body.style.opacity	= this.opacity;

	this.topSpace.style.backgroundColor = this.bottomDiv.style.backgroundColor = this.leftDiv.style.backgroundColor = this.rightDiv.style.backgroundColor = this.color;
	this.footer.style.height = this.borderSize+'vh';
	
	this.leftDiv.style.width = this.rightDiv.style.width = this.borderSize+'vh';

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
	this.proportionTool.classList.remove('MW_Svg_Icon');
	
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
	
	this.video.addEventListener('loadedmetadata', function() {
		obj.setPropotionsTool(proportionnedState);
		obj.video.play();
		obj.main.style.opacity = 1;
	},false);
	this.video.src = url;
	this.video.className = 'MWVid';
	this.video.type = 'video/mp4';			// TODO Est-ce que le type de la vidéo se définit vraiment ainsi en JS ?
	this.body.appendChild(this.video);
}

MW.prototype.singleImage = function(url,proportionnedState) {
	obj = this;
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
