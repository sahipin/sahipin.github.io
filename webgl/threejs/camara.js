/**
 * Seminario GPC 3. Cámara
 * 
 * Cámaras, marcos y 
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var esferacubo, cubo, angulo = 0;
var r = t = 4;
var l = b = -r;
var cameraController;
var alzado, planta, perfil;

// Acciones
init();
loadScene();
render();

function setCameras(ar ){
	//contruir las 4 cámaras
	
	var origen = new THREE.Vector3(0,0,0);
	//ortográficas
	var camOrtografica;
	if(ar>1){
	  camOrtografica = new THREE.OrthographicCamera(l*ar, r*ar, t, b, -20, 20); 
	}
	else{
	  camOrtografica = new THREE.OrthographicCamera(l, r, t/ar, b/ar, -20, 20); 
	}
	alzado = camOrtografica.clone();
	alzado.position.set(0,0,4);
	alzado.lookAt(origen);
	perfil = camOrtografica.clone();
	perfil.position.set(4,0,0);
	perfil.lookAt(origen);
	planta = camOrtografica.clone();
	planta.position.set(0,4,0);
	planta.lookAt(origen);
	planta.up = new THREE.Vector3(0,0,-1);
	
	//perspectiva
	camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 100 ); // valores de cerca y lejos (los dos ultimos)
    // Movemos la camare respecto al sistema de referencia de la scena
    camera.position.set(0.5, 3, 9); // traslado de la camara desde el origen de coordenadas
    camera.lookAt(new THREE.Vector3(0,0,0));
    scene.add(alzado);
	scene.add(perfil);
	scene.add(planta);
	scene.add(camera);
}

function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x0000AA) );
  renderer.autoClear = false;
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;
  
  setCameras(ar );
  
  
  //controlador de camara
  cameraController = new THREE.OrbitControls( camera, renderer.domElement);
  cameraController.target.set(0,0,0);
  cameraController.noKeys = true;
  
  window.addEventListener('resize', updateAspectRatio);
  renderer.domElement.addEventListener('dblclick', rotate);
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  var material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
  
  // Geometrias
  var geocubo = new THREE.BoxGeometry(2, 2, 2);
  var geoesfera = new THREE.SphereGeometry(1, 30, 30);

  // objetos
  cubo = new THREE.Mesh(geocubo, material);
  cubo.position.x = -1;

  var esfera = new THREE.Mesh(geoesfera, material);
  esfera.position.x = 1;

  esferacubo = new THREE.Object3D();
  esferacubo.position.y = 1;

  // Modelo importado
  var loader = new THREE.ObjectLoader();
  loader.load('models/soldado/soldado.json', obj => {    
    obj.position.y = 1;
    cubo.add(obj);
  });

  // construir escena
  esferacubo.add(cubo);
  esferacubo.add(esfera);
  
  scene.add(esferacubo);
  cubo.add( new THREE.AxisHelper(3) );
  scene.add( new THREE.AxisHelper(3) );
}

function rotate(event){
	//localiza el objeto seleccionado y lo gira 45º
	var x = event.clientX;
	var y = event.clientY;
	
	// convertir al cuadrado canónico (2x2) centrado en el origen de coordenadas
	x = (x/window.innerWidth) * 2 - 1;
	y = -(y/window.innerHeight) * 2 + 1;
	
	// construir el rayo e interseccion con la escena
	var rayo = new THREE.Raycaster();
	rayo.setFromCamera(new THREE.Vector2(x,y), camera);
	var interseccion = rayo.intersectObjects(scene.children, true);//true para que lo haga recursivamentre sobre los hijos de los hijos de la escena
	if(interseccion.lenght > 0){
		interseccion[0].object.rotation.y += Math.PI /45;
	}
console.log("sas");
}




function updateAspectRatio(){
	//indicarle al motor las nuevas dimensiones
	renderer.setSize(window.innerWidth, window.innerHeight);
	var ar = window.innerWidth/window.innerHeight;
	if(ar>1){
	  alzado.left = perfil.left = planta.left = l*ar;
	  camera.left = l*ar;
	  alzado.right = perfil.right = planta.right = r*ar;
	  camera.right = r*ar;
	  alzado.bottom = perfil.bottom = planta.bottom = b;
	  camera.bottom = b;
	  alzado.top = perfil.top = planta.top = t;
	  camera.top = t;
	}
	else{
	  alzado.left = perfil.left = planta.left = l;
	  camera.left = l;
	  alzado.right = perfil.right = planta.right = r;
	  camera.right = r;
	  alzado.bottom = perfil.bottom = planta.bottom = b/ar;
	  camera.bottom = b/ar;
	  alzado.bottom = perfil.bottom = planta.bottom = t/ar;
	  camera.top = t/ar;
	}
	camera.aspect = ar;
	//se ha variado el valumen de la vista
	//se ha variado la matriz de proyeccion
	camera.updateProjectionMatrix();
	alzado.updateProjectionMatrix();
	perfil.updateProjectionMatrix();
	planta.updateProjectionMatrix();
}

function update(){
  // Cambios entre frames
  //angulo += Math.PI / 100;
  //esferacubo.rotation.y = angulo;
  //cubo.rotation.x = angulo / 2;
}

function render(){
	
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

  update();
  
  renderer.clear();
  
  renderer.setViewport(0, window.innerHeight/2, 
						 window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, planta );


  renderer.setViewport(window.innerWidth/2, 0, 
						 window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, perfil );


  renderer.setViewport(0, 0, 
						 window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, alzado );
  
  
  renderer.setViewport(window.innerWidth/2, window.innerHeight/2, 
						 window.innerWidth/2, window.innerHeight/2);
  renderer.render( scene, camera );
}









