"use strict";
var moveObj = function(ID) {
	var element = ID;
	var run_Move = function() {
		mouse.activeMovefunction(element);
		window.addEventListener('mouseup',stop_Move,false);
	}
	var stop_Move = function() {
		mouse.stopMoveFunction(element);
		window.removeEventListener('mouseup',stop_Move,false);
	}
	element.addEventListener('mousedown',run_Move,false);
}

// BROUILLON approximatif
var moveRabbit = function(ID) {
	var element = ID;

	var origin_X, destination_X;
	var origin_Y, destination_Y;

	var direction;
	var ratio_X, diff_X;
	var ratio_Y, diff_Y;

	var timeout = false;
	var i=0;

	var rabbit_Destination = function(e) {
		window.removeEventListener('mouseup',rabbit_Destination,false);

		direction=(e.pageX < origin_X)?1:(-1);
		element.style.transform = 'scaleX('+direction+')';

		origin_X -= diff_X;

		destination_X = e.pageX-diff_X;
		destination_Y = e.pageY-diff_Y;

		ratio_X = (destination_X - origin_X)/50;
		ratio_Y = (destination_Y - origin_Y)/50;

		i=0;
		console.log(ratio_X);
		timeout = setInterval(function(){
			if (((element.offsetLeft+ratio_X) < 0) || (element.offsetLeft+element.offsetWidth+ratio_X) > screen.width) {
				ratio_X = (ratio_X * -1);
				direction = (direction * -1);
				element.style.transform = 'scaleX('+direction+')';

				origin_X = element.offsetLeft;
				origin_Y = element.offsetTop;
				i = 0;
			}
			if (((element.offsetTop+ratio_Y) < 0) || (element.offsetTop+element.offsetHeight+ratio_Y) > screen.height) {
				ratio_Y = (ratio_Y * -1);

				origin_X = element.offsetLeft;
				origin_Y = element.offsetTop;
				i = 0;
			}
			i++;
			element.style.left	= origin_X+(i*ratio_X)+'px';
			element.style.top 	= origin_Y+(i*ratio_Y)+'px';
		},50);
	}
	var rabbit_Origin = function(e) {
		window.addEventListener('mouseup',rabbit_Destination,false);
		clearTimeout(timeout);
		diff_X   = e.pageX - element.offsetLeft;
		diff_Y 	 = e.pageY - element.offsetTop;
		origin_X = e.pageX;
		origin_Y = e.pageY - diff_Y;
	}
	element.addEventListener('mousedown',rabbit_Origin,false);
}