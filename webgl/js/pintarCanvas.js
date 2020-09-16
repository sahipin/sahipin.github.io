/**
* pintar un rectangulo azul
*/


function main (){

    //recuperar canvas
    var canvas = document.getElementById("canvas")

    if (!canvas) {
        console.log("Error loading canvas");
        return;
    }

    // Get render context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        conlose.log("Error loading the context render");
        return;
    }

    // Color de borrado
    gl.clearColor(0.0, 0.5, 0.0, 1.0);

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

}
