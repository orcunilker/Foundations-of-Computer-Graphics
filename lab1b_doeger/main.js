// server (terminal at folder):
// python -m http.server


//Additional variables
cameraMode = true;
shapeSelectedMode = false;
selectedShapeNumber = -1;
statusMode = "Camera mode";


window.onload = async () => {

    let canvas = document.getElementById("canvas");
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

//Text Canvas
    let textCanvas = document.querySelector("#text");
    textCtx = textCanvas.getContext("2d");

    // Enable z-Buffer calculations
    gl.enable(gl.DEPTH_TEST);

    // When resizing canvas (?)
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

    //Background(clearing per drawcall) color
    gl.clearColor(0.729, 0.764, 0.674, 1);


    // The Projection Matrix is calculated once and is given to the GLSL, the GPU, the vertex Shader (uniform variable)
    // Orthogonal, Perspective..., converts to from View-Space to Clip-Space
    // Converts to Clip-coordinates -1.0 to 1.0 (everything that can be seen)
    const projectionMatrix = mat4.create();
    mat4.perspective(matrices.projectionMatrix, toRad(45), canvas.clientWidth / canvas.clientHeight, 0.1, 100);

    // ViewMatrix: Transform vertecies from world(model)-space to how it would look like from a given camera position and direction
    mat4.lookAt(matrices.viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0]);
    // Translating Camera in the world
    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [0, 0, -6])


     // create shader programs and enable one of them
     shaderPrograms.noLightProgram = new ShaderProgram(shaders.noLight, shaders.fragment, shaderInfo);
     shaderPrograms.T1Program = new ShaderProgram(shaders.t1Program, shaders.fragment, shaderInfo);
     shaderPrograms.T2Program = new ShaderProgram(shaders.t2Program, shaders.fragment, shaderInfo);
     shaderPrograms.T3Program = new ShaderProgram(shaders.t3Program, shaders.f3Program, shaderInfo);
     shaderPrograms.T4Program = new ShaderProgram(shaders.t4Program, shaders.f4Program, shaderInfo);
 
     shaderPrograms.T1Program.enable();

    
    // LightPoint Shape Try
    let lightPoint = new Shape();
    lightPoint.vertices = [0.0, 0.0, 0.0, 1.0];
    lightPoint.translate([0.0, 10.0, 0.0, 1.0]);
    matrices.lightPointMatrix = lightPoint.lightPointMatrix;


    // Load OBJ
    let objObject = null;

    objObject = await loadOBJ('sampleModels/teapot.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/tetrahedron.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/cube.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/sphere_noSmooth.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/bunny.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/sphere.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/teapot.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/tetrahedron.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('sampleModels/cube.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));
    
    shapes[0].translate([-2, 2, 0]);
    shapes[1].translate([0, 2, 0]);
    shapes[2].translate([2, 2, 0]);
    shapes[3].translate([-2, 0, 0]);
    shapes[4].translate([0, 0, 0]);
    shapes[5].translate([2, 0, 0]);
    shapes[6].translate([-2, -2, 0]);
    shapes[7].translate([0, -2, 0]);
    shapes[8].translate([2, -2, 0]);

    shapes[3].scale([0.8,0.8,0.8]);
    shapes[4].scale([5,5,5]);
    shapes[5].scale([0.8,0.8,0.8]);

// Camera Movement Keyboard
    window.addEventListener("keydown", (event) => {

        console.log(event)

        const trAmt = 0.2;
        const roAmt = 0.5;

        //Switching Modes
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
        else if(event.key == "q"){
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "No light mode"
        }
        else if(event.key == "w"){
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "Gouraud/diffuse mode"
        }
        else if(event.key == "e"){
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "Gouraud/specular mode"
        }
        else if(event.key == "r"){
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "Phong/diffuse mode"
        }
        else if(event.key == "t"){
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "Phong/specular mode"
        }

        if(cameraMode){ //Translating Camera
            switch(event.key){
                case "ArrowUp": 
                    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [0, -trAmt, 0])
                    break;
                case "ArrowDown":  
                    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [0, trAmt, 0])
                    break;
                case "ArrowLeft":
                    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [trAmt, 0, 0])  
                    break;
                case "ArrowRight":
                    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [-trAmt, 0, 0])
                    break;


                // Lighting Modes:
                case "q":
                    shaderPrograms.noLightProgram.enable();
                    break;
                case "w": // (Gouraud/diffuse)
                    shaderPrograms.T1Program.enable();
                    break;
                case "e": // (Gouraud/specular)
                    shaderPrograms.T2Program.enable();
                    break;
                case "r": // (Phong/diffuse)
                    shaderPrograms.T3Program.enable();
                    break;
                case "t": // (Phong/specular)
                    shaderPrograms.T4Program.enable();
                    break;
            }
        }    
        else if(shapeSelectedMode){ // Translating single shapes
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
                // .. when rotated, it gets distorted
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
                    shapes[selectedShapeNumber].rotate(roAmt, [0, 0, -1]);
                    break;
                case "j":
                    shapes[selectedShapeNumber].rotate(roAmt, [0, 0, 1]);
                    break;
            }
            
        }
        // Global tranformations
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

// Camera Movement with Mouse
    function mouseCameraMove(event){
        console.log(event)

        let xDelta = event.movementX * 0.005;
        let yDelta = event.movementY * -0.005;

        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [xDelta, yDelta, 0])
    }

    window.addEventListener("mousedown", (event) => {
        window.addEventListener("mousemove", mouseCameraMove);
    })
    window.addEventListener("mouseup", (event) => {
        window.removeEventListener("mousemove", mouseCameraMove);
    })




    requestAnimationFrame(render);
}




let then = 0;

function render(now) {
    
    let delta = now - then;
    delta *= 0.001;

    then = now;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    shapes.forEach(shape => {
        
        shape.rotate(1 * delta, [0, 1, 1]);
        shape.draw();

    });

// Refresh Text Canvas
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(statusMode, 50,50);


    requestAnimationFrame(render)

}

// Cubes 
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
        [1.0, 1.0, 1.0, 1.0],    // Front face: white
        [1.0, 0.0, 0.0, 1.0],    // left face: red
        [0.0, 1.0, 0.0, 1.0],    // back face: green
        [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
        [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
        [1.0, 0.0, 1.0, 1.0],    // top face: purple
    ];

    const colors = [];

    /* --------- add one color per face, so 6 times for each color --------- */

    const normalData = [
        [0, 0, 1], // front
        [-1, 0, 0], // left
        [0, 0, -1], // back
        [0, -1, 0], // bottom
        [1, 0, 0], // right
        [0, 1, 0], // top
    ];

    // add one color and normal per vertex
    const normals = [];

    for (let i = 0; i < 6; ++i) {

        for (let j = 0; j < 6; ++j) {

            normals.push(normalData[i]);
            colors.push(colorData[i]);

        }

    }

    /* --------- create shape object and initialize data --------- */

    const cube = new Shape();

    cube.initData(vertices, colors, normals)

    return cube;

}

function createShapeOBJShape(obj){
    // constructor(vertices, textures, normals, faces, faceVerticesIndices, faceTexturesIndices, faceNormalsIndices){

    // dem Shape nach facevertex indizes die Vertecies geben (reihenfolge)
    let vertices = [];
    let normals = [];
    let colors = [];

    /*
    vertices.push(obj.vertices[obj.faceVerticesIndices[0][0]])
    vertices.push(obj.vertices[obj.faceVerticesIndices[0][1]])
    vertices.push(obj.vertices[obj.faceVerticesIndices[0][2]])

    vertices.push(obj.vertices[obj.faceVerticesIndices[1][0]])
    vertices.push(obj.vertices[obj.faceVerticesIndices[1][1]])
    vertices.push(obj.vertices[obj.faceVerticesIndices[1][2]])
    */
   // is this:

    obj.faceVerticesIndices.forEach(threeIndices => {
        threeIndices.forEach(vertexIndex => {
            // console.log(obj.vertices[vertexIndex-1])
            vertices.push([obj.vertices[vertexIndex-1], 1].flat());
        });
    });

    obj.faceNormalsIndices.forEach(threeIndices => {
        threeIndices.forEach(index => {
            normals.push(obj.normals[index-1]);
        });
    });

    // white color for now
    vertices.forEach(vertex =>{
        colors.push([1,1,1,1]);
    });
    

    console.log(vertices);
    console.log(normals);
    console.log(colors);
    

    const objShape = new Shape();
    objShape.initData(vertices, colors, normals)
    return objShape;
}

