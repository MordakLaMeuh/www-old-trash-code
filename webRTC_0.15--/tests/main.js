var scrollbar = (function() {    
	var create_div = function(c, cont, cont_clone) {			// create and append div finc
		var o = document.createElement('div');
		o.cont = cont;
		o.className = c;
		cont_clone.appendChild(o);
		return o;
	}
	function makeScrollbar(cont_id) {			// constructor
		var mouseY = 0;
		var asd = 0;					 /*active scrollbar element*/
		var scrollContinue = 0;
		var scrollInverseSpeed = 0;
		var scrollingTimeout = 0;
		
		var init = function () {													// initialization
			if (window.oper || (! window.addEventListener && ! window.attachEvent)) { return false; }

			// temp inner function for event registration
			function addEvent (o, e, f) {
				if (window.addEventListener) { o.addEventListener(e, f, false); return true; }
				if (window.attachEvent) return o.attachEvent('on' + e, f);
				return false;
			}

			// binding events
			addEvent(window.document, 'mousemove', onmousemove);
			addEvent(window.document, 'mouseup', onmouseup);
			addEvent(window, 'resize', refresh);
			return true;
		}
		var clear = function () {					// do clear of controls
			clearTimeout(scrollingTimeout);
			scrollContinue = 0;
			return false;
		}
		// Gestion du scrolling à partir des boutons up et down: arrow_scroll && mousedown (event)				
		var arrow_scroll = function () {				
			if (scrollContinue != 0) {
				asd.scrollTop += 6 * scrollContinue / asd.ratio;
				scrollingTimeout = setTimeout(arrow_scroll, scrollInverseSpeed);
				scrollInverseSpeed = 10;	// enchainement && vitesse scroll pour un appui long
			}
		}
		var mousedown = function (o, s) {					// event : Scroll on mouse down 
			if (scrollContinue == 0) {
				asd = o.cont;
				scrollContinue = s;
				scrollInverseSpeed = 400;	// setFirstTimeout: Attente après 1er appuis sur souris
				arrow_scroll();
			}
		}
		var onmousemove = function(e) {		// on mouseMove binded event
			if (! e) e = window.event;
			mouseY = e.screenY;
			if (asd.sg) asd.scrollTop = asd.sZ + (mouseY - asd.yZ) / asd.ratio;
		}
	
		var onmouseup = function (e) {		// on mouseUp binded event
			asd.sg = false;
		}
				     
		var refresh = function () {
			var o=cont;
			o.ssb_onscroll();
			o.sb.style.width = o.st.style.width = o.arrowUp.style.width = o.arrowUp.style.height = o.arrowDown.style.width = o.arrowDown.style.height = o.sw + 'px';
			o.sb.style.height = Math.ceil(Math.max(o.sw * .5, o.ratio * o.offsetHeight) + 1) + 'px';
		}
		
		var cont = document.getElementById(cont_id);

		// perform initialization
		if (! init()) return false;
		
		var cont_clone = cont.cloneNode(false);
		cont_clone.style.overflow = "hidden";
		cont.parentNode.appendChild(cont_clone);
		cont_clone.appendChild(cont);
		cont.style.position = 'absolute';
		cont.style.left = cont.style.top = '0px';
		cont.style.width = cont.style.height = '100%';

		cont.sg = false;
	
		//creating scrollbar child elements
		cont.st = create_div('ssb_st', cont, cont_clone);
		cont.sb = create_div('ssb_sb', cont, cont_clone);
		cont.arrowUp = create_div('ssb_up', cont, cont_clone);
		cont.arrowDown = create_div('ssb_down', cont, cont_clone);

		// on mouse down processing
		cont.sb.onmousedown = function (e) {
			if (! cont.sg) {
				if (! e) e = window.event;

				asd = cont;
				cont.yZ = e.screenY;
				cont.sZ = cont.scrollTop;
				cont.sg = true;
			}
			return false;
		}
		// on mouse down on free track area - move our scroll element too
		cont.st.onmousedown = function (e) {
			if (! e) e = window.event;
			asd = this.cont;

			mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			for (var o = this.cont, y = 0; o != null; o = o.offsetParent) y += o.offsetTop;
			this.cont.scrollTop = (mouseY - y - (this.cont.ratio * this.cont.offsetHeight / 2) - this.cont.sw) / this.cont.ratio;
			this.cont.sb.onmousedown(e);
		}

		// onmousedown events : EVENTs --- Gestion des flêches down && up.
		cont.arrowUp.onmousedown = function (e) 	{ mousedown(this, -1); return false; }
		cont.arrowDown.onmousedown = function (e) { mousedown(this,  1); return false; }

		//onmouseout events   : EVENTs --- Relachement de la souris, stope le scrolling qui s'est automatiquement lancé.
		cont.arrowUp.onmouseout = cont.arrowUp.onmouseup = clear;
		cont.arrowDown.onmouseout = cont.arrowDown.onmouseup = clear;

		// onscroll - change positions of scroll element : Gestion de la barre mouvante.L
		cont.ssb_onscroll = function () {
			this.ratio = (this.offsetHeight - 2 * this.sw) / this.scrollHeight;
			this.sb.style.top = Math.floor(this.sw + this.scrollTop * this.ratio) + 'px';
		}
		cont.sw = 20;				// scrollbar width
		cont.ssb_onscroll();			// start scrolling
		
		refresh();
        
		cont.onscroll = cont.ssb_onscroll;	// EVENT --- binding own onscroll event		
	};
	return makeScrollbar;	
})();

window.onload = function() 
{	
	var A = new scrollbar('main_content');
}