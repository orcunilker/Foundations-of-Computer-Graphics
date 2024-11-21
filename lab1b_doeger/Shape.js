class Shape {

    constructor() {

        this.vertices = [];
        this.colors = [];
        this.normals = [];

        this.buffers = {

            // initialize buffers
            vertexBuffer: gl.createBuffer(),
            colorBuffer: gl.createBuffer(),
            normalBuffer: gl.createBuffer(),

        }

        // initialize transformation and normal matrix
        this.transformationMatrix = mat4.create();
        this.normalMatrix = mat3.create();

    }

    initData(vertices, colors, normals) {

        // flatten & convert data to 32 bit float arrays
        this.vertices = new Float32Array(vertices.flat());
        this.colors = new Float32Array(colors.flat());
        this.normals = new Float32Array(normals.flat());

        /* --------- send data to buffers --------- */

        // Bind Vertex Buffer to ARRAY_BUFFER
        // Fill the ARRAY_BUFFER with the Vertex-array
        // Static_DRAW: Contents are specified once per application, no later changes of vertecies at this shape
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        // Bind Color Buffer to ARRAY_BUFFER
        // Fill the ARRAY_BUFFER with the Color-array (Same size as V-Array)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    }

    draw() {
        // Specifiy Vertex-(and Color-)Array-Layout...
        Shape.setupAttribute(this.buffers.vertexBuffer, currentShaderProgram.attributes.vertexLocation);
        Shape.setupAttribute(this.buffers.colorBuffer, currentShaderProgram.attributes.colorLocation);
        Shape.setupAttribute(this.buffers.normalBuffer, currentShaderProgram.attributes.normalLocation, true);

        // Multiply current World Coordinates (Transformation Matrix) with the current View matrix (Camera View)
        const modelViewMatrix = mat4.create();
        mat4.mul(modelViewMatrix, matrices.viewMatrix, this.transformationMatrix);

        // construct normal matrix as inverse transpose of modelView matrix
        mat3.normalFromMat4(this.normalMatrix, modelViewMatrix);

        // Give the modelViewMatrix to GLSL, that it can draw with it
        // (ModelView Matrix for this drawcall(shape) (how the vetecies are positioned with this camera position...)
        // Given to GPU once per drawcall
        // send modelView and normal matrix to GPU
        gl.uniformMatrix4fv(currentShaderProgram.uniforms.modelViewMatrix, gl.FALSE, modelViewMatrix);
        gl.uniformMatrix3fv(currentShaderProgram.uniforms.normalMatrix, gl.FALSE, this.normalMatrix);

        // Draw Triangles from (TRIANGLES) 3 Vertecies, Starting point, How many (Triangles)
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
    }


    static setupAttribute(buffer, location, isNormal = false) {

        if (location === -1 || location === undefined) { return; }

        // Bind V or C-Buffer to ARRAYBUFFER (have to change every time)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        // enable the attribute
        gl.enableVertexAttribArray(location);

        // Specifiyng Layout of Vertex-Data
        gl.vertexAttribPointer(
            location, // the attribute location
            isNormal ? 3 : 4, // number of elements for each attribute/vertex
            gl.FLOAT, // type of the attributes
            gl.FALSE, // is data normalised?
            (isNormal ? 3 : 4) * Float32Array.BYTES_PER_ELEMENT, // size for one vertex
            0 // offset from begin of vertex to the attribute
        );
    }

//Added Rotation, Translation and Scaling also for global tranformations
    scale(vector){
        //?
        mat4.scale(this.transformationMatrix, this.transformationMatrix, vector)
        //const scaleMatrix = mat4.create();
        //mat4.scale(scaleMatrix, scaleMatrix, vector);
        //mat4.mul(this.transformationMatrix, scaleMatrix, this.transformationMatrix)
    }
    scaleGlobal(vector){
        //mat4.scale(this.transformationMatrix, this.transformationMatrix, vector)
        const scaleMatrix = mat4.create();
        mat4.scale(scaleMatrix, scaleMatrix, vector);
        mat4.mul(this.transformationMatrix, scaleMatrix, this.transformationMatrix)
    }

    rotate(angle, axes) {

        mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle, axes);
    }
    rotateGlobal(angle, axes) {
        const rotationMatrix = mat4.create();
        mat4.rotate(rotationMatrix, rotationMatrix, angle, axes);
        mat4.mul(this.transformationMatrix, rotationMatrix, this.transformationMatrix)
    }

    translate(vector) {
        mat4.translate(this.transformationMatrix, this.transformationMatrix, vector);
    }
    translateGlobal(vector) {
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, vector);
        mat4.mul(this.transformationMatrix, translationMatrix, this.transformationMatrix)
    }

    


}
