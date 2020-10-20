/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;
var materialE,materialG,materialF,materialR,materialS,materialH,material_default;
// Variables globales
var city, angulo = 0, material;
var r = t = 40;
var l = b = -r;
var max_height = 20, separation_dist = 1;
var cameraController;
var cenital;
// Global GUI
var effectController;
var backX, backZ;
var contenido;
var notified = 0;
// Acciones
init();
loadScene();
setupGui();
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
    camera.position.set(300, 100, 300); // traslado de la camara desde el origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(cenital);
	scene.add(camera);
}


function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x000011) );
  document.getElementById("container").appendChild(renderer.domElement);
  renderer.autoClear = false;
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


  window.addEventListener('resize', updateAspectRatio);

	const loader = new THREE.TextureLoader();
	/*loader.load('images/edificios/puente.jpg' , function(texture)
	            {
	             scene.background = texture;
	            });
	*/
	loader.load('images/edificios/escuela.jpg' , function(texture)
		{
		 materialE = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/farmacia.jpg' , function(texture)
		{
		materialF = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/hospital.jpg' , function(texture)
		{
		materialH = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/residencia.jpg' , function(texture)
		{
		materialR = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/supermercado.jpg' , function(texture)
		{
		materialS = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/gimnasio.jpg' , function(texture)
		{
		materialG = new THREE.MeshBasicMaterial({ map:texture });
		});
	loader.load('images/edificios/centro_comercial.jpg' , function(texture)
		{
		material_default = new THREE.MeshBasicMaterial({ map:texture});
		});

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
	loader.load('images/edificios/morning.jpg' , function(texture)
				{
				 var fondo = new THREE.MeshBasicMaterial({ map:texture });
				 set_city_backGround(fondo);
				});

	loader.load('images/edificios/asfalto.jpg' , function(texture)
				{
				 var fondo = new THREE.MeshBasicMaterial({ map:texture });
				 var suelo = new THREE.PlaneGeometry(384,384,10,10);
	 				asfalto = new THREE.Mesh(suelo, fondo);
					asfalto.rotation.x = -Math.PI / 2;
					asfalto.position.x = 192;
					asfalto.position.z = 192;

					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set( 10, 10 );

	 				scene.add(asfalto);
				});

}

function update(){
  // Cambios entre frames
  //angulo += Math.PI / 1000;
  //robot.rotation.y = angulo;

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

	var lines = contenido.split('\n');

  for (var i=0 ; i < lines.length; i++){
    var tokens = lines[i].split(' ');
    // Geometrias
    var height = Math.random() * (max_height - 5) + 5;
    var cube_building = new THREE.BoxGeometry(tokens[3]*1, height, tokens[4]*1);

    /* OBJETOS */
    if(tokens[2] == "E"){
			material = materialE

    }
    else if(tokens[2] == "G"){
      material = materialG
    }
    else if(tokens[2] == "F"){
      material = materialF
    }
    else if(tokens[2] == "R"){
      material = materialR
    }
    else if(tokens[2] == "S"){
      material = materialS
    }
    else if(tokens[2] == "H"){
      material = materialH
    }
    else {
      material = material_default
    }
		material.wrapS = THREE.RepeatWrapping;
		material.wrapT = THREE.RepeatWrapping;
		material.repeat.set( tokens[3], tokens[4] );

    var building = new THREE.Mesh(cube_building, material);
    building.position.x = separation_dist * tokens[0]*1+tokens[3]/2+0.5;
    building.position.z = separation_dist * tokens[1]*1+tokens[4]/2+0.5;
    building.position.y = height/2;

    city.add(building);
  }

	scene.add(city);
}

function render(){
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.clear();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );


  var size = Math.min(window.innerWidth, window.innerHeight)/4;
  renderer.setViewport(0, 0, size, size);
  renderer.render( scene, cenital );

}

function updateAspectRatio(){
	//indicarle al motor las nuevas dimensiones
	renderer.setSize(window.innerWidth, window.innerHeight);
	var ar = window.innerWidth/window.innerHeight;

	var size = Math.min(window.innerWidth, window.innerHeight)/4;

	if(ar>1){
	  //cenital.left = l*ar;
	  camera.left = l*ar;
	  //cenital.right = r*ar;
	  camera.right = r*ar;
	  //cenital.bottom = b;
	  camera.bottom = b;
	  //cenital.top = t;
	  camera.top = t;
	}
	else{
	  //cenital.left = l;
	  camera.left = l;
	  //cenital.right = r;
	  camera.right = r;
	  //cenital.bottom = b/ar;
	  camera.bottom = b/ar;
	  //cenital.bottom = t/ar;
	  camera.top = t/ar;
	}

	camera.aspect = ar;
	//se ha variado el valumen de la vista
	//se ha variado la matriz de proyeccion
	camera.updateProjectionMatrix();
	//cenital.updateProjectionMatrix();
	render();
}

function setupGui() {
	// Definicion de los controles
	effectController = {
		time: 0,
		separation: 1,
		height: 20,
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control ciudad");
	var hour = h.add(effectController, "time", 0, 2, 1).name("Hora");
	var separationDist = h.add(effectController, "separation", 1, 4, 1).name("Separación edificios");
	var heightConf = h.add(effectController, "height", 20, 100, 5).name("Altura edificios");
	hour.onChange(function(time){
		const loader = new THREE.TextureLoader();
		if (time == 0){
			var fondo;
			loader.load('images/edificios/morning.jpg' , function(texture)
						{
							fondo = new THREE.MeshBasicMaterial({ map:texture });
							set_city_backGround(fondo);
						});


		}
	  else if (time == 1){
			var fondo;
			loader.load('images/edificios/day.jpg' , function(texture)
						{
							fondo = new THREE.MeshBasicMaterial({ map:texture });
 						  set_city_backGround(fondo);
						});
		}
		else{
			var fondo;
			loader.load('images/edificios/night.jpg' , function(texture)
						{
							fondo = new THREE.MeshBasicMaterial({ map:texture });
							set_city_backGround(fondo);
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

function set_city_backGround(fondo){
	var back = new THREE.PlaneGeometry(384,185,10,10);
	backX = new THREE.Mesh(back, fondo);
  backZ = new THREE.Mesh(back, fondo);
  backX.rotation.y = Math.PI / 2;
  backX.position.y = 50;
  backZ.position.y = 50;
  backZ.position.x = 192;
  backX.position.z = 192;
  scene.add(backX);
	scene.add(backZ);
}
