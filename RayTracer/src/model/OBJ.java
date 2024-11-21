package model;

import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

public class OBJ {
	public List<float[]> vertices = new ArrayList<float[]>();
	public List<float[]> textures = new ArrayList<float[]>();
	public List<float[]> normals = new ArrayList<float[]>();
	
	
	private List<String[]> faces = new ArrayList<String[]>();
	public List<int[]> faceVerticesIndices = new ArrayList<int[]>();
	public List<int[]> faceTexturesIndices = new ArrayList<int[]>();
	public List<int[]> faceNormalsIndices = new ArrayList<int[]>();
	
	
	public OBJ(List<float[]> vertices, List<float[]> textures, List<float[]> normals, List<String[]> faces, 
			List<int[]> faceVerticesIndices, List<int[]> faceTexturesIndices, List<int[]> faceNormalsIndices){
        this.vertices = vertices;
        this.textures = textures;
        this.normals = normals;
        
        this.faces = faces;
        this.faceVerticesIndices = faceVerticesIndices;
        this.faceTexturesIndices = faceTexturesIndices;
        this.faceNormalsIndices = faceNormalsIndices;
    }
	
	public OBJ(){
    }
	
	// Taken from Lab1 and converted to Java:
	public OBJ loadOBJ(String pathString) {
		
		try {
			Path path = Paths.get(pathString);
			byte[] bytes = Files.readAllBytes(path);
			List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

		    if(lines == null){
		        System.out.println("no text in obj");
		        return null;
		    }
		    
		    for(String line: lines) {
		        if(line.startsWith("v ")){
		    	    String tempArray[];
		    	    float floatArray[] = new float[3];
		    	    tempArray = line.split(" ");
		    	    floatArray[0] = Float.parseFloat(tempArray[1]);
		    	    floatArray[1] = Float.parseFloat(tempArray[2]);
		    	    floatArray[2] = Float.parseFloat(tempArray[3]);
		            vertices.add(floatArray);
		        }
		        else if(line.startsWith("vt ")){
		    	    String tempArray[];
		    	    float floatArray[] = new float[2];
		    	    tempArray = line.split(" ");
		    	    floatArray[0] = Float.parseFloat(tempArray[1]);
		    	    floatArray[1] = Float.parseFloat(tempArray[2]);
		            textures.add(floatArray);
		        }
		        else if(line.startsWith("vn ")){
		    	    String tempArray[];
		    	    float floatArray[] = new float[3];
		    	    tempArray = line.split(" ");
		    	    floatArray[0] = Float.parseFloat(tempArray[1]);
		    	    floatArray[1] = Float.parseFloat(tempArray[2]);
		    	    floatArray[2] = Float.parseFloat(tempArray[3]);
		            normals.add(floatArray);
		        }
		        else if(line.startsWith("f ")){
		    	    String tempArray[];
		    	    String stringArray[] = new String[3];
		    	    tempArray = line.split(" ");
		    	    stringArray[0] = tempArray[1];
		    	    stringArray[1] = tempArray[2];
		    	    stringArray[2] = tempArray[3];
		            faces.add(stringArray);
		        }
		    };


		    for(String[] face: faces) {
		        int[] vertexIndices = new int[3];
		        int[] textureIndices = new int[3];
		        int[] normalIndices = new int[3];
		        
		    	String[] partParts0 = face[0].split("/");
	            vertexIndices[0] = Integer.parseInt(partParts0[0]) - 1;
	            textureIndices[0] = Integer.parseInt(partParts0[1]) - 1;
	            normalIndices[0] = Integer.parseInt(partParts0[2]) - 1;
	            
		    	String[] partParts1 = face[1].split("/");
	            vertexIndices[1] = Integer.parseInt(partParts1[0]) - 1;
	            textureIndices[1] = Integer.parseInt(partParts1[1]) - 1;
	            normalIndices[1] = Integer.parseInt(partParts1[2]) - 1;
	            
		    	String[] partParts2 = face[2].split("/");
	            vertexIndices[2] = Integer.parseInt(partParts2[0]) - 1;
	            textureIndices[2] = Integer.parseInt(partParts2[1]) - 1;
	            normalIndices[2] = Integer.parseInt(partParts2[2]) - 1;
		        
		        faceVerticesIndices.add(vertexIndices);
		        faceTexturesIndices.add(textureIndices);
		        faceNormalsIndices.add(normalIndices);
		    };
		    
		    OBJ objObject = new OBJ(vertices, textures, normals, faces, faceVerticesIndices, faceTexturesIndices, faceNormalsIndices);
		    return objObject;
		    
		} catch (Exception e) {
			System.err.println(e);
		}
		return null;
	}

}
