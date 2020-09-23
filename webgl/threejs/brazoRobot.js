/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera;

// Variables globales
var robot, angulo = 0, material;

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
  camera.position.set(0.5, 20, 350);
  camera.lookAt(new THREE.Vector3(0,0,0));
}

function loadScene() {
  // Cargar la escena con objetos


  // Materiales
  material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });

  robot = new THREE.Object3D();

  loadBrazoRobot();
  // construir escena

  var cilindro_base = new THREE.CylinderGeometry(50, 50, 15, 80);
  var base = new THREE.Mesh(cilindro_base, material);
  base.position.y = -150;
  robot.add(base);

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


function loadBrazoRobot(){
  // Geometrias
  var esfera_rotula = new THREE.SphereGeometry(20, 20, 30);
  var cubo_eje = new THREE.BoxGeometry(12, 120, 18);
  var cilindro_esparrago = new THREE.CylinderGeometry(20, 20, 18, 80);

  /* OBJETOS */
  var rotula = new THREE.Mesh(esfera_rotula, material);
  var eje = new THREE.Mesh(cubo_eje, material);
  var esparrago = new THREE.Mesh(cilindro_esparrago, material);

  rotula.position.y = 60;
  esparrago.position.y = -60;
  esparrago.rotation.x = Math.PI / 2;

  var brazo = new THREE.Object3D();

  // construir brazo
  brazo.add(rotula);
  brazo.add(eje);
  brazo.add(esparrago);

  // Geometrias antebrazo
  var cilindro_mano = new THREE.CylinderGeometry(15, 15, 40, 80);
  var cubo_nervio = new THREE.BoxGeometry(4, 80, 4);
  var cilindro_disco = new THREE.CylinderGeometry(22, 22, 6, 80);

  /* OBJETOS ANTEBRAZO*/
  var mano = new THREE.Mesh(cilindro_mano, material);
  var disco = new THREE.Mesh(cilindro_disco, material);
  mano.position.y = 40;
  disco.position.y = -40;
  mano.rotation.x = Math.PI / 2;

  var ante_brazo = new THREE.Object3D();

  // nervios
  for ( i = -1; i < 2; i+=2){
    for ( j = -1; j < 2; j+=2){
      var nervio = new THREE.Mesh(cubo_nervio, material);
      nervio.position.x = 5 * (i);
      nervio.position.z = 5 * (j);
      ante_brazo.add(nervio);
    }
  }

  // pinzas
  var pinza = new THREE.Object3D();
  var cubo_palma = new THREE.BoxGeometry(19, 20, 4);
  var palma = new THREE.Mesh(cubo_palma, material);
  pinza.add(palma);

  // construir ante brazo
  ante_brazo.add(disco);
  ante_brazo.add(mano);
  ante_brazo.add(palma);
  ante_brazo.position.y = 100;


  brazo.add(ante_brazo);
  robot.add(brazo);

}
