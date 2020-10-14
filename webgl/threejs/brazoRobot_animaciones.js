/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Global GUI
var effectController;

// Variables globales
var robot, angulo = 0, material;
var base, brazo, ante_brazo, pinzas, pinza_izq, pinza_der;
var r = t = 40;
var l = b = -r;
var cameraController;
var cenital;


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
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });

	// Geometrias
	var pinza = new THREE.Geometry();
	//Add the corners' coordinates
	pinza.vertices.push(
   new THREE.Vector3(0,0,0),
   new THREE.Vector3(19,0,0),
   new THREE.Vector3(19,20,0),
   new THREE.Vector3(0,20,0),
   new THREE.Vector3(0,20,-4),
   new THREE.Vector3(19,20,-4),
   new THREE.Vector3(0,0,-4),
   new THREE.Vector3(19,0,-4),
   new THREE.Vector3(38,4,0),
   new THREE.Vector3(38,4,-4),
   new THREE.Vector3(38,16,-4),
   new THREE.Vector3(38,16,0)
   );

	// Add vertices that form the faces. Clockwise
	pinza.faces.push(
   new THREE.Face3(0,1,2),
   new THREE.Face3(0,2,3),
   new THREE.Face3(3,2,4),
   new THREE.Face3(2,5,4),
   new THREE.Face3(1,7,2),
   new THREE.Face3(7,5,2),
   new THREE.Face3(6,7,0),
   new THREE.Face3(7,1,0),
   new THREE.Face3(6,0,3),
   new THREE.Face3(6,3,4),
   new THREE.Face3(4,5,6),
   new THREE.Face3(5,7,6),
   new THREE.Face3(1,8,11),
   new THREE.Face3(1,11,2),
   new THREE.Face3(2,11,5),
   new THREE.Face3(11,10,5),
   new THREE.Face3(8,9,10),
   new THREE.Face3(8,10,11),
   new THREE.Face3(7,9,8),
   new THREE.Face3(7,8,1),
   new THREE.Face3(7,5,9),
   new THREE.Face3(5,10,9)
  );
	var planeGeom = new THREE.PlaneGeometry(1000,1000, 20,20);
	var cilindro_base = new THREE.CylinderGeometry(50, 50, 15, 80);
	var cubo_eje = new THREE.BoxGeometry(12, 120, 18);
	var cilindro_esparrago = new THREE.CylinderGeometry(20, 20, 18, 80);
	var esfera_rotula = new THREE.SphereGeometry(20, 20, 30);
	var cilindro_disco = new THREE.CylinderGeometry(22, 22, 6, 80);
	var cubo_nervio = new THREE.BoxGeometry(4, 80, 4);
	var cilindro_mano = new THREE.CylinderGeometry(15, 15, 40, 80);


	/* OBJETOS */
	var plane = new THREE.Mesh(planeGeom, material);
  plane.rotation.x = Math.PI / 2;

	robot = new THREE.Object3D();
	robot.position.y = 10;

	base = new THREE.Mesh(cilindro_base, material);
	brazo = new THREE.Object3D();

	var eje = new THREE.Mesh(cubo_eje, material);
	eje.position.y = 60;
	var esparrago = new THREE.Mesh(cilindro_esparrago,material);
	esparrago.rotation.x = Math.PI / 2;
	var rotula = new THREE.Mesh(esfera_rotula,material);
	rotula.position.y = 120;
	ante_brazo = new THREE.Object3D();
	ante_brazo.position.y = 120;
  var disco = new THREE.Mesh(cilindro_disco,material);

	// nervios
	for ( i = -1; i < 2; i+=2){
		for ( j = -1; j < 2; j+=2){
			var nervio = new THREE.Mesh(cubo_nervio, material);
			nervio.position.y = 40;
			nervio.position.x = 12 * (i);
			nervio.position.z = 12 * (j);
			ante_brazo.add(nervio);
		}
	}

	var mano = new THREE.Mesh(cilindro_mano,material);
	mano.position.y = 80;
	mano.rotation.x = Math.PI/2;
	pinzas = new THREE.Object3D();
	pinzas.position.x = 12;
	pinzas.rotation.x = Math.PI / 2;
	pinza_izq = new THREE.Mesh(pinza, material);
	pinza_izq.position.z = 14;
	pinza_izq.position.y = -10;
	pinza_der = new THREE.Mesh(pinza,material);
	pinza_der.position.z = -10;
	pinza_der.position.y = -10;

	pinzas.add(pinza_izq);
	pinzas.add(pinza_der);

	mano.add(pinzas);

	ante_brazo.add(disco);
	ante_brazo.add(mano);

	brazo.add(eje);
	brazo.add(esparrago);
	brazo.add(rotula);
	brazo.add(ante_brazo);

	base.add(brazo);

	robot.add(base);

	scene.add(robot);
	scene.add(plane);




  scene.add( new THREE.AxisHelper(30) );
}

function update(){
  // Cambios entre frames
  //angulo += Math.PI / 1000;
  //robot.rotation.y = angulo;
	// Actualiza interpoladores
	TWEEN.update();

	robot.rotation.y = effectController.base *Math.PI /360;


	brazo.rotation.z = effectController.brazo* Math.PI / 180;


	ante_brazo.rotation.y = effectController.ante_brazo_y * Math.PI / 180;
	ante_brazo.rotation.z = effectController.ante_brazo_z * Math.PI / 180;


	pinzas.rotation.z = effectController.giro_pinza * Math.PI / 180;
	pinzas.position.x = Math.cos(pinzas.rotation.z) * 12;
	pinzas.position.z = Math.sin(pinzas.rotation.z) * 12;

	pinza_izq.position.z = 4 + effectController.abrir_pinza / 2;
  pinza_der.position.z = 0 - effectController.abrir_pinza / 2;


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
		base: 0,
		brazo: 0,
		ante_brazo_y: 0,
		ante_brazo_z: 0,
		giro_pinza: 0,
		abrir_pinza: 15,
		/*reiniciar: function(){
			TWEEN.removeAll();
			eje.position.set(-2.5,0,-2.5);
			eje.rotation.set( 0, 0, 0 );
			startAnimation();
		}*/
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
	var h = gui.addFolder("Control robot");
	h.add(effectController, "base", -180, 180, 1).name("Giro Base");
	h.add(effectController, "brazo", -45, 45, 1).name("Giro Brazo");
	h.add(effectController, "ante_brazo_y", -180, 180, 1).name("Giro Ante Brazo Y");
	h.add(effectController, "ante_brazo_z", -90, 90, 1).name("Giro Ante Brazo Z");
	h.add(effectController, "giro_pinza", -40, 220, 1).name("Giro Pinza");
	h.add(effectController, "abrir_pinza", 0, 15, 1).name("Separación Pinza");

}
