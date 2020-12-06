/**
 * Seminario GPC 2. FormaBasica
 *
 * Dibujar formas basicas con animación
 */

// Variables globales imprescindibles
// motor render (dibujar), estructura datos almacen dibujos, desde donde dibujamos
var renderer, scene, camera, cenital, personalCamera;
var materialE,materialG,materialF,materialR,materialS,materialH,material_default;
var texE,texG,texF,texR,texS,texH,tex_default;
// Variables globales
var elevator0, elevator1, elevator2, elevator3, elevator4;
var passenger0, passenger1, passenger2, passenger3, passenger4;
var problem, angulo = 0, material;
var r = t = 40;
var l = b = -r;
var max_height = 20, separation_dist = 1;
var cameraController;
var lineToRead = 0;
var path = "images/ImagesPIN/";
// Global GUI
var effectController;
var backX, backZ;
var contenido;
// Acciones
init();
loadScene();
render();

function setCameras(ar ){
	//contruir las 4 cámaras

	var origen = new THREE.Vector3(0,0,0);
	/*
	//ortográfica
	var camOrtografica = new THREE.OrthographicCamera(l, r, t, b, -200, 200);
	cenital = camOrtografica.clone();
	cenital.position.set(0,130,0);
	cenital.lookAt(origen);
	cenital.up = new THREE.Vector3(0,0,-1);
	*/

	//perspectiva
	camera = new THREE.PerspectiveCamera(45, ar, 0.1, 10000 ); // valores de cerca y lejos (los dos ultimos)
    // Movemos la camare respecto al sistema de referencia de la scena
	camera.position.set(60, 140, 190); // traslado de la camara desde el origen de coordenadas
	camera.lookAt(new THREE.Vector3(0,0,0));
	//scene.add(cenital);
	scene.add(camera);
}


function init() {
  // Crear el motor, la escena y la camara

  // Motor de render
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( new THREE.Color(0x777777) );
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

  // Luces
  var luzAmbiente = new THREE.AmbientLight(0xFFFFFF, 0.9);
  scene.add(luzAmbiente);


  window.addEventListener('resize', updateAspectRatio);

const loader = new THREE.TextureLoader();
/*
tex_default = loader.load('images/edificios/centro_comercial.jpg' , function(texture)   {
	material_default = new THREE.MeshBasicMaterial({ map:texture});
});
*/
material_default = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });
problem = new THREE.Scene();
problem.name = "problem";
generateBuilding();

elevator0 = new THREE.Object3D();
elevator1 = new THREE.Object3D();
elevator2 = new THREE.Object3D();
elevator3 = new THREE.Object3D();
elevator4 = new THREE.Object3D();

generateElevator(elevator0, 0,-20);
generateElevator(elevator1, 40,-10);
generateElevator(elevator2, 40,0);
generateElevator(elevator3, 80,10);
generateElevator(elevator4, 0,20, false);

problem.add(elevator0);
problem.add(elevator1);
problem.add(elevator2);
problem.add(elevator3);
problem.add(elevator4);

passenger0 = generatePassenger(20, 0);
passenger1 = generatePassenger(40, 0);
passenger2 = generatePassenger(10, 1);
passenger3 = generatePassenger(80, 0);
passenger4 = generatePassenger(10, 0);

problem.add(passenger0);
problem.add(passenger1);
problem.add(passenger2);
problem.add(passenger3);
problem.add(passenger4);

scene.add(problem);

}

function loadScene() {
  // Cargar la escena con objetos

  // Materiales
 	material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });

	document.getElementById('file-input').addEventListener('change', leerArchivo, false);

	//scene.add( new THREE.AxisHelper(30) );

	// Suelo adoquines
	// var texturaSuelo = new THREE.TextureLoader().load(path+'pavimento2.jpg');
    // texturaSuelo.magFilter = THREE.LinearFilter;
    // texturaSuelo.minFilter = THREE.LinearFilter;
    // texturaSuelo.repeat.set(10,10);
	// texturaSuelo.wrapS = texturaSuelo.wrapT = THREE.MirroredRepeatWrapping;
	// var materialSuelo = new THREE.MeshPhongMaterial({color:'white', map: texturaSuelo});
	// var geoSuelo = new THREE.PlaneGeometry(400, 400, 10, 10);
	// var suelo = new THREE.Mesh(geoSuelo, materialSuelo);
	// suelo.rotation.x = -Math.PI/2;
	// scene.add(suelo);

	// Entorno habitacion
	var paredes = [ path+'posx6.png',path+'negx6.png',
                    path+'posy6.png',path+'negy6.png',
                    path+'posz6.png',path+'negz6.png'
                    ];
    var mapaEntorno = new THREE.CubeTextureLoader().load(paredes);
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaEntorno;
	var matparedes = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
		side: THREE.BackSide
	});
	var habitacion = new THREE.Mesh( new THREE.CubeGeometry(400,400,400),matparedes);
	scene.add(habitacion);


/*
	const loader = new THREE.TextureLoader();
	loader.load('images/edificios/morning.jpg' , function(texture)
	{
	 var fondo = new THREE.MeshBasicMaterial({ map:texture });
	 set_city_backGround(fondo);
	});

	var tex = loader.load('images/edificios/asfalto.jpg' , function(texture)
				{
				 var fondo = new THREE.MeshBasicMaterial({ map:texture });
				 var suelo = new THREE.PlaneGeometry(384,384,10,10);
	 				asfalto = new THREE.Mesh(suelo, fondo);
					asfalto.rotation.x = -Math.PI / 2;
					asfalto.position.x = 192;
					asfalto.position.z = 192;

	 				scene.add(asfalto);
				});

		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set( 90, 90 );
*/
}

function update(){
  // Cambios entre frames

}

function moveElevator(elevator, floor){
	new TWEEN.Tween(elevator.position)
		 .to(elevator.position.clone().setY((floor*10)+5), 1000).onComplete(
			 function() {
			 	 readLine();
			 }).start();

}

function enterPassenger(elevator, passenger, seat){
	var newZPos = 2;
	var newXPos = 0;
	var newYPos = - 5 + 2*seat;

	new TWEEN.Tween(passenger.position)
		 .to(passenger.position.clone().setZ(elevator.position.z).setX(elevator.position.x), 500).onComplete(
			 function() {
			   elevator.add(passenger);
			   passenger.position.x = 0;
			   passenger.position.y = 0;
			   passenger.position.z = 0;
			   new TWEEN.Tween(passenger.position)
				 .to(passenger.position.clone().setZ(newZPos).setX(newXPos).setY(newYPos), 500).onComplete(
				 function() {
				   readLine();
				 }).start();
			 }).start();
}

function exitPassenger(elevator, passenger, seat){
	var newZPos = elevator.position.z +4;
	var newXPos = elevator.position.x;
	var newYPos = elevator.position.y - 5 + 0.5;
	problem.add(passenger);
	elevator.remove(passenger);
	passenger.position.x = elevator.position.x;
	passenger.position.y = elevator.position.y +5;
	passenger.position.z = elevator.position.z+2;
	new TWEEN.Tween(passenger.position)
	   .to(passenger.position.clone().setZ(newZPos).setX(newXPos).setY(newYPos), 500).onComplete(
	   function() {
	     readLine();
	}).start();
}

function leerArchivo(e) {
  var archivo = e.target.files[0];
  console.log(archivo)
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    contenido = e.target.result;
    readLine();
  };
  lector.readAsText(archivo);
}

function generateBuilding() {

  for (var i=0; i <= 13; i++){
		// Geometrias
		var height = 10*i;
		//var floor = new THREE.PlaneGeometry(50, 20);
		var floor = new THREE.BoxGeometry(50,20,0.5);
		var tex_to_modify = tex_default;
		//material = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false, side: THREE.DoubleSide});
		material = new THREE.MeshPhongMaterial({
			color:  "rgb(194, 155, 97)",
			opacity: 0.7,
			transparent: true}); // color suelo

		var floorMesh = new THREE.Mesh(floor, material);
		floorMesh.rotation.x = -Math.PI / 2;
		floorMesh.position.y = height;

		material = new THREE.MeshBasicMaterial({ color: 'pink', wireframe: true });
		problem.add(floorMesh);


		if(i != 13){

			var wall = new THREE.PlaneGeometry(50, 10);
			texturePared = new THREE.TextureLoader().load(path + 'pared'+ i+'.png'); // Añadir paredes fondo
			materialPared = new THREE.MeshPhongMaterial({map: texturePared, side: THREE.DoubleSide});
			var wallMesh = new THREE.Mesh(wall, materialPared);
			wallMesh.position.y = height + 5;
			wallMesh.position.z = -10;
			problem.add(wallMesh);


			// Geometrias
			// 512 x 512, size 300
			// https://onlinenumbertools.com/convert-numbers-to-image
			texture0 = new THREE.TextureLoader().load(path + i + '.png'); // Añadir numeros
			materialNumero = new THREE.MeshPhongMaterial({map: texture0, side: THREE.DoubleSide});

			var wall = new THREE.PlaneGeometry(20, 10);
			var wallMesh = new THREE.Mesh(wall, materialNumero);
			wallMesh.rotation.y = Math.PI / 2;
			wallMesh.position.y = height + 5;
			wallMesh.position.x = -25;

			problem.add(wallMesh);
		}
	}

}

function generatePassenger(planta, celda = 0){
	// Geometrias
	var height = 1;
	var passenger = new THREE.CylinderGeometry(0.5, 1, height, 64);
	var head = new THREE.SphereGeometry(0.5, 32, 32);

	//var texturaVestido = new THREE.TextureLoader().load(path+'estampado.jpg');
	//var mat = new THREE.MeshPhongMaterial({color:'white', map: texturaVestido});
	var color = 'blue'

	var mat = new THREE.MeshBasicMaterial({ color, wireframe: false });
	var body = new THREE.Mesh(passenger, mat);
	color ='black'
	mat = new THREE.MeshBasicMaterial({ color, wireframe: false });
	var cabeza = new THREE.Mesh(head, mat);

	cabeza.position.y = 1;
	/*
	cabeza.position.x += 5 * celda;
	body.position.x += 5 * celda;
	cabeza.position.y = height + 0.5 + planta;
	body.position.y = height/2 + planta;
	body.position.z = 8;
	cabeza.position.z = 8;
*/
	person = new THREE.Object3D();
	person.add(body);
	person.add(cabeza);
	person.position.x -= 10;
	person.position.x += 5 * celda;
	person.position.z = 8;
	person.position.y = height/2 + planta;
  return person;
}

function generateElevator(elevator, position_y, position_x, slow = true){
	// Geometrias
	var height = 10;
	var cube_elevator = new THREE.BoxGeometry(4, height, 4);
	var texturaAscensor = new THREE.TextureLoader().load(path+'ascensor.jpg');
	var mat = new THREE.MeshPhongMaterial({color:'white', map: texturaAscensor});
	//var color = 'black'

	if(slow == false){
		var texturaAscensor = new THREE.TextureLoader().load(path+'ascensor2.jpg');
		var mat = new THREE.MeshPhongMaterial({color:'white', map: texturaAscensor});
		//color = 'yellow'
	}

	//var mat = new THREE.MeshBasicMaterial({ color, wireframe: false });

	var elevMesh = new THREE.Mesh(cube_elevator, mat);

	elevator.add(elevMesh);
	elevator.position.x = position_x;
	elevator.position.y = height/2 + position_y;


}

function readLine( ) {
	if(!personalCamera){
		//setPersonalCamera ();
	}


  if(!contenido){
		if(!notified){
			alert("No has cargado ningun plan");
			notified =1;
		}
		return;
	}
  var lines = contenido.split('\n');
  if(lines.length == lineToRead){
    return;
  }
  var tokens = lines[lineToRead].split(' ');
  document.getElementById("actionInProgress").innerHTML = lines[lineToRead];
  lineToRead +=1;
  /* ACCIONES */
  if(tokens[1] == "GODOWN" || tokens[1] == "GOUP"){
		var elevatorToMove = new THREE.Object3D();
		var destFloor = -1;
		switch (tokens[2]) {
			case "SLOWELEVATOR0":
				elevatorToMove = elevator0;
				break;
			case "SLOWELEVATOR1":
				elevatorToMove = elevator1;
				break;
			case "SLOWELEVATOR2":
				elevatorToMove = elevator2;
				break;
			case "SLOWELEVATOR3":
				elevatorToMove = elevator3;
				break;
			case "SLOWELEVATOR4":
				elevatorToMove = elevator4;
				break;
			default:
		}
		switch (tokens[3]) {
			case "FL0":
				destFloor = 0;
				break;
			case "FL1":
				destFloor = 1;
				break;
			case "FL2":
				destFloor = 2;
				break;
			case "FL3":
				destFloor = 3;
				break;
			case "FL4":
				destFloor = 4;
				break;
			case "FL5":
				destFloor = 5;
				break;
			case "FL6":
				destFloor = 6;
				break;
			case "FL7":
				destFloor = 7;
				break;
			case "FL8":
				destFloor = 8;
				break;
			case "FL9":
				destFloor = 9;
				break;
			case "FL10":
				destFloor = 10;
				break;
			case "FL11":
				destFloor = 11;
				break;
			case "FL12":
				destFloor = 12;
				break;
			default:
		}
		if(destFloor != -1){
			moveElevator(elevatorToMove, destFloor);
		}

  }
	if (tokens[1] == "EXIT" || tokens[1] == "ENTER"){
		var elevatorToMove = new THREE.Object3D();
		var passengerToMove = new THREE.Object3D();
		var seat = -1;
		var enter = false; // if true, enters, otherwhise, exits
		switch (tokens[2]) {
			case "SLOWELEVATOR0":
				elevatorToMove = elevator0;
				break;
			case "SLOWELEVATOR1":
				elevatorToMove = elevator1;
				break;
			case "SLOWELEVATOR2":
				elevatorToMove = elevator2;
				break;
			case "SLOWELEVATOR3":
				elevatorToMove = elevator3;
				break;
			case "SLOWELEVATOR4":
				elevatorToMove = elevator4;
				break;
			default:
		}

		switch (tokens[3]) {
			case "PASSENGER0":
				passengerToMove = passenger0;
				break;
			case "PASSENGER1":
				passengerToMove = passenger1;
				break;
			case "PASSENGER2":
				passengerToMove = passenger2;
				break;
			case "PASSENGER3":
				passengerToMove = passenger3;
				break;
			case "PASSENGER4":
				passengerToMove = passenger4;
				break;
			default:
		}

		switch (tokens[5]) {
			case "SEAT1":
				seat = 1;
				break;
			case "SEAT2":
				seat = 2;
				break;
			case "SEAT3":
				seat = 3;
				break;
			default:
		}

		if(seat != -1){
			if(tokens[1] == "ENTER")
				enterPassenger(elevatorToMove, passengerToMove, seat, enter);
			if(tokens[1] == "EXIT"){
				exitPassenger(elevatorToMove, passengerToMove, seat, enter);
			}
		}
	}


}

function render(){
  // dibujar cada frame
  // Callback de redibujado

  // recibe la misma funcion
  requestAnimationFrame(render);
  TWEEN.update();
  update();

  renderer.clear();

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.render( scene, camera );


  var size = Math.min(window.innerWidth, window.innerHeight)/4;
  renderer.setViewport(0, 0, size, size);
  //renderer.render( scene, cenital );

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
