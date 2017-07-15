var socket = io();


arrayTVs =["TV1_on","TV2_on","TV3_on","TV4_on","TV5_on","TV6_on","TV7_on","TV8_on","TV9_on","TV10_on"]

socket.on("updateTR", function (data){
	console.log(data)
	document.getElementById('power').innerHTML = Math.round(data.Power_consumed.value);
	document.getElementById('temp').innerHTML = Math.round(data.Temperature.value);
	document.getElementById('press').innerHTML = Math.round(data.Pressure.value);
	tvs_on (data)
	if (Math.round(data.Power_consumed.value) == 0) {
		count = 0
	} else {
		count = Math.round(data.Power_consumed.value)/500
	}
	document.getElementById('tv').innerHTML = count;
});

socket.on("switch", function (data){
	console.log(data)
	if(data.status == 200){
		index = data.index + 1
		screen = "screenOff"
        screenVal = screen.concat(index.toString())
        toggleScreen(ctxArray[data.index], screenVal, data.index)
        console.log("Update accepted")
	} else if(data.status == 401) {
		alert("You are not authorized to turn on or down a TV")
	} else {
		alert("Error in Pep Proxy communication")
	}
});


function tvs_on (data) {
	if (data.TV1_on.value == 1 && isOn[0] == false) {
		toggleScreen(ctxArray[0], 'screenOff1', 0)
	}
	if (data.TV2_on.value == 1 && isOn[1] == false) {
		toggleScreen(ctxArray[1], 'screenOff2', 1)
	}
	if (data.TV3_on.value == 1 && isOn[2] == false) {
		toggleScreen(ctxArray[2], 'screenOff3', 2)
	}
	if (data.TV4_on.value == 1 && isOn[3] == false) {
		toggleScreen(ctxArray[3], 'screenOff4', 3)
	}
	if (data.TV5_on.value == 1 && isOn[4] == false) {
		toggleScreen(ctxArray[4], 'screenOff5', 4)
	}
	if (data.TV6_on.value == 1 && isOn[5] == false) {
		toggleScreen(ctxArray[5], 'screenOff6', 5)
	}
	if (data.TV7_on.value == 1 && isOn[6] == false) {
		toggleScreen(ctxArray[6], 'screenOff7', 6)
	}
	if (data.TV8_on.value == 1 && isOn[7] == false) {
		toggleScreen(ctxArray[7], 'screenOff8', 7)
	}
	if (data.TV9_on.value == 1 && isOn[8] == false) {
		toggleScreen(ctxArray[8], 'screenOff9', 8)
	}
	if (data.TV10_on.value == 1 && isOn[9] == false) {
		toggleScreen(ctxArray[9], 'screenOff10', 9)
	}

}

function updateRequest (index) {
	if (isOn[index] == false) {
		switchON = 1
		powerValue = parseInt(document.getElementById('power').innerHTML)
		powerValue = powerValue + 500
		count = count + 1
	} else {
		switchON = 0
		powerValue = parseInt(document.getElementById('power').innerHTML)
		if (powerValue <= 0) {
			alert("Fail")
		} else {
			powerValue = powerValue - 500
			count = count - 1
		}
	}
	console.log(arrayTVs[index])
	nameTv = arrayTVs[index]
    socket.emit("subtelevision", {tvName: nameTv, switchON: switchON, powerValue: powerValue, index: index});
}



btnElm = document.getElementById('btn1');
btnElm.addEventListener('click', function() {
	updateRequest(0)
}, false);
btnElm = document.getElementById('btn2');
btnElm.addEventListener('click', function() {
	updateRequest(1)
}, false);
btnElm = document.getElementById('btn3');
btnElm.addEventListener('click', function() {
	updateRequest(2)
}, false);
btnElm = document.getElementById('btn4');
btnElm.addEventListener('click', function() {
	updateRequest(3)
}, false);
btnElm = document.getElementById('btn5');
btnElm.addEventListener('click', function() {
	updateRequest(4)
}, false);
btnElm = document.getElementById('btn6');
btnElm.addEventListener('click', function() {
	updateRequest(5)
}, false);
btnElm = document.getElementById('btn7');
btnElm.addEventListener('click', function() {
	updateRequest(6)
}, false);
btnElm = document.getElementById('btn8');
btnElm.addEventListener('click', function() {
	updateRequest(7)
}, false);
btnElm = document.getElementById('btn9');
btnElm.addEventListener('click', function() {
	updateRequest(8)
}, false);
btnElm = document.getElementById('btn10');
btnElm.addEventListener('click', function() {
	updateRequest(9)
}, false);