const { mat4, mat3, vec4, vec3 } = glMatrix;
const toRad = glMatrix.glMatrix.toRadian;

const shapes = [];
let gl = null;

const shaders = {
    noLight: "v-shader-nolight",
    t1Program: "v-shader-T1",
    t2Program: "v-shader-T2",
    t3Program: "v-shader-T34",
    t4Program: "v-shader-T34", //!!!!!
    
    fragment: "f-shader",
    f3Program: "f-shader_T3",
    f4Program: "f-shader_T4"
}

let currentShaderProgram = null;

const shaderInfo = {

    attributes: {

        vertexLocation: "vertexPosition",
        colorLocation: "vertexColor",
        normalLocation: "vertexNormal"

    }, uniforms: {

        modelViewMatrix: "modelViewMatrix",
        projectionMatrix: "projectionMatrix",
        viewMatrix: "viewMatrix",
        normalMatrix: "normalMatrix",
        lightPointMatrix: "lightPointMatrix"

    }
}

const shaderPrograms = {

    noLightProgram: null,
    T1Program: null,
    T2Program: null,
    T3Program: null,
    T4Program: null,
    perspectiveProgram: null,
    shearProgram: null

}

const matrices = {

    viewMatrix: mat4.create(),
    projectionMatrix: mat4.create(),
    lightPointMatrix: mat4.create()

}

let flag = true;