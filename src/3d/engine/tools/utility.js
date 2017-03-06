//get the context
function getWebGLContext(canvas, err) {
   // bind err
   if (canvas.addEventListener) {
       canvas.addEventListener("webglcontextcreationerror", function(event) {
           console.log(event.statusMessage);
       }, false);
   }
   //create context
   var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
   var context = null;
   for (var ii = 0; ii < names.length; ++ii) {
       try {
           context = canvas.getContext(names[ii], err);
       } catch (e) {}
       if (context) {
           break;
       }
   }
   return context;
};

//init shader
function initShaders(gl, vshader, fshader) {
   var program = createProgram(gl, vshader, fshader);
   if (!program) {
       console.log('Failed to create program');
       return false;
   }
   gl.useProgram(program);
   gl.program = program;

   // init shader variable
   gl.uPMatrix = gl.getUniformLocation(program, "uPMatrix");
   gl.uMVMatrix =  gl.getUniformLocation(program, "uMVMatrix");

   gl.aPosition = gl.getAttribLocation(gl.program, 'aPosition');
   gl.aColor = gl.getAttribLocation(gl.program, 'aColor');
   return true;
}

//create program
function createProgram(gl, vshader, fshader) {
    console.log('create')
   // Create shader object
   var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
   var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
   if (!vertexShader || !fragmentShader) {
       return null;
   }
   // Create a program object
   var program = gl.createProgram();
   if (!program) {
       return null;
   }
   // Attach the shader objects
   gl.attachShader(program, vertexShader);
   gl.attachShader(program, fragmentShader);
   // Link the program object
   gl.linkProgram(program);
   // Check the result of linking
   var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
   if (!linked) {
       var error = gl.getProgramInfoLog(program);
       console.log('Failed to link program: ' + error);
       gl.deleteProgram(program);
       gl.deleteShader(fragmentShader);
       gl.deleteShader(vertexShader);
       return null;
   }
   return program;
}

//loadShader
function loadShader(gl, type, source) {
   // Create shader object
   var shader = gl.createShader(type);
   if (shader == null) {
       console.log('unable to create shader');
       return null;
   }
   // Set the shader program
   gl.shaderSource(shader, source);
   // Compile the shader
   gl.compileShader(shader);
   // Check the result of compilation
   var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
   if (!compiled) {
       var error = gl.getShaderInfoLog(shader);
       console.log('Failed to compile shader: ' + error);
       gl.deleteShader(shader);
       return null;
   }
   return shader;
}

function colorTransform(colorStr){
    var color = [0,0,0];
    if (typeof(colorStr) == 'string') {
        if (colorStr.indexOf('#') !== -1) {
            var _color = colorStr.substring(1);
            if(_color.length == 3){
                color = [];
                for (var i = 0; i<_color.length; i++) {
                    var key = _color.charAt(i);
                    color.push(parseInt(key+key,16)/255);
                }
            }else if(_color.length == 6){
                color = [];
                for (var i = 0; i<_color.length; i+=2) {
                    var key = _color.charAt(i);
                    var key2 = _color.charAt(i+1);
                    color.push(parseInt(key+key2,16)/255);
                }
            }
        }
    }
    return color;
}

export {getWebGLContext,initShaders,createProgram,loadShader,colorTransform}
