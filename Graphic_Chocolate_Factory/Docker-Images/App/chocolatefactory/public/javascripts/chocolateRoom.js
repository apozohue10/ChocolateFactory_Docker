var socket = io();



socket.on("updateCR", function (data){
	console.log(data)
	document.getElementById('tempValue').innerHTML = Math.round(data.Temperature.value);
	document.getElementById('pressValue').innerHTML = Math.round(data.Pressure.value);
	document.getElementById('riverValue').innerHTML = Math.round(data.River_level.value);
	document.getElementById('speedValue').innerHTML = Math.round(data.Waterfall_speed.value);

	setWaterLevel(data.River_level.value);
	speedWaterfall(data.Waterfall_speed.value/100);

	percent = 5.5*(10 - (data.River_level.value/10))
	waterFallSettings.percent = percent
	waterFallSettings.count = data.River_level.value
	setWaterFall (percent)
	
});

socket.on("riverChoc", function (data){
	console.log(data)
	if(data.status == 200){
		upOrDownWater(data.incr)
        console.log("Update accepted")
	} else if(data.status == 401) {
		alert("You are not authorized to change the river level")
	} else {
		alert("Error in Pep Proxy communication")
	}
});

socket.on("waterCho", function (data){
	console.log(data)
	if(data.status == 200){
		speedWaterfall(data.incr)
        console.log("Update accepted")
	} else if(data.status == 401) {
		alert("You are not authorized to change the waterfall speed")
	} else {
		alert("Error in Pep Proxy communication")
	}
});

function updateRequest(event, incr) {
	if (event == "speed") {
		currentSpeed = parseInt(document.getElementById('speedValue').innerHTML)
		if (incr == "plus") {
			if (currentSpeed >= 100) {
				alert("Is in the maximum speed");
			} else {
				currentSpeed = currentSpeed + 10
			}
		} else if (incr == "minus") {
			if (currentSpeed <= 0) {
				alert("Is in the minimu speed");
			} else {
				currentSpeed = currentSpeed - 10
			}
		}
		socket.emit("subwaterfall", {waterValue: currentSpeed, incr: incr});

	} else if (event =="river") {
		currentLevel = parseInt(document.getElementById('riverValue').innerHTML)
		if (incr == "plus") {
			if (currentLevel >= 100) {
				alert("Is in the maximum level");
			} else {
				currentLevel = currentLevel + 10
			}
		} else if (incr == "minus") {
			if (currentLevel <= 0) {
				alert("Is in the minimum level");
			} else {
				currentLevel = currentLevel - 10
			}
		}
		socket.emit("subriver", {riverValue: currentLevel, incr: incr});
	}
}

btnElm = document.getElementById('plusSpeed');
btnElm.addEventListener('click', function() {
	updateRequest('speed', 'plus')
	// speedWaterfall('plus')
}, false);
btnElm = document.getElementById('minusSpeed');
btnElm.addEventListener('click', function() {
	updateRequest('speed', 'minus')
	// speedWaterfall('minus')
}, false);
btnElm = document.getElementById('plusRiver');
btnElm.addEventListener('click', function() {
	updateRequest('river', 'plus')
	// upOrDownWater('plus')
}, false);
btnElm = document.getElementById('minusRiver');
btnElm.addEventListener('click', function() {
	updateRequest('river', 'minus')
	// upOrDownWater('minus')
}, false);