/**
* Generate a scene object with a background color
**/

function getScene() {
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  return scene;
}

function getCamera() {
  var aspectRatio = window.innerWidth / window.innerHeight;
  var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
  camera.position.set(0, 2000, -5000);
  camera.lookAt(scene.position);
  return camera;
}

function getLight(scene) {
  var light = new THREE.PointLight( 0xffffff, 0.6, 0, 0 )
  light.position.set( -2000, 1000, -2100 );
  scene.add( light );

  var light = new THREE.PointLight( 0xffffff, 0.15, 0, 0 )
  light.position.set( -190, 275, -1801 );
  light.castShadow = true;
  scene.add( light );

  // create some ambient light for the scene
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  return light;
}

function getRenderer() {
  // Create the canvas with a renderer
  var renderer = new THREE.WebGLRenderer({antialias: true});
  // Add support for retina displays
  renderer.setPixelRatio(window.devicePixelRatio);
  // Specify the size of the canvas
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Enable shadows
  renderer.shadowMap.enabled = true;
  // Specify the shadow type; default = THREE.PCFShadowMap
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Add the canvas to the DOM
  document.body.appendChild(renderer.domElement);
  return renderer;
}

/**
* Generate the controls to be used in the scene
* @param {obj} camera: the three.js camera for the scene
* @param {obj} renderer: the three.js renderer for the scene
**/

function getControls(camera, renderer) {
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.zoomSpeed = 0.4;
  //controls.panSpeed = 0.4;
  return controls;
}

function getPlanes(scene, loader) {
  var planes = [];
  var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
  [ [4000, 2000, 0, 0, -1000, 0] ].map(function(p) {
    var geometry = new THREE.PlaneGeometry(p[0], p[1]);
    var plane = new THREE.Mesh(geometry, material);
    plane.position.x = p[2];
    plane.position.y = p[3];
    plane.position.z = p[4];
    plane.rotation.y = p[5];
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = true;
    planes.push(plane);
    scene.add(plane);
  })
  return planes;
}

/**
* Add background
**/
/*
function getBackground(scene, loader) {
  var imagePrefix = 'sky-parts/';
  var directions  = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  var imageSuffix = '.bmp';
  var geometry = new THREE.BoxGeometry( 4000, 4000, 4000 );
  // Add each of the images for the background cube
  var materialArray = [];
  for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
      //map: loader.load(imagePrefix + directions[i] + imageSuffix),
      color: 0xff0000,
      side: THREE.BackSide
    }));
  var sky = new THREE.Mesh( geometry, materialArray );
  scene.add(sky);
  return sky;
}
*/
/**
* Add a character
**/

function getSphere(scene) {
  var geometry = new THREE.SphereGeometry( 30, 12, 9 );
  var material = new THREE.MeshPhongMaterial({
    color: 0xd0901d,
    emissive: 0xaa0000,
    side: THREE.DoubleSide,
    flatShading: true
  });
  var sphere = new THREE.Mesh( geometry, material );
  // allow the sphere to cast a shadow
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  // create a group for translations and rotations
  var sphereGroup = new THREE.Group();
  sphereGroup.add(sphere)
  sphereGroup.castShadow = true;
  sphereGroup.receiveShadow = false;
  scene.add(sphereGroup);
  return [sphere, sphereGroup];
}

/**
* Initialize physics engine
**/

function getPhysics() {
  world = new CANNON.World();
  world.gravity.set(0, -400, 0); // earth = -9.82 m/s
  world.broadphase = new CANNON.NaiveBroadphase();
  world.broadphase.useBoundingBoxes = true;
  var solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = solver;
  world.quatNormalizeSkip = 0;
  world.quatNormalizeFast = false;
  world.defaultContactMaterial.contactEquationStiffness = 1e9;
  world.defaultContactMaterial.contactEquationRelaxation = 4;
  return world;
}

/**
* Generate the materials to be used for contacts
**/

function getPhysicsMaterial() {
  var physicsMaterial = new CANNON.Material('slipperyMaterial');
  var physicsContactMaterial = new CANNON.ContactMaterial(
      physicsMaterial, physicsMaterial, 0.0, 0.3)
  world.addContactMaterial(physicsContactMaterial);
  return physicsMaterial;
}

/**
* Add objects to the world
**/

function addObjectPhysics() {
  addFloorPhysics()
  addSpherePhysics()
}

function addFloorPhysics() {
  floors.map(function(floor) {
    var q = floor.quaternion;
    floorBody = new CANNON.Body({
      mass: 0, // mass = 0 makes the body static
      material: physicsMaterial,
      shape: new CANNON.Plane(),
      quaternion: new CANNON.Quaternion(-q._x, q._y, q._z, q._w)
    });
    world.addBody(floorBody);
  })
}

function addSpherePhysics() {
  sphereBody = new CANNON.Body({
    mass: 1,
    material: physicsMaterial,
    shape: new CANNON.Sphere(30),
    linearDamping: 0.5,
    position: new CANNON.Vec3(1000, 500, -2000)
  });
  world.addBody(sphereBody);
}

/**
* Store all currently pressed keys & handle window resize
**/

function addListeners() {
  window.addEventListener('keydown', function(e) {
    pressed[e.key.toUpperCase()] = true;
  })
  window.addEventListener('keyup', function(e) {
    pressed[e.key.toUpperCase()] = false;
  })
  window.addEventListener('resize', function(e) {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    personalCamera.aspect = window.innerWidth / window.innerHeight;
    personalCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (typeof(controls) != 'undefined') controls.handleResize();
  })
}

/**
* Update the sphere's position
**/

function moveSphere() {
  var delta = clock.getDelta(); // seconds
  var moveDistance = 500 * delta; // n pixels per second
  var rotateAngle = Math.PI / 2 * delta; // 90 deg per second

  // move forwards, backwards, left, or right
  if (pressed['W'] || pressed['ARROWUP']) {
    sphereBody.velocity.z += moveDistance;
  }
  if (pressed['S'] || pressed['ARROWDOWN']) {
    sphereBody.velocity.z -= moveDistance;
  }
  if (pressed['A'] || pressed['ARROWLEFT']) {
    sphereBody.velocity.x += moveDistance;
  }
  if (pressed['D'] || pressed['ARROWRIGHT']) {
    sphereBody.velocity.x -= moveDistance;
  }
}

/**
* Follow the sphere
**/

function moveCamera() {
  personalCamera.position.x = sphereBody.position.x + 0;
  personalCamera.position.y = sphereBody.position.y + 50;
  personalCamera.position.z = sphereBody.position.z + -200;
  personalCamera.lookAt(sphereGroup.position);
}

function updatePhysics() {
  world.step(1/60);
  sphereGroup.position.copy(sphereBody.position);
  sphereGroup.quaternion.copy(sphereBody.quaternion);
}

// Render loop
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, personalCamera);
  moveSphere();
  updatePhysics();
  if (typeof(controls) === 'undefined') moveCamera();
  if (typeof(controls) !== 'undefined') controls.update();
  if (typeof(stats) !== 'undefined') stats.update();
};

/*
function setupGui() {
	// Definicion de los controles
	effectController = {
		camera: 0,
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control camara");
	var camera = h.add(effectController, "camera", 0, 1, 1).name("Camera");

	camera.onChange(function(camGeneral){
    if (camGeneral == 0){
      controls.reset();
      controls.enabled = false;
    }
    else{
      controls.enabled = true;
    }
	});
}
*/

// state
var pressed = {};
var clock = new THREE.Clock();

// globals
var scene = getScene();
var personalCamera = getCamera();
var light = getLight(scene);
var renderer = getRenderer();
var world = getPhysics();
var physicsMaterial = getPhysicsMaterial();
//var controls = getControls(personalCamera, renderer);
//controls.enabled = false;

// global body references
var sphereBody, floorBody;

// add meshes
var loader = new THREE.TextureLoader();
var floors = getPlanes(scene, loader);
//var background = getBackground(scene, loader);
var sphereData = getSphere(scene);
var sphere = sphereData[0];
var sphereGroup = sphereData[1];

addObjectPhysics();
addListeners();
//setupGui();
render();
