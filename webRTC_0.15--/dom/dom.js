var mainDOM = function() {
	/* BEGIN */
	var documentEventMouseDown;
	var documentEventInsideBody;
	
	document.body.onmousedown	=	function(e) {		/* BUG pour postTab - mise à true */
		documentEventMouseDown=true; 					/* TRUE laisse les events par défaut du navigateur fonctionner. */
		console.log('mouseDown');	
		if (e.target.tagName == 'INPUT') e.target.focus();
		if (e.target.className == 'imgBoutons') return true;	
		return false; }
	document.body.onmouseup		=	function(e) { documentEventMouseDown=false; 	console.log('mouseUp'); 	 	return false; }
	document.body.onmouseleave	=    	function(e) { documentEventInsideBody=true; 	console.log('out of document');  	return false; }
	document.body.onmouseenter	= 	function(e) { documentEventInsideBody=false;	console.log('inside document');  	return false; }
	
/*** Forme complexe de scrollbar, option LOCKED pour éviter les refresh systématiques - YES. ***/
	var scrollbar = (function() {				
		var clear = function (obj) {		
			console.log('clear Event trigered');
			clearTimeout(obj.scrollingTimeout);
			obj.scrollContinue = 0;
			return false;
		}
		var arrow_scroll = function (obj) {				
			if (obj.scrollContinue != 0) {
				obj.newMainDiv.scrollTop += 6 * obj.scrollContinue / 2;			// obj.conteiner.ratio
				obj.scrollingTimeout = setTimeout(function(){arrow_scroll(obj)}, obj.scrollInverseSpeed);
				obj.scrollInverseSpeed = 10;								// enchainement && vitesse scroll pour un appui long
			}
		}
		var mousedown = function (o, s, obj) {								// event : Scroll on mouse down 
			if (obj.scrollContinue == 0) {
				obj.scrollContinue = s;
				obj.scrollInverseSpeed = 400;								// setFirstTimeout: Attente après 1er appuis sur souris
				arrow_scroll(obj);
			}
		}		
		var MouseWheelHandler = function(e,obj) {
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			obj.newMainDiv.scrollTop+=(delta >0?-20:20);
			//console.log('mouseWheel ScrollTop:'+obj.newMainDiv.scrollTop);
			return false;
		}
		var moveCursor = function(e,obj) {
			var pageY = e.pageY-1;							// pageY=0 doesn't exist. First began at 1(y). [->correction: -1] 
			var H = obj.newMainDiv.offsetTop +  obj.scrollBarPixelSize;
			var T = obj.realPixelHeight - (2 * obj.scrollBarPixelSize);
			var scrollHeight = obj.newMainDiv.scrollHeight;
			
			//console.log('moveCursor scrollTOP:'+((pageY-H)/T)*scrollHeight+' pageY:'+pageY+' H:'+H+' T:'+T+' scrollHeight:'+scrollHeight);
			obj.newMainDiv.scrollTop=((pageY-H)/T)*scrollHeight; 	
		}
		function refresh(obj) {
			obj.ComputedStyle = window.getComputedStyle(obj.conteiner,null).getPropertyValue("height");
			if (obj.ComputedStyle.match(/\d+\.\d/g)) 	obj.realPixelHeight = Math.round(obj.ComputedStyle.match(/\d+\.\d/g)[0]);
			else 							obj.realPixelHeight = obj.ComputedStyle.match(/\d+/g)[0];		
				
			obj.scrollDiv.style.height = obj.newMainDiv.style.height = obj.realPixelHeight+'px';
			
			console.log('computing');
			DisplayScrollbar(obj);
			scrolling(obj);
		}
		var DisplayScrollbar = function (obj) {
			obj.scrollDiv.style.display=(obj.realPixelHeight<obj.newMainDiv.scrollHeight?'block':'none');
			obj.scrollHeight =  obj.realPixelHeight - (2*obj.scrollBarPixelSize);
			if (obj.scrollHeight > 0)   { obj.middleDiv.style.height 	= obj.scrollHeight +'px';		//regenerate middleDIV
								obj.scroller.style.height 	= obj.scrollHeight / obj.newMainDiv.scrollHeight * 100+'%'; }
			else 					obj.middleDiv.style.height = obj.scroller.style.height = '0px';
		}
		var scrolling = function (obj) { 			   
			var ratio = (obj.realPixelHeight - (2 * obj.scrollBarPixelSize)) / obj.newMainDiv.scrollHeight;
			//obj.scroller.style.top = Math.floor((obj.scrollBarPixelSize) + obj.newMainDiv.scrollTop * ratio) + 'px';
			obj.scroller.style.top = ((obj.scrollBarPixelSize) + obj.newMainDiv.scrollTop * ratio) + 'px';
		}
		function createImgElement (src,parent,style) {
			var img = document.createElement('img');
			img.src = src;
			img.className = style;
			img = parent.appendChild(img);
			return img;
		}
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 
		
		function makeScrollbar(ID) {
			console.log("création d'un objet scrollbar pour "+ID);
			var obj=new Object;
			
			obj.conteiner=document.getElementById(ID);
			obj.conteiner.style.overflow = 'hidden';
					
			var cloneDiv=obj.conteiner.cloneNode(true);
			while (obj.conteiner.firstChild) 	obj.conteiner.removeChild(obj.conteiner.firstChild);
			
			obj.scrollDiv = document.createElement('div');

			obj.scrollDiv.className='scrollbar';
			obj.scrollDiv = obj.conteiner.appendChild(obj.scrollDiv);
		
			obj.scrollDiv.style.position='relative';
			obj.scrollDiv.style.display='none';
			
			var arrowUp		= createImgElement('images/icon-arrow-up.png',obj.scrollDiv,'cursorArrow');
			var arrowDown	= createImgElement('images/icon-arrow-down.png',obj.scrollDiv,'cursorArrow');
			
			obj.scrollDiv.lastChild.style.bottom = '0px';
			
			obj.middleDiv = document.createElement('div');			// Création du bloc central entre les deux flêches.
			obj.middleDiv = obj.scrollDiv.appendChild(obj.middleDiv);
			obj.middleDiv.style.position = 'absolute';
			
			obj.newMainDiv = document.createElement('div');
			obj.newMainDiv.className = 'normalScrollbarMainDiv';
			obj.newMainDiv = obj.conteiner.appendChild(obj.newMainDiv);

			while (cloneDiv.firstChild) 	obj.newMainDiv.appendChild(cloneDiv.firstChild);
			
			obj.newMainDiv.style.overflow='hidden';
			obj.newMainDiv.scrollTop = 0;			
		
			obj.scroller	= document.createElement('div');
			obj.scroller.className= 'middle';
			obj.scroller 	= obj.scrollDiv.appendChild(obj.scroller);
			
			/* DETERMINE WIDTH VALUE */
			obj.scrollBarViewWidth = 1.5;											// Initial Ratio 
			obj.scrollBarPixelSize = Math.floor(obj.scrollBarViewWidth*(window.innerWidth/100));	
			console.log('scrollBarPixelSize:'+obj.scrollBarPixelSize);
			
			/* SET WIDTH PROPOTIONS */
			obj.scroller.style.width  = obj.scroller.style.top 
			= obj.middleDiv.style.width = obj.middleDiv.style.top 
			= arrowUp.style.width = arrowUp.style.height 
			= arrowDown.style.width = arrowDown.style.height 
			= obj.scrollDiv.style.width 
			= obj.scrollBarPixelSize+'px';
			/** END PROPOTIONS */
			
			obj.scrollContinue = 0;
			obj.scrollInverseSpeed = 0;
			obj.scrollingTimeout = null;
			
			obj.middleDiv.onmousedown					= 	function(e) { moveCursor(e,obj); return false; }
			obj.middleDiv.onmousemove =  obj.scroller.onmousemove = 	function(e) { if (documentEventMouseDown)moveCursor(e,obj); return false; }
			
			arrowUp.onmousedown 						=   	function(e) { mousedown(this, -1, obj); return false; }
			arrowDown.onmousedown 						= 	function(e) { mousedown(this, 1, obj); return false;  }
			arrowUp.onmouseout 	= arrowUp.onmouseup 		= 	function(e) { clear(obj); return false; }
			arrowDown.onmouseout	= arrowDown.onmouseup		= 	function(e) { clear(obj); return false; }
			obj.newMainDiv.addEventListener(mousewheelevt, function(e) {MouseWheelHandler(e, obj)}, false);
			
			obj.newMainDiv.onscroll = function(e) { scrolling(obj); return false; }
				
			DisplayScrollbar(obj);
					
			refresh(obj);
			window.addEventListener('resize', function(){refresh(obj)}, false);
			
			this.utilize 		= function() { return obj.newMainDiv; }
			this.adjustScrollSize 	= function() { DisplayScrollbar(obj); }
			this.log			= function(msg) {
				obj.newMainDiv.innerHTML+=msg+'<br>';
				DisplayScrollbar(obj);
				obj.newMainDiv.scrollTop+=10000;
			}
		};
		return makeScrollbar;	
	})();

/*** Forme plus simple de scrollbar sans les deux boutons mais plus fûtée aussi. ***/
	var contextscrollbar = (function() {					
		var MouseWheelHandler = function(e,obj) {
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			obj.newMainDiv.scrollTop+=(delta >0?-20:20);
			//console.log('mouseWheel ScrollTop:'+obj.newMainDiv.scrollTop);
			return false;
		}
		var moveCursor = function(e,obj) {
			var pageY = e.pageY-1;						 
			var H = obj.conteiner.offsetTop +  (obj.realPixelHeight*(1-obj.contextRatio)/2); 
			var T = obj.realPixelHeight - (obj.realPixelHeight*(1-obj.contextRatio));
			var scrollHeight = obj.newMainDiv.scrollHeight;
			obj.newMainDiv.scrollTop=((pageY-H)/T)*scrollHeight;
			//console.log('moveCursor scrollTOP:'+((pageY-H)/T)*scrollHeight+' pageY:'+pageY+' H:'+H+' T:'+T+' scrollHeight:'+scrollHeight);
		}
		function refresh(obj) {
			obj.ComputedStyle = window.getComputedStyle(obj.conteiner,null).getPropertyValue("height");
			if (obj.ComputedStyle.match(/\d+\.\d/g)) 	obj.realPixelHeight = Math.round(obj.ComputedStyle.match(/\d+\.\d/g)[0]);
			else 							obj.realPixelHeight = obj.ComputedStyle.match(/\d+/g)[0];		
			obj.newMainDiv.style.height	 = obj.realPixelHeight+'px';
			
			obj.scrollDiv.style.height     = obj.realPixelHeight*obj.contextRatio+'px';
			obj.scrollDiv.style.top        = obj.realPixelHeight*((1-obj.contextRatio)/2)+'px';
			
			DisplayScrollbar(obj);
			scrolling(obj);
		}
		var DisplayScrollbar = function (obj) {
			obj.scrollDiv.style.display=(obj.realPixelHeight<obj.newMainDiv.scrollHeight?'block':'none');
			obj.scrollHeight = obj.realPixelHeight*obj.contextRatio;
			if (obj.scrollHeight > 0)   {
								obj.scroller.style.height 	= obj.realPixelHeight / obj.newMainDiv.scrollHeight * 100+'%'; }
			else 					 obj.scroller.style.height = '0px'; 
		}
		var scrolling = function (obj) { 			   
			var ratio = (obj.contextRatio*obj.realPixelHeight) / obj.newMainDiv.scrollHeight;
			
			//obj.scroller.style.top = Math.floor(0 + obj.newMainDiv.scrollTop * ratio) + 'px';
			obj.scroller.style.top = (0 + obj.newMainDiv.scrollTop * ratio) + 'px';
			
			var math = Math.floor(obj.newMainDiv.scrollTop/obj.newMainDiv.scrollHeight*256);
			obj.scroller.style.backgroundColor='rgb('+math+', 0, '+(255-math)+')';
		}
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 
		
		function makeScrollbar(ID,ratioHeight,ratiowidth) {
			console.log("création d'un objet scrollbar pour "+ID);
			var obj=new Object;
			obj.contextRatio = ratioHeight;
			
			obj.conteiner=document.getElementById(ID);
			obj.conteiner.style.overflow = 'hidden';
					
			var cloneDiv=obj.conteiner.cloneNode(true);
			while (obj.conteiner.firstChild) 	obj.conteiner.removeChild(obj.conteiner.firstChild);
			
			obj.scrollDiv = document.createElement('div');

			obj.scrollDiv.className='contextScrollbar';
			obj.scrollDiv = obj.conteiner.appendChild(obj.scrollDiv);
		
			obj.scrollDiv.style.position='relative';
			obj.scrollDiv.style.display='none';
			
			obj.newMainDiv = document.createElement('div');
			obj.newMainDiv.className = 'contextScrollbarMainDiv';
						
			obj.newMainDiv = obj.conteiner.appendChild(obj.newMainDiv);

			while (cloneDiv.firstChild) 	obj.newMainDiv.appendChild(cloneDiv.firstChild);
			
			obj.newMainDiv.style.overflow='hidden';
			obj.newMainDiv.scrollTop = 0;			
		
			obj.scroller	= document.createElement('div');
			obj.scroller.className= 'contextMiddle';
			obj.scroller 	= obj.scrollDiv.appendChild(obj.scroller);
			
			/* DETERMINE WIDTH VALUE */
			obj.scrollBarViewWidth = ratiowidth;											// Initial Width Ratio 
			obj.scrollBarPixelSize = Math.floor(obj.scrollBarViewWidth*(window.innerWidth/100));	
			console.log('scrollBarPixelSize:'+obj.scrollBarPixelSize);
			
			/* SET WIDTH PROPOTIONS */
			obj.scroller.style.width  = obj.scroller.style.top = obj.scrollDiv.style.width  
			= obj.scrollBarPixelSize+'px';
			/** END PROPOTIONS */
			
			obj.scrollDiv.onmousedown					= 	function(e) { moveCursor(e,obj); return false; }
			obj.scrollDiv.onmousemove =  obj.scroller.onmousemove = 	function(e) { if (documentEventMouseDown)moveCursor(e,obj); return false; }
			
			obj.newMainDiv.addEventListener(mousewheelevt, function(e) {MouseWheelHandler(e, obj)}, false);
			
			obj.newMainDiv.onscroll = function(e) { scrolling(obj); return false; }
				
			DisplayScrollbar(obj);
					
			refresh(obj);
			window.addEventListener('resize', function(){refresh(obj)}, false);
			
			this.utilize 		= function() { return obj.newMainDiv; }
			this.adjustScrollSize 	= function() { DisplayScrollbar(obj); }
			this.refreshWindow	= function() {
				DisplayScrollbar(obj);
				obj.newMainDiv.scrollTop+=10000;
			}
			this.log			= function(msg) {
				obj.newMainDiv.innerHTML+=msg;
				DisplayScrollbar(obj);
				obj.newMainDiv.scrollTop+=10000;
			}
		};
		return makeScrollbar;	
	})();
	
	var mouseFonctions = (function() {			/*** FONCTION CONFIGUREE POUR TOUJOURS RENVOYER LA DIV COURANTE	***/
		var mouseConstructor = function(){
			this.mouse_X = null;
			this.mouse_Y = null;
			this.id = null;
			this.tag = null;
			this.class = null;
			SUPER = this;
			var _isGecko=window.Event?1:0; 	// navigateurs Gecko ou IE -- console.log('_isGecko vaut:'+_isGecko);
	
			var evalMouse = function(e) {
				var element=_isGecko?e.target:event.srcElement;		 //objet sous la souris				
				
				//console.log('targer:'+e.target+' parentNode:'+e.target.parentNode+' id:'+e.target.parentNode.id+' tagname:'+e.target.tagName+ ' reId:'+e.target.parentNode.id+ 'tag:'+e.target.tagName+' secondID:'+e.target.id);
				//SUPER.id = element.id;
				//console.log('superID:'+SUPER.id);
				//Description du bug recontré: Dans le cas d'une balise <p>, <span>, <img> etc... HTML quoi, on doit remonter...
				//... au parent. Dans le cas ou la souris pointe déjà sur une <div>, on ne fait que renvoyer l'id de la div pointée.
				
				if (e.target.tagName != 'DIV')	SUPER.id=element.parentNode.id;
				else		 				SUPER.id=element.id;
				
				SUPER.class	  = e.target.className;
				SUPER.tag	  = e.target.tagName;
				SUPER.mouse_X = e.pageX;
				SUPER.mouse_Y = e.pageY;
				console.log('Xmouse='+SUPER.mouse_X +' Ymouse='+SUPER.mouse_Y+' ID:'+SUPER.id+' tag:'+SUPER.tag+' classe:'+SUPER.class);
			}	
			console.log('activation de la détéction souris');
			document.onmousemove=evalMouse;
		}
		return mouseConstructor;
	})();
	
	var manageScroll = function() {			/*** FONCTION CONFIGUREE POUR EXCLURE DES DIVS A NE PAS SCROLLER. ***/
		console.log('module personalised scrolling activé :'+mouse.id);
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel" 
		
		var scroll = function (direction) {
			document.getElementById(mouse.id).scrollTop += (direction*20); //le défilement se fait par 10px
			//setTimeout('scroll('+to_scroll+', '+true+')', 10);
		}
		var MouseWheelHandler = function(e) {
			// INTEROGATION de mouse.id à savoir si l'on a envie qu'elle pointe sur une div dont on veut le scroll.
			if (true) return;
			
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			if (delta > 0) 	scroll(-1);
			else			scroll(+1); 
			return false;
		}
		document.addEventListener(mousewheelevt, MouseWheelHandler, false);
	}
	
	var toolbar = function() {
		var toolbar = document.getElementById("toolbar");		// DOM générale - var. globale.
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
				alert("C'est un gros Lolo qui fait des petits avec un gros Thibaud.");
			};
		})();
		/***  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ***/
		//var toolbarWidthLimit=toolbar.offsetWidth; 						// GESTION DE L'ECRAN ET DES EVENTS SOURIS
	}
	
/* Gestion des messages de la pachy box. ATTENTION utilise div chatTab */
	this.displayMsg = (function () {
		var soundAnimal = document.createElement("Audio");
		return function(user,message) {
			if (message) {
				var msg;
				switch (message) 		{
					case '/kick':
						var animal = new Array('elephant1','elephant2','elephant3','elephant4','elephant5','elephant6','vache1','vache2','cochon1');
						function find_animal() {return "animal/" + animal[Math.floor(Math.random() * 9)] + ".ogg";}
						
						msg="<span class='commentChatbox'>Au loin, l'on entend crier un animal</span><br>";
						soundAnimal.src = find_animal();
						soundAnimal.play();
						break;
					case '/roll':
					/*	var nbr = Math.floor(Math.random() * 7);
						if (nbr)	msg="<span class='commentChatbox'>"+user+" lance les dés et obtient "+nbr+"</span><br>";
						else		msg="<span class='commentChatbox'>"+user+" lance les dés et obtient "+nbr+" ! Mouhaha !</span><br>"; */
						msg="<span class='commentChatbox'>"+user+" lance les dés et obtient 0! Mouhaha !</span><br>";
						break;		
					default:
						msg="<span class='userSpeakChatbox'>"+user+':</span>'+message+'<br>';
						break;	}
				//chatTab.utilize().innerHTML+=msg; chatTab.adjustScrollSize(); chatTab.utilize().scrollTop+=10000;
				chatTab.log(msg);
			}
		}
	})();
	this.sendMsg = (function () {
		var user = 'ME';
		var sendBox = document.getElementById('sendBox');
		return function() {
			var message = sendBox.value;
			if (message) {	
			// Fonction envoyer message à rediriger ici vers JS profond.
				RTC.sendMsgToAll(JSON.stringify({
					rtcDataType: 'CHAT',
					msg 		: message
							}));
				this.displayMsg(user,message);
				sendBox.value='';
			}
			sendBox.focus();	
		}
	})();
	
/* Gestion de l'affichage de la liste des fichiers: ATTENTION utilise div fileTab */
	var fileObject = function(name,location) {		
		var deleteEntry 	 	= null;
		var statusEntry   	= null;
		var nameEntry     	= null;

		var SUPER = this;
		var createElements = function () {	
			var fileA 		= document.createElement('a');
			var fileP	 	= document.createElement('p');;	
			
			fileA.className 		= 'sharingButton';
			fileP.innerHTML  		= name;
			
			if (location) {
				var fileDiv		= document.createElement('div')
				
				fileA.innerHTML 		= 'LOCAL';
				fileA.href			= URL.createObjectURL(location);
				fileA.download  		= '';
			
				fileDiv.className		= 'deleteFile';
				fileDiv.innerHTML	 	= 'DEL'
				fileDiv.onclick   	= function(e) { SUPER.delete(); return false; }	
				
				deleteEntry 	= fileTab.utilize().appendChild(fileDiv);
			}
			else {
				fileA.innerHTML 		= 'DOWNLOAD';
			}
			
			statusEntry   	= fileTab.utilize().appendChild(fileA);
			nameEntry     	= fileTab.utilize().appendChild(fileP);
		}
			
		createElements();
		
		this.fullFileReceived = function(location) {
			statusEntry.innerHTML 		= 'LOCAL';
			statusEntry.href			= URL.createObjectURL(location);
			statusEntry.download  		= '';
			
			deleteEntry  = statusEntry.parentNode.insertBefore(document.createElement('div'), statusEntry);
					
			deleteEntry.className		= 'deleteFile';
			deleteEntry.innerHTML	 	= 'DEL'
			deleteEntry.onclick   		= function(e) { SUPER.delete(); return false; }		
		}
			
		this.delete = function() {
			nameEntry.remove();
			statusEntry.remove();
			deleteEntry.remove();
			for (key in this) { this[key]=null; }
			fileTab.refreshWindow();
		}
		fileTab.refreshWindow();
	}
	var fileList = new Array();
	
	this.displayFile = function(name,location) 
	{	
		fileList[fileList.length] = new fileObject(name,location);
		
		/*fileList[fileList.length] = new fileObject(name);
		fileList[(fileList.length-1)].fullFileReceived(location);
		fileList[fileList.length] = new fileObject(name);*/
	}
	
	var SUPER=this;
	document.getElementById('file-upload').onchange = function() 
	{	
		SUPER.console.log(this.files.length+' files selected. name:'+this.files[0].name);
		SUPER.displayFile(this.files[0].name, this.files[0]);
		
		if (RTC) {
			RTC.sendMetaDataToAll(this.files[0]);
		}
		else {
			SUPER.console.log('RTC DOWN: unable to send meta-data');
		}
	}
	
	//var mouse = new mouseFonctions();
	//var Z = new manageScroll();
	
	var toolbar	      = new toolbar();
	
	this.console	= new scrollbar('consoleTab');
	
	var chatTab 	= new contextscrollbar('chatTab',0.8,1.6);
	var fileTab 	= new contextscrollbar('files',0.8,1.2);
}