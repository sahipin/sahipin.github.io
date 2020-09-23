/**
 * Seminario GPC 2. FormaBasica
 * 
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var robot, angulo = 0;

// Acciones
init();
loadScene();
render();


function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x0000AA) );
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;
  // args: angulo, ar, distancia init foto, distancia fin foto (profundidad de campo)
  camera = new THREE.PerspectiveCamera( 50, ar, 0.1, 1000000 );
  // añadimos camara en el eje de coordenas mirando hacia -z
  scene.add(camera);
  // Movemos la camare respecto al sistema de referencia de la scena ( la z tiene que ser menor que la profundidad de campo, o corta la escena)
  camera.position.set(0.5, 20, 150);
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
  var material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });
  
  // Geometrias
  var cilindro_base = new THREE.CylinderGeometry(50, 50, 15, 80);
  var esfera_rotula = new THREE.SphereGeometry(20, 20, 30);
  var cubo_eje = new THREE.BoxGeometry(18, 120, 12);
  var cilindro_esparrago = new THREE.CylinderGeometry(20, 20, 18, 80);
  
  /* OBJETOS */
  
  // base
  var base = new THREE.Mesh(cilindro_base, material);
  var rotula = new THREE.Mesh(esfera_rotula, material);
  var eje = new THREE.Mesh(cubo_eje, material);
  var esparrago = new THREE.Mesh(cilindro_esparrago, material);
  
  
  rotula.position.y = 60;
  eje.position.y = 0;
  esparrago.position.y = -60;
  esparrago.rotation.x = Math.PI / 2;
  
  var brazo = new THREE.Object3D();
  

  robot = new THREE.Object3D();

  // construir escena
  robot.add(base);
  robot.add(rotula);
  robot.add(eje);
  robot.add(esparrago);
  
  scene.add(robot);
  scene.add( new THREE.AxisHelper(3) );
}

function update(){
  // Cambios entre frames
  angulo += Math.PI / 1000;
  robot.rotation.y = angulo;
  //cubo.rotation.x = angulo / 2;
}

function render(){
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);

  update();

  renderer.render( scene, camera );
}
