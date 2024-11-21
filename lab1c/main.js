// server (terminal at folder):
// python -m http.server


//Additional variables
cameraMode = true;
shapeSelectedMode = false;
selectedShapeNumber = -1;
statusMode = "PacMan-Mode";

let projectionShearMode = false;

let pacToLeft = false;
let pacToRight = false;
let pacToUp = false;
let pacToDown = false;

let pacFacingDirection = 0;

const pacMouthNr = 1;
const pacHeadNr = 2;

const pacSpeed = 0.05;


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
    gl.clearColor(99/255, 184/255, 255/255, 1);


    // The Projection Matrix is calculated once and is given to the GLSL, the GPU, the vertex Shader (uniform variable)
    // Orthogonal, Perspective..., converts to from View-Space to Clip-Space
    // Converts to Clip-coordinates -1.0 to 1.0 (everything that can be seen)


    // LAB1C: Perspective and Shear Projection
    let perspectiveMatrix = mat4.create();
    let shearMatrix = mat4.create();
    let aspectRatio = canvas.clientWidth / canvas.clientHeight;

    mat4.perspective(perspectiveMatrix, toRad(45), aspectRatio, 0.1, 100);
    
    mat4.ortho(shearMatrix, -8.0*aspectRatio, 8.0*aspectRatio, -8.0, 8.0, 0.1, 100);
    let shear =         [1, 0, 0, 0,
                            0, 1, 0, 0,
                            0.8, 0, 1, 0,
                            0, 0, 0, 1];
    mat4.multiply(shearMatrix, shear, shearMatrix);
    
    matrices.projectionMatrix = shearMatrix;


    // ViewMatrix: Transform vertecies from world(model)-space to how it would look like from a given camera position and direction
    //mat4.lookAt(matrices.viewMatrix, [10, 20, 16], [0, 0, 0], [0, 1, 0]);
    mat4.lookAt(matrices.viewMatrix, [0, 10, 10], [0, 0, 0], [0, 1, 0]);
    // Translating Camera in the world
    mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [10, 0, 0])


     // create shader programs and enable one of them
     shaderPrograms.noLightProgram = new ShaderProgram(shaders.noLight, shaders.fragment, shaderInfo);
     shaderPrograms.T1Program = new ShaderProgram(shaders.t1Program, shaders.fragment, shaderInfo);
     shaderPrograms.T2Program = new ShaderProgram(shaders.t2Program, shaders.fragment, shaderInfo);
     shaderPrograms.T3Program = new ShaderProgram(shaders.t3Program, shaders.f3Program, shaderInfo);
     shaderPrograms.T4Program = new ShaderProgram(shaders.t4Program, shaders.f4Program, shaderInfo);

     shaderPrograms.projectionProgram = new ShaderProgram(shaders.t4Program, shaders.f4Program, shaderInfo);
     shaderPrograms.projectionProgram.enable();

     
    // Tried to make a shape for the light to move it around for LAB1B
    /*
    let lightPoint = new Shape();
    lightPoint.vertices = [0.0, 0.0, 0.0, 1.0];
    lightPoint.translate([0.0, 10.0, 0.0, 1.0]);
    matrices.lightPointMatrix = lightPoint.lightPointMatrix;
    */

    // Load OBJ
    let objObject = null;

    objObject = await loadOBJ('objects/labyrinth.obj'); // returns OBJ object
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('objects/pacmanLower.obj');
    shapes.push(createShapeOBJShape(objObject));

    objObject = await loadOBJ('objects/pacmanUpper.obj');
    shapes.push(createShapeOBJShape(objObject));


    // SET Keyevents for PacMan Movement
    window.addEventListener("keydown", (event) => {
        switch(event.key){
            case "ArrowUp": 
                pacToUp = true;
                break;
            case "ArrowDown":  
                pacToDown = true;
                break;
            case "ArrowLeft":
                pacToLeft = true;
                break;
            case "ArrowRight":
                pacToRight = true;
                break;
        }
    });
    window.addEventListener("keyup", (event) => {
        switch(event.key){
            case "ArrowUp": 
                pacToUp = false;
                break;
            case "ArrowDown":  
                pacToDown = false;
                break;
            case "ArrowLeft":
                pacToLeft = false;
                break;
            case "ArrowRight":
                pacToRight = false;
                break;
        }
    });

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
        else if(event.key == "p"){ //"v" for camera mode
            cameraMode = true;
            shapeSelectedMode = false;
            statusMode = "PacMan-Mode"
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

        else if(event.key == "v"){ //Toggle between shear and perspective view
            projectionShearMode = !projectionShearMode;

            console.log(projectionShearMode);
            if(projectionShearMode){
                matrices.projectionMatrix = shearMatrix;
                shaderPrograms.projectionProgram = new ShaderProgram(shaders.t4Program, shaders.f4Program, shaderInfo);
                shaderPrograms.projectionProgram.enable();
            }
            else{
                matrices.projectionMatrix = perspectiveMatrix;
                shaderPrograms.projectionProgram = new ShaderProgram(shaders.t4Program, shaders.f4Program, shaderInfo);
                shaderPrograms.projectionProgram.enable();
            }
        }

        if(cameraMode){ //Translating Camera (not anymore)
            switch(event.key){
                /*
                case "ArrowUp": 
                    shapes[pacShapeNr].translate([0, 0, -pacSpeed]);
                    break;
                case "ArrowDown":  
                    shapes[pacShapeNr].translate([0, 0, pacSpeed]);
                    break;
                case "ArrowLeft":
                    shapes[pacShapeNr].translate([-pacSpeed, 0, 0]);
                    break;
                case "ArrowRight":
                    shapes[pacShapeNr].translate([pacSpeed, 0, 0]);
                    break;
                */

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
let counter = 0;
let rotationAngle = 0;

function render(now) {
    let delta = now - then;
    delta *= 0.001;
    then = now;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    //Move Mouth back to 0 (to make local rotatian)
    shapes[pacMouthNr].rotate(-rotationAngle, [1, 0, 0]);

    // Move PacMan to direction that is set true on the keyevent up in the code 
        // and rotate to facing direction
        // and also move camera with him
    if(pacToUp){
        if (pacFacingDirection == 0)      shapes[pacMouthNr].rotate(toRad(-180), [0, 1, 0]);
        else if (pacFacingDirection == 1) shapes[pacMouthNr].rotate(toRad(90), [0, 1, 0]);
        else if (pacFacingDirection == 2) shapes[pacMouthNr].rotate(toRad(0), [0, 1, 0]);
        else if (pacFacingDirection == 3) shapes[pacMouthNr].rotate(toRad(-90), [0, 1, 0]);
        pacFacingDirection = 2;

        shapes[pacMouthNr].translateGlobal([0, 0, -pacSpeed]);
        shapes[pacHeadNr].translateGlobal([0, 0, -pacSpeed]);
        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [0, 0, pacSpeed])
    }
    else if(pacToDown){
        if (pacFacingDirection == 0)      shapes[pacMouthNr].rotate(toRad(0), [0, 1, 0]);
        else if (pacFacingDirection == 1) shapes[pacMouthNr].rotate(toRad(-90), [0, 1, 0]);
        else if (pacFacingDirection == 2) shapes[pacMouthNr].rotate(toRad(-180), [0, 1, 0]);
        else if (pacFacingDirection == 3) shapes[pacMouthNr].rotate(toRad(90), [0, 1, 0]);
        pacFacingDirection = 0;

        shapes[pacMouthNr].translateGlobal([0, 0, pacSpeed]);
        shapes[pacHeadNr].translateGlobal([0, 0, pacSpeed]);
        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [0, 0, -pacSpeed])
    }
    else if(pacToLeft){
        if (pacFacingDirection == 0)      shapes[pacMouthNr].rotate(toRad(-90), [0, 1, 0]);
        else if (pacFacingDirection == 1) shapes[pacMouthNr].rotate(toRad(-180), [0, 1, 0]);
        else if (pacFacingDirection == 2) shapes[pacMouthNr].rotate(toRad(90), [0, 1, 0]);
        else if (pacFacingDirection == 3) shapes[pacMouthNr].rotate(toRad(0), [0, 1, 0]);
        pacFacingDirection = 3;

        shapes[pacMouthNr].translateGlobal([-pacSpeed, 0, 0]);
        shapes[pacHeadNr].translateGlobal([-pacSpeed, 0, 0]);
        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [pacSpeed, 0, 0])
    }
    else if(pacToRight){
        if (pacFacingDirection == 0)      shapes[pacMouthNr].rotate(toRad(90), [0, 1, 0]);
        else if (pacFacingDirection == 1) shapes[pacMouthNr].rotate(toRad(0), [0, 1, 0]);
        else if (pacFacingDirection == 2) shapes[pacMouthNr].rotate(toRad(-90), [0, 1, 0]);
        else if (pacFacingDirection == 3) shapes[pacMouthNr].rotate(toRad(-180), [0, 1, 0]);
        pacFacingDirection = 1;

        shapes[pacMouthNr].translateGlobal([pacSpeed, 0, 0]);
        shapes[pacHeadNr].translateGlobal([pacSpeed, 0, 0]);
        mat4.translate(matrices.viewMatrix, matrices.viewMatrix, [-pacSpeed, 0, 0])
    }
    
    //Rotate Mouth back to where it was before
    shapes[pacMouthNr].rotate(rotationAngle, [1, 0, 0]);

    //Rotate Mouth with frames
    counter++;
    if(counter <= 30){
        shapes[pacMouthNr].rotate(-0.03, [1, 0, 0]);
        rotationAngle += -0.03;
    }
    else if(counter <= 60){
        shapes[pacMouthNr].rotate(0.03, [1, 0, 0]);
        rotationAngle += 0.03;
    }
    else{
        counter = 0;
    }

    //Update viewMatrix
    gl.uniformMatrix4fv(currentShaderProgram.uniforms.viewMatrix, gl.FALSE, matrices.viewMatrix);
    shapes.forEach(shape => {
        shape.draw();
    });

    // Refresh Text Canvas
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(statusMode, 50,50);


    requestAnimationFrame(render)
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

