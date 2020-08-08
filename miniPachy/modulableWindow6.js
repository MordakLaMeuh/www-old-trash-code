'use strict';
//OBJECT NAME: Modular Window (abrev. MW)
//OBJECT GOAL: DOM UPGRADE with many resizable/modulable Windows, like a OS desktop. achivement: 40%;	
var MW_iFrame_Mouse_Protection;
var MW = (function() {
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

	function switch_Css_init(class_Name,element,value,value2) {
		var cssRules;
		var custom_Function = function() {};
		for (var S = 0; S < document.styleSheets.length; S++){
			try {
				document.styleSheets[S].insertRule(class_Name+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);
				console.log('MW_change_CSS: solution I avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
				custom_Function = function(invv) { document.styleSheets[S].insertRule(class_Name+' { '+element+': '+((invv)?value2:value)+'; }',document.styleSheets[S][cssRules].length); }
				return custom_Function;	
			} 
			catch(err) {
				try {
					document.styleSheets[S].addRule(class_Name,element+': '+value+';');
					console.log('MW_change_CSS: solution II avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
					custom_Function = function(invv) { document.styleSheets[S].addRule(class_Name,element+': '+((invv)?value2:value)+';'); }
					return custom_Function;	
				}
				catch(err) {
					console.log('MW_change_CSS: invalid combinaison !');
					try {
						if (document.styleSheets[S]['rules']) {
							cssRules = 'rules';
						} 
						else if (document.styleSheets[S]['cssRules']) {
							cssRules = 'cssRules';
						} 
						else 
						{
							// Navigateur inconnu ?!?
						}
						for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
							if (document.styleSheets[S][cssRules][R].selectorText == class_Name) {
								if(document.styleSheets[S][cssRules][R].style[element]){
									document.styleSheets[S][cssRules][R].style[element] = value;
									custom_Function = function(invv) { document.styleSheets[S][cssRules][R].style[element] = ((invv)?value2:value); }
									return custom_Function;	
					}}}} 
					catch (err){}
		}}}
		return custom_Function;	
	}
	MW_iFrame_Mouse_Protection = switch_Css_init('.MW_Iframe_Mouse_Box','display','none','block');

	var zIndex_Min = 1000000;	// Utilisé par la méchanique rudimentaire de mise en background des fenetres. 	cf. put_Backward()
	var zIndex_Max = 1000000;	// Utilisé par la méchanique rudimentaire de mise en avant des fenetres. 		cf. put_Forward()

	var resize_Event = false;
	var resize_Timer = 100;
	var resize_All_Windows = function() {
		console.log('MW: Resize All Windows -> resizeEvent:'+resize_Event);
		resize_Event = false;
		
		var i = 0;
		for (i; i<objects.length; i++) objects[i].resize();
	}
	window.onresize = function() {
			if (resize_Event == false) {
				resize_Event = true;
				setTimeout(resize_All_Windows,resize_Timer);
	}}
	
	var objects = new Array();
	var header_Height = 2.5;					// predefined. VH
	var border_Size   = 0.2;					// predefined. VH
	var mouse_Border  = 1.5; 					// predefined. VH
	var opacity		= 0.63;					// predefined. 0 to 1

	var Modulable_Window_Constructor = function(id,title_Window,positionX,positionY,sizeX,sizeY,border_Color,body_Color,opts) {

		console.log(JSON.stringify(opts));
		objects.push(this);
	
        	this.id = id;		
        				
		this.opacity 			= opacity;				
		this.border_Size			= border_Size;				
		this.header_Height 		= header_Height;				
		this.window_Mouse_Border  	= mouse_Border;
		this.border_Color			= border_Color;			// TODO PATCH pour la couleur dans headerLess
		

		(this.main = document.getElementById(id))?this.assign():this.create();
		this.set_Property(title_Window,positionX,positionY,sizeX,sizeY,border_Color,body_Color);
		
		var obj = this;

		zIndex_Max = this.put_Forward(zIndex_Max);

	// Fonction de selection globale des fenetres: Elle est déclenchée pour TOUS les events précis définis ci-dessous, return FALSE n'est donc pas nécessaire pour ces sous-events. (ici false est déjà retourné)
		this.main.onmousedown = function(e) {
			console.log('MW main.onmousedown event: selection globale de la fenetre -> Augmentation du Zindex pour toute la fenetre. target '+((e.target.id)?'ID='+e.target.id+' ':'')+((e.target.tagName)?'TAG='+e.target.tagName+' ':'')+((e.target.className)?'CLASS='+e.target.className+'':''));
			MW_iFrame_Mouse_Protection(true);
			if (obj.backroom) {					// TODO Patch conflit putForward car this.main.onmouse down est aussi activé quand la souris pointe sur minimize.
				obj.backroom = false;
				zIndex_Min = obj.go_To_Backroom(zIndex_Min);
			}	
			else 	{ zIndex_Max = obj.put_Forward(zIndex_Max); }
			if ((e.target.tagName == 'INPUT') || (e.target.id == 'chatTab'))	return true;			// exception pour le chat (mettre en place une liste)
			else											return false;			// return false bloque les events habituelles du navigateur.
		}
		
		this.set_Window_Base_Selectors()												// Gestions des différents mouvements et redimentionnements de la fenetre provoqués par la souris.
		
	// gestion des clics de la souris sur les diverses icones:
		this.hide_Header.onmousedown = function() {
			console.log('MW: Déclenchement du header_MaskSystem:');
			obj.toggle_Header(header_Height,border_Size);
		}
		this.close.onmousedown = function() {
			console.log('MW: Close');
			obj.on_Close = true;
			obj.transition_Token++;
			obj.main.style.transitionProperty = 'opacity';
			obj.main.style.transitionDuration = '0.4s';
			obj.main.style.opacity='0';
			obj.video && obj.video.pause();
		}
		var full_Opacity = false;
		var toggle_Opacity = function() { obj.body.style.opacity = (full_Opacity = !full_Opacity)?1:obj.opacity; }
		this.opacity_Button.onmousedown = function() {
			toggle_Opacity();
		}
		// Gestion des deux boutons, MAXIMIZE et MINIMIZE: (important: Afin de garantir un ajustement classique des fenetres, minimize passe à false lors d'un clic sur footer, leftDiv ou rightDiv cf. plus haut.)		
		this.minimal_Width = (obj.title.offsetWidth + obj.header.getElementsByTagName('svg').length*(obj.header_Height/100*window.innerHeight)) + 40; // taille minimale d'une fenetre exprimée en pixels.
		this.maximize_State  = false;
		this.minimize_State = false;
		
		this.maximize.onmousedown = function() { 
			obj.toggle_FullScreen(); 
		}
		
		this.minimize.onmousedown = function() { 
			obj.toggle_Minimize(); 
		}
		
		this.last_Top, this.last_Left, this.last_Height, this.last_Width = null;
		this.put_Backward.onmousedown = function() {
			console.log('MW: Minimize');
			obj.backroom = true;
		}
		this.transition_Token = 0;	// Puisque lorsque plusieurs transitions apparaissent en même temps, on veut limiter le nombre de calculs de redimentionnement, on ne donne qu'un seul jeton pour limiter ca !					
		obj.main.addEventListener("transitionend",function(e){obj.end_Of_Transition(e);},false);
		
		this.active_Scrolling = function() {
			this.body.addEventListener(mousewheelevt, function(e) {
				var e = window.event || e; // old IE support
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
				obj.body.scrollTop -= delta*20;
				console.log(obj.id);
			}, false);
		}
	// gestion des options:
		opts.opacity && toggle_Opacity();
		opts.fullscreen && obj.toggle_FullScreen();
		opts.noheader && obj.toggle_Header(header_Height,border_Size);
		
		switch (opts.type) {
			case 'video':
				this.single_Video(opts.url, opts.ratio);
				break;
			case 'image':
				this.single_Image(opts.url, opts.ratio);
				break;
			case 'rawTxt':
				this.raw_Text();
				break;
			case 'customContent':
				this.set_Custom_Content();
				break;
			case 'iframe':
				this.iframe(opts.url);
				break;
			default:
				break;
		}
	}
	return Modulable_Window_Constructor;
})();
// MW -> Prototypes de base:
MW.prototype.utilize = function() {				// (EN)utilize <--> (FR)exploiter	cf. To utilize a woman (c. Idiocraty)
	return this.body;
}

MW.prototype.change_Color	= function() {}			// TODO Fonction pouvant trouver son utilité.
MW.prototype.change_Opacity	= function() {}		    	// TODO Fonction pouvant trouver son utilisé.

MW.prototype.end_Of_Transition = function(e) {						
	if (this.transition_Token > 0) {
		console.log("MW end_Of_Transition(e) private function: consume one token, Detected transition -> "+e.propertyName);
		this.transition_Token--;
		this.main.style.transitionProperty = 'none';
		if (this.on_Close) this.main.style.display = 'none';							// TODO Secure close
		if (this.video) {
			this.resize_Video();
			this.video.style.display='block';
		}
		if (this.img) {
		 	this.resize_Image();
			this.img.style.display='block';
		}
		if (this.custom_Content) {
			this.body.style.fontSize = (this.conteiner.offsetHeight/20)+'px';				// TODO Ajout expérimental.
		}
	}
	else console.log('MW end_Of_Transition(e) private function: No one token.');
}
		
// Fonctions de redimentionnement évennementiel des fenetres.
MW.prototype.put_Forward = function(zIndex_Max) {
	zIndex_Max+=4;
	this.main.style.zIndex = zIndex_Max;
	this.mouse_Left_Div.style.zIndex = this.mouse_Right_Div.style.zIndex = zIndex_Max+1;
	this.bottom_Left_Div.style.zIndex = this.bottom_Right_Div.style.zIndex = zIndex_Max+2;
	this.header.style.zIndex = zIndex_Max+3;
return zIndex_Max;
}
MW.prototype.go_To_Backroom = function(zIndex_Min) {
	zIndex_Min-=4;
	this.main.style.zIndex = zIndex_Min;
	this.mouse_Left_Div.style.zIndex = this.mouse_Right_Div.style.zIndex = zIndex_Min+1;
	this.bottom_Left_Div.style.zIndex = this.bottom_Right_Div.style.zIndex = zIndex_Min+2;
	this.header.style.zIndex = zIndex_Min+3;	
return zIndex_Min;
}
		
MW.prototype.toggle_Header = function(header_Height,border_Size) {
	if (this.video) 	this.video.style.display='none';
	if (this.img)	this.img.style.display='none';
	this.transition_Token++;
	this.main.style.transitionProperty = 'width,height,top,left';
	this.main.style.transitionDuration = '0.1s';
	if (this.header_Height) {
		this.header_Mask.style.height = '0px';
		
		this.header.classList.remove('MW_Visible_Header');
		this.header.classList.add('MW_Hidden_Header');
		this.header.style.backgroundColor='transparent';
		
		this.conteiner.style.height = ((this.conteiner.offsetHeight*100/window.innerHeight) + this.header_Height)+'vh';
		this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = '0px';
		this.header_Height = this.border_Size = 0;
	}
	else {
		this.header_Height = header_Height;	
		this.border_Size 	 = border_Size;
							
		this.header_Mask.style.height = this.header_Height+'vh';
		
		this.header.classList.remove('MW_Hidden_Header');
		this.header.classList.add('MW_Visible_Header');
		this.header.style.backgroundColor = this.border_Color;						// TODO PAtCH
		
		this.conteiner.style.height = ((this.conteiner.offsetHeight*100/window.innerHeight) - this.header_Height)+'vh';
		this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = this.border_Size+'vh';
	}
}
MW.prototype.toggle_Minimize = function() {
	console.log('MW: Minimize');
	this.transition_Token++;
	this.main.style.transitionProperty = 'width,height,top,left';
	this.main.style.transitionDuration = '0.1s';
	if (!this.minimize_State) {
		if (!this.maximize_State) {
			this.last_Top = this.main.offsetTop/window.innerHeight*100;
			this.last_Left = this.main.offsetLeft/window.innerWidth*100;
			this.last_Height = this.main.offsetHeight/window.innerHeight*100;
			this.last_Width = this.main.offsetWidth/window.innerWidth*100;
			this.main.style.height = (this.header_Height + this.border_Size)+'vh';
			this.conteiner.style.height = '0px';
			this.mouse_Bottom_Div.style.display = this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'none'; // enter minimize - Désactictivation des champs de redimentionnement.

			// Routines de redimentionnement minimal de la taille horizontale de la fenetre:
			var local_Minimal_Width = this.minimal_Width/window.innerWidth*100;
			this.main.style.width = local_Minimal_Width +'vw';
			this.main.style.left = (this.last_Left + this.last_Width - local_Minimal_Width)+'vw';
		}
		else {
			this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;					// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
			
			this.mouse_Right_Div.style.right = (this.window_Mouse_Border-this.border_Size)+'vh';						// TODO Patch
		
			this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = this.border_Size+'vh';
			this.conteiner.style.height = (100 - this.header_Height - this.border_Size)+'vh';
			
			this.maximize_State = false;
		}
	}
	else {
		this.main.style.height = this.last_Height+'vh';
		this.main.style.width = this.last_Width+'vw';
		this.main.style.top = this.last_Top+'vh';
		this.main.style.left = this.last_Left+'vw';
		this.conteiner.style.height = (this.last_Height - this.header_Height  - this.border_Size)+'vh';
		this.mouse_Bottom_Div.style.display = this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'block';	// quit minimize: Réactivcation des champs de redimentionnement souris.
	}
	this.minimize_State = !this.minimize_State;
}

MW.prototype.toggle_FullScreen = function() {
	console.log('MW: Maximize');
	if (this.video) 	this.video.style.display='none';
	if (this.img)	this.img.style.display='none';
	this.transition_Token++;
	this.main.style.transitionProperty = 'width,height,top,left';
	this.main.style.transitionDuration = '0.1s';

	if (!this.maximize_State) {
		if (!this.minimize_State) {
			this.last_Top = this.main.offsetTop/window.innerHeight*100;
			this.last_Left = this.main.offsetLeft/window.innerWidth*100;
			this.last_Height = this.main.offsetHeight/window.innerHeight*100;
			this.last_Width = this.main.offsetWidth/window.innerWidth*100;
		}
		else {
			this.minimize_State = false;
			this.mouse_Bottom_Div.style.display = this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'block'; // TODO quit minimize: Réactivation des champs de redimentionnement souris.
		}
		this.switch_To_Fullscreen();
	}
	else  this.quit_Full_screen();

	this.maximize_State = !this.maximize_State;
}

MW.prototype.switch_To_Fullscreen = function() {		
	this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE_INVERSE").innerHTML;		// TODO Patch: il y a mieux que innerHTML pour changer d'icone.

	this.main.style.height = '100vh';
	this.main.style.width = '100vw';
	this.main.style.top = this.main.style.left ='0px';

	this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = '0px';
	
	this.conteiner.style.height=(100 - this.header_Height)+'vh';

	this.mouse_Right_Div.style.right = this.window_Mouse_Border+'vh';						// TODO patch mouse_Right_Div (puisqu'elle est relative à une div en float left qui perd son width lors de maximize)
}
MW.prototype.quit_Full_screen = function () {				
	this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;			// TODO Patch: il y a mieux que innerHTML pour changer d'icone.

	this.main.style.height = this.last_Height+'vh';
	this.main.style.width = this.last_Width+'vw';
	this.main.style.top = this.last_Top+'vh';
	this.main.style.left = this.last_Left+'vw';

	this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = this.border_Size+'vh';
	
	this.conteiner.style.height=(this.last_Height - this.header_Height - this.border_Size)+'vh';

	this.mouse_Right_Div.style.right = (this.window_Mouse_Border-this.border_Size)+'vh';		// TODO patch mouse_Right_Div
}
		
MW.prototype.resize = function() {
	this.minimal_Width = (this.title.offsetWidth + this.header.getElementsByTagName('svg').length*(this.header_Height/100*window.innerHeight)) + 40;	// TODO patch, remise à jour de minimal width lorsque résol. change
	this.video && this.resize_Video();
	this.img && this.resize_Image();
	this.custom_Content && (this.body.style.fontSize=(this.conteiner.offsetHeight/20)+'px');		// TODO Ajout expérimental.
}

//  Prototypes de création primordiale des fenêtres:

MW.prototype.assign = function() {
	console.log('MW: Assign existed window -> '+this.id);
																	// TODO header_MaskSystem -> this.header_Mask = this.main.getElementsByClassName('MWheader_Mask')[0]
	this.header_Mask = this.main.getElementsByClassName("MWHeaderMask")[0];
		this.header = this.header_Mask.getElementsByClassName("MWHeader")[0];
		
			this.top_Space = this.header.getElementsByClassName('MWTitle')[0];
		
			this.hide_Header 		= document.getElementById("MW_SVG_HEADERLESS").cloneNode(true);
			this.opacity_Button 	= document.getElementById("MW_SVG_OPACITY").cloneNode(true);
			this.close 			= document.getElementById("MW_SVG_CLOSE").cloneNode(true);
			this.maximize 		= document.getElementById("MW_SVG_MAXIMIZE").cloneNode(true);
			this.minimize 		= document.getElementById("MW_SVG_MINIMIZE").cloneNode(true);
			this.put_Backward 	= document.getElementById("MW_SVG_BACKROOM").cloneNode(true);		
					
			this.hide_Header.classList.remove('MW_Svg_Hidden');
			this.opacity_Button.classList.remove('MW_Svg_Hidden');
			this.close.classList.remove('MW_Svg_Hidden');
			this.maximize.classList.remove('MW_Svg_Hidden');
			this.minimize.classList.remove('MW_Svg_Hidden');
			this.put_Backward.classList.remove('MW_Svg_Hidden');
			
			this.header.insertBefore(this.close, this.top_Space);
			this.header.insertBefore(this.minimize, this.top_Space);
			this.header.insertBefore(this.maximize, this.top_Space);
			this.header.insertBefore(this.put_Backward, this.top_Space);
			this.header.insertBefore(this.opacity_Button, this.top_Space);
			this.header.insertBefore(this.hide_Header, this.top_Space);
		
	this.conteiner = this.main.getElementsByClassName("MWConteiner")[0];
		this.leftDiv = this.conteiner.getElementsByClassName("MWLeft")[0];
			this.mouse_Left_Div = this.leftDiv.getElementsByClassName("MWMouseSideDiv")[0];
		this.rightDiv = this.conteiner.getElementsByClassName("MWRight")[0];
			this.mouse_Right_Div = this.rightDiv.getElementsByClassName("MWMouseSideDiv")[0];
		this.body = this.conteiner.getElementsByClassName("MWBody")[0];

	this.footer = this.main.getElementsByClassName("MWFooter")[0];
		this.bottom_Div = this.footer.getElementsByClassName("MWBottom")[0];
		this.mouse_Bottom_Div = this.footer.getElementsByClassName("MWMouseBottomDiv")[0];
		this.bottom_Left_Div = this.footer.getElementsByClassName("MWLeftBottom")[0];
		this.bottom_Right_Div = this.footer.getElementsByClassName("MWRightBottom")[0];
}
MW.prototype.create = function() {
	console.log('MW: Create new window -> '+this.id);

	this.main = document.createElement('div');
	this.main.id = this.id;
	this.main.className = 'MW';
	document.getElementsByTagName('body')[0].appendChild(this.main);
	
	this.header_Mask = document.createElement('div');
	this.header_Mask.className = 'MWHeaderMask';
	this.main.appendChild(this.header_Mask);
		this.header = document.createElement('div');
		this.header.className = 'MWHeader MW_Visible_Header';
		this.header_Mask.appendChild(this.header);								
			this.hide_Header 		= document.getElementById("MW_SVG_HEADERLESS").cloneNode(true);
			this.opacity_Button 	= document.getElementById("MW_SVG_OPACITY").cloneNode(true);
			this.close 			= document.getElementById("MW_SVG_CLOSE").cloneNode(true);
			this.maximize 		= document.getElementById("MW_SVG_MAXIMIZE").cloneNode(true);
			this.minimize 		= document.getElementById("MW_SVG_MINIMIZE").cloneNode(true);
			this.put_Backward 	= document.getElementById("MW_SVG_BACKROOM").cloneNode(true);		
					
			this.hide_Header.classList.remove('MW_Svg_Hidden');
			this.opacity_Button.classList.remove('MW_Svg_Hidden');
			this.close.classList.remove('MW_Svg_Hidden');
			this.maximize.classList.remove('MW_Svg_Hidden');
			this.minimize.classList.remove('MW_Svg_Hidden');
			this.put_Backward.classList.remove('MW_Svg_Hidden');
			
			this.top_Space = document.createElement('div');	
			this.top_Space.className = 'MWTitle';
			
			this.header.appendChild(this.close);
			this.header.appendChild(this.minimize);
			this.header.appendChild(this.maximize);
			this.header.appendChild(this.put_Backward);
			this.header.appendChild(this.opacity_Button);
			this.header.appendChild(this.hide_Header);
			this.header.appendChild(this.top_Space);

	this.conteiner = document.createElement('div');
	this.conteiner.className = 'MWConteiner';
	this.main.appendChild(this.conteiner);
		this.leftDiv = document.createElement('div');
			this.mouse_Left_Div = document.createElement('div');
			this.mouse_Left_Div.className = 'MWMouseSideDiv';
		this.rightDiv = document.createElement('div');
			this.mouse_Right_Div = document.createElement('div');
			this.mouse_Right_Div.className = 'MWMouseSideDiv';
		this.body = document.createElement('div');
		this.leftDiv.className = 'MWLeft MWSideDiv';
		this.rightDiv.className = 'MWRight MWSideDiv';
		this.body.className = 'MWBody';
		this.conteiner.appendChild(this.leftDiv);
			this.leftDiv.appendChild(this.mouse_Left_Div);
		this.conteiner.appendChild(this.rightDiv);
			this.rightDiv.appendChild(this.mouse_Right_Div);
		this.conteiner.appendChild(this.body);

	this.footer = document.createElement('div');
	this.footer.className = 'MWFooter';
	this.main.appendChild(this.footer);
		this.bottom_Left_Div = document.createElement('div');
		this.bottom_Right_Div = document.createElement('div');
		this.bottom_Div = document.createElement('div');
		this.mouse_Bottom_Div = document.createElement('div');
		this.bottom_Left_Div.className='MWLeftBottom MWMouseSideBottomDiv';
		this.bottom_Right_Div.className='MWRightBottom MWMouseSideBottomDiv';
		this.bottom_Div.className='MWBottom';
		this.mouse_Bottom_Div.className='MWMouseBottomDiv';
		this.footer.appendChild(this.bottom_Div);
		this.footer.appendChild(this.mouse_Bottom_Div);
		this.footer.appendChild(this.bottom_Left_Div);
		this.footer.appendChild(this.bottom_Right_Div);
}
MW.prototype.set_Property = function(title_Window,positionX,positionY,sizeX,sizeY,border_Color,body_Color)
{
	this.main.style.left = positionX+'vw';
	this.main.style.top = positionY+'vh';
	this.main.style.width = sizeX+'vw';
	this.main.style.height = sizeY+'vh';

	this.header_Mask.style.height = this.header.style.height = this.header_Height+'vh';
	
	this.title = document.createElement('span');
	this.top_Space.appendChild(this.title);

	this.title.appendChild(document.createTextNode(title_Window));

	this.conteiner.style.height = (sizeY - this.header_Height - this.border_Size)+'vh';
	
	this.body.style.backgroundColor = body_Color;
	this.body.style.opacity	= this.opacity;

	this.header.style.backgroundColor = this.bottom_Div.style.backgroundColor = this.leftDiv.style.backgroundColor = this.rightDiv.style.backgroundColor = border_Color;
	
	this.footer.style.height = this.leftDiv.style.width = this.rightDiv.style.width = this.border_Size+'vh';

	this.bottom_Left_Div.style.width = this.bottom_Right_Div.style.width = this.bottom_Left_Div.style.height = this.bottom_Right_Div.style.height = (2*this.window_Mouse_Border)+'vh';
	this.bottom_Left_Div.style.bottom = this.bottom_Right_Div.style.bottom = (3*this.window_Mouse_Border)+'vh';

	this.mouse_Right_Div.style.right = (this.window_Mouse_Border-this.border_Size)+'vh';
	
	this.mouse_Right_Div.style.width = this.mouse_Left_Div.style.width = this.window_Mouse_Border+'vh';

	this.mouse_Bottom_Div.style.height = this.mouse_Bottom_Div.style.bottom = this.window_Mouse_Border+'vh';
}

MW.prototype.set_Window_Base_Selectors = function() {
	var obj = this;

	this.diffX = this.diffY = this.temp = null;
	this.top_Space.onmousedown = function(e) {
		obj.move_Begin(e);
		mouse_Move_Function = function(e) {
			obj.move_Current(e);
		}
		mouse_Up_Function = function() {
			obj.move_End();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
	this.mouse_Bottom_Div.onmousedown = function(e) {
		obj.bottom_Resize_Begin(e);
		mouse_Move_Function = function(e) {
			obj.bottom_Resize_Current(e);
			if (obj.video) obj.resize_Video();
			if (obj.img)   obj.resize_Image();
		}
		mouse_Up_Function = function() {
			obj.bottom_Resize_End();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
	this.mouse_Left_Div.onmousedown = function(e) {
		if (obj.minimize_State) { console.log('MW: leftDiv mouseDown event -> Disable Minimize'); obj.minimize_State = false; }
		console.log(obj.mouse_Left_Div);
		obj.left_Resize_Begin(e);
		mouse_Move_Function = function(e) {
			obj.left_Resize_Current(e);
			if (obj.video) obj.resize_Video();
			if (obj.img)   obj.resize_Image();
		}
		mouse_Up_Function = function() {
			obj.leftResizeEnd();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
	this.mouse_Right_Div.onmousedown = function(e) {
		if (obj.minimize_State) { console.log('MW: leftDiv mouseDown event -> Disable Minimize'); obj.minimize_State = false; }
		obj.right_Resize_Begin(e);
		mouse_Move_Function = function(e) {
			obj.rightResizeCurrent(e);
			if (obj.video) obj.resize_Video();
			if (obj.img)   obj.resize_Image();
		}
		mouse_Up_Function = function() {
			obj.right_Resize_End();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
	this.bottom_Left_Div.onmousedown = function(e) {
		obj.bottom_Resize_Begin(e);
		obj.left_Resize_Begin(e);
		mouse_Move_Function = function(e) {
			obj.bottom_Resize_Current(e);
			obj.left_Resize_Current(e);
			if (obj.video) 	obj.resize_Video();
			if (obj.img)	obj.resize_Image();
		}
		mouse_Up_Function = function() {
			obj.bottom_Resize_End();
			obj.leftResizeEnd();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
	this.bottom_Right_Div.onmousedown = function(e) {
		obj.bottom_Resize_Begin(e);
		obj.right_Resize_Begin(e);
		mouse_Move_Function = function(e) {
			obj.bottom_Resize_Current(e);
			obj.rightResizeCurrent(e);
			if (obj.video) obj.resize_Video();
			if (obj.img)   obj.resize_Image();
		}
		mouse_Up_Function = function() {
			obj.bottom_Resize_End();
			obj.right_Resize_End();
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
}
// Ensemble de prototypes permettant le redimentionnement et le repositionnement des fenetres selon l'utilisation faite de la souris:

MW.prototype.move_Begin = function(e) {
	console.log('MW: start moving');
	this.diffX = e.pageX - this.main.offsetLeft;
	this.diffY = e.pageY - this.main.offsetTop;
}
MW.prototype.move_Current = function(e) {
	var new_Top 	= -this.diffY + e.pageY;
	var new_Left = -this.diffX + e.pageX;
	if (new_Top < 0) new_Top   = 0;
	if (new_Left < 0) new_Left = 0;
	if (new_Top > (window.innerHeight - this.main.offsetHeight)) new_Top = (window.innerHeight - this.main.offsetHeight);
	if (new_Left > (window.innerWidth  - this.main.offsetWidth))  new_Left = (window.innerWidth - this.main.offsetWidth);
	this.main.style.top = new_Top+"px";
	this.main.style.left = new_Left+"px";
}
MW.prototype.move_End = function() {
	console.log("MW: stop moving");
      this.main.style.top = (this.main.offsetTop/window.innerHeight*100)+"vh";	// Conversion finale en VH et VW, BUG conversion overflow barre de scroll actives dans certaines résolutions
      this.main.style.left = (this.main.offsetLeft/window.innerWidth*100)+"vw";
}

MW.prototype.bottom_Resize_Begin = function(e) {
	console.log("MW: start resizing bottom Tab");
	this.diffY = e.pageY - this.main.offsetHeight;
}
MW.prototype.bottom_Resize_Current = function(e) {
	var new_Height = -this.diffY + e.pageY;
	if (new_Height < (this.header.offsetHeight + 100)) 	new_Height = this.header.offsetHeight + 100;
	if ((new_Height + this.main.offsetTop) > window.innerHeight) new_Height = window.innerHeight - this.main.offsetTop;
	this.main.style.height = new_Height+"px";
	// TODO UPGRADE: Afin d'integrer au mieux la fonction de disparition du titre/header, permis par un jeu de mise à 0 de header_Height, l'ancienne capture de la hauteur du header dans l'équation est remplacée
	// par une expression de hauteur relative à header_Height, ce dernier étant exprimé en VH, une conversion express en pixel est nécessaire -> (this.header_Height/100*window.innerHeight)
	// berfore: this.conteiner.style.height = (new_Height-this.header.offsetHeight-this.footer.offsetHeight)+"px";
	this.conteiner.style.height = (new_Height-(this.header_Height/100*window.innerHeight)-this.footer.offsetHeight)+"px";

	if (this.custom_Content) this.body.style.fontSize = (new_Height/20)+'px';				// TODO Ajout expérimental pour custom_Content et la taille des polices relatives VH/EM.
}
MW.prototype.bottom_Resize_End = function() {
	console.log("MW: stop resizing bottom");
	this.main.style.height 		= (this.main.offsetHeight/window.innerHeight*100)+"vh";
	this.conteiner.style.height 	= (this.conteiner.offsetHeight/window.innerHeight*100)+"vh";
}

MW.prototype.left_Resize_Begin = function(e) {
	console.log("MW: start resizing left Tab");
	this.diffX = e.pageX - this.main.offsetLeft;
	this.temp = this.main.offsetLeft + this.main.offsetWidth;
}
MW.prototype.left_Resize_Current = function(e) {
	var new_Left = -this.diffX + e.pageX;
	if (new_Left < 0) new_Left = 0;
	if (new_Left > (this.temp - this.minimal_Width)) 	new_Left = this.temp - this.minimal_Width;
	this.main.style.left = new_Left+"px";
	this.main.style.width = (this.temp-this.main.offsetLeft)+"px";
}
MW.prototype.leftResizeEnd = function() {
	console.log("MW: stop resizing left tab");
	this.main.style.left	= (this.main.offsetLeft/window.innerWidth*100)+"vw";
	this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
}

MW.prototype.right_Resize_Begin = function(e) {
	console.log("MW: start resizing right Tab");
	this.diffX = e.pageX - (this.main.offsetLeft + this.main.offsetWidth);
	this.temp = this.main.offsetLeft;
}
MW.prototype.rightResizeCurrent = function(e) {
	var new_Right = -this.diffX + e.pageX;
	if (new_Right > window.innerWidth) 	new_Right = window.innerWidth;
	if (new_Right < (this.temp + this.minimal_Width))	new_Right = this.temp + this.minimal_Width;
	this.main.style.width = (new_Right - this.temp)+"px";
}
MW.prototype.right_Resize_End = function() {
	console.log("MW: stop resizing right tab");
	this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
}

// Définition des outils de proportion pout les images et les vidéos.

MW.prototype.resize_Image = function() {
	if (this.proportions_Respected) {
		if (this.img.classList.contains('MWImgFull')) {
			console.log('MW.resize_Image() Switch to propotionned image -> Suppression de la classe MWImgFull');
			this.img.classList.remove("MWImgFull");
		}
		var ratio_Window 	= this.body.offsetWidth/this.body.offsetHeight;
		var ratioImage	= this.img.width/this.img.height;
		if (ratioImage > ratio_Window) {
			if (this.imageRatioCmp || this.break_Resolution) {
				console.log('MW.resize_Image() New image/window ratio detected (respected proportions) RATIO_IMAGE > RATIO_WINDOW');
				this.imageRatioCmp = this.break_Resolution = false;
				this.img.style.width = '100%';
				this.img.style.left = '0px';
				this.img.style.removeProperty('height');
				this.img.style.position = 'relative';
			}
			var actualImageHeight = this.img.height*(this.body.offsetWidth/this.img.width);
			this.img.style.top = ((this.body.offsetHeight-actualImageHeight)/2)+'px';
		}
		else {
			if (!this.imageRatioCmp || this.break_Resolution) {
				console.log('MW.resize_Image() New image/window ratio detected (respected proportions) RATIO_IMAGE < RATIO_WINDOW');
				this.imageRatioCmp = true;
				this.break_Resolution = false;
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
			console.log('MW.resize_Image() Full window image resize -> Attribution de la classe MWImgFull');
			this.img.style.removeProperty('position');
			this.img.className = 'MWImgFull';
		}
	}
}
MW.prototype.resize_Video = function() {
	var ratio_Window 	= this.body.offsetWidth/this.body.offsetHeight;
	var ratio_Video	= this.video.videoWidth/this.video.videoHeight;
	if (ratio_Video > ratio_Window) {
		if (this.proportions_Respected) {
			if (this.video_Ratio_Cmp) {
				console.log('MW.resize_Video() New video/window ratio detected (respected proportions) RATIO_VIDEO > RATIO_WINDOW');
				this.video_Ratio_Cmp = false;
				this.video.style.width = '100%';
				this.video.style.left = '0px';
				this.video.style.removeProperty('height');
				this.video.style.removeProperty('transform');
			}
			var actual_Video_Height = this.video.videoHeight*(this.body.offsetWidth/this.video.videoWidth);
			this.video.style.top = ((this.body.offsetHeight-actual_Video_Height)/2)+'px';
		}
		else	{
			if (this.video_Ratio_Cmp) {
				console.log('MW.resize_Video() New video/window ratio detected (full window video) RATIO_VIDEO > RATIO_WINDOW');
				this.video_Ratio_Cmp = false;
				this.video.style.left = this.video.style.top = '0px';
				this.video.style.width = '100%';
				this.video.style.removeProperty('height');
			}
			var actual_Video_Height = this.video.videoHeight*this.body.offsetWidth/this.video.videoWidth;
			var scaleY = this.body.offsetHeight/actual_Video_Height;
		 	//console.log("MW: Real vid proportions -> Width="+this.video.videoWidth+" Height="+this.video.videoHeight+". Actual video height (relative to window width):"+actual_Video_Height+" -> scaleY:"+scaleY);
			this.video.style.transform="scaleY("+scaleY+")";
		}
	}
	else	{
		if (this.proportions_Respected) {
			if (!this.video_Ratio_Cmp) {
				console.log('MW.resize_Video() New video/window ratio detected (respected proportions) RATIO_VIDEO < RATIO_WINDOW');
				this.video_Ratio_Cmp = true;
				this.video.style.height = '100%';
				this.video.style.removeProperty('top');
				this.video.style.removeProperty('transform');
			}
			var actual_Video_Width = this.video.videoWidth*(this.body.offsetHeight/this.video.videoHeight);
			this.video.style.width = actual_Video_Width+'px';
			this.video.style.left = ((this.body.offsetWidth-actual_Video_Width)/2)+'px'
		}
		else	{
			if (!this.video_Ratio_Cmp) {
				console.log('MW.resize_Video() New video/window ratio detected (full window video) RATIO_VIDEO < RATIO_WINDOW');
				this.video_Ratio_Cmp = true;
				this.video.style.left = this.video.style.top = '0px';
				this.video.style.height = '100%';
				this.video.style.removeProperty('width');
			}
			var actual_Video_Width = this.video.videoWidth*this.body.offsetHeight/this.video.videoHeight;
			var scaleX = this.body.offsetWidth/actual_Video_Width;
		 	//console.log("MW: Real vid proportions -> Width="+this.video.videoWidth+" Height="+this.video.videoHeight+". Actual video width (relative to window height):"+actual_Video_Width+" -> scaleY:"+scaleX);
			this.video.style.transform="scaleX("+scaleX+")";
}}}
MW.prototype.set_Propotions_Tool = function(proportionned_State)
{
	this.proportion_Tool = document.getElementById("MW_SVG_PROPORTIONS").cloneNode(true);
	this.proportion_Tool.classList.remove('MW_Svg_Hidden');
	
	this.header.insertBefore(this.proportion_Tool, this.top_Space);				// var insertElement = parentElement.insertBefore(nouvelElement, refElement)

	var obj = this;
	this.proportions_Respected = proportionned_State;

	if (this.video) {
		var ratio_Window 	= this.body.offsetWidth/this.body.offsetHeight;
		var ratio_Video	= this.video.videoWidth/this.video.videoHeight;
		this.video_Ratio_Cmp = ((this.video.videoWidth/this.video.videoHeight) > (this.body.offsetWidth/this.body.offsetHeight))?true:false;		// stimulation redimentionnement.
		this.resize_Video();
	}
	if (this.img) {
		this.break_Resolution = true;
		this.resize_Image();
	}

	this.proportion_Tool.addEventListener('mousedown', function(){
		obj.proportions_Respected = !obj.proportions_Respected;

		if (obj.video) {
			obj.video_Ratio_Cmp = !obj.video_Ratio_Cmp; 																 // stimulation redimentionnement.
			obj.resize_Video();
		}
		if (obj.img) {
			obj.break_Resolution = true;
			obj.resize_Image();
		}
	},false);
}

// Methodes appelées selon le type de média utilisé dans la fenetre.

MW.prototype.single_Video = function(url,proportionned_State) {
	var obj = this;
	var proportionned_State = proportionned_State;
	this.video = document.createElement('video');

	var video_Controls = document.createElement('div');
	video_Controls.className = 'video_Controls';
	this.conteiner.appendChild(video_Controls);
	
	this.video_Controls_Timeline = document.createElement('div');
	this.video_Controls_Timeline.className = 'video_Controls_Timeline';
	this.video_Controls_Conteiner = document.createElement('div');
	this.video_Controls_Conteiner.className = 'video_Controls_Conteiner';
	video_Controls.appendChild(this.video_Controls_Timeline);
	video_Controls.appendChild(this.video_Controls_Conteiner);
	
	this.video_Time_Info = document.createElement('div');
	this.video_Time_Info.className = 'video_Time_Info';

	this.video_Play_Icon = document.getElementById("MW_SVG_VIDEO_PLAY").cloneNode(true);	
	this.video_Pause_Icon = document.getElementById("MW_SVG_VIDEO_PAUSE").cloneNode(true);		
	this.video_Mute_Icon = document.getElementById("MW_SVG_VIDEO_SOUND").cloneNode(true);			
	this.video_Play_Icon.classList.remove('MW_Svg_Hidden');
	this.video_Pause_Icon.classList.remove('MW_Svg_Hidden');
	this.video_Mute_Icon.classList.remove('MW_Svg_Hidden');
	this.video_Controls_Conteiner.appendChild(this.video_Play_Icon);
	this.video_Controls_Conteiner.appendChild(this.video_Pause_Icon);
	this.video_Controls_Conteiner.appendChild(this.video_Mute_Icon);
	this.video_Controls_Conteiner.appendChild(this.video_Time_Info);
	
	this.video_TimeLine = document.createElement('div');
	this.video_TimeLine.className='video_Current_TimeLine';
	this.video_Controls_Timeline.appendChild(this.video_TimeLine);

	this.video.addEventListener('loadedmetadata', function() {
		obj.set_Propotions_Tool(proportionned_State);
		obj.video.volume = 0;
		var a = Math.floor(obj.video.duration/60);
		var b = Math.floor(obj.video.duration%60);
		obj.video_Duration_String = ((a)?a+'.':'0.')+((b)?((b<10)?'0'+b:b):'00');
		obj.video.play();
		obj.main.style.opacity = 1;
	},false);
	
	this.video.src = url;
	this.video.className = 'MWVid';
	this.video.type = 'video/mp4';			// TODO Est-ce que le type de la vidéo se définit vraiment ainsi en JS ?
	this.body.appendChild(this.video);

	this.video_Play_Icon.onmousedown = function()  { 	obj.video.play();	 }
	this.video_Pause_Icon.onmousedown = function() { 	obj.video.pause(); }
	this.video_Mute_Icon.onmousedown = function()  { 	obj.video.volume = (obj.video.volume)?0:1; }

	this.video.addEventListener('timeupdate',function() { 
		var a = Math.floor(obj.video.currentTime/60);
		var b = Math.floor(obj.video.currentTime%60);
		
		obj.video_Time_Info.innerHTML = ((a)?a+'.':'0.')+((b)?((b<10)?'0'+b:b):'00') +'/'+obj.video_Duration_String;
		obj.video_TimeLine.style.width=(obj.video.currentTime/obj.video.duration*100)+'%'; 
	},false);
	
	this.video.onplay = function() { 
		console.log('MW: VIDEO -> play video event for '+obj.id);  
		obj.video_Play_Icon.classList.add('video_Controls_Icons_Active'); 
		obj.video_Pause_Icon.classList.remove('video_Controls_Icons_Active'); 
	}
	this.video.onpause = function() { 
		console.log('MW: VIDEO -> pause video event for '+obj.id); 
		obj.video_Pause_Icon.classList.add('video_Controls_Icons_Active'); 
		obj.video_Play_Icon.classList.remove('video_Controls_Icons_Active'); 
	}
	this.video.onvolumechange = function() { 
		console.log('MW: VIDEO -> change volume video event for '+obj.id); 
		(obj.video.volume)?obj.video_Mute_Icon.classList.add('video_Controls_Icons_Active'):obj.video_Mute_Icon.classList.remove('video_Controls_Icons_Active');
	}
	
	var lock_Cpu_Busy = false;
	var apply_Timeline_Change = function() {
		console.log('MW: Apply timeline change for:'+obj.id);
		var exp = obj.diffX / obj.video_Controls_Timeline.offsetWidth;
		if (exp < 0 || exp > 1) console.log('MW: video exception -> Out of limit for '+obj.id);
		else 				obj.video.currentTime = exp * obj.video.duration;
		lock_Cpu_Busy = false;
	}
	var video_Set_Timeline = function(e) {
		console.log('MW: set video timeline for:'+obj.id+' window offset left: '+obj.video_Controls_Timeline.offsetLeft);
		if (!lock_Cpu_Busy) { 
			obj.diffX = e.pageX - ( obj.main.offsetLeft + obj.video_Controls_Timeline.offsetLeft);
			lock_Cpu_Busy=true; 
			setTimeout(apply_Timeline_Change,250); 
	}}	
	
	this.video_Controls_Timeline.onmousedown = function(e) {
		video_Controls.classList.add('video_Controls_Selected');
		video_Set_Timeline(e);
		mouse_Move_Function = function(e) {
			video_Set_Timeline(e);
		}
		mouse_Up_Function = function(e) {
			video_Controls.classList.remove('video_Controls_Selected');
			video_Set_Timeline(e);
			mouse_Move_Function = mouse_Up_Function = function() {}
	}}
}

MW.prototype.single_Image = function(url,proportionned_State) {
	var obj = this;
	this.img = document.createElement('img');
	this.img.src = url;
	this.img.onload = function() {
		obj.set_Propotions_Tool(proportionned_State);
		obj.body.appendChild(obj.img);
		obj.main.style.opacity = 1;
	}
}
MW.prototype.iframe = function(url) {	
	this.iframe = document.createElement('iframe');
	this.iframe.className = 'MW_Iframe';
	this.iframe.src = url;
	this.iframe.frameBorder = 0;
	this.body.appendChild(this.iframe);
	this.main.style.opacity = 1;

	this.iFrame_mouseBox = document.createElement('div');
	this.iFrame_mouseBox.className = 'MW_Iframe_Mouse_Box';
	this.body.appendChild(this.iFrame_mouseBox);
}
MW.prototype.raw_Text = function() {
	this.body.innerHTML = "";
	this.active_Scrolling();
	this.main.style.opacity = 1;
}
MW.prototype.set_Custom_Content = function() {
	this.custom_Content = true;
	this.main.style.opacity = 1;
}

// General DOM -> Spécific fonctions (Dépendances de MW):

var mouse_Move_Function = function() {}
document.onmousemove = function(e) {
	mouse_Move_Function(e);
	//return false;							// TODO suppression expérimentale
}

var mouse_Up_Function = function() {}
document.onmouseup = function(e) {
	mouse_Up_Function(e);
	MW_iFrame_Mouse_Protection(false);
	return false;
}




/*
TODO -> Gestion intelligente du redimentionnement lorsque nous sommes en FullScreen.
TODO -> Gestion précise de la taille des polices utilisées dans les fenetres contenant du texte. em dans la feuille css exprime une grandeur de poilice relative à celle du parent.	10%
TODO -> Mode d'affichage des images dans le respect des proportions.		STATE -> OK
TODO -> Mode d'affichage des vidéos dans le respect des proportions.		STATE -> OK
TODO -> Désign controls de la lecture vidéo.						STATE -> OK
TODO -> Désigned scrollings Bars.
TODO -> FULL opacity fonction									STATE -> OK
TODO -> Back to Backroom fonction, Z-index devient minimum pour affichage en arrière plan.	STATE -> OK
TODO -> ToolBar de controle central des fenetres.
TODO -> Download bouton for images.
TODO -> Affichage discret du header dans le mode plein écran en full opacity.		STATE -> OK
TODO -> Full opacity mode et bouton									STATE -> OK
TODO URGENT -> Redimentionnement auto lors d'un changement de la taille de la fenetre du navigateur	STATE ->OK			DIFFICILE -> Apparement pris en charge voir plutot la taille du texte avec maximize)
			le trigger transition est déclenché lors du redimentionnement des fentres, les vidéos et les images sonr 'risizées' à la fin de la transition
			Les iframe prennent automatiquement les bonnes dimentions et les textes exprimés en vh/em voient leurs polices changer de taille.
			MW.prototype.bottom_Resize_Current = function(e) {	[...] 		//this.body.style.fontSize = (new_Height/20)+'px';				// Ajout expérimental.
			Cette instruction augmente la taille de la police selon la taille du window.body
			invention de la super classe custom_Content. Répétion de la meme ligne dans endoftransisition et resizeBottomCurrent !		STATE -> OK
TODO URGENT -> Minimize -> Tenir compte du nombre de boutons sur la barre HEADER											STATE -> OK
TODO URGENT -> BUG CHAMP INPUT DETECTE																		STATE -> OK
var mouse_Move_Function = function() {}
document.onmousemove = function(e) {
	mouse_Move_Function(e);
	//return false;							// suppression expérimentale			AGISSEMENT ICI !
}																								STATE -> OK (à tester cependant)
TODO URGENT -> Quand la fenetre est sous minimize, désactiver les champs de resize qui se mettent devant les boutons.					STATE -> OK
TODO URGENT -> En mode fullScreen, mauvais positionnement de mouse_Left_Div												STATE -> OK
TODO URGENT -> fenetre minimizées, soucis de taille du texte quand la taille de la fenetre du navigateur diminue.						STATE -> OK
TODO Image proportions: -> bouton keep proportions R																STATE -> OK
TODO URGENT										CHANGER LA GESTION DES COULEURS -> PASSER PAR CLASSES PLUTOT ?
TODO URGENT										EMPECHER BODY DE SCROLLER TOUT SEUL								STATE -> OK
TODO URGENT										rajouter OPTS pour fenetre headerLEss							STATE -> OK
TODO mouveMove sur iframe																				STATE -> OK

Dynamic JS function -> A tester impérativement:
	var test = function(i) {
		var Z = (i)?13:7; 
		var a = function(j) { console.log('meuuuuh:'+((j)?Z:(Z*2))); }
		return a;
	}
	
	var I = test(true);
	var J = test(false);
	
	I(false);
	J(true);
	I(true);
	J(false);
*/



