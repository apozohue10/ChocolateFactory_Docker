var WIDTH = 450;
var HEIGHT = 300;
var flickerInterval;
var switchTimeout;
var isOn = [false, false, false, false, false, false, false, false, false, false];
ctxArray = []
imgDataArray = []
pixArray = []
flickerIntervalArray = ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none"]
powerValue = 0;
tvValue = 0;

var Application = ( function() {

	var init = function() {
		config('canvas1', 'screenOff1')
		config('canvas2', 'screenOff2')
		config('canvas3', 'screenOff3')
		config('canvas4', 'screenOff4')
		config('canvas5', 'screenOff5')
		config('canvas6', 'screenOff6')
		config('canvas7', 'screenOff7')
		config('canvas8', 'screenOff8')
		config('canvas9', 'screenOff9')
		config('canvas10', 'screenOff10')

		document.getElementById('power').innerHTML = "0";
		document.getElementById('tv').innerHTML = "0";
		document.getElementById('temp').innerHTML = "0";
		document.getElementById('press').innerHTML = "0";
	};

	return {
		init : init
	};
}());

Application.init();

function config(canvas, classList) {
	canvas = document.getElementById(canvas);
	ctx = canvas.getContext('2d');
	canvas.width = WIDTH ;
	canvas.height = HEIGHT;
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	ctx.fill();
	ctxArray.push(ctx);
	imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
	imgDataArray.push(imgData);
	pix = imgData.data;
	pixArray.push(pix);
	document.body.classList.add(classList);
}

function flickering (screen, f) {
	for (var i = 0; i < pixArray[f].length; i += 4) {
		var color = (Math.random() * 255) + 50;
		pixArray[f][i] = color; flickering
		pixArray[f][i + 1] = color;
		pixArray[f][i + 2] = color;
	}
	screen.putImageData(imgDataArray[f], 0, 0);
};

function toggleScreen (screen, classList, i) {
	if ( typeof switchTimeout != 'undefined') {
		clearTimeout(switchTimeout);
	}
	if (isOn[i]) {
		console.log("off")
		// if (powerValue > 0) {
		// 	powerValue = powerValue - 500
		// 	document.getElementById('power').innerHTML = powerValue;
		// 	tvValue = tvValue - 1
		// 	document.getElementById('tv').innerHTML = tvValue;
		// }
		clearInterval(flickerIntervalArray[i]);
		flickerIntervalArray[i] = "none"
		document.body.classList.add(classList);
		screen.fillStyle = 'black';
		screen.fillRect(0, 0, WIDTH, HEIGHT);
		screen.fill();
	} else {
		console.log("on")
		// powerValue = powerValue + 500
		// document.getElementById('power').innerHTML = powerValue;
		// tvValue = tvValue + 1;
		// document.getElementById('tv').innerHTML = tvValue;
		document.body.classList.remove(classList);
		flickerInterval = setInterval(function() {
			flickering(screen, i)
		}, 50);
		flickerIntervalArray[i] = flickerInterval
	}
	isOn[i] = !isOn[i];
};