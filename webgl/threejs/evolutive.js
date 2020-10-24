/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */
//llk
// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera, cenital, personalCamera;
var materialE,materialG,materialF,materialR,materialS,materialH,material_default;
var texE,texG,texF,texR,texS,texH,tex_default;
var luzAmbiente, luzFocal, luzFocalBall;
var asfalto;

var pressed = {};
var clock = new THREE.Clock();
// Variables globales
var city, angulo = 0, material;
var r = t = 40;
var l = b = -r;
var max_height = 20, separation_dist = 1;
var cameraController;
// Global GUI
var effectController;
var backX, backZ;
var contenido;
var notified = 0;
var loading_city = 0;

var buildings = [];
// Acciones
init();
loadScene();
setupGui();

var world = getPhysics();
var physicsMaterial = getPhysicsMaterial();
var sphereBody, floorBody;


var sphereData = getSphere(scene);
var sphere = sphereData[0];
var sphereGroup = sphereData[1];
addSpherePhysics();

addFloorPhysics();


render();


function setCameras(ar ){
	//contruir las 4 cámaras

	var origen = new THREE.Vector3(0,0,0);
	//ortográfica
	var camOrtografica = new THREE.OrthographicCamera(l, r, t, b, -200, 200);
	cenital = camOrtografica.clone();
	cenital.position.set(0,130,0);
	cenital.lookAt(origen);
	cenital.up = new THREE.Vector3(0,0,-1);

	//perspectiva
	camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 10000 ); // valores de cerca y lejos (los dos ultimos)
    // Movemos la camare respecto al sistema de referencia de la scena
  camera.position.set(180, 80, 250); // traslado de la camara desde el origen de coordenadas
  camera.lookAt(new THREE.Vector3(0,0,0));
  scene.add(cenital);
	scene.add(camera);
}

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

function getPhysicsMaterial() {
  var physicsMaterial = new CANNON.Material('slipperyMaterial');
  var physicsContactMaterial = new CANNON.ContactMaterial(
      physicsMaterial, physicsMaterial, 0.0, 0.3)
  world.addContactMaterial(physicsContactMaterial);
  return physicsMaterial;
}

function getSphere(scene) {
	var geometry = new THREE.SphereGeometry( 1, 12, 9 );
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


function addFloorPhysics() {


  var limites = [];

  // suelo
	var material = new THREE.MeshBasicMaterial({ color: '', wireframe: false });
		var geometry = new THREE.PlaneGeometry(2000, 2000);
		var plane = new THREE.Mesh(geometry, material);
		plane.position.x = 1000;
		plane.position.z = 1000;
		plane.position.y = -0.2;
		plane.rotation.x = Math.PI / 2;
		plane.receiveShadow = true;
		plane.castShadow = true;
		scene.add(plane);

	limites.push(plane);

	var pared = new THREE.PlaneGeometry(384,185,10,10);
	backX = new THREE.Mesh(pared, material);
	backZ = new THREE.Mesh(pared, material);

  backX.rotation.y = Math.PI / 2;
  backX.position.y = 50;
  backZ.position.y = 50;
  backZ.position.x = 192;
  backZ.position.z = -3;
  backX.position.z = 192;
  backX.position.x = -3;
  scene.add(backX);
	scene.add(backZ);
	limites.push(backX);
	limites.push(backZ);

	limites.map(function(plane) {
		var q = plane.quaternion;
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
    shape: new CANNON.Sphere(0.5),
    linearDamping: 0.5,
    position: new CANNON.Vec3(10, 20, 100)
  });
  world.addBody(sphereBody);
}

function setPersonalCamera (){

	  var ar =  window.innerWidth / window.innerHeight;
		personalCamera = new THREE.PerspectiveCamera(75, ar, 0.1, 10000);
		personalCamera.position.set(0, 200, -500);
		personalCamera.lookAt(scene.position);
		scene.add(personalCamera);
}


function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x777777) );
  document.getElementById("container").appendChild(renderer.domElement);
  renderer.autoClear = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  // Escena
  scene = new THREE.Scene();

  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;


  // Crear la camaras
  setCameras(ar);

  //controlador de camara
  cameraController = new THREE.OrbitControls( camera, renderer.domElement);
  cameraController.target.set(0,0,0);
  cameraController.noKeys = true;

	//Activar el calculo de sombras
	renderer.shadowMap.enabled = true;


		//Luces
		//Luz ambiental (color, intensidad)
		luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 1);
		scene.add(luzAmbiente);

		//Luz focal desde la pelota (color, intensidad)
		luzFocalBall = new THREE.SpotLight(0xFFFFFF, 1, );
		scene.add(luzFocalBall);



		luzFocalBall.angle = Math.PI / 4;
		luzFocalBall.distance = 15;
		luzFocalBall.castShadow = true;
		luzFocalBall.shadow.camera.near = 0;
		luzFocalBall.shadow.camera.far = 100;
		luzFocalBall.shadow.camera.fov = 2;

		var spotLightHelper = new THREE.SpotLightHelper( luzFocalBall , 'black');
		scene.add( spotLightHelper );

		//luz focal (color, intensidad)
		luzFocal = new THREE.SpotLight(0xFFFFFF, 0.8, );
		//Posición
		luzFocal.position.set( 400, 400, 400);
		//Dirección
		luzFocal.target.position.set(0,0,0);
		luzFocal.angle = Math.PI / 5;
		luzFocal.penumbra = 0.6;
		luzFocal.castShadow = true;
		luzFocal.shadow.camera.near = 0.1;
		luzFocal.shadow.camera.far = 1000;
		luzFocal.shadow.camera.fov = 36;
		scene.add(luzFocal);


		//var spotLightHelper = new THREE.SpotLightHelper( luzFocal );
		//scene.add( spotLightHelper );



  window.addEventListener('resize', updateAspectRatio);

	const loader = new THREE.TextureLoader();

	texE = loader.load('images/edificios/escuela.jpg' , function(texture)
		{
		 materialE = new THREE.MeshLambertMaterial({ map:texture });
		});
	texF = loader.load('images/edificios/farmacia.jpg' , function(texture)
		{
		materialF = new THREE.MeshLambertMaterial({ map:texture });
		});
	texH = loader.load('images/edificios/hospital.jpg' , function(texture)
		{
		materialH = new THREE.MeshLambertMaterial({ map:texture });
		});
	texR = loader.load('images/edificios/residencia.jpg' , function(texture)
		{
		materialR = new THREE.MeshLambertMaterial({ map:texture });
		});
	texS = loader.load('images/edificios/supermercado.jpg' , function(texture)
		{
		materialS = new THREE.MeshLambertMaterial({ map:texture });
		});
	texG = loader.load('images/edificios/gimnasio.jpg' , function(texture)
		{
		materialG = new THREE.MeshLambertMaterial({ map:texture });
		});
	tex_default = loader.load('images/edificios/centro_comercial.jpg' , function(texture)
		{
		material_default = new THREE.MeshLambertMaterial({ map:texture});
		});


	  window.addEventListener('keydown', function(e) {
	    pressed[e.key.toUpperCase()] = true;
	  })
	  window.addEventListener('keyup', function(e) {
	    pressed[e.key.toUpperCase()] = false;
	  })

}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  material = new THREE.MeshBasicMaterial({ color: 'pink', solid: true });

	city = new THREE.Object3D();
  city.name = "city";
	document.getElementById('file-input').addEventListener('change', leerArchivo, false);

  scene.add( new THREE.AxisHelper(30) );

	const loader = new THREE.TextureLoader();
	loader.load('images/edificios/day.jpg' , function(texture)
				{
				 var fondo = new THREE.MeshBasicMaterial({ map:texture });
         set_city_backGround(fondo, texture);
				});
	var tex = loader.load('images/edificios/asfalto.jpg' , function(texture)
				{
 				 	var mat_asfalto = new THREE.MeshLambertMaterial({ map:texture });

					var suelo = new THREE.PlaneGeometry(384,384,10,10);
					asfalto = new THREE.Mesh(suelo, mat_asfalto);
					asfalto.receiveShadow = true;
					asfalto.castShadow = true;
					asfalto.rotation.x = -Math.PI / 2;
					asfalto.position.x = 192;
					asfalto.position.z = 192;

					scene.add(asfalto);
				});

		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set( 150, 150 );

}

function update(){
  // Cambios entre frames
  //angulo += Math.PI / 1000;
  //robot.rotation.y = angulo;

}

function moveSphere() {
  var delta = clock.getDelta(); // seconds
  var moveDistance = 100 * delta; // n pixels per second
  var rotateAngle = Math.PI / 2 * delta; // 90 deg per second

  // move forwards, backwards, left, or right
  if (pressed['W'] || pressed['ARROWUP']) {
		  console.log(moveDistance);
    sphereBody.velocity.z -= moveDistance;
  }
  if (pressed['S'] || pressed['ARROWDOWN']) {
    sphereBody.velocity.z += moveDistance;
  }
  if (pressed['A'] || pressed['ARROWLEFT']) {
    sphereBody.velocity.x -= moveDistance;
  }
  if (pressed['D'] || pressed['ARROWRIGHT']) {
    sphereBody.velocity.x += moveDistance;
  }

	luzFocalBall.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z-2);
	luzFocalBall.rotation.x = Math.PI / 2;

}


function moveCamera() {
	if(personalCamera){
	  personalCamera.position.x = sphereBody.position.x + 0;
	  personalCamera.position.y = sphereBody.position.y + 3;
	  personalCamera.position.z = sphereBody.position.z + 6;
	  personalCamera.lookAt(sphereGroup.position);
	}
}

function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    contenido = e.target.result;
    generaCiudad();
  };
  lector.readAsText(archivo);
}

function generaCiudad() {
  if (loading_city == 1){
		return;
	}
	if(!personalCamera){
		setPersonalCamera ();
	}
	console.log("generating");
	loading_city = 1;
	var selectedObject = scene.getObjectByName(city.name);
  scene.remove( selectedObject );
	city = new THREE.Object3D();
	city.name = "city";

  if(!contenido){
		if(!notified){
			alert("No has cargado ninguna ciudad");
			notified =1;
		}
		return;
	}

  world.bodies.map(function(body){
		world.removeBody(body);
	})

	addSpherePhysics();

	addFloorPhysics();

	var lines = contenido.split('\n');
  for (var i=0 ; i < lines.length; i++){
    var tokens = lines[i].split(' ');
    // Geometrias
    var height = Math.random() * (max_height - 5) + 5;
    var cube_building = new THREE.BoxGeometry(tokens[3]*1, height, tokens[4]*1);
    var tex_to_modify = tex_default;
		material = material_default;
    /* OBJETOS */
    if(tokens[2] == "E"){
			material = materialE;
      tex_to_modify = texE;
    }
    else if(tokens[2] == "G"){
      material = materialG;
      tex_to_modify = texG;
    }
    else if(tokens[2] == "F"){
      material = materialF;
      tex_to_modify = texF;
    }
    else if(tokens[2] == "R"){
      material = materialR;
      tex_to_modify = texR;
    }
    else if(tokens[2] == "S"){
      material = materialS;
      tex_to_modify = texS;
    }
    else if(tokens[2] == "H"){
      material = materialH;
      tex_to_modify = texH;
    }
		tex_to_modify.wrapS = THREE.RepeatWrapping;
		tex_to_modify.wrapT = THREE.RepeatWrapping;
		tex_to_modify.repeat.set( 1, height );

    var building = new THREE.Mesh(cube_building, material);
    building.position.x = separation_dist * tokens[0]*1+tokens[3]/2+0.5;
    building.position.z = separation_dist * tokens[1]*1+tokens[4]/2+0.5;
    building.position.y = height/2;
		building.receiveShadow = true;
		building.castShadow = true;

    city.add(building);


		var materialBasic = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
    var cube_building_shape = new THREE.BoxGeometry((tokens[3]*1)-1, height, (tokens[4]*1)-1);
		var buildingShape = new THREE.Mesh(cube_building, materialBasic);
		buildingShape.position.x = separation_dist * tokens[0]*1+tokens[3]/2+0.5;
		buildingShape.position.z = separation_dist * tokens[1]*1+tokens[4]/2+0.5;
		buildingShape.position.y = height/2;
		city.add(buildingShape);

		var q = buildingShape.quaternion;
		buildingBody = new CANNON.Body({
	    mass: 0,
	    material: physicsMaterial,
	    shape: new CANNON.Box(new CANNON.Vec3((tokens[3]*1), height, (tokens[4]*1))),
	    position: new CANNON.Vec3(separation_dist * tokens[0]*1+tokens[3]/2+0.5, height/2, separation_dist * tokens[1]*1+tokens[4]/2+0.5)
	  });


		world.addBody(buildingBody);
  }


	scene.add(city);
	loading_city = 0;
}

function updatePhysics() {
  world.step(1/60);
  sphereGroup.position.copy(sphereBody.position);
  sphereGroup.quaternion.copy(sphereBody.quaternion);

}

function render(){
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

	moveSphere();
	updatePhysics();

	if (typeof(controls) === 'undefined') moveCamera();
  update();

  renderer.clear();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );


  var size = Math.min(window.innerWidth, window.innerHeight)/4;
  renderer.setViewport(0, 0, size, size);
  renderer.render( scene, cenital );

	if(personalCamera){
		renderer.setViewport(window.innerWidth-(size*2), window.innerHeight-(size*2), size*2, size*2);
	  renderer.render( scene, personalCamera );
	}
}

function updateAspectRatio(){
	//indicarle al motor las nuevas dimensiones
	renderer.setSize(window.innerWidth, window.innerHeight);
	var ar = window.innerWidth/window.innerHeight;

	var size = Math.min(window.innerWidth, window.innerHeight)/4;

	if(ar>1){
		if(personalCamera){
		  personalCamera.left = l*ar;
		  personalCamera.right = r*ar;
		  personalCamera.bottom = b;
		  personalCamera.top = t;
		}
	  camera.left = l*ar;
	  camera.right = r*ar;
	  camera.bottom = b;
	  camera.top = t;
	}
	else{
		if(personalCamera){
		  personalCamera.left = l;
		  personalCamera.right = r;
		  personalCamera.bottom = b/ar;
		  personalCamera.bottom = t/ar;
		}
	  camera.left = l;
	  camera.right = r;
	  camera.bottom = b/ar;
	  camera.top = t/ar;
	}

	camera.aspect = ar;
	//se ha variado el valumen de la vista
	//se ha variado la matriz de proyeccion
	camera.updateProjectionMatrix();
	if(personalCamera){
		personalCamera.updateProjectionMatrix();
	}
	render();
}

function setupGui() {
	// Definicion de los controles
	effectController = {
		time: 1,
		separation: 1,
		height: 20,
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control ciudad");
	var hour = h.add(effectController, "time", 0, 2, 1).name("Hora");
	var separationDist = h.add(effectController, "separation", 1, 3, 1).name("Separación edificios");
	var heightConf = h.add(effectController, "height", 20, 100, 5).name("Altura edificios");
	hour.onChange(function(time){
		const loader = new THREE.TextureLoader();
		if (time == 0){
			luzAmbiente.intensity = 0.6;
		  luzFocal.intensity = 0.6;
			luzFocal.position.set( 400, 200, 200);
			loader.load('images/edificios/morning.jpg' , function(texture)
						{
							var fondo = new THREE.MeshBasicMaterial({ map:texture });
							set_city_backGround(fondo, texture);
						})
		}
	  else if (time == 1){
			luzAmbiente.intensity = 1;
		  luzFocal.intensity = 1;
			luzFocal.position.set( 400, 400, 400);
			loader.load('images/edificios/day.jpg' , function(texture)
						{
							var fondo = new THREE.MeshBasicMaterial({ map:texture });
				      set_city_backGround(fondo, texture);
						});
		}
		else{
			luzAmbiente.intensity = 0.05;
			luzFocal.intensity = 0.05;
			luzFocal.position.set( 200, 200, 400);
			loader.load('images/edificios/night.jpg' , function(texture)
						{
							var fondo = new THREE.MeshBasicMaterial({ map:texture });
				      set_city_backGround(fondo, texture);
						});
		}
	});
	separationDist.onChange(function(distance){
		separation_dist = distance;
		generaCiudad();

	});
	heightConf.onChange(function(height){
		max_height = height;
	  generaCiudad();

	});
}

function set_city_backGround(fondo, tex){
	var back = new THREE.PlaneGeometry(384,185,10,10);
	backX = new THREE.Mesh(back, fondo);
	fondo.side = THREE.DoubleSide;
  backZ = new THREE.Mesh(back, fondo);
	backZ.scale.x = -1;
  backX.rotation.y = Math.PI / 2;
  backX.position.y = 50;
  backZ.position.y = 50;
  backZ.position.x = 192;
  backX.position.z = 192;
  scene.add(backX);
	scene.add(backZ);
}
