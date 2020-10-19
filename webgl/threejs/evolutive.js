/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;
var materialE;
// Variables globales
var city, angulo = 0, material;
var r = t = 40;
var l = b = -r;
var cameraController;
var cenital;


// Acciones
init();
loadScene();
render();


function setCameras(ar ){
	//contruir las 4 cámaras

	var origen = new THREE.Vector3(0,0,0);
	//ortográfica
	var camOrtografica = new THREE.OrthographicCamera(l, r, t, b, -200, 200);
	cenital = camOrtografica.clone();
	cenital.position.set(0,250,0);
	cenital.lookAt(origen);
	cenital.up = new THREE.Vector3(0,0,-1);
	//perspectiva
	camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 10000 ); // valores de cerca y lejos (los dos ultimos)
    // Movemos la camare respecto al sistema de referencia de la scena
    camera.position.set(300, 300, 300); // traslado de la camara desde el origen de coordenadas
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
	loader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture)
	            {
	             scene.background = texture;
	            });
	loader.load('images/edificios/escuela.jpg' , function(texture)
							{
							 materialE = new THREE.MeshBasicMaterial({ map:texture });
							});

}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  material = new THREE.MeshBasicMaterial({ color: 'pink', solid: true });

	city = new THREE.Object3D();

	document.getElementById('file-input').addEventListener('change', leerArchivo, false);

  scene.add( new THREE.AxisHelper(30) );
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
    var contenido = e.target.result;
    generaCiudad(contenido);
  };
  lector.readAsText(archivo);
}

function generaCiudad(contenido) {
  var lines = contenido.split('\n');

  for (var i=0 ; i < lines.length; i++){
    console.log(lines[i]);
    var tokens = lines[i].split(' ');
    console.log(tokens[0]*1+tokens[3]/2);
    // Geometrias
    var height = Math.floor(Math.random()* 10) + 1;
    var cube_building = new THREE.BoxGeometry(tokens[3]*1, height, tokens[4]*1);

    /* OBJETOS */
    if(tokens[2] == "E"){
			material = materialE


    }
    else if(tokens[2] == "G"){
      material = new THREE.MeshBasicMaterial({ color: 'green', solid: true });
    }
    else if(tokens[2] == "F"){
      material = new THREE.MeshBasicMaterial({ color: 'pink', solid: true });
    }
    else if(tokens[2] == "R"){
      material = new THREE.MeshBasicMaterial({ color: 'red', solid: true });
    }
    else if(tokens[2] == "S"){
      material = new THREE.MeshBasicMaterial({ color: 'yellow', solid: true });
    }
    else if(tokens[2] == "H"){
      material = new THREE.MeshBasicMaterial({ color: 'cyan', solid: true });
    }
    else {
      material = new THREE.MeshBasicMaterial({ color: 'white', solid: true });
    }
    var building = new THREE.Mesh(cube_building, material);
    building.position.x = tokens[0]*1+tokens[3]/2+0.5;
    building.position.z = tokens[1]*1+tokens[4]/2+0.5;
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
