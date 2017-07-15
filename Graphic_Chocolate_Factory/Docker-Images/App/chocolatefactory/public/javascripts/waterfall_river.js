///////////////////////
////// WATERFALL
///////////////////////

contWaterfall = document.getElementById('container')
var waterFallSettings = {
  height: contWaterfall.offsetHeight,
  heightMax: 280,
  width: contWaterfall.offsetWidth,
  count: 100,
  percent: 0,
  speed: 0.2 
}


var waterfallCanvas = function(c, cw, ch){
  
  var _this = this;
  this.c = c;
  this.ctx = c.getContext('2d');
  this.cw = cw;
  this.ch = ch;     
  
  this.particles = [];
  this.particleRate = 6;
  this.gravity = waterFallSettings.speed;
          

  this.init = function(){       
    this.loop();
  };
  
  this.reset = function(){        
    this.ctx.clearRect(0,0,this.cw,this.ch);
    this.particles = [];
  };
        
  this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
  

  this.Particle = function(){
    var newWidth = _this.rand(1,20);
    var newHeight = _this.rand(1, 45);
    this.x = _this.rand(10+(newWidth/2), _this.cw-10-(newWidth/2));
    this.y = -newHeight;
    this.vx = 0;
    this.vy = 0;
    this.width = newWidth;
    this.height = newHeight;
    this.hue = _this.rand(24, 24);
    this.saturation = _this.rand(33, 60);
    this.lightness = _this.rand(10, 14);
  };
  
  this.Particle.prototype.update = function(i){
    this.vx += this.vx; 
    this.vy += _this.gravity;
    this.x += this.vx;
    this.y += this.vy;              
  };
  
  this.Particle.prototype.render = function(){      
    _this.ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .05)';
    _this.ctx.beginPath();
    _this.ctx.moveTo(this.x, this.y);
    _this.ctx.lineTo(this.x, this.y + this.height);
    _this.ctx.lineWidth = this.width/2;
    _this.ctx.lineCap = 'round';
    _this.ctx.stroke();
  };
  
  this.Particle.prototype.renderBubble = function(){        
    _this.ctx.fillStyle = 'hsla('+this.hue+', 40%, 40%, 1)';
    _this.ctx.fillStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .3)';
    _this.ctx.beginPath();
    _this.ctx.arc(this.x+this.width/2, _this.ch-20-_this.rand(0,10), _this.rand(1,8), 0, Math.PI*2, false);
    _this.ctx.fill();
  };
        
  this.createParticles = function(){
    var i = this.particleRate;
    while(i--){
      this.particles.push(new this.Particle());
    }
  };
  
  this.removeParticles = function(){
    var i = this.particleRate;
    while(i--){
      var p = this.particles[i];
      if(p.y > _this.ch-20-p.height){
        p.renderBubble();
        _this.particles.splice(i, 1);
      } 
    }
  };
          
  this.updateParticles = function(){          
    var i = this.particles.length;            
    while(i--){
      var p = this.particles[i];
      p.update(i);                      
    };            
  };
  
  this.renderParticles = function(){
    var i = this.particles.length;            
    while(i--){
      var p = this.particles[i];
      p.render();                     
    };          
  };
  
  this.clearCanvas = function(){        
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(255,255,255,.06)';
    this.ctx.fillRect(0,0,this.cw,this.ch);
    this.ctx.globalCompositeOperation = 'lighter';
  };
  
  this.loop = function(){
    var loopIt = function(){          
      requestAnimationFrame(loopIt, _this.c);         
        _this.clearCanvas();          
        _this.createParticles();          
        _this.updateParticles();          
        _this.renderParticles();  
        _this.removeParticles();
    };
    loopIt();         
  };

};

var isCanvasSupported = function(){
var elem = document.createElement('canvas');
return !!(elem.getContext && elem.getContext('2d'));
};

var setupRAF = function(){
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
  window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
};

if(!window.requestAnimationFrame){
  window.requestAnimationFrame = function(callback, element){
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
};

if (!window.cancelAnimationFrame){
  window.cancelAnimationFrame = function(id){
    clearTimeout(id);
  };
};
};      

if(isCanvasSupported()){
  var c = document.getElementById('waterfall');
  var cw = c.width = waterFallSettings.width;
  var ch = c.height = waterFallSettings.height; 
  var waterfall = new waterfallCanvas(c, cw, ch);       
  setupRAF();
  waterfall.init();
}



















///////////////////////
////// SCENE
///////////////////////
var renderer, scene, camera, controls, light;

var waterSettings = {
  base: 0.001,
  size: {
    x: 8,
    y: 0,
    z: 40
  },
  maxValue: 7,
  selected: 0,
  level: 1,
  slosh: 0.1,
  sloshRange: [0.5, 0.5],
  sections: 10,
  range: 0.05,
  ranges: [0.06, 0.05],
  spaceBetween: 20,
  speed: 0.05
}

var sceneSettings = {
  cameraZ: 0
}

var timeline = new TimelineMax();
var sloshAnimation = new TimelineMax();

var waterBlocks = [{
  title: 'One'
}, {
  title: 'Two'
}, {
  title: 'Three'
}, {
  title: 'Four'
}, {
  title: 'Five'
}, {
  title: 'Six'
}, {
  title: 'Seven'
}, {
  title: 'Eight'
}];

function init() {
	// renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

  container = document.getElementById('scene');
  //document.body.appendChild(container);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  //renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setSize(1500, 750);
	renderer.setClearColor(0x222428, 1);
	container.appendChild(renderer.domElement);

	// scene
	scene = new THREE.Scene();
  scene.translateX(-15)

	// camera
	var aspect = 2;
	var d = 30;
	camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	// materials
	var waterSides = new THREE.MeshPhongMaterial({
		color: 0x330000,
		side: THREE.DoubleSide,
		transparent: false,
		opacity: 0.8,
		//shading: THREE.FlatShading,
		specular: 0x4DBFE1,
		shininess: 5,
	});

	var waterTop = new THREE.MeshPhongMaterial({
		color: 0x330000,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: false,
		opacity: 0.9,
		specular: 0xFFFFFF,
		shininess: 10,
	});

	var materials = [waterSides, waterSides, waterTop, waterSides, waterSides, waterSides];


	//light
  light1 = new THREE.PointLight(0xffffff, 1, 2000, 14);
  light1.position.set(50, 50, -50);
  light2 = new THREE.PointLight(0xffffff, 1, 2000, 14);
  light2.position.set(50, 50, 50);
  light3 = new THREE.PointLight(0xffffff, 1, 2000, 14);
  light3.position.set(-50, 50, -50);
  light4 = new THREE.PointLight(0xffffff, 1, 2000, 14);
  light4.position.set(-50, 50, 50);
  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);

	///////////////////////////
	// ------GROUND------
	//////////////////////////

  var materialGrass = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/grass.jpg') } );
  var materialGrass1 = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/grass1.jpg') } );
  var materialChocolate = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/chocolate.jpg') } );

  // SHAPE GROUND LEFT RIVER
  var groundShape = new THREE.Shape();
  groundShape.moveTo(-4, 0);
  groundShape.lineTo(-4, -20);
  groundShape.quadraticCurveTo (-4, -28, 4, -28);
  groundShape.lineTo(16, -28);
  groundShape.lineTo(16, -36);
  groundShape.lineTo(-20, -36);
  groundShape.lineTo(-20, 28);
  groundShape.lineTo(-12, 28);
  groundShape.quadraticCurveTo (-12, 20, -4, 20);
  groundShape.lineTo(-4, 0);

  // GRASS LEFT RIVER
	var extrudeSettings = {amount: 0.5, curveSegments: 10, bevelEnabled: false};
	var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var max = { x: 16, y: 28};
  var min = { x: -20, y: -36};
  UVmappingXY(extrudeGeometry,min,max);

	var meshGrass = new THREE.Mesh(extrudeGeometry, materialGrass);
	meshGrass.position.y = 8.5;
	meshGrass.rotation.x = -Math.PI/2
	scene.add(meshGrass);

  // CHOCOLATE LEFT RIVER
  var extrudeSettings = {amount: 8.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var meshChocolate = new THREE.Mesh(extrudeGeometry, new THREE.MeshPhongMaterial({ color: 0x512000}));
  meshChocolate.rotation.x = -Math.PI/2
  scene.add(meshChocolate);

  // SHAPE GROUND RIGHT RIVER
  var groundShape = new THREE.Shape();
  groundShape.moveTo(4, 0);
  groundShape.lineTo(4, -20);
  groundShape.lineTo(16, -20);
  groundShape.quadraticCurveTo (24, -20, 24, -28);
  groundShape.lineTo(24, -36);
  groundShape.lineTo(28, -36);
  groundShape.lineTo(28, 28);
  groundShape.lineTo(12, 28);
  groundShape.quadraticCurveTo (12, 20, 4, 20);
  groundShape.lineTo(4, 0);

  // GRASS RIGHT RIVER
  var extrudeSettings = {amount: 0.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var max = { x: 28, y: 28};
  var min = { x: 4, y: -36};
  UVmappingXY(extrudeGeometry,min,max);

  var meshGrass1 = new THREE.Mesh(extrudeGeometry, materialGrass);
  meshGrass1.position.y = 8.5;
  meshGrass1.rotation.x = -Math.PI/2
  scene.add(meshGrass1);

  // CHOCOLATE RIGHT RIVER
  var extrudeSettings = {amount: 8.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var meshChocolate1 = new THREE.Mesh(extrudeGeometry, new THREE.MeshPhongMaterial({ color: 0x512000}));
  meshChocolate1.rotation.x = -Math.PI/2
  scene.add(meshChocolate1);

  // SIDE LEFT
  var groundShape = new THREE.Shape();
  groundShape.moveTo(-20, 28);
  groundShape.lineTo(-30, 16);
  groundShape.lineTo(-30, -24);
  groundShape.lineTo(-20, -36);

  // SIDE LEFT GRASS
  var extrudeSettings = {amount: 0.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var max = { x: -20, y: 28};
  var min = { x: -50, y: -36};
  UVmappingXY(extrudeGeometry,min,max);

  var meshGrass1 = new THREE.Mesh(extrudeGeometry, materialGrass);
  meshGrass1.position.y = 8.5;
  meshGrass1.rotation.x = -Math.PI/2
  scene.add(meshGrass1);

  // SIDE LEFT CHOCOLATE
  var extrudeSettings = {amount: 8.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var meshChocolate1 = new THREE.Mesh(extrudeGeometry, new THREE.MeshPhongMaterial({ color: 0x512000}));
  meshChocolate1.rotation.x = -Math.PI/2
  scene.add(meshChocolate1);

  // SIDE RIGHT
  var groundShape = new THREE.Shape();
  groundShape.moveTo(28, 28);
  groundShape.lineTo(32, 16);
  groundShape.lineTo(32, -24);
  groundShape.lineTo(28, -36);

  // SIDE RIGHT GRASS
  var extrudeSettings = {amount: 0.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var max = { x: 58, y: 28};
  var min = { x: 28, y: -36};
  UVmappingXY(extrudeGeometry,min,max);

  var meshGrass1 = new THREE.Mesh(extrudeGeometry, materialGrass);
  meshGrass1.position.y = 8.5;
  meshGrass1.rotation.x = -Math.PI/2
  scene.add(meshGrass1);

  // SIDE RIGHT CHOCOLATE
  var extrudeSettings = {amount: 8.5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = groundShape.extrude(extrudeSettings);

  var meshChocolate1 = new THREE.Mesh(extrudeGeometry, new THREE.MeshPhongMaterial({ color: 0x512000}));
  meshChocolate1.rotation.x = -Math.PI/2
  scene.add(meshChocolate1);

  ///////////////////////////
  // ------MOUNTAINS------
  //////////////////////////

  // MOUNTAIN RIGHT GRASS
  var mountain = new THREE.BoxGeometry( 12, 0.5, 12 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 16.25;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 2;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 16.25;
  meshGrassMountain.position.x = -21;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 12.25;
  meshGrassMountain.position.x = -13;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 14.25;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 12.25;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 14;
  scene.add(meshGrassMountain);

  // MOUNTAINS RIGHT CHOCOLATE
  var mountain = new THREE.BoxGeometry( 12, 6, 12 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 13;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 2;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 6, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 13;
  meshGrassMountain.position.x = -21;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 4, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 12;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 2, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 11;
  meshGrassMountain.position.x = -13;
  meshGrassMountain.position.z = 10;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 4, 2, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 11;
  meshGrassMountain.position.x = -17;
  meshGrassMountain.position.z = 14;
  scene.add(meshGrassMountain);

  // MOUNTAIN LEFT GRASS
  var mountain = new THREE.BoxGeometry( 10, 0.5, 12 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 16.25;
  meshGrassMountain.position.x = 22;
  meshGrassMountain.position.z = -2.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 7, 0.5, 7 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 16.25;
  meshGrassMountain.position.x = 13.5;
  meshGrassMountain.position.z = 4;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 16.25;
  meshGrassMountain.position.x = 18.75;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 14.25;
  meshGrassMountain.position.x = 22.25;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 0.5, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialGrass1);
  UVmappingXY(extrudeGeometry,min,max);
  meshGrassMountain.position.y = 12.25;
  meshGrassMountain.position.x = 25.75;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);


  // MOUNTAINS LEFT CHOCOLATE
  var mountain = new THREE.BoxGeometry( 10, 6, 12 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 13;
  meshGrassMountain.position.x = 22;
  meshGrassMountain.position.z = -2.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 7, 6, 7 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 13;
  meshGrassMountain.position.x = 13.5;
  meshGrassMountain.position.z = 4;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 6, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 13;
  meshGrassMountain.position.x = 18.75;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 4, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 12;
  meshGrassMountain.position.x = 22.25;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);

  var mountain = new THREE.BoxGeometry( 3.5, 2, 4 );
  var meshGrassMountain = new THREE.Mesh(mountain, materialChocolate);
  meshGrassMountain.position.y = 11;
  meshGrassMountain.position.x = 25.75;
  meshGrassMountain.position.z = 5.5;
  scene.add(meshGrassMountain);


  ///////////////////////////
  // ------STONE WALL------
  //////////////////////////

  var materialStoneBehind = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/stoneWallBehind.jpg') } );
  var materialStone = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/stoneWall.jpg') } );
  var materialStone1 = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/stoneWall1.jpg') } );
  var materialStone2 = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/stoneWall2.jpg') } );

  stoneGeometry = new THREE.BoxGeometry(36, 10, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone);
    stoneMesh.position.y = 5;
    stoneMesh.position.x = -2;
    stoneMesh.position.z = 36;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(4.5, 10, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone1);
    stoneMesh.position.y = 5;
    stoneMesh.position.x = 26.25;
    stoneMesh.position.z = 36;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(11.65, 10, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone2);
    stoneMesh.position.y = 5;
    stoneMesh.position.x = 30;
    stoneMesh.position.z = 30;
    stoneMesh.rotation.y = 0.4*Math.PI;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(12.65, 18, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone2);
    stoneMesh.position.y = 9;
    stoneMesh.position.x = 30;
    stoneMesh.position.z = -22;
    stoneMesh.rotation.y = -0.4*Math.PI;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(14.65, 10, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone2);
    stoneMesh.position.y = 5;
    stoneMesh.position.x = -24.5;
    stoneMesh.position.z = 31;
    stoneMesh.rotation.y = -0.5*Math.PI/2;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(14.65, 18, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone2);
    stoneMesh.position.y = 9;
    stoneMesh.position.x = -24.5;
    stoneMesh.position.z = -23;
    stoneMesh.rotation.y = 0.5*Math.PI/2;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(40, 14, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone);
    stoneMesh.position.y = 7;
    stoneMesh.position.x = 32;
    stoneMesh.position.z = 4;
    stoneMesh.rotation.y = Math.PI/2;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(44, 14, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStone);
    stoneMesh.position.y = 7;
    stoneMesh.position.x = -29.5;
    stoneMesh.position.z = 4;
    stoneMesh.rotation.y = Math.PI/2;
  scene.add(stoneMesh);

  stoneGeometry = new THREE.BoxGeometry(48, 20.5, 1);
  var stoneMesh = new THREE.Mesh(stoneGeometry, materialStoneBehind);
    stoneMesh.position.y = 10.25;
    stoneMesh.position.x = 4;
    stoneMesh.position.z = -28;
  scene.add(stoneMesh);

  ///////////////////////////
  // ------DECORATION------
  //////////////////////////

  var red = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var redNS = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    opacity: 0.9,
  });

  var green = new THREE.MeshPhongMaterial({
    color: 0x00FF00,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var blue = new THREE.MeshPhongMaterial({
    color: 0x0000FF,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var blueNS = new THREE.MeshPhongMaterial({
    color: 0x0000FF,
    opacity: 0.9,
  });

  var purple = new THREE.MeshPhongMaterial({
    color: 0x610B5E,
    opacity: 0.9,
    shininess: 60,
  });

  var white = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var black = new THREE.MeshPhongMaterial({
    color: 0x000000,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var pink = new THREE.MeshPhongMaterial({
    color: 0xFF00FF,
    opacity: 0.9,
  });

  var brown = new THREE.MeshPhongMaterial({
    color: 0x610B0B,
    opacity: 0.9,
  });

  var orangeNS = new THREE.MeshPhongMaterial({
    color: 0xFF8000,
    opacity: 0.9,
    specular: 0xFFFFFF,
    shininess: 60,
  });

  var orange = new THREE.MeshPhongMaterial({
    color: 0xFF8000,
    opacity: 0.9,
  });

  var yellow = new THREE.MeshPhongMaterial({
    color: 0xFFFF00,
    opacity: 0.9,
  });

  // CANDY CANES
  // instantiate a loader
  var loader = new THREE.JSONLoader();
  // load a resource
  loader.load(
    // resource URL
    'images/cane.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      materials =[red, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
        object.position.x = -7;
        object.position.y = 15;
        object.position.z = 19;
        object.rotation.x = (-Math.PI/2);
        object.rotation.y = Math.PI/8;
        object.scale.set( 0.05, 0.05, 0.05 )
      scene.add( object );

      materials =[blue, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
        object.rotation.x = Math.PI/2;
        object.position.x = 10;
        object.position.y = 15;
        object.position.z = 19;
        object.rotation.z = Math.PI;
        object.rotation.x = -Math.PI/2;
        object.scale.set( 0.05, 0.05, 0.05 )
      scene.add( object );

      materials =[black, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
        object.position.x = -24;
        object.position.y = 15;
        object.position.z = 38;
        object.rotation.x = (-Math.PI/2);
        object.rotation.y = Math.PI/17;
        object.scale.set( 0.05, 0.05, 0.05 )
      scene.add( object );
    }
  );

  // CANDY COTTON
  loader.load(
    // resource URL
    'images/cotton.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      materials =[pink, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = -20;
      object.position.y = 5;
      object.position.z = 20;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 25, 25, 25 )
      scene.add( object );

      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = -8;
      object.position.y = 5;
      object.position.z = 26;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 25, 25, 25 )
      scene.add( object );
    }
  );

  // TREE
  loader.load(
    // resource URL
    'images/tree.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      var object = new THREE.Mesh(geometry, purple);
      object.rotation.x = Math.PI/2;
      object.position.x = 12;
      object.position.y = 10;
      object.position.z = 32;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 0.008, 0.008, 0.008 )
      scene.add( object );

      var object = new THREE.Mesh(geometry, yellow);
      object.rotation.x = Math.PI/2;
      object.position.x = 26;
      object.position.y = 22;
      object.position.z = 14;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 0.008, 0.008, 0.008 )
      scene.add( object );
    }
  );

  // LOLLIPOP
  loader.load(
    // resource URL
    'images/lollipop.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      var object = new THREE.Mesh(geometry, red);
      object.rotation.x = Math.PI/2;
      object.position.x = -14;
      object.position.y = 10;
      object.position.z = 29;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      scene.add( object );

      var object = new THREE.Mesh(geometry, orangeNS);
      object.rotation.x = Math.PI/2;
      object.position.x = -14;
      object.position.y = 28;
      object.position.z = 26;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      scene.add( object );
    }
  );

  // PUMPKIN
  loader.load(
    // resource URL
    'images/pumpkin.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      materials =[redNS, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = 26;
      object.position.y = 10;
      object.position.z = 26;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 8, 8, 8 )
      scene.add( object );

      materials =[blueNS, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = -20;
      object.position.y = 24;
      object.position.z = 26;
      object.rotation.z = Math.PI/2;
      object.rotation.y = -Math.PI/2;
      object.scale.set( 8, 8, 8 )
      scene.add( object );
    }
  );

  // MUSHROOM
  loader.load(
    // resource URL
    'images/mushroom.js',
    // Function when resource is loaded
    function ( geometry, materials ) {
      materials = [blueNS, blueNS, blueNS, blueNS, blueNS, blueNS, white, white, white, white, white, white, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = -7;
      object.position.y = 10;
      object.position.z = -12;
      object.rotation.z = Math.PI/2;
      object.scale.set( 1, 1, 1 )
      scene.add( object );

      materials = [red, red, red, red, red, red, white, white, white, white, white, white, white]
      var object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial( materials ));
      object.rotation.x = Math.PI/2;
      object.position.x = 16;
      object.position.y = 22;
      object.position.z = 14;
      object.rotation.z = Math.PI/2;
      object.scale.set( 1, 1, 1 )
      scene.add( object );

    }
  );

  ///////////////////////////
  // ------PATH------
  //////////////////////////
  var materialTile = new THREE.MeshPhongMaterial( { map: new THREE.TextureLoader().load('images/tile2.jpg') } );

  var path = new THREE.BoxGeometry( 2, 0.2, 4 );
  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -23;
    meshPath.position.z = 31;
    meshPath.rotation.y = 0.5*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -21;
    meshPath.position.z = 29;
    meshPath.rotation.y = 0.5*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -19;
    meshPath.position.z = 27;
    meshPath.rotation.y = 0.5*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -17;
    meshPath.position.z = 25;
    meshPath.rotation.y = 0.4*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -14.5;
    meshPath.position.z = 23.5;
    meshPath.rotation.y = 0.3*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -12;
    meshPath.position.z = 22;
    meshPath.rotation.y = 0.2*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = -9.5;
    meshPath.position.z = 21.5;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 9.5;
    meshPath.position.z = 21.5;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 12;
    meshPath.position.z = 21.5;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 14.5;
    meshPath.position.z = 21.5;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 17;
    meshPath.position.z = 21;
    meshPath.rotation.y = 0.15*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 19.5;
    meshPath.position.z = 20;
    meshPath.rotation.y = 0.3*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 22;
    meshPath.position.z = 18.5;
    meshPath.rotation.y = 0.45*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 24;
    meshPath.position.z = 16.5;
    meshPath.rotation.y = 0.45*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 26.5;
    meshPath.position.z = 14.5;
    meshPath.rotation.y = 0.3*Math.PI/2;
  scene.add(meshPath);

  var meshPath = new THREE.Mesh(path, materialTile);
    meshPath.position.y = 10.5;
    meshPath.position.x = 29;
    meshPath.position.z = 13.5;
    meshPath.rotation.y = 0.15*Math.PI/2;
  scene.add(meshPath);



	///////////////////////////
	// ------BRIDGE------
	//////////////////////////

	var bridgeShape = new THREE.Shape();
	var x = -9
	var y = 9
	bridgeShape.moveTo(x, y);
	bridgeShape.bezierCurveTo( (x+1), y, (x+4), y, (x+5), (y+1) );
	bridgeShape.bezierCurveTo( (x+7), (y+4), (x+11), (y+4), (x+13), (y+1) );
	bridgeShape.bezierCurveTo( (x+14), (y), (x+16), y, (x+18), y );
	bridgeShape.lineTo( (x+13), y );
	bridgeShape.bezierCurveTo( (x+11), (y+3), (x+7), (y+3), (x+5), y );
	bridgeShape.lineTo( x, y );

	var extrudeSettings = {amount: 5, curveSegments: 10, bevelEnabled: false};
	var extrudeGeometry = bridgeShape.extrude(extrudeSettings);
  var max = { x: 9, y: 24};
  var min = { x: -9, y: -20};
  UVmappingXY(extrudeGeometry,min,max);
	var mesh = new THREE.Mesh(extrudeGeometry, materialChocolate);
    mesh.position.z = 15;  
	scene.add(mesh);

  var x = -9
  var y = 9
  bridgeShape.moveTo(x, y);
  bridgeShape.bezierCurveTo( (x+1), y, (x+4), (y+1), (x+5)+0.1, (y+2)+0.1 );
  bridgeShape.bezierCurveTo( (x+7), (y+4.5), (x+11), (y+4.5), (x+13)+0.1, (y+2)+0.1 );
  bridgeShape.bezierCurveTo( (x+14), (y+1), (x+16), y, (x+18)+0.1, y+0.1 );
  bridgeShape.bezierCurveTo( (x+16), (y), (x+14), y, (x+13)+0.1, (y+1)+0.1 );
  bridgeShape.bezierCurveTo( (x+11), (y+4), (x+7), (y+4), (x+5)+0.1, (y+1)+0.1 );
  bridgeShape.bezierCurveTo( (x+4), y, (x+1), y, x+0.1, y+0.1 );

  var extrudeSettings = {amount: 5, curveSegments: 10, bevelEnabled: false};
  var extrudeGeometry = bridgeShape.extrude(extrudeSettings);
  var maxXYZ = { x: 9, y: 19, z: 5};
  var minXYZ = { x: -9, y: 9, z: 0};
  UVmappingXYZ(extrudeGeometry,minXYZ,maxXYZ)
  var mesh = new THREE.Mesh(extrudeGeometry, materialGrass);
    mesh.position.z = 15;  
  scene.add(mesh);


	///////////////////////////
	// ------WATER BLOCKS------
	//////////////////////////
	for (var j = 0; j < waterBlocks.length; j++) {
  	waterBlocks[j].water = null;
    waterBlocks[j].waterMesh = null;
    waterBlocks[j].sloshOffsets = [];
    waterBlocks[j].topVertices = [];
    waterBlocks[j].angles = [];
	}



  /////---FIRST STRAIGHT OF RIVER
  //--floor
  var floorGeometry = new THREE.BoxGeometry(waterSettings.size.x, 0.5, waterSettings.size.z);
  var floor = new THREE.Mesh(floorGeometry, materialChocolate);
  	floor.position.y = 0.25;
  	floor.position.x = 0;
  	floor.position.z = 0;
  scene.add(floor);    

  //--geometry
  waterBlocks[0].water = new THREE.BoxGeometry(waterSettings.size.x, waterSettings.maxValue, waterSettings.size.z, waterSettings.sections, 1, waterSettings.sections);
  configWaterBlocks(waterBlocks[0]);
  waterBlocks[0].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh
  waterBlocks[0].waterMesh = new THREE.Mesh(waterBlocks[0].water, waterTop);
  	waterBlocks[0].waterMesh.position.y = 0.5;
  	waterBlocks[0].waterMesh.position.x = 0;
  	waterBlocks[0].waterMesh.position.z = 0;
  scene.add(waterBlocks[0].waterMesh);



  /////---FIRST CURVE OF RIVER
  //--floor
  floorCylinder = new THREE.CylinderGeometry(8,8,0.5, 10, 1, false, 0, Math.PI/2);
  var floorCylinderMesh = new THREE.Mesh(floorCylinder, materialChocolate);
  	floorCylinderMesh.position.x = 4;
  	floorCylinderMesh.position.y = 0.5;
  	floorCylinderMesh.position.z = 20;
  	floorCylinderMesh.rotation.y = -Math.PI/2 
  	floorCylinderMesh.material.side = THREE.DoubleSide;   
  scene.add(floorCylinderMesh);

  //--geometry
  waterBlocks[1].water = new THREE.CylinderGeometry(8,8,waterSettings.maxValue, 10, 1, false, 0, Math.PI/2);
  configWaterBlocks(waterBlocks[1]);
  waterBlocks[1].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh
  waterBlocks[1].waterMesh = new THREE.Mesh(waterBlocks[1].water, waterTop);
  	waterBlocks[1].waterMesh.position.x = 4;
  	waterBlocks[1].waterMesh.position.y = 0.5;
  	waterBlocks[1].waterMesh.position.z = 20;
  	waterBlocks[1].waterMesh.rotation.y = -Math.PI/2
  	waterBlocks[1].waterMesh.material.side = THREE.DoubleSide;
  scene.add(waterBlocks[1].waterMesh);



  /////---SECOND STRAIGHT OF RIVER
  //--floor
  var floorGeometry = new THREE.BoxGeometry(waterSettings.size.x+4, 0.5, waterSettings.size.x);
  var floor = new THREE.Mesh(floorGeometry, materialChocolate);
  	floor.position.y = 0.25;
  	floor.position.x = 10;
  	floor.position.z = 24;
  scene.add(floor);    

  //--geometry
  waterBlocks[2].water = new THREE.BoxGeometry(waterSettings.size.x+4, waterSettings.maxValue, waterSettings.size.x, waterSettings.sections, 1, waterSettings.sections);
  configWaterBlocks(waterBlocks[2]);
  waterBlocks[2].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh
  waterBlocks[2].waterMesh = new THREE.Mesh(waterBlocks[2].water, waterTop);
  	waterBlocks[2].waterMesh.position.y = 0.5;
  	waterBlocks[2].waterMesh.position.x = 10;
  	waterBlocks[2].waterMesh.position.z = 24;
  scene.add(waterBlocks[2].waterMesh);



  /////---SECOND CURVE OF RIVER
  //--floor
  floorCylinder = new THREE.CylinderGeometry(8,8,0.5, 10, 1, false, 0, Math.PI/2);
  new THREE.MeshFaceMaterial(materials)
  var floorCylinderMesh = new THREE.Mesh(floorCylinder, materialChocolate);
  	floorCylinderMesh.position.x = 16;
  	floorCylinderMesh.position.y = 0.25;
  	floorCylinderMesh.position.z = 28;
  	floorCylinderMesh.rotation.y = Math.PI/2 
  	floorCylinderMesh.material.side = THREE.DoubleSide;   
  scene.add(floorCylinderMesh);

  //--geometry
  waterBlocks[3].water = new THREE.CylinderGeometry(8,8,waterSettings.maxValue, 10, 1, false, 0, Math.PI/2);
  configWaterBlocks(waterBlocks[3]);
  waterBlocks[3].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh
  waterBlocks[3].waterMesh = new THREE.Mesh(waterBlocks[3].water, waterTop);
  	waterBlocks[3].waterMesh.position.x = 16;
  	waterBlocks[3].waterMesh.position.y = 0.5;
  	waterBlocks[3].waterMesh.position.z = 28;
  	waterBlocks[3].waterMesh.rotation.y = Math.PI/2
  scene.add(waterBlocks[3].waterMesh);



  /////---THIRD STRAIGHT OF RIVER
  //--floor
  var floorGeometry = new THREE.BoxGeometry(waterSettings.size.x, 0.5, waterSettings.size.x);
  var floor = new THREE.Mesh(floorGeometry, materialChocolate);
  	floor.position.y = 0.25;
  	floor.position.x = 20;
  	floor.position.z = 32;
  scene.add(floor);    

  //--geometry
  waterBlocks[4].water = new THREE.BoxGeometry(waterSettings.size.x, waterSettings.maxValue, waterSettings.size.x, waterSettings.sections, 1, waterSettings.sections);
  configWaterBlocks(waterBlocks[4]);
  waterBlocks[4].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh
  waterBlocks[4].waterMesh = new THREE.Mesh(waterBlocks[4].water, waterTop);
  	waterBlocks[4].waterMesh.position.y = 0.5;
  	waterBlocks[4].waterMesh.position.x = 20;
  	waterBlocks[4].waterMesh.position.z = 32;
  scene.add(waterBlocks[4].waterMesh);

  /////---LAKE UNDER WATERFALL
  //--floor
    var floorGeometry = new THREE.BoxGeometry(waterSettings.size.x, 0.5, waterSettings.size.x);
    var floor = new THREE.Mesh(floorGeometry, materialChocolate);
    	floor.position.y = 0;
    	floor.position.x = 0;
    	floor.position.z = -24;
	scene.add(floor); 

	var floorCylinder = new THREE.CylinderGeometry(8,8,0.5, 10, 1, false, 0, Math.PI/2);
    var floor = new THREE.Mesh(floorCylinder, materialChocolate);
    	floor.position.y = 0;
    	floor.position.x = -4;
    	floor.position.z = -28;
    	floor.rotation.y = -Math.PI/2 
    	floor.material.side = THREE.DoubleSide;
	scene.add(floor); 

	var floorCylinder = new THREE.CylinderGeometry(8,8,0.5, 10, 1, false, 0, Math.PI/2);
    var floor = new THREE.Mesh(floorCylinder, materialChocolate);
    	floor.position.y = 0;
    	floor.position.x = 4;
    	floor.position.z = -28; 
    	floor.material.side = THREE.DoubleSide;
	scene.add(floor); 

  //--geometry central square
  waterBlocks[5].water = new THREE.BoxGeometry(waterSettings.size.x, waterSettings.maxValue, waterSettings.size.x, waterSettings.sections, 1, waterSettings.sections);
  configWaterBlocks(waterBlocks[5]);
  waterBlocks[5].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh central square
  waterBlocks[5].waterMesh = new THREE.Mesh(waterBlocks[5].water, waterTop);
  	waterBlocks[5].waterMesh.position.y = 0;
  	waterBlocks[5].waterMesh.position.x = 0;
  	waterBlocks[5].waterMesh.position.z = -24;
  scene.add(waterBlocks[5].waterMesh);

  //--geometry left cylinder
  waterBlocks[6].water = new THREE.CylinderGeometry(8,8,waterSettings.maxValue-0.5, 10, 1, false, 0, Math.PI/2);
  configWaterBlocks(waterBlocks[3]);
  waterBlocks[6].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh left cylinder
  waterBlocks[6].waterMesh = new THREE.Mesh(waterBlocks[6].water, waterTop);
  	waterBlocks[6].waterMesh.position.x = -4;
  	waterBlocks[6].waterMesh.position.y = 0;
  	waterBlocks[6].waterMesh.position.z = -28;
  	waterBlocks[6].waterMesh.rotation.y = -Math.PI/2
  scene.add(waterBlocks[6].waterMesh);

  //--geometry right cylinder
  waterBlocks[7].water = new THREE.CylinderGeometry(8,8,waterSettings.maxValue-0.5, 10, 1, false, 0, Math.PI/2);
  configWaterBlocks(waterBlocks[3]);
  waterBlocks[7].water.applyMatrix(new THREE.Matrix4().makeTranslation(0, (waterSettings.maxValue / 2) - waterSettings.base, 0));

  //--mesh right cylinder
  waterBlocks[7].waterMesh = new THREE.Mesh(waterBlocks[7].water, waterTop);
  	waterBlocks[7].waterMesh.position.x = 4;
  	waterBlocks[7].waterMesh.position.y = 0;
  	waterBlocks[7].waterMesh.position.z = -28;
  scene.add(waterBlocks[7].waterMesh);

}

function UVmappingXY(geometry,min,max) {
  var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
  var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
  var faces = geometry.faces;

  geometry.faceVertexUvs[0] = [];

  for (var i = 0; i < faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a], 
          v2 = geometry.vertices[faces[i].b], 
          v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
          new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
          new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
          new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
      ]);
  }
}


function UVmappingXYZ(geometry,min,max) {
  var offset = new THREE.Vector3(0 - min.x, 0 - min.y, 0 - min.z);
  var range = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
  var faces = geometry.faces;

  geometry.faceVertexUvs[0] = [];

  for (var i = 0; i < faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a], 
          v2 = geometry.vertices[faces[i].b], 
          v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
          new THREE.Vector3((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y,(v1.z + offset.z)/range.z),
          new THREE.Vector3((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y,(v2.z + offset.z)/range.z),
          new THREE.Vector3((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y,(v3.z + offset.z)/range.z)
      ]);
  }
}

function configWaterBlocks(waterBlock) {
	var count = 0;
    var pos = 0 - Math.floor(waterSettings.sections / 2);
    var zeds = [];

    for (var i = waterBlock.water.vertices.length - 1; i >= 0; i--) {
      if (waterBlock.water.vertices[i].y >= (waterSettings.maxValue / 2)) {
        waterBlock.topVertices.push(waterBlock.water.vertices[i]); 
        zeds.push(waterBlock.water.vertices[i].z)
        waterBlock.angles.push(count + waterSettings.speed + (Math.random()*2));
        waterBlock.sloshOffsets.push( Math.random() / 2);
        count++;
      }
    };

    zeds = _.uniq(zeds);
    zeds.sort(function(a, b) {
      return a - b
    });

    for (var i = waterBlock.topVertices.length - 1; i >= 0; i--) {
      waterBlock.topVertices[i].zPos = zeds.indexOf(waterBlock.topVertices[i].z) - Math.floor(zeds.length / 2);
    }
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
	//camera.position.set(2, 50, 40 + sceneSettings.cameraZ);
	camera.position.set(2, 20, 40 + sceneSettings.cameraZ);
	//camera.position.set(50, 20, 40 + sceneSettings.cameraZ);
	camera.lookAt(new THREE.Vector3(0, 5.6, sceneSettings.cameraZ));

	requestAnimationFrame(animate);

	for (var i = 0; i < waterBlocks.length; i++) {
	waterBlocks[i].waterMesh.scale.y = waterSettings.size.y / 100;

	for (var j = waterBlocks[i].topVertices.length - 1; j >= 0; j--) {
	  var sloshAmount = waterBlocks[i].topVertices[j].zPos * waterSettings.slosh * waterBlocks[i].sloshOffsets[j];
	  waterBlocks[i].topVertices[j].y = sloshAmount + (waterSettings.maxValue + Math.sin(waterBlocks[i].angles[j]) * waterSettings.range);
	  waterBlocks[i].angles[j] += waterSettings.speed; 
	}

	waterBlocks[i].water.verticesNeedUpdate = true;
	}

	render();
}

function upOrDownWater(incr) {
  if (incr == "plus") {
    if (waterFallSettings.count >= 100) {
      console.log("Is in the max level")
      alert("Is in the maximum level");
    } else {
      waterFallSettings.count = waterFallSettings.count + 10
      waterFallSettings.percent = waterFallSettings.percent - 5.5
      setWaterLevel(waterFallSettings.count)
      setWaterFall(waterFallSettings.percent)
    }
  } else if (incr == "minus"){
    if (waterFallSettings.count <= 0) {
      console.log("Is in the min level")
      alert("Is in the minimum level");
    } else {
      waterFallSettings.count = waterFallSettings.count - 10
      waterFallSettings.percent = waterFallSettings.percent + 5.5
      setWaterLevel(waterFallSettings.count)
      setWaterFall(waterFallSettings.percent)
    }

  }
}

function speedWaterfall(incr) {
  if (incr == "plus") {
    if (waterFallSettings.speed >= 1) {
      console.log("Is in the max level")
      alert("Is in the maximum speed");
    } else {
      waterFallSettings.speed = waterFallSettings.speed + 0.1
      TweenLite.to(waterfall, 2, {gravity: waterFallSettings.speed})
    }
  } else if (incr == "minus"){
    if (waterFallSettings.speed <= 0.1) {
      console.log("Is in the min level")
      alert("Is in the minimum speed");
    } else {
      waterFallSettings.speed = waterFallSettings.speed - 0.1
      TweenLite.to(waterfall, 2, {gravity: waterFallSettings.speed})
    }
  } else {
    TweenLite.to(waterfall, 2, {gravity: incr})
  }
}


function setWaterFall (percent) {
  var c = document.getElementById('waterfall');
  if (percent == 100) {
    TweenLite.to(c, 1, {height: waterFallSettings.height, width: waterFallSettings.width})
  } else {
    height =  waterFallSettings.height*(1+(percent/100))  
    TweenLite.to(c, 1, {height: height, width: waterFallSettings.width})
  }
}

function setWaterLevel(percent) {

  waterSettings.oldlevel = waterSettings.level;
  
  var level = (waterSettings.maxValue / 100) * percent;
  var p = percent == 100 ? 105 : percent;
  TweenLite.to(waterSettings.size, 1, {
    y: level > 0.5 ? p : ((0.5 / waterSettings.maxValue) * 100),
    ease: Power2.easeInOut
  });

  var diff = percent - waterSettings.level;
  var disturbAmount = (diff / 100) * 0.5;
  timeline.clear()
  var r = (((waterSettings.ranges[0] - waterSettings.ranges[1]) / 100) * (100 - waterSettings.size.y)) + waterSettings.ranges[1]
  timeline.append(TweenMax.to(waterSettings, 0.5, {
    range: r + disturbAmount,
    ease: Power2.easeIn
  }));
  timeline.append(TweenMax.to(waterSettings, 2.5, {
    range: r,
    ease: Elastic.easeOut
  }));
  
  timeline.restart();

  waterSettings.level = percent;
}

function randomHeight() {
  setWaterLevel(Math.random() * 100);
}

init();
render();
animate();
setWaterLevel(100);

window.addEventListener( 'resize', function () 
{ 
    container = document.getElementById('scene');
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );

    contWaterfall = document.getElementById('container')
    var c = document.getElementById('waterfall');

    height = contWaterfall.offsetHeight
    width = contWaterfall.offsetWidth
    waterFallSettings.height = height;
    waterFallSettings.width = width;
    
    heightResize = height*(1+(waterFallSettings.percent/100)) 

    TweenLite.to(c, 0.01, {height: heightResize, width: width})
  
}, false );

