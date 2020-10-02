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
  renderer.setClearColor( new THREE.Color(0x000011) );
  document.getElementById("container").appendChild(renderer.domElement);

  // Escena
  scene = new THREE.Scene();

  // Crear la camara
  // Relacion aspecto
  var ar =  window.innerWidth / window.innerHeight;
  // args: angulo, ar, distancia init foto, distancia fin foto (profundidad de campo)
  camera = new THREE.PerspectiveCamera( 10, ar, 0.1, 1000000 );
  // añadimos camara en el eje de coordenas mirando hacia -z
  scene.add(camera);
  // Movemos la camare respecto al sistema de referencia de la scena ( la z tiene que ser menor que la profundidad de campo, o corta la escena)
  camera.position.set(0.5, 80, 200);
  camera.lookAt(new THREE.Vector3(0,0,0));


}

function loadScene() {
  // Cargar la escena con objetos


  // Materiales
  material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });

  robot = new THREE.Object3D();

  loadBrazoRobot();
  // construir escena

  scene.add(robot);
  scene.add( new THREE.AxisHelper(30) );
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

  var city = new THREE.Object3D();

  for (var i=0 ; i < 37; i++){
    console.log(lines[i]);
    var tokens = lines[i].split(' ');
    console.log(tokens[0]*1+tokens[3]/2);
    // Geometrias
    var height = Math.floor(Math.random()* 10) + 1;
    var cube_building = new THREE.BoxGeometry(tokens[3]*1, height, tokens[4]*1);

    /* OBJETOS */
    if(tokens[2] == "E"){
      material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
    }
    else if(tokens[2] == "G"){
      material = new THREE.MeshBasicMaterial({ color: 'blue', wireframe: true });
    }
    else if(tokens[2] == "F"){
      material = new THREE.MeshBasicMaterial({ color: 'yellow', wireframe: true });
    }
    else if(tokens[2] == "R"){
      material = new THREE.MeshBasicMaterial({ color: 'white', wireframe: true });
    }
    else if(tokens[2] == "s"){
      material = new THREE.MeshBasicMaterial({ color: 'orange', wireframe: true });
    }
    else if(tokens[2] == "H"){
      material = new THREE.MeshBasicMaterial({ color: 'purple', wireframe: true });
    }
    else {
      material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });
    }
    var building = new THREE.Mesh(cube_building, material);
    building.position.x = tokens[0]*1+tokens[3]/2+0.5;
    building.position.z = tokens[1]*1+tokens[4]/2+0.5;
    building.position.y = height/2+0.5;
    //eje.rotation.x = Math.PI / 2;

    // construir brazo

    city.add(building);
  }

  robot.add(city);

}



function loadBrazoRobot(){
  document.getElementById('file-input').addEventListener('change', leerArchivo, false);

  /*
  var city = new THREE.Object3D();
  for( i = 0; i < 10; i ++){
    // Geometrias
    var height = Math.floor(Math.random()* 10) + 1;
    var cube_building = new THREE.BoxGeometry(1, height, 1);

    // OBJETOS
    var building = new THREE.Mesh(cube_building, material);
    building.position.x = i*height;
    building.position.z = i - height;
    building.position.y = height/2+0.5;
    //eje.rotation.x = Math.PI / 2;



    // construir brazo

    city.add(building);
  }

  robot.add(city);
  */
}
