"use strict";
var X_Window = function(ID, list, height, width) {
	var ELEMENT	=	new Array();
	var AREA	=	new Array();
	
	var panel	=	ID;
	var height	=	height;
	var width	=	width;
		
	var createElement = function(list) {
		
		var elementObjet = function(area,location)
		{
			this.element=area;
			this.location=location;
			this.blankDiv;
			this.mouvement=0;
		}
		var element;
		var area;
		var box;
		var txt;
		
		for (var j=0; j<16; j++) 
		{
			for (var i=0;i<list.length; i++)
			{
				console.log("création d\'un element:");
				
				var element = document.createElement('div');
				var area = document.createElement('div');
				element.className  = 'boxLine '+list[i];
				area.className  = 'areaLine';
				
				area.style.top 	= ((j*list.length)+i)*height+'vh'; 			// ATTENTION On donne aussi un offsetTop aux éléments statiques.
				element.style.height = area.style.height = height+'vh';		     	// Afin d'éviter un 'blocage' lors du tout premier mouvement.
				
				var box = document.createElement('div');
				box.className = 'leftBox';
				if ((j*7+i)%2 == 1) box.style.float='right';
				element.appendChild(box);
				
				//var txt = document.createTextNode('AREA '+((i)+j*list.length));
				var txt = document.createTextNode('Nya Nya Nya '+((i)+j*list.length));
				
				box.appendChild(txt);
				
				box = document.createElement('div');
				box.className = 'rightBox';
				element.appendChild(box);
				
				//box.appendChild(document.createTextNode('Nao Nao Nao !'));
				
				panel.appendChild(element);
				panel.appendChild(area);

				AREA.push(new elementObjet(area,((j*list.length)+i)*height));
				ELEMENT.push(element);
			}
		}
	}
		
	var startListener = function() {
	// ATTENTION 		Utilisation de mouseLeft, element, mouse_X && mouse_Y de l'objet mouse.
		var currentElement;
		var mouseOut;
		var begin;
		var end;
		
		panel.addEventListener('mousedown',function(e) {
			mouseOut = false;
			
			currentElement = mouse.element;

			var mouseUpListener   = function(e) {					// Annulation des effets mouseMove en cas de dé-clic 
				window.removeEventListener('mousemove',mouseMoveListener,false);
				window.removeEventListener('mouseup',mouseUpListener,false);
			}	
			var mouseMoveListener = function(e) {
				if (currentElement != mouse.element) 
				{	
					if (mouse.element.parentNode.id != 'urlAreaDom') 
					{	
						mouseOut = true;
						console.log('OUT Of AREA !');
						
						autoScroll.testScroll();
						
						if (clone.getStatus() == 'dead') {
							for (var z=0; z<ELEMENT.length; z++)	// Recherche des éléments ciblés 
							{
								if (currentElement == AREA[z].element) {
									clone.createClone(ELEMENT[z]);
									clone.setClearEvent(window,'mouseup');
									break;
								}
							}
						}
						return;		
					}
					for (var z=0; z<ELEMENT.length; z++)		// Recherche des éléments ciblés 
					{
						if ( currentElement 	== AREA[z].element) 	begin	= z; 
						if ( mouse.element 	== AREA[z].element)	end	= z; 
					}
					console.log('mouseClass='+mouse.element.className+' mouseID='+mouse.element.parentNode.id+' begin='+begin+' end='+end+' current='+ELEMENT[begin].className+' mouse='+ELEMENT[end].className);
					
					if (mouseOut == true)		// Condition: Quand la souris était dehors et vient de rentrer à nouveau dans la zone.
					{				// Math min
						mouseOut = false;
						foreignInversion(begin,end);
					}
					else 
					{
					// ATTENTION Dans le cas d'une 'latence' de mouseMove (très fréquent sur Firefox), il se peut qu'une div soit 'oubliée', ce petit bout de code rattrape
					// tout oublie malencontreux qui pourrait être commis par le navigateur.
						if (begin < end) 
						{				
							for (begin; begin<end; begin++) {
								localInversion(begin, begin+1);
							}
						}
						else	
						{
							for (begin; begin>end; begin--) {
								localInversion(begin, begin-1);
							}
						}
					}
					currentElement = mouse.element;	
				}
			}
			e.preventDefault();
			window.addEventListener('mousemove',mouseMoveListener,false);	
			window.addEventListener('mouseup',mouseUpListener,false);
		},false);
	}	
// Objet CLONE utilisé lors d'une sortie de la zone d'URL - Affiche la DIV concernée en transparence & permet de la bouger.
	var Clone = function(opacity,duration) 	{
		var opacity 	= opacity;
		var duration 	= duration;
		
		var clone 	= null;
		var clearTimeout;
		
		var status	= 'dead';
		var trigger = {
			element: 	window,
			event: 		'unknown' }
		
		var setClonePosition = function() {
			clone.style.left = mouse.mouse_X+'px';
			clone.style.top  = mouse.mouse_Y - (clone.offsetHeight/2) +'px';
		}
		
		var refreshClonePosition = function() {
			if (clearTimeout == true) return; 
			setClonePosition();
			setTimeout(function(){refreshClonePosition();},50);
		}
		
		var destroyClone = function() {					console.log('DESTRUCTION du clone !');
			clearTimeout = true;
			document.body.removeChild(clone);
			
			status = 'dead';
			trigger.element.removeEventListener(trigger.event,destroyClone,false);
		}
		
		this.createClone = function(element) {				console.log('CREATION du clone !');
			clone = element.cloneNode(true);
			clone.style.opacity=opacity;
			clone.style.transitionDuration=duration+'s';		
			clone.style.position = 'absolute';
			
			clone.style.height 	= height+'vh';
			clone.style.width	= width	+'vw';
			
			setClonePosition();
			document.body.appendChild(clone);

			clearTimeout = false;
			setTimeout(function(){refreshClonePosition();},50);
			
			status = 'alive';
		}
			
		this.setClearEvent = function(element,event) {			console.log('Amorcage de la destruction du clone en '+event+ 'sur '+element);
			trigger.element = element; 
			trigger.event 	= event;
			trigger.element.addEventListener(trigger.event,destroyClone,false);
		}
		
		this.getStatus = function() { return status; }
	}
	// Objet autoScroll permettant de faire scroller une div quand la souris est au dessous ou au dessus avec clic gauche appuyé.
	var AutoScroll = function(scrollQuantity,scrollInterval) {
		var quantity 	= scrollQuantity;
		var time 	= scrollInterval;
		
		var onAutoScroll = false;
		var diff 	 = 0; 
		
		var blockScroll = function() {
			window.removeEventListener('mouseup',blockScroll,false);
			onAutoScroll = false;
		}
					
		var scrollUp = function() {
			if (onAutoScroll != false) 
			{
				panel.scrollTop += diff*quantity;
				if ((diff=testUpScroll())<0) 	setTimeout(function(){scrollUp();},time); 
				else 				blockScroll();
		}}
					
		var scrollDown = function() {
			if (onAutoScroll != false) 
			{
				panel.scrollTop += diff*quantity;
				if ((diff=testDownScroll())>0)	setTimeout(function(){scrollDown();},time);
				else 				blockScroll();
		}}
		
		var testUpScroll = function() 	{
			return	(mouse.mouse_Y - panel.offsetTop)					     }
		var testDownScroll = function() {
			return  (mouse.mouse_Y - (panel.offsetTop+panel.offsetHeight))		     }
		
		this.testScroll = function()
		{
			if (onAutoScroll == true) return;
			
			if 	(( diff=testUpScroll())   <0 ) 	{ onAutoScroll = true; scrollUp();	 window.addEventListener('mouseup',blockScroll,false); } 	
			else if (( diff=testDownScroll()) >0 )	{ onAutoScroll = true; scrollDown();	 window.addEventListener('mouseup',blockScroll,false); }
		}
	}
	
	var foreignInversion = function(z1,z2) {	console.log('foreign inversion- z1:'+z1+':'+ELEMENT[z1].className+' z2:'+z2+':'+ELEMENT[z2].className);
		ELEMENT[z1].style.height = '0px';			//console.log('reduction de la taille z2:'+z1+' class:'+ELEMENT[z1].className);
		ELEMENT[z1].style.opacity = 0;				//console.log('position élément I:'+ELEMENT[z1].offsetTop);

		var temp = ELEMENT[z1].cloneNode(true);
		panel.removeChild(ELEMENT[z1]);
		
		if (z2 > z1)	 	ELEMENT[z1] = panel.insertBefore(temp,ELEMENT[z2].nextSibling);		// mouvement vers le bas
		else 			ELEMENT[z1] = panel.insertBefore(temp,ELEMENT[z2]);			// mouvement vers le haut	
			
		temp = ELEMENT[z1];
		ELEMENT.splice(z1,1);
		ELEMENT.splice(z2,0,temp);				//console.log('position élément II:'+ELEMENT[z2].offsetTop);
		// ATTENTION Peut être ici les éléments devraient être remis en STATIC ?!?
					
		
		var element = ELEMENT[z2];	// BUG (corrigé) Avec le timeout -pour animation- l'élément z2 pouvait changer si la souris bougait vite en localInversion... 
						// Dorénavant, élément pointe sur l'éléments désigné par z2, ce qui arrange le problême. 
		//element.style.top = AREA[z2].location+'vh';
		
		setTimeout(function(){
			element.style.height = height+'vh';		//console.log('Agrandissement de le taille z2:'+z2+' class:'+element.className);
			element.style.opacity = 1;			
		},100);
	}
	
	var localInversion = function(z1,z2) {		console.log('local inversion');
	// Inversion MATHEMATIQUE des deux éléments : ATTENTION Absolument necessaire dès le début de routine. (mais peut porter à confusion ensuite...)
		var temp = ELEMENT[z1];
		ELEMENT[z1] = ELEMENT[z2];
		ELEMENT[z2] = temp;
						
	// Récupération des positions GRAPHIQUES actuelles des éléments. ATTENTION LEs élements peuvent être en mouvement à ce moment précis !
		var location1 = ELEMENT[z1].offsetTop;		//console.log('z1:'+z1+ 'class:'+ELEMENT[z1].className+' offset:'+location1);
		var location2 = ELEMENT[z2].offsetTop;		//console.log('z2:'+z2+ 'class:'+ELEMENT[z2].className+' offset:'+location2);
					
	// Dans un cas d'un mouvement rapide, la blankDiv de l'élement en cours est déjà faite, innutile d'en remettre une autre.			
		if (AREA[z1].mouvement == 0)
		{										//console.log('Anciennement statique Z1:'+ELEMENT[z1].className+' starting mouvement.');
			ELEMENT[z2].style.position='absolute'
			ELEMENT[z2].style.top     = location2+'px';
			AREA[z1].blankDiv = document.createElement('div');
			AREA[z1].blankDiv.style.height = height+'vh';
			panel.insertBefore(AREA[z1].blankDiv,ELEMENT[z2]);
		}
		if (AREA[z2].mouvement == 0)
		{										//console.log('anciennement statique Z2:'+ELEMENT[z2].className+' starting mouvement.');
			ELEMENT[z1].style.position='absolute'
			ELEMENT[z1].style.top     = location1+'px';
			AREA[z2].blankDiv = document.createElement('div');
			AREA[z2].blankDiv.style.height = height+'vh';
			panel.insertBefore(AREA[z2].blankDiv,ELEMENT[z1]);
		}
		AREA[z1].mouvement++;	AREA[z2].mouvement++;
						
		setTimeout(function(){
			ELEMENT[z1].style.top = AREA[z1].location+'vh';
			ELEMENT[z2].style.top = AREA[z2].location+'vh';
		},50);
					
	// Après la migration, seuls les éléments n'ayant pas été resolicités sont permis de retrouver un état static !
		setTimeout(function(){
			AREA[z1].mouvement--;
			AREA[z2].mouvement--;
			if (AREA[z1].mouvement == 0)	{ 					//console.log('Remplacement du noeud blank pour z'+z1);
				panel.replaceChild(ELEMENT[z1],AREA[z1].blankDiv);
				ELEMENT[z1].style.position = 'static';					
			}
			if (AREA[z2].mouvement == 0)	{ 					//console.log('Remplacement du noeud blank pour z'+z2);
				panel.replaceChild(ELEMENT[z2],AREA[z2].blankDiv);
				ELEMENT[z2].style.position = 'static'; 
			}
		},550);
						
		ELEMENT[z1].style.opacity = ELEMENT[z2].style.opacity = 0.4;	// Opacity tric 
		setTimeout(function(){ELEMENT[z1].style.opacity = 1; ELEMENT[z2].style.opacity = 1;},275);
	}
		
	var autoScroll = new AutoScroll(3,50);
	var clone = new Clone(0.5,0.1);
	
	createElement(list);
	startListener();
}