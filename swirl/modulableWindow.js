'use strict';
//OBJECT NAME: Modular Window (abrev. MW)
//OBJECT GOAL: DOM UPGRADE with many resizable/modulable Windows, like a OS desktop. achievement: 60%;

var MW = function() {
	var file_Index = -1;
	var imageType = /image.*/;
	var videoType = /video.*/;
	var audioType = /audio.*/;
		
	this.create_New_Window = function(title,proportions,colors,opts,share) {
		if (!share) new Window(title,title,proportions,colors,opts);
		else {
			if (!opts) 	 opts   = new Object();
			if (!colors) colors = new Object();
			
			file_Index++;
			share.meta = (share.meta)?share.meta:{ 'name':share.file.name,
					   				   'size':share.file.size,
					   				   'type':share.file.type	
			};
			console.log('new incoming file of '+share.meta.type);
			
			if (share.meta.type.match(imageType)) {
				opts.type = 'image';
				colors.border = '#e74c3c';
				colors.body = 'black';
				opts.ratio = true;
				opts.opacity = false;
			}
			else if (share.meta.type.match(videoType)) {
				opts.type = 'video';
				colors.border = '#a5583c';
				colors.body = 'black';
				opts.ratio = true;
				opts.opacity = false;
			}
			else if(share.meta.type.match(audioType)) {
				colors.border = '#4333FE';
				colors.body = 'black';
				opts.type = 'audio';
				opts.opacity = false;
				opts.sound = true;
			}
			else {
				opts.type = false;
				console.log('format non reconnu');
			}
			opts.url = URL.createObjectURL(share.file);
			
			new Window('id'+file_Index,share.meta.name,{'x':(70-(2*(file_Index%5))),'y':(30-(3*(file_Index%5))),'w':30,'h':70},colors,opts,share);
		}	
	}
	
	var Playlist = function() {
		var self = this;
		var music_List = new Array();
		var ready = true;
		var next = function(e) {
			if (music_List.length) {
				ready = true;
				self.add_To_PlayList(music_List[0]);
				this.removeEventListener("ended",next,false);
				music_List.splice(0,1);
			}
		}
		this.remove_To_PlayList = function(music) {
		
		}
		this.add_To_PlayList = function(music) {
			if (ready) 	{
				ready = false;
				music.play();
				music.addEventListener("ended",next,false);
			}
			else  music_List.push(music);
		}
	}
	var playlist = new Playlist();
	
	var MW_iFrame_Mouse_Protection;
	var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";

	function switch_Css_init(class_Name,element,value,value2) {
		var cssRules;
		for (var S = 0, len = document.styleSheets.length; S < len; S++){
			try {
				document.styleSheets[S].insertRule(class_Name+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);
				console.log('MW_change_CSS: solution I avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
				return 	function(invv) { document.styleSheets[S].insertRule(class_Name+' { '+element+': '+((invv)?value2:value)+'; }',document.styleSheets[S][cssRules].length); };
			} 
			catch(err) {
				try {
					document.styleSheets[S].addRule(class_Name,element+': '+value+';');
					console.log('MW_change_CSS: solution II avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
					return	 function(invv) { document.styleSheets[S].addRule(class_Name,element+': '+((invv)?value2:value)+';'); };
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
						else 	{}	// Navigateur inconnu ?!? 
						
						for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
							if (document.styleSheets[S][cssRules][R].selectorText == class_Name) {
								if(document.styleSheets[S][cssRules][R].style[element]){
									document.styleSheets[S][cssRules][R].style[element] = value;
									return	function(invv) { document.styleSheets[S][cssRules][R].style[element] = ((invv)?value2:value); };
					}}}} 
					catch (err){}
		}}}
		return function() {};
	}
	MW_iFrame_Mouse_Protection = switch_Css_init('.MW_Iframe_Mouse_Box','display','none','block');

	function modify_Class_Value(class_Name,element,value) {
		var cssRules;
		for (var S = 0; S < document.styleSheets.length; S++){
			try {
				document.styleSheets[S].insertRule(class_Name+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);
				console.log('MW_change_CSS: solution I avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
			} 
			catch(err) {
				try {
					document.styleSheets[S].addRule(class_Name,element+': '+value+';');
					console.log('MW_change_CSS: solution II avec feuille '+S+' class:'+class_Name+' element:'+element+' value:'+value+' -> Création de fonction utile');
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
						else {}	// Navigateur inconnu ?!?
						
						for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
							if (document.styleSheets[S][cssRules][R].selectorText == class_Name) {
								if(document.styleSheets[S][cssRules][R].style[element]){
									document.styleSheets[S][cssRules][R].style[element] = value;
					}}}} 
					catch (err){}
	}}}}
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
	var header_Height 		= 2.5;			// predefined. VH
	var border_Size   		= 0.2;			// predefined. VH
	var mouse_Resize_Area_Size 	= 3.0				// predefined. VH
	var opacity				= 0.63;			// predefined. 0 to 1
	
	var value = header_Height+'vh';
	modify_Class_Value('.MW_Svg_Icon_Right','width',value);	// L'utilisation de cette fonction est en réalité facultative puisque header_Height est 'predefined', la classe CSS pour width aurait pu etre remplie à la main !
	modify_Class_Value('.MW_Svg_Icon_Left','width',value);	// ca rajoute du calcul pour le pauvre processeur, mais c'est marrant.

	var Window = function(id,title_Window,proportions,colors,opts,share) {
		objects.push(this);
	
        	this.id = id;		
        				
		this.opacity 			= opacity;				
		this.border_Size			= border_Size;				
		this.header_Height 		= header_Height;				
		this.mouse_Resize_Area_Size  	= mouse_Resize_Area_Size;
		this.border_Color			= colors.border;				// TODO PATCH pour la couleur dans headerLess
		
		
		this.create(title_Window,proportions,colors,opts.id);
		
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
			obj.media && obj.media.pause();
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
		
		if (share) {														// TODO IMPORTANT -> opts.share est une parlie liée à rtc.js qui n'est pas propre à MW version originale.				
			if (share.type == 'upload') 	{
				this.upload_Tool = document.getElementById("MW_SVG_UPLOAD").cloneNode(true);
				this.upload_Tool.classList.remove('MW_Svg_Hidden');
				this.header.insertBefore(this.upload_Tool, this.top_Space);	
				
				this.file = share.file;
				
				this.upload_Tool.addEventListener('mousedown', function(){
					RTC.sendFile(new Array(obj.file), user_To_Share);							// NOTE: RTC.sendFile se charge par lui-même de determiner si la session avec 'user_To_Share' existe. 
				},false);
			}
			if (share.type == 'download') {
				display('reception de '+share.meta.name+'.\n');
			
				this.download_Link = document.createElement('a');
				this.download_Link.href = opts.url;
				this.download_Link.src = share.meta.name;
				this.download_Link.download = share.meta.name;
				this.header.insertBefore(this.download_Link, this.top_Space);
				
				this.download_Tool = document.getElementById("MW_SVG_DOWNLOAD").cloneNode(true);
				this.download_Tool.classList.remove('MW_Svg_Hidden');
				this.download_Link.appendChild(this.download_Tool);	
			}
		}
		
		switch (opts.type) {
			case 'video':
				this.single_Video(opts.url,opts.ratio,opts.sound);
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
			case 'audio':
				this.single_Audio(opts.url,opts.sound);
				break;
			default:
				break;
		}
	}
// MW -> Prototypes de base:
	Window.prototype.utilize = function() {				// (EN)utilize <--> (FR)exploiter	cf. To utilize a woman (c. Idiocraty)
		return this.body;
	}
	
	Window.prototype.change_Color	= function() {}			// TODO Fonction pouvant trouver son utilité.
	Window.prototype.change_Opacity = function() {}		    	// TODO Fonction pouvant trouver son utilisé.
	
	Window.prototype.end_Of_Transition = function(e) {						
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
	Window.prototype.put_Forward = function(zIndex_Max) {
		zIndex_Max+=3;
		this.main.style.zIndex = zIndex_Max;
		this.bottom_Left_Div.style.zIndex = this.bottom_Right_Div.style.zIndex = zIndex_Max+1;
		this.header.style.zIndex = zIndex_Max+2;
	return zIndex_Max;
	}
	Window.prototype.go_To_Backroom = function(zIndex_Min) {
		zIndex_Min-=3;
		this.main.style.zIndex = zIndex_Min;
		this.bottom_Left_Div.style.zIndex = this.bottom_Right_Div.style.zIndex = zIndex_Min+1;
		this.header.style.zIndex = zIndex_Min+2;	
	return zIndex_Min;
	}
			
	Window.prototype.toggle_Header = function(header_Height,border_Size) {
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
	Window.prototype.toggle_Minimize = function() {
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
				this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'none';					// enter minimize - Désactictivation des champs de redimentionnement.
	
				// Routines de redimentionnement minimal de la taille horizontale de la fenetre:
				var local_Minimal_Width = this.minimal_Width/window.innerWidth*100;
				this.main.style.width = local_Minimal_Width +'vw';
				this.main.style.left = (this.last_Left + this.last_Width - local_Minimal_Width)+'vw';
			}
			else {
				this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;					// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
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
			this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'block';						// quit minimize: Réactivcation des champs de redimentionnement souris.
		}
		this.minimize_State = !this.minimize_State;
	}
	
	Window.prototype.toggle_FullScreen = function() {
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
				this.bottom_Left_Div.style.display = this.bottom_Right_Div.style.display = 'block';
			}
			this.switch_To_Fullscreen();
		}
		else  this.quit_Full_screen();
	
		this.maximize_State = !this.maximize_State;
	}
	
	Window.prototype.switch_To_Fullscreen = function() {		
		this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE_INVERSE").innerHTML;		// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
	
		this.main.style.height = '100vh';
		this.main.style.width = '100vw';
		this.main.style.top = this.main.style.left ='0px';
	
		this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = '0px';
		
		this.conteiner.style.height=(100 - this.header_Height)+'vh';
	}
	Window.prototype.quit_Full_screen = function () {				
		this.maximize.innerHTML = document.getElementById("MW_SVG_MAXIMIZE").innerHTML;			// TODO Patch: il y a mieux que innerHTML pour changer d'icone.
	
		this.main.style.height = this.last_Height+'vh';
		this.main.style.width = this.last_Width+'vw';
		this.main.style.top = this.last_Top+'vh';
		this.main.style.left = this.last_Left+'vw';
	
		this.leftDiv.style.width = this.rightDiv.style.width = this.footer.style.height = this.border_Size+'vh';
		
		this.conteiner.style.height=(this.last_Height - this.header_Height - this.border_Size)+'vh';
	}
			
	Window.prototype.resize = function() {
		this.minimal_Width = (this.title.offsetWidth + this.header.getElementsByTagName('svg').length*(this.header_Height/100*window.innerHeight)) + 40;	// TODO patch, remise à jour de minimal width lorsque résol. change
		this.video && this.resize_Video();
		this.img && this.resize_Image();
		this.custom_Content && (this.body.style.fontSize=(this.conteiner.offsetHeight/20)+'px');		// TODO Ajout expérimental.
	}
	
//  Prototypes de création primordiale des fenêtres:	
	Window.prototype.create = function(title_Window,proportions,colors,custom) {
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
			this.rightDiv = document.createElement('div');
			this.body = document.createElement('div');
			this.leftDiv.className = 'MWLeft MWSideDiv';
			this.rightDiv.className = 'MWRight MWSideDiv';
			this.body.className = 'MWBody';
			this.conteiner.appendChild(this.leftDiv);
			this.conteiner.appendChild(this.rightDiv);
			this.conteiner.appendChild(this.body);
	
		this.footer = document.createElement('div');
		this.footer.className = 'MWFooter';
		this.main.appendChild(this.footer);
			this.bottom_Left_Div = document.createElement('div');
			this.bottom_Right_Div = document.createElement('div');
			this.bottom_Div = document.createElement('div');
			this.bottom_Left_Div.className='MWLeftBottom MWMouseSideBottomDiv';
			this.bottom_Right_Div.className='MWRightBottom MWMouseSideBottomDiv';
			this.bottom_Div.className='MWBottom';
			this.footer.appendChild(this.bottom_Div);
			this.footer.appendChild(this.bottom_Left_Div);
			this.footer.appendChild(this.bottom_Right_Div);
			
		if (custom) {
			var content = document.getElementById(custom).innerHTML;
			document.body.removeChild(document.getElementById(custom));
			this.body.innerHTML = content;
		}
		
		this.main.style.left = proportions.x+'vw';
		this.main.style.top = proportions.y+'vh';
		this.main.style.width = proportions.w+'vw';
		this.main.style.height = proportions.h+'vh';
	
		this.header_Mask.style.height = this.header.style.height = this.header_Height+'vh';
		
		this.title = document.createElement('span');
		this.top_Space.appendChild(this.title);
	
		this.title.appendChild(document.createTextNode(title_Window));
	
		this.conteiner.style.height = (proportions.h - this.header_Height - this.border_Size)+'vh';
		
		this.body.style.backgroundColor = colors.body;
		this.body.style.opacity	= this.opacity;
	
		this.header.style.backgroundColor = this.bottom_Div.style.backgroundColor = this.leftDiv.style.backgroundColor = this.rightDiv.style.backgroundColor = colors.border;
		
		this.footer.style.height = this.leftDiv.style.width = this.rightDiv.style.width = this.border_Size+'vh';
	
		this.bottom_Left_Div.style.width = this.bottom_Right_Div.style.width = this.bottom_Left_Div.style.height = this.bottom_Right_Div.style.height = this.mouse_Resize_Area_Size+'vh';
		this.bottom_Left_Div.style.bottom = this.bottom_Right_Div.style.bottom = this.mouse_Resize_Area_Size+'vh';
	}
	
	Window.prototype.set_Window_Base_Selectors = function() {
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
	Window.prototype.move_Begin = function(e) {
		console.log('MW: start moving');
		this.diffX = e.pageX - this.main.offsetLeft;
		this.diffY = e.pageY - this.main.offsetTop;
	}
	Window.prototype.move_Current = function(e) {
		var new_Top 	= -this.diffY + e.pageY;
		var new_Left = -this.diffX + e.pageX;
		if (new_Top < 0) new_Top   = 0;
		if (new_Left < 0) new_Left = 0;
		if (new_Top > (window.innerHeight - this.main.offsetHeight)) new_Top = (window.innerHeight - this.main.offsetHeight);
		if (new_Left > (window.innerWidth  - this.main.offsetWidth))  new_Left = (window.innerWidth - this.main.offsetWidth);
		this.main.style.top = new_Top+"px";
		this.main.style.left = new_Left+"px";
	}
	Window.prototype.move_End = function() {
		console.log("MW: stop moving");
	      this.main.style.top = (this.main.offsetTop/window.innerHeight*100)+"vh";	// Conversion finale en VH et VW, BUG conversion overflow barre de scroll actives dans certaines résolutions
	      this.main.style.left = (this.main.offsetLeft/window.innerWidth*100)+"vw";
	}
	
	Window.prototype.bottom_Resize_Begin = function(e) {
		console.log("MW: start resizing bottom Tab");
		this.diffY = e.pageY - this.main.offsetHeight;
	}
	Window.prototype.bottom_Resize_Current = function(e) {
		var new_Height = -this.diffY + e.pageY;
		if (new_Height < (this.header.offsetHeight + 100)) 	new_Height = this.header.offsetHeight + 100;
		if ((new_Height + this.main.offsetTop) > window.innerHeight) new_Height = window.innerHeight - this.main.offsetTop;
		this.main.style.height = new_Height+"px";
		// TODO UPGRADE: Afin d'integrer au mieux la fonction de disparition du titre/header, permis par un jeu de mise à 0 de header_Height, l'ancienne capture de la hauteur du header dans l'équation est remplacée
		// par une expression de hauteur relative à header_Height, ce dernier étant exprimé en VH, une conversion express en pixel est nécessaire -> (this.header_Height/100*window.innerHeight)
		// berfore: this.conteiner.style.height = (new_Height-this.header.offsetHeight-this.footer.offsetHeight)+"px";
		this.conteiner.style.height = (new_Height-(this.header_Height/100*window.innerHeight)-this.footer.offsetHeight)+"px";
	
		if (this.custom_Content) this.body.style.fontSize = (new_Height/20)+'px';						// TODO expérimental: (Custom_Content) -> la taille des polices relatives VH/EM.
	}
	Window.prototype.bottom_Resize_End = function() {
		console.log("MW: stop resizing bottom");
		this.main.style.height 		= (this.main.offsetHeight/window.innerHeight*100)+"vh";
		this.conteiner.style.height 	= (this.conteiner.offsetHeight/window.innerHeight*100)+"vh";
	}
	
	Window.prototype.left_Resize_Begin = function(e) {
		console.log("MW: start resizing left Tab");
		this.diffX = e.pageX - this.main.offsetLeft;
		this.temp = this.main.offsetLeft + this.main.offsetWidth;
	}
	Window.prototype.left_Resize_Current = function(e) {
		var new_Left = -this.diffX + e.pageX;
		if (new_Left < 0) new_Left = 0;
		if (new_Left > (this.temp - this.minimal_Width)) 	new_Left = this.temp - this.minimal_Width;
		this.main.style.left = new_Left+"px";
		this.main.style.width = (this.temp-this.main.offsetLeft)+"px";
	}
	Window.prototype.leftResizeEnd = function() {
		console.log("MW: stop resizing left tab");
		this.main.style.left	= (this.main.offsetLeft/window.innerWidth*100)+"vw";
		this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
	}
	
	Window.prototype.right_Resize_Begin = function(e) {
		console.log("MW: start resizing right Tab");
		this.diffX = e.pageX - (this.main.offsetLeft + this.main.offsetWidth);
		this.temp = this.main.offsetLeft;
	}
	Window.prototype.rightResizeCurrent = function(e) {
		var new_Right = -this.diffX + e.pageX;
		if (new_Right > window.innerWidth) 	new_Right = window.innerWidth;
		if (new_Right < (this.temp + this.minimal_Width))	new_Right = this.temp + this.minimal_Width;
		this.main.style.width = (new_Right - this.temp)+"px";
	}
	Window.prototype.right_Resize_End = function() {
		console.log("MW: stop resizing right tab");
		this.main.style.width	= (this.main.offsetWidth/window.innerWidth*100)+"vw";
	}
	
// Définition des outils de proportion pout les images et les vidéos.
	Window.prototype.resize_Image = function() {
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
	Window.prototype.resize_Video = function() {
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
	Window.prototype.set_Propotions_Tool = function(proportionned_State)
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
	Window.prototype.single_Video = function(url,proportionned_State,sound) {
		var obj = this;
		this.video = document.createElement('video');
		this.media = this.video;
	
		var proportionned_State = proportionned_State;
		
		this.video.addEventListener('loadedmetadata', function() {
			obj.set_Propotions_Tool(proportionned_State);
			obj.video.volume = (sound)?1:0;
			var a = Math.floor(obj.video.duration/60);
			var b = Math.floor(obj.video.duration%60);
			obj.media_Duration_String = ((a)?a+'.':'0.')+((b)?((b<10)?'0'+b:b):'00');
			obj.video.play();
			obj.main.style.opacity = 1;
		},false);
		
		this.video.volume = 0;	
		this.video.src = url;
		this.video.className = 'MWVid';
		this.video.type = 'video/mp4';			// TODO Est-ce que le type de la vidéo se définit vraiment ainsi en JS ?
		this.body.appendChild(this.video);
		
		this.media_Common();
	}
	
	Window.prototype.update_Duration_String = function() {
		var a = Math.floor(this.media.currentTime/60);
		var b = Math.floor(this.media.currentTime%60);
		
		this.media_Time_Info.innerHTML = ((a)?a+'.':'0.')+((b)?((b<10)?'0'+b:b):'00') +'/'+this.media_Duration_String;
		this.media_TimeLine.style.width=(this.media.currentTime/this.media.duration*100)+'%'; 
	}
	
	Window.prototype.single_Audio = function(url,sound) {
		var obj = this;
		this.audio = new Audio();
		this.media = this.audio;
		
		this.audio.addEventListener('loadedmetadata', function() {
			obj.audio.volume = (sound)?1:0;
			var a = Math.floor(obj.audio.duration/60);
			var b = Math.floor(obj.audio.duration%60);
			obj.media_Duration_String = ((a)?a+'.':'0.')+((b)?((b<10)?'0'+b:b):'00');			

			obj.update_Duration_String();

			playlist.add_To_PlayList(obj.audio);
			obj.main.style.opacity = 1;
		},false);
				
		this.audio.src = url; 
		this.audio.className = 'MWAudio';
		this.audio.type = 'audio/mp3';
		this.audio.volume = 0;
		
		var icon = document.getElementById("MW_SVG_MEDIA_SOUND").cloneNode(true);			
		icon.classList.remove('MW_Svg_Hidden');
		icon.style.position = 'relative';
		this.body.appendChild(icon);
		
		this.media_Common();
	}
	
	Window.prototype.media_Common = function() {
		var obj = this;
	
		var media_Controls = document.createElement('div');
		media_Controls.className = 'media_Controls';
		this.conteiner.appendChild(media_Controls);
		
		this.media_Controls_Timeline = document.createElement('div');
		this.media_Controls_Timeline.className = 'media_Controls_Timeline';
		this.media_Controls_Conteiner = document.createElement('div');
		this.media_Controls_Conteiner.className = 'media_Controls_Conteiner';
		media_Controls.appendChild(this.media_Controls_Timeline);
		media_Controls.appendChild(this.media_Controls_Conteiner);
		
		this.media_Time_Info = document.createElement('div');
		this.media_Time_Info.className = 'media_Time_Info';
	
		this.media_Play_Icon = document.getElementById("MW_SVG_MEDIA_PLAY").cloneNode(true);	
		this.media_Pause_Icon = document.getElementById("MW_SVG_MEDIA_PAUSE").cloneNode(true);		
		this.media_Mute_Icon = document.getElementById("MW_SVG_MEDIA_SOUND").cloneNode(true);			
		this.media_Play_Icon.classList.remove('MW_Svg_Hidden');
		this.media_Pause_Icon.classList.remove('MW_Svg_Hidden');
		this.media_Mute_Icon.classList.remove('MW_Svg_Hidden');
		this.media_Controls_Conteiner.appendChild(this.media_Play_Icon);
		this.media_Controls_Conteiner.appendChild(this.media_Pause_Icon);
		this.media_Controls_Conteiner.appendChild(this.media_Mute_Icon);
		this.media_Controls_Conteiner.appendChild(this.media_Time_Info);
		
		this.media_TimeLine = document.createElement('div');
		this.media_TimeLine.className='media_Current_TimeLine';
		this.media_Controls_Timeline.appendChild(this.media_TimeLine);
	
		this.media_Play_Icon.onmousedown = function()  { 	obj.media.play();	 }
		this.media_Pause_Icon.onmousedown = function() { 	obj.media.pause(); }
		this.media_Mute_Icon.onmousedown = function()  { 	obj.media.volume = (obj.media.volume)?0:1; }
	
		this.media.addEventListener('timeupdate',function() { 
			obj.update_Duration_String();
		},false);
		
		this.media.onplay = function() { 
			console.log('MW: MEDIA -> play media event for '+obj.id);  
			obj.media_Play_Icon.classList.add('media_Controls_Icons_Active'); 
			obj.media_Pause_Icon.classList.remove('media_Controls_Icons_Active'); 
		}
		this.media.onpause = function() { 
			console.log('MW: MEDIA -> pause media event for '+obj.id); 
			obj.media_Pause_Icon.classList.add('media_Controls_Icons_Active'); 
			obj.media_Play_Icon.classList.remove('media_Controls_Icons_Active'); 
		}
		this.media.onvolumechange = function() { 
			console.log('MW: MEDIA -> change volume media event for '+obj.id); 
			(obj.media.volume)?obj.media_Mute_Icon.classList.add('media_Controls_Icons_Active'):obj.media_Mute_Icon.classList.remove('media_Controls_Icons_Active');
		}
		
		var lock_Cpu_Busy = false;
		var apply_Timeline_Change = function() {
			console.log('MW: Apply timeline change for:'+obj.id);
			var exp = obj.diffX / obj.media_Controls_Timeline.offsetWidth;
			if (exp < 0 || exp > 1) console.log('MW: media exception -> Out of limit for '+obj.id);
			else 				obj.media.currentTime = exp * obj.media.duration;
			lock_Cpu_Busy = false;
		}
		var media_Set_Timeline = function(e) {
			console.log('MW: set media timeline for:'+obj.id+' window offset left: '+obj.media_Controls_Timeline.offsetLeft);
			if (!lock_Cpu_Busy) { 
				obj.diffX = e.pageX - ( obj.main.offsetLeft + obj.media_Controls_Timeline.offsetLeft);
				lock_Cpu_Busy=true; 
				setTimeout(apply_Timeline_Change,250); 
		}}	
		
		this.media_Controls_Timeline.onmousedown = function(e) {
			media_Controls.classList.add('media_Controls_Selected');
			media_Set_Timeline(e);
			mouse_Move_Function = function(e) {
				media_Set_Timeline(e);
			}
			mouse_Up_Function = function(e) {
				media_Controls.classList.remove('media_Controls_Selected');
				media_Set_Timeline(e);
				mouse_Move_Function = mouse_Up_Function = function() {}
		}}
	}
	
	Window.prototype.single_Image = function(url,proportionned_State) {
		var obj = this;
		this.img = document.createElement('img');
		this.img.src = url;
		this.img.onload = function() {
			obj.set_Propotions_Tool(proportionned_State);
			obj.body.appendChild(obj.img);
			obj.main.style.opacity = 1;
		}
	}
	Window.prototype.iframe = function(url) {	
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
	Window.prototype.raw_Text = function() {
		this.body.innerHTML = "";
		this.active_Scrolling();
		this.main.style.opacity = 1;
	}
	Window.prototype.set_Custom_Content = function() {
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
		e.preventDefault();
	}
}
