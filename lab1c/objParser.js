// Loading and extracting vertices from an OBJ file
// INDICES START AT 0, UNLIKE IN OBJ FILE (IMPORTANT FOR FACE INDICES)
class OBJ{
    constructor(vertices, textures, normals, faces, faceVerticesIndices, faceTexturesIndices, faceNormalsIndices){
        this.vertices = vertices;
        this.textures = textures;
        this.normals = normals;
        
        this.faces = faces;
        this.faceVerticesIndices = faceVerticesIndices;
        this.faceTexturesIndices = faceTexturesIndices;
        this.faceNormalsIndices = faceNormalsIndices;
    }
}

async function loadOBJ(path) { //just normals and vertices
    let vertices = [] // [["-0.500000", "-0.500000", "0.500000"], ["-0.500000", "0.500000", "0.500000"], ...
    let textures = [] 
    let normals = [] // ["-1.0000", "0.0000", "0.0000"], ["0.0000", "0.0000", "-1.0000"], ...
    let faces = [] // [["2//1", "3//1", "1//1"], ["4//2", "7//2", "3//2"], ...

    const objText = await fetch(path).then(result => result.text());

    const lines = objText.split('\n');
    if(!lines){
        console.log('no text in obj');
        return;
    }
    
    let tempArray = [];
    lines.forEach(line => {
        if(line.startsWith('v ')){
            tempArray = line.split(' ');
            tempArray.shift(); // removes 1st element (v )
            tempArray = tempArray.map(parseFloat)
            vertices.push(tempArray);
        }
        else if(line.startsWith('vt ')){
            tempArray = line.split(' ');
            tempArray.shift();
            tempArray = tempArray.map(parseFloat) 
            textures.push(tempArray);
        }
        else if(line.startsWith('vn ')){
            tempArray = line.split(' ');
            tempArray.shift();
            tempArray = tempArray.map(parseFloat) 
            normals.push(tempArray);
        }
        else if(line.startsWith('f ')){
            tempArray = line.split(' ');
            tempArray.shift();
            faces.push(tempArray);
        }
    });

    let faceVerticesIndices = []; // [["2", "3", "1"], ["4", "7", "3"], ...
    let faceTexturesIndices = [];
    let faceNormalsIndices = [];

    faces.forEach(face => {
        let vertexIndices = [];
        let textureIndices = [];
        let normalIndices = [];
        face.forEach(facePart => {
            partParts = facePart.split('/');
            vertexIndices.push(partParts[0]);
            textureIndices.push(partParts[1]);
            normalIndices.push(partParts[2]);
        });
        faceVerticesIndices.push(vertexIndices.map(parseFloat));
        faceTexturesIndices.push(textureIndices.map(parseFloat));
        faceNormalsIndices.push(normalIndices.map(parseFloat));
    });

    
    console.log(vertices);
    console.log(textures);
    console.log(normals);
    console.log(faces);
    console.log(faceVerticesIndices);
    console.log(faceTexturesIndices);
    console.log(faceNormalsIndices);

    let objObject = new OBJ(vertices, textures, normals, faces, faceVerticesIndices, faceTexturesIndices, faceNormalsIndices)
    return objObject;
}

