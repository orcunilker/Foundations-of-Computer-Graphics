// http://vda.univie.ac.at/Teaching/Graphics/22w/Labs/Lab1/lab1a.html
// file:///Users/orcun/Desktop/Uni/GFX/Lab1a/webgl_example/index.html


const { mat4 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

//Additional variables
cameraMode = true;
shapeSelectedMode = false;
selectedShapeNumber = -1;
statusMode = "Camera mode";

const locations = {

    attributes: {

        vertexLocation: null,
        colorLocation: null

    }, uniforms: {

        modelViewMatrix: null,
        projectionMatrix: null,

    }
}

const viewMatrix = mat4.create();

window.onload = async () => {

    /* --------- basic setup --------- */

    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

//Text Canvas
    let textCanvas = document.querySelector("#text");
    textCtx = textCanvas.getContext("2d");

    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    gl.clearColor(0.729, 0.764, 0.674, 1);

    const program = createShaderProgram("v-shader", "f-shader");
    gl.useProgram(program);

    /* --------- save attribute & uniform locations --------- */


    
    locations.attributes.vertexLocation = gl.getAttribLocation(program, "vertexPosition");
    locations.attributes.colorLocation = gl.getAttribLocation(program, "vertexColor");

    locations.uniforms.modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
    locations.uniforms.projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");

    /* --------- create & send projection matrix --------- */

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);

    gl.uniformMatrix4fv(locations.uniforms.projectionMatrix, gl.FALSE, projectionMatrix);

    /* --------- create view matrix --------- */

    mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);

    /* --------- translate view matrix --------- */

    mat4.translate(viewMatrix, viewMatrix, [0, 0, -2])

    /* --------- create 2 cubes and translate them away from each other --------- */

// 9 shapes

    shapes.push(createShape());
    shapes[0].translate([-1, 1, 0]);

    shapes.push(createShapePyramid());
    shapes[1].translate([0, 1, 0]);

    shapes.push(createShape());
    shapes[2].translate([1, 1, 0]);

    shapes.push(createShapePyramid());
    shapes[3].translate([-1, 0, 0]);

    shapes.push(createShape());
    shapes[4].translate([0, 0, 0]);

    shapes.push(createShapePyramid());
    shapes[5].translate([1, 0, 0]);

    shapes.push(createShape());
    shapes[6].translate([-1, -1, 0]);

    shapes.push(createShapePyramid());
    shapes[7].translate([0, -1, 0]);

    shapes.push(createShape());
    shapes[8].translate([1, -1, 0]);

    /* --------- Attach event listener for keyboard events to the window --------- */

// Camera Movement Keyboard
    window.addEventListener("keydown", (event) => {

        /* ----- this event contains all the information you will need to process user interaction ---- */

        console.log(event)

        const trAmt = 0.2;
        const roAmt = 0.5;

        if(parseInt(event.key) <= 9 && parseInt(event.key) >= 1){
            cameraMode = false;
            shapeSelectedMode = true;
            selectedShapeNumber = parseInt(event.key) - 1;
            statusMode = "Single shape transformation mode"
        }
        else if(parseInt(event.key) == 0){
            cameraMode = false
            shapeSelectedMode = false;
            statusMode = "Multiple shape transformation mode"
        }
        else if(event.key == "v"){ //"v" for camera mode
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "Camera mode"
        }

        if(cameraMode){
            switch(event.key){
                case "ArrowUp": 
                    mat4.translate(viewMatrix, viewMatrix, [0, -trAmt, 0])
                    break;
                case "ArrowDown":  
                    mat4.translate(viewMatrix, viewMatrix, [0, trAmt, 0])
                    break;
                case "ArrowLeft":
                    mat4.translate(viewMatrix, viewMatrix, [trAmt, 0, 0])  
                    break;
                case "ArrowRight":
                    mat4.translate(viewMatrix, viewMatrix, [-trAmt, 0, 0])
                    break;
            }
            
        }    
        else if(shapeSelectedMode){
            switch(event.key){
                // Translation
                case "ArrowUp": 
                    shapes[selectedShapeNumber].translate([0, trAmt, 0]);
                    break;
                case "ArrowDown":  
                    shapes[selectedShapeNumber].translate([0, -trAmt, 0]);
                    break;
                case "ArrowLeft":
                    shapes[selectedShapeNumber].translate([-trAmt, 0, 0])  
                    break;
                case "ArrowRight":
                    shapes[selectedShapeNumber].translate([trAmt, 0, 0])
                    break;
                case ",":
                    shapes[selectedShapeNumber].translate([0, 0, trAmt])
                    break;
                case ".":
                    shapes[selectedShapeNumber].translate([0, 0, -trAmt])
                    break;
                //Scaling
                // when rotated, it gets distorted
                case "a":
                    shapes[selectedShapeNumber].scale([0.9, 1, 1])
                    break;
                case "A":
                    shapes[selectedShapeNumber].scale([1.1, 1, 1])
                    break;
                case "b":
                    shapes[selectedShapeNumber].scale([1, 0.9, 1])
                    break;
                case "B":
                    shapes[selectedShapeNumber].scale([1, 1.1, 1])
                    break;
                case "c":
                    shapes[selectedShapeNumber].scale([1, 1, 0.9])
                    break;
                case "C":
                    shapes[selectedShapeNumber].scale([1, 1, 1.1])
                    break;
                //Rotation
                case "i":
                    shapes[selectedShapeNumber].rotate(roAmt, [1, 0, 0]);
                    break;
                case "k":
                    shapes[selectedShapeNumber].rotate(roAmt, [-1, 0, 0]);
                    break;
                case "o":
                    shapes[selectedShapeNumber].rotate(roAmt, [0, 1, 0]);
                    break;
                case "u":
                    shapes[selectedShapeNumber].rotate(roAmt, [0, -1, 0]);
                    break;
                case "l":
                    shapes[selectedShapeNumber].rotate(roAmt, [0, 0, 1]);
                    break;
                case "j":
                    shapes[selectedShapeNumber].rotate(roAmt, [0, 0, -1]);
                    break;
            }
            
        }
        // global tranformations
        else if(!shapeSelectedMode){
            switch(event.key){
                // Translation
                case "ArrowUp":
                    shapes.forEach(shape => {shape.translateGlobal([0, trAmt, 0]);});
                    break;
                case "ArrowDown":  
                    shapes.forEach(shape => {shape.translateGlobal([0, -trAmt, 0]);});
                    break;
                case "ArrowLeft":
                    shapes.forEach(shape => {shape.translateGlobal([-trAmt, 0, 0]);});
                    break;
                case "ArrowRight":
                    shapes.forEach(shape => {shape.translateGlobal([trAmt, 0, 0]);});
                    break;
                case ",":
                    shapes.forEach(shape => {shape.translateGlobal([0, 0, trAmt]);});
                    break;
                case ".":
                    shapes.forEach(shape => {shape.translateGlobal([0, 0, -trAmt]);});
                    break;
                //Scaling
                case "a":
                    shapes.forEach(shape => {shape.scaleGlobal([0.9, 1, 1]);});
                    break;
                case "A":
                    shapes.forEach(shape => {shape.scaleGlobal([1.1, 1, 1]);});
                    break;
                case "b":
                    shapes.forEach(shape => {shape.scaleGlobal([1, 0.9, 1]);});
                    break;
                case "B":
                    shapes.forEach(shape => {shape.scaleGlobal([1, 1.1, 1]);});
                    break;
                case "c":
                    shapes.forEach(shape => {shape.scaleGlobal([1, 1, 0.9]);});
                    break;
                case "C":
                    shapes.forEach(shape => {shape.scaleGlobal([1, 1, 1.1]);});
                    break;
                //Rotation
                case "i":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [1, 0, 0]);});
                    break;
                case "k":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [-1, 0, 0]);});
                    break;
                case "o":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [0, 1, 0]);});
                    break;
                case "u":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [0, -1, 0]);});
                    break;
                case "l":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [0, 0, 1]);});
                    break;
                case "j":
                    shapes.forEach(shape => {shape.rotateGlobal(roAmt, [0, 0, -1]);});
                    break;
            }

        }


    })

// Camera Movement Mouse
    function mouseCameraMove(event){
        console.log(event)

        let xDelta = event.movementX * 0.005;
        let yDelta = event.movementY * -0.005;

        mat4.translate(viewMatrix, viewMatrix, [xDelta, yDelta, 0])
    }

    window.addEventListener("mousedown", (event) => {
        window.addEventListener("mousemove", mouseCameraMove);
    })
    window.addEventListener("mouseup", (event) => {
        window.removeEventListener("mousemove", mouseCameraMove);
    })

 
// Load OBJ
    let objVertices = await loadOBJVertices('sampleModels/teapot.obj');
    console.log(objVertices);
    let objShape = createShapeOBJShape(objVertices);
    shapes.push(objShape);
    shapes[9].translate([2, 0, 0]);

    /* --------- start render loop --------- */

    requestAnimationFrame(render);

}


// Loading and extracting vertices from an OBJ file
async function loadOBJVertices(path) {
    let objVertices = []

    const objText = await fetch(path).then(result => result.text());
    //console.log(objText);

    let threeVertices = [];
    const lines = objText.split('\n');
    if(!lines){
        console.log('no text in obj');
        return;
    }
    lines.forEach(line => {
        if(line.startsWith('v ')){
            threeVertices = line.split(' ');
            threeVertices.shift();
        }
        if(threeVertices.length = 3){
            objVertices = objVertices.concat(threeVertices);
        }
    }); 
    
    let objVerticesFloat = [];
    let index = 0;
    objVertices.forEach(v => {
          objVerticesFloat.push(parseFloat(v)*1);
    //   if(index % 4)
    //   index++;
    });

    return objVerticesFloat;
}


let then = 0;

function render(now) {

    /* --------- calculate time per frame in seconds --------- */

    let delta = now - then;
    delta *= 0.001;

    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {

        /* --------- scale rotation amount by time difference --------- */

        // shape.rotate(1 * delta, [0, 1, 1]);
        shape.draw();

    });

// Refresh Text Canvas
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(statusMode, 50,50);


    requestAnimationFrame(render)

}


function createShape() {

    /* --------- define vertex positions & colors --------- */
    /* -------------- 3 vertices per triangle ------------- */

    const vertices = [

        // X, Y, Z, W
        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,

        -0.2, 0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        -0.2, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, 0.2, 0.2, 1,

        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1, // left face end

        0.2, 0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,
        -0.2, -0.2, -0.2, 1, // back face end

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1,
        0.2, -0.2, -0.2, 1,

        0.2, -0.2, 0.2, 1,
        -0.2, -0.2, 0.2, 1,
        -0.2, -0.2, -0.2, 1, // bottom face end

        0.2, 0.2, 0.2, 1,
        0.2, -0.2, -0.2, 1,
        0.2, 0.2, -0.2, 1,

        0.2, -0.2, -0.2, 1,
        0.2, 0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        0.2, 0.2, 0.2, 1,
        0.2, 0.2, -0.2, 1,
        -0.2, 0.2, -0.2, 1,

        0.2, 0.2, 0.2, 1,
        -0.2, 0.2, -0.2, 1,
        -0.2, 0.2, 0.2, 1, // Top face end

    ];

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],    // Front face: black
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */

    colorData.forEach(color => {

        for (let i = 0; i < 6; ++i) {

            colors.push(color);

        }

    });

    /* --------- create shape object and initialize data --------- */

    const cube = new Shape();

    cube.initData(vertices, colors)

    return cube;

}

// Pyramid Shape
function createShapePyramid() {


    const vertices = [

        // X, Y, Z, W
        0, 0.2, 0, 1,
        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1, // front face end

        0, 0.2, 0, 1,
        0, -0.2, -0.2, 1,
        -0.2, -0.2, 0.2, 1, // left face end

        0, 0.2, 0, 1,
        0, -0.2, -0.2, 1,
        0.2, -0.2, 0.2, 1, // right face end

        -0.2, -0.2, 0.2, 1,
        0.2, -0.2, 0.2, 1,
        0, -0.2, -0.2, 1, // bottom face end

    ];

    const colorData = [
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 0.0, 1.0],    // left face: red
    ];

    const colors = [];

    colorData.forEach(color => {

        for (let i = 0; i < 3; ++i) {

            colors.push(color);

        }

    });

    const pyramid = new Shape();

    pyramid.initData(vertices, colors)

    return pyramid;

}


// OBJ Shape
function createShapeOBJShape(vertices){
    newVertices = vertices;
    // add 1 on every three vertices
    newVertices.splice(3, 0, 1)
    for (let i = 4; i < newVertices.length; i++) {
        if(newVertices[i-4] == 1){
            newVertices.splice(i, 0, 1)
        }
    }
    console.log(newVertices);

    const colorData = [
        [0.0, 0.0, 0.0, 1.0],
    ];

    const colors = [];

    colorData.forEach(color => {
        for (let i = 0; i < newVertices.length; ++i) {
            colors.push(color);
        }
    });

    const objShape = new Shape();

    objShape.initData(newVertices, colors)

    return objShape;
}