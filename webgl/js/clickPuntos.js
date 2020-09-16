//Seminario #1 GPC


//Shader vertices
var VSHADER_SOURCE =
    'attribute vec4 posicion;       \n' +
    'void main(){                   \n' +
    '  gl_Position = posicion;      \n' +
    '  gl_PointSize = 8.0;         \n' +
    '}       \n';


var FSHADER_SOURCE =
    'void main(){            			          \n' +
    '  gl_FragColor = vec4(1.0,1.0,1.0,1.0);      \n' +
    '}                        				      \n';


function main() {
    //Recuperar el cavas
    var canvas = document.getElementById("canvasSara");
    if (!canvas) {
        console.log("Fallo de carga del canvas");
        return;
    }

    // Recuperar el contexto de render
    var gl = getWebGLContext(canvas)
    if (!gl) {
        console.log("Fallo de carga del contexto del render");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
	
    // Cargar, compilar y montar los shaders en un 'program'
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("no se ha realizado la carga de los shaders")
        return;
    }

    gl.clear(gl.COLOR_BUGGET_BIT);
	
    var coordenadas = gl.getAttribLocation(gl.program, 'posicion');

    canvas.onmousedown = function (evento) {
        click(evento, gl, canvas, coordenadas)
    }
}

var puntos = []; //Array de puntos

function click(evento, gl, canvas, coordenadas) {
	
    var x = evento.clientX;
    var y = evento.clientY;
    var rect = evento.target.getBoundingClientRect();

    //Conversion de cordenadas al sistema de WebGl por defecto
	//cuadrado de 2x2 centrado
    x = ((x - rect.left) - canvas.width / 2) * 2 / canvas.width;
    y = (canvas.height / 2 - (y - rect.top)) * 2 / canvas.height;

    //Guardar los puntos
    puntos.push(x); puntos.push(y);

    //Borrar el canvas
    gl.clear(gl.COLOR_BUGGET_BIT);

    //Inserta las coodenadas de los puntos como atributos y los dibuja uno a uno
    for (var i = 0; i < puntos.length; i += 2) {
        gl.vertexAttrib3f(coordenadas, puntos[i], puntos[i + 1], 0.9);
        gl.drawArrays(gl.POINTS, 0, 1);
    }

}