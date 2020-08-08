'use strict';
var mainDOM = function() {
    /* BEGIN */
    var documentEventMouseDown;
    var documentEventInsideBody;

    document.body.onmousedown    =    function(e) {        /* BUG pour postTab - mise à true */
        documentEventMouseDown=true;                     /* TRUE laisse les events par défaut du navigateur fonctionner. */
        console.log('mouseDown');
        if (e.target.tagName == 'INPUT') e.target.focus();
        if (e.target.className == 'imgBoutons') return true;
        return false; }
    document.body.onmouseup        =    function(e) { documentEventMouseDown=false;     console.log('mouseUp');          return false; }
    document.body.onmouseleave    =        function(e) { documentEventInsideBody=true;     console.log('out of document');      return false; }
    document.body.onmouseenter    =     function(e) { documentEventInsideBody=false;    console.log('inside document');      return false; }

    /*
    var videoPlayer = (function (){
        var onPlaying = false;
        var video = document.getElementsByTagName('video')[0];
        video.onclick =  function(){
            if(onPlaying == false)    video.play();
            else                video.pause();
            onPlaying = !onPlaying;
        }
    })();
    */
/*** Forme complexe de scrollbar, option LOCKED pour éviter les refresh systématiques - YES. ***/
/* OUTDATED: Original Scrollbar, unique. */
    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"

    var logScrollbar = function (ID) {
        var self = this;

        this.conteiner=document.getElementById(ID);
        this.conteiner.style.overflow = 'hidden';

        var cloneDiv=this.conteiner.cloneNode(true);
        while (this.conteiner.firstChild)     this.conteiner.removeChild(this.conteiner.firstChild);

        this.scrollDiv = document.createElement('div');

        this.scrollDiv.className='scrollbar';
        this.scrollDiv = this.conteiner.appendChild(this.scrollDiv);

        this.scrollDiv.style.position='relative';
        this.scrollDiv.style.display='none';

        var arrowUp        = this.createImgElement('medias/images/icon-arrow-up.png',this.scrollDiv,'cursorArrow');
        var arrowDown    = this.createImgElement('medias/images/icon-arrow-down.png',this.scrollDiv,'cursorArrow');

        this.scrollDiv.lastChild.style.bottom = '0px';

        this.middleDiv = document.createElement('div');            // Création du bloc central entre les deux flêches.
        this.middleDiv = this.scrollDiv.appendChild(this.middleDiv);
        this.middleDiv.style.position = 'absolute';

        this.newMainDiv = document.createElement('div');
        this.newMainDiv.className = 'normalScrollbarMainDiv';
        this.newMainDiv = this.conteiner.appendChild(this.newMainDiv);

        while (cloneDiv.firstChild)     this.newMainDiv.appendChild(cloneDiv.firstChild);

        this.newMainDiv.style.overflow='hidden';
        this.newMainDiv.scrollTop = 0;

        this.scroller    = document.createElement('div');
        this.scroller.className= 'middle';
        this.scroller     = this.scrollDiv.appendChild(this.scroller);

        /* DETERMINE WIDTH VALUE */
        this.scrollBarViewWidth = 1.5;                                            // Initial Ratio
        this.scrollBarPixelSize = Math.floor(this.scrollBarViewWidth*(window.innerWidth/100));
        console.log('scrollBarPixelSize:'+this.scrollBarPixelSize);

        /* SET WIDTH PROPOTIONS */
        this.scroller.style.width  = this.scroller.style.top
        = this.middleDiv.style.width = this.middleDiv.style.top
        = arrowUp.style.width = arrowUp.style.height
        = arrowDown.style.width = arrowDown.style.height
        = this.scrollDiv.style.width
        = this.scrollBarPixelSize+'px';
        /** END PROPOTIONS */

        this.scrollContinue = 0;
        this.scrollInverseSpeed = 0;
        this.scrollingTimeout = null;

        this.middleDiv.onmousedown                    =     function(e) { self.moveCursor(e); return false; }
        this.middleDiv.onmousemove =  this.scroller.onmousemove =     function(e) { if (documentEventMouseDown) self.moveCursor(e); return false; }

        arrowUp.onmousedown                         =       function(e) { self.mousedown(this, -1); return false; }
        arrowDown.onmousedown                         =     function(e) { self.mousedown(this, 1); return false;  }
        arrowUp.onmouseout     = arrowUp.onmouseup         =     function(e) { self.clear(); return false; }
        arrowDown.onmouseout    = arrowDown.onmouseup        =     function(e) { self.clear(); return false; }
        this.newMainDiv.addEventListener(mousewheelevt, function(e) {self.MouseWheelHandler(e)}, false);

        this.newMainDiv.onscroll = function(e) { self.scrolling(); return false; }

        this.DisplayScrollbar();

        this.refresh();
        window.addEventListener('resize', function(){self.refresh()}, false);

        this.utilize         = function() { return this.newMainDiv; }
        this.adjustScrollSize     = function() { this.DisplayScrollbar(); }

        this.RTCLog     = new OBJ(this);
        //this.fileLog     = new OBJ2(this);
    }

    var OBJ = function(obj) { this.obj = obj; }
    var OBJ2 = function(obj) { this.obj = obj; }

    OBJ.prototype.log = function(msg,error) {
            var p = document.createElement('p')
            p = this.obj.newMainDiv.appendChild(p);
            var span = p.appendChild(document.createElement('span'));
            span.className = 'instance';
            span.appendChild(document.createTextNode('_RTC_CORE_: '));
            p.appendChild(document.createTextNode(msg));
            if (error) p.className = 'consoleImportantInformation';

            this.obj.DisplayScrollbar();
            this.obj.newMainDiv.scrollTop+=10000;
    }

    OBJ2.prototype.fileLog = function(msg,error) {
        var p = document.createElement('p')
        p = this.obj.newMainDiv.appendChild(p);
        var span = p.appendChild(document.createElement('span'));
        span.className = 'instance';
        span.appendChild(document.createTextNode('_FILE_: '));
        p.appendChild(document.createTextNode(msg));
        if (error) p.className = 'criticalWarning';

        this.obj.DisplayScrollbar();
        this.obj.newMainDiv.scrollTop+=10000;
    }
/**************************** GENERAL CONSOLE MESSAGE PROTOTYPES ********************/
    logScrollbar.prototype.log = function(msg,error) {
        var p = document.createElement('p')
        p = this.newMainDiv.appendChild(p);
        p.appendChild(document.createTextNode(msg));
        if (error) p.className = 'consoleImportantInformation';

        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    logScrollbar.prototype.RTCLog = function(msg,error) {


        var p = document.createElement('p')
        p = this.newMainDiv.appendChild(p);
        var span = p.appendChild(document.createElement('span'));
        span.className = 'instance';
        span.appendChild(document.createTextNode('_RTC_CORE_: '));
        p.appendChild(document.createTextNode(msg));
        if (error) p.className = 'consoleImportantInformation';

        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    logScrollbar.prototype.fileLog = function(msg,error) {
        var p = document.createElement('p')
        p = this.newMainDiv.appendChild(p);
        var span = p.appendChild(document.createElement('span'));
        span.className = 'instance';
        span.appendChild(document.createTextNode('_FILE_: '));
        p.appendChild(document.createTextNode(msg));
        if (error) p.className = 'criticalWarning';

        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    logScrollbar.prototype.P2PLog = function(msg, error) {
        var p = document.createElement('p')
        p = this.newMainDiv.appendChild(p);
        var span = p.appendChild(document.createElement('span'));
        span.className = 'instance';
        span.appendChild(document.createTextNode('P2P: '));
        p.appendChild(document.createTextNode(msg));
        if (error) p.className = 'criticalWarning';

        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    logScrollbar.prototype.alert = function(msg) {
        var p = document.createElement('p')
        p = this.newMainDiv.appendChild(p);
        p.appendChild(document.createTextNode(msg));
        p.className = 'criticalWarning';

        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }

    logScrollbar.prototype.clear = function () {
        console.log('clear Event trigered');
        clearTimeout(this.scrollingTimeout);
        this.scrollContinue = 0;
        return false;
    }
    logScrollbar.prototype.arrow_scroll = function () {
        if (this.scrollContinue != 0) {
            self=this;
            this.newMainDiv.scrollTop += 6 * this.scrollContinue / 2;            // this.conteiner.ratio
            this.scrollingTimeout = setTimeout(function(){self.arrow_scroll()}, this.scrollInverseSpeed);
            this.scrollInverseSpeed = 10;                                // enchainement && vitesse scroll pour un appui long
        }
    }
    logScrollbar.prototype.mousedown = function (o, s) {                                // event : Scroll on mouse down
        if (this.scrollContinue == 0) {
            this.scrollContinue = s;
            this.scrollInverseSpeed = 400;                                // setFirstTimeout: Attente après 1er appuis sur souris
            this.arrow_scroll();
        }
    }
    logScrollbar.prototype.MouseWheelHandler = function(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.newMainDiv.scrollTop+=(delta >0?-20:20);
        //console.log('mouseWheel ScrollTop:'+this.newMainDiv.scrollTop);
        return false;
    }
    logScrollbar.prototype.moveCursor = function(e) {
        var pageY = e.pageY-1;                            // pageY=0 doesn't exist. First began at 1(y). [->correction: -1]
        var H = this.newMainDiv.offsetTop +  this.scrollBarPixelSize;
        var T = this.realPixelHeight - (2 * this.scrollBarPixelSize);
        var scrollHeight = this.newMainDiv.scrollHeight;

        //console.log('moveCursor scrollTOP:'+((pageY-H)/T)*scrollHeight+' pageY:'+pageY+' H:'+H+' T:'+T+' scrollHeight:'+scrollHeight);
        this.newMainDiv.scrollTop=((pageY-H)/T)*scrollHeight;
    }
    logScrollbar.prototype.refresh = function () {
        this.ComputedStyle = window.getComputedStyle(this.conteiner,null).getPropertyValue("height");
        if (this.ComputedStyle.match(/\d+\.\d/g))     this.realPixelHeight = Math.round(this.ComputedStyle.match(/\d+\.\d/g)[0]);
        else                                 this.realPixelHeight = this.ComputedStyle.match(/\d+/g)[0];

        this.scrollDiv.style.height = this.newMainDiv.style.height = this.realPixelHeight+'px';

        console.log('computing');
        this.DisplayScrollbar();
        this.scrolling();
    }
    logScrollbar.prototype.DisplayScrollbar = function () {
        this.scrollDiv.style.display=(this.realPixelHeight<this.newMainDiv.scrollHeight?'block':'none');
        this.scrollHeight =  this.realPixelHeight - (2*this.scrollBarPixelSize);
        if (this.scrollHeight > 0)   { this.middleDiv.style.height     = this.scrollHeight +'px';        //regenerate middleDIV
                            this.scroller.style.height     = this.scrollHeight / this.newMainDiv.scrollHeight * 100+'%'; }
        else                     this.middleDiv.style.height     = this.scroller.style.height = '0px';
    }
    logScrollbar.prototype.scrolling = function () {
        var ratio = (this.realPixelHeight - (2 * this.scrollBarPixelSize)) / this.newMainDiv.scrollHeight;
        //this.scroller.style.top = Math.floor((this.scrollBarPixelSize) + this.newMainDiv.scrollTop * ratio) + 'px';
        this.scroller.style.top = ((this.scrollBarPixelSize) + this.newMainDiv.scrollTop * ratio) + 'px';
    }
    logScrollbar.prototype.createImgElement = function (src,parent,style) {
        var img = document.createElement('img');
        img.src = src;
        img.className = style;
        img = parent.appendChild(img);
        return img;
    }

/*** Forme plus simple de scrollbar sans les deux boutons mais plus fûtée aussi. ***/
    var contextScrollbar = function (ID,ratioHeight,ratiowidth) {
        var self = this;

        this.contextRatio = ratioHeight;

        this.conteiner=document.getElementById(ID);
        this.conteiner.style.overflow = 'hidden';

        var cloneDiv=this.conteiner.cloneNode(true);
        while (this.conteiner.firstChild)     this.conteiner.removeChild(this.conteiner.firstChild);

        this.scrollDiv = this.scrollDivCreater();

        this.newMainDiv = document.createElement('div');
        this.newMainDiv.className = 'contextScrollbarMainDiv';
        this.newMainDiv = this.conteiner.appendChild(this.newMainDiv);
        while (cloneDiv.firstChild)     this.newMainDiv.appendChild(cloneDiv.firstChild);

        this.newMainDiv.style.overflow='hidden';
        this.newMainDiv.scrollTop = 0;

        this.scroller    = document.createElement('div');
        this.scroller.className= 'contextMiddle';
        this.scroller     = this.scrollDiv.appendChild(this.scroller);

        /* DETERMINE WIDTH VALUE */
        this.scrollBarViewWidth = ratiowidth;                                            // Initial Width Ratio
        this.scrollBarPixelSize = Math.floor(this.scrollBarViewWidth*(window.innerWidth/100));
        console.log('scrollBarPixelSize:'+this.scrollBarPixelSize);

        /* SET WIDTH PROPOTIONS */
        this.scroller.style.width  = this.scroller.style.top = this.scrollDiv.style.width
        = this.scrollBarPixelSize+'px';
        /** END PROPOTIONS */

        this.scrollDiv.onmousedown                    =     function(e) { self.moveCursor(e); return false; }
        this.scrollDiv.onmousemove =  this.scroller.onmousemove =     function(e) { if (documentEventMouseDown)self.moveCursor(e); return false; }

        this.newMainDiv.addEventListener(mousewheelevt, function(e) {self.MouseWheelHandler(e)}, false);
        this.newMainDiv.onscroll = function(e) { self.scrolling(); return false; }

        this.DisplayScrollbar();
        this.refresh();

        window.addEventListener('resize', function(){self.refresh()}, false);
    }
    contextScrollbar.prototype.scrollDivCreater = function() {
        var scrollDiv = document.createElement('div');
        scrollDiv.className='contextScrollbar';
        scrollDiv = this.conteiner.appendChild(scrollDiv);
        scrollDiv.style.position='relative';
        scrollDiv.style.display='none';
        return scrollDiv;
    }
    contextScrollbar.prototype.utilize                 = function(){ return this.newMainDiv; }
    contextScrollbar.prototype.adjustScrollSize          = function(){ this.DisplayScrollbar();}
    contextScrollbar.prototype.refreshWindow = function() {
        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    contextScrollbar.prototype.log = function(msg) {
        this.newMainDiv.innerHTML+='<p>'+msg+'</p>';
        this.DisplayScrollbar();
        this.newMainDiv.scrollTop+=10000;
    }
    contextScrollbar.prototype.inform = function(msg) {

    }
    contextScrollbar.prototype.alert = function(msg) {

    }
    contextScrollbar.prototype.MouseWheelHandler = function(e) {
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        this.newMainDiv.scrollTop+=(delta >0?-20:20);
        //console.log('mouseWheel ScrollTop:'+this.newMainDiv.scrollTop);
        return false;
    }
    contextScrollbar.prototype.moveCursor = function(e) {
        var pageY = e.pageY-1;
        var H = this.conteiner.offsetTop +  (this.realPixelHeight*(1-this.contextRatio)/2);
        var T = this.realPixelHeight - (this.realPixelHeight*(1-this.contextRatio));
        var scrollHeight = this.newMainDiv.scrollHeight;
        this.newMainDiv.scrollTop=((pageY-H)/T)*scrollHeight;
        //console.log('moveCursor scrollTOP:'+((pageY-H)/T)*scrollHeight+' pageY:'+pageY+' H:'+H+' T:'+T+' scrollHeight:'+scrollHeight);
    }
    contextScrollbar.prototype.refresh = function () {
        this.ComputedStyle = window.getComputedStyle(this.conteiner,null).getPropertyValue("height");
        if (this.ComputedStyle.match(/\d+\.\d/g))     this.realPixelHeight = Math.round(this.ComputedStyle.match(/\d+\.\d/g)[0]);
        else                             this.realPixelHeight = this.ComputedStyle.match(/\d+/g)[0];
        this.newMainDiv.style.height     = this.realPixelHeight+'px';

        this.scrollDiv.style.height     = this.realPixelHeight*this.contextRatio+'px';
        this.scrollDiv.style.top        = this.realPixelHeight*((1-this.contextRatio)/2)+'px';

        this.DisplayScrollbar();
        this.scrolling();
    }
    contextScrollbar.prototype.DisplayScrollbar = function () {
        this.scrollDiv.style.display=(this.realPixelHeight<this.newMainDiv.scrollHeight?'block':'none');
        this.scrollHeight = this.realPixelHeight*this.contextRatio;
        if (this.scrollHeight > 0)   {
                            this.scroller.style.height = this.realPixelHeight / this.newMainDiv.scrollHeight * 100+'%'; }
        else                     this.scroller.style.height = '0px';
    }
    contextScrollbar.prototype.scrolling = function () {
        var ratio = (this.contextRatio*this.realPixelHeight) / this.newMainDiv.scrollHeight;

        this.scroller.style.top = (0 + this.newMainDiv.scrollTop * ratio) + 'px';

        var math = Math.floor(this.newMainDiv.scrollTop/this.newMainDiv.scrollHeight*256);
        this.scroller.style.backgroundColor='rgb('+math+', 0, '+(255-math)+')';
    }

    var mouseFonctions = (function() {            /*** FONCTION CONFIGUREE POUR TOUJOURS RENVOYER LA DIV COURANTE    ***/
        var mouseConstructor = function(){
            this.mouse_X = null;
            this.mouse_Y = null;
            this.id = null;
            this.tag = null;
            this.class = null;
            self = this;
            var _isGecko=window.Event?1:0;     // navigateurs Gecko ou IE -- console.log('_isGecko vaut:'+_isGecko);

            var evalMouse = function(e) {
                var element=_isGecko?e.target:event.srcElement;         //objet sous la souris

                //console.log('targer:'+e.target+' parentNode:'+e.target.parentNode+' id:'+e.target.parentNode.id+' tagname:'+e.target.tagName+ ' reId:'+e.target.parentNode.id+ 'tag:'+e.target.tagName+' secondID:'+e.target.id);
                //self.id = element.id;
                //console.log('superID:'+self.id);
                //Description du bug recontré: Dans le cas d'une balise <p>, <span>, <img> etc... HTML quoi, on doit remonter...
                //... au parent. Dans le cas ou la souris pointe déjà sur une <div>, on ne fait que renvoyer l'id de la div pointée.

                if (e.target.tagName != 'DIV')    self.id=element.parentNode.id;
                else                         self.id=element.id;

                self.class      = e.target.className;
                self.tag      = e.target.tagName;
                self.mouse_X = e.pageX;
                self.mouse_Y = e.pageY;
                console.log('Xmouse='+self.mouse_X +' Ymouse='+self.mouse_Y+' ID:'+self.id+' tag:'+self.tag+' classe:'+self.class);
            }
            console.log('activation de la détéction souris');
            document.onmousemove=evalMouse;
        }
        return mouseConstructor;
    })();

    var manageScroll = function() {            /*** FONCTION CONFIGUREE POUR EXCLURE DES DIVS A NE PAS SCROLLER. ***/
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
            if (delta > 0)     scroll(-1);
            else            scroll(+1);
            return false;
        }
        document.addEventListener(mousewheelevt, MouseWheelHandler, false);
    }

/* Unique : -> no prototypes (outdated: à revoir.*/
    var toolbar = function() {
        var toolbar = document.getElementById("toolbar");        // DOM générale - var. globale.
        var menuItem = toolbar.getElementsByClassName("menuItem")    // DOM générale    - var. globale.
        var itemManager = (function()                    // GESTION DE LA BARRE D'OUTIL:
        {
            var unselectedColorItem     = 'rgb(200, 100, 0)';            // Couleur du menu déssélectionné.
            var selectedColorItem        = 'rgb(255, 255,   0)';            // Couleur du menu selectionné.
            var i;                                // Variable à la con.
            var state;                                // Aide à renvoyer l'état de la comande, enable or disable.
            var item = new Array();                        // Ici seront définies les différentes taches propres à chaque menu
            item[0] = function(state) { console.log("Lancement des routines de l'item 1. - Etat on-off="+state);}
            item[1] = function(state) { console.log("Lancement des routines de l'item 2. - Etat on-off="+state);}
            item[2] = function(state) { console.log("Lancement des routines de l'item 3. - Etat on-off="+state);}
            item[3] = function(state) { console.log("Lancement des routines de l'item 4. - Etat on-off="+state);}

            function selectItem(itemObj){
                for (i=0; i<menuItem.length; i++) if(itemObj == menuItem[i]) break;

                if (itemObj.style.borderColor == unselectedColorItem)    { itemObj.style.borderColor=selectedColorItem;   state=true;  }
                else                                    { itemObj.style.borderColor=unselectedColorItem; state=false; }
                item[i](state);
            }

            for (i=0; i<menuItem.length; i++)                     // Création des contours des menus selon la couleur unselected et association des events clics de souris.
            {
                menuItem[i].style.borderColor = unselectedColorItem;
                menuItem[i].onclick=function(){selectItem(this)};
            }
            return function(){ /* Ici pourront figurer des fonctions pouvant être appelées par le programme de facon globale et jouant sur les items style unselected All par exemple.*/
                alert("C'est un gros Lolo qui fait des petits avec un gros Thibaud.");
            };
        })();
        /***  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ***/
        //var toolbarWidthLimit=toolbar.offsetWidth;                         // GESTION DE L'ECRAN ET DES EVENTS SOURIS
    }

/* Gestion des messages de la pachy box. ATTENTION utilise div chatTab */
    this.displayMsg = (function () {
        // En mode strict, une fonction ne peut pas etre déclarée dans un FOR, IF, SWITCH etc...
        var animal = new Array('elephant1','elephant2','elephant3','elephant4','elephant5','elephant6','vache1','vache2','cochon1');
        function find_animal() {return "medias/animal/" + animal[Math.floor(Math.random() * 9)] + ".ogg";}
        var soundAnimal = document.createElement("Audio");
        return function(user,message) {
            if (message) {
                var msg;
                switch (message)         {
                    case '/kick':
                        msg="<span class='commentChatbox'>Au loin, l'on entend crier un animal</span><br>";
                        soundAnimal.src = find_animal();
                        soundAnimal.play();
                        break;
                    case '/roll':
                        var nbr = Math.floor(Math.random() * 7);
                        if (nbr)    msg="<span class='commentChatbox'>"+user+" lance les dés et obtient "+nbr+"</span><br>";
                        else        msg="<span class='commentChatbox'>"+user+" lance les dés et obtient "+nbr+" ! Mouhaha !</span><br>";
                        break;
                    default:
                        msg="<span class='userSpeakChatbox'>"+user+':</span>'+message+'<br>';
                        break;    }
                chatTab.log(msg);
            }
        }
    })();
    this.sendMsg = (function () {
        var localUser = false;
        var sendBox = document.getElementById('sendBox');
        return function() {
            if (!localUser)                 localUser=_RTC_CORE_.getLocalUser();
            var message = sendBox.value;
            if (message) {
                if(!_RTC_CORE_.sendMsg(message))        this.console.alert("_RTC_CORE_ response -> critical warning. You're just talking to the wind.")
                else    this.displayMsg(localUser,message);
                sendBox.value='';
            }
            sendBox.focus();
        }
    })();

    //var mouse = new mouseFonctions();
    //var Z = new manageScroll();

    var toolbar          = new toolbar();
    this.console    = new logScrollbar('consoleTab');

    var chatTab     = new contextScrollbar('chatTab',0.8,1.6);
    this.fileTab     = new contextScrollbar('files',0.8,1.2);

    document.getElementById('file-upload').onchange = function() { _FILE_.addLocalFile(this.files); }

    this.console.log('_DOM_ successfully loaded.',1);
}
