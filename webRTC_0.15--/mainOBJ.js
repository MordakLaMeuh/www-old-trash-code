var scrollbar = (function() {
	var aConts  = new Array();
	var mouseY = 0;
	var N  = 0;
	var asd = 0; /*active scrollbar element*/
	var sc = 0;
	var sp = 0;
	var to = 0;

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

    // create and append div finc
	var create_div = function(c, cont, cont_clone) {
		var o = document.createElement('div');
		o.cont = cont;
		o.className = c;
		cont_clone.appendChild(o);
		return o;
	}
    // do clear of controls
/*	var clear = function () {
		clearTimeout(to);
		sc = 0;
		return false;
	}*/
    // refresh scrollbar
	var refresh = function () {
		for (var i = 0, x = N; i < x; i++) {
			var o = aConts[i];
			o.ssb_onscroll();
			o.sb.style.width = o.st.style.width = o.su.style.width = o.su.style.height = o.sd.style.width = o.sd.style.height = o.sw + 'px';
			o.sb.style.height = Math.ceil(Math.max(o.sw * .5, o.ratio * o.offsetHeight) + 1) + 'px';
		}
	};
	// arrow scrolling
	var arrow_scroll = function () {
		if (sc != 0) {
			asd.scrollTop += 6 * sc / asd.ratio;
			to = setTimeout(arrow_scroll, sp);
			sp = 32;
		}
	}

	/* event binded functions : */
	// scroll on mouse down
	var mousedown = function (o, s) {
		if (sc == 0) {
			// new class name
			o.cont.sb.className = 'ssb_sb ssb_sb_down';
			asd = o.cont;
			sc = s;
			sp = 400;
			arrow_scroll();
		}
	}
	// on mouseMove binded event
	var onmousemove = function(e) {
		if (! e) e = window.event;
		// get vertical mouse position
		mouseY = e.screenY;
		if (asd.sg) asd.scrollTop = asd.sZ + (mouseY - asd.yZ) / asd.ratio;
	};
	// on mouseUp binded event
	var onmouseup = function (e) {
		/*** A VOIR ! ***/
		//if (! e) e = window.event;
		//var tg = (e.target) ? e.target : e.srcElement;
		//if (asd && document.releaseCapture) asd.releaseCapture();

		// new class name
		//if (asd) asd.sb.className = (tg.className.indexOf('scrollbar') > 0) ? 'ssb_sb ssb_sb_over' : 'ssb_sb';
		/*document.onselectstart = '';
		clear();*/
		asd.sg = false;
	}

	// constructor
	function makeScrollbar(cont_id) {
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

		// adding new container into array
		aConts[N++] = cont;

		cont.sg = false;

		//creating scrollbar child elements
		cont.st = create_div('ssb_st', cont, cont_clone);
		cont.sb = create_div('ssb_sb', cont, cont_clone);
		cont.su = create_div('ssb_up', cont, cont_clone);
		cont.sd = create_div('ssb_down', cont, cont_clone);



		// on mouse down processing
		cont.sb.onmousedown = function (e) {
			if (! cont.sg) {
				if (! e) e = window.event;

				asd = cont;
				cont.yZ = e.screenY;
				cont.sZ = cont.scrollTop;
				cont.sg = true;

				// new class name
				this.className = 'ssb_sb ssb_sb_down';
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

		// onmousedown events
		cont.su.onmousedown = cont.su.ondblclick = function (e) { mousedown(this, -1); return false; }
		cont.sd.onmousedown = cont.sd.ondblclick = function (e) { mousedown(this,  1); return false; }

		//onmouseout events
		cont.su.onmouseout = cont.su.onmouseup = clear;
		cont.sd.onmouseout = cont.sd.onmouseup = clear;

		// on mouse over - apply custom class name: ssb_sb_over
		cont.sb.onmouseover = function (e) {
			if (! this.cont.sg) this.className = 'ssb_sb ssb_sb_over';
			return false;
		}

		// on mouse out - revert back our usual class name 'ssb_sb'
		cont.sb.onmouseout  = function (e) {
			if (! this.cont.sg) this.className = 'ssb_sb';
			return false;
		}

		// onscroll - change positions of scroll element
		cont.ssb_onscroll = function () {
			this.ratio = (this.offsetHeight - 2 * this.sw) / this.scrollHeight;
			this.sb.style.top = Math.floor(this.sw + this.scrollTop * this.ratio) + 'px';
		}

		// scrollbar width
		cont.sw = 20;

		// start scrolling
		cont.ssb_onscroll();
		refresh();

		// binding own onscroll event
		cont.onscroll = cont.ssb_onscroll;
		//return cont;
	};
	return makeScrollbar;
})();

window.onload = function()
{
	var A = new scrollbar('main_content');
}