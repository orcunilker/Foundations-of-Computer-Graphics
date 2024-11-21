import model.*;
import surfaces.*;
import lights.*;

import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.JDOMException;
import org.jdom2.input.SAXBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Main{
	
    public static void main(String[] args) {
    	
    	String filepath = "scenes/example4TexturedSphere.xml";
    	String scenesFolder = "scenes/";
    	
    	
//    	 Filepath type in
    	Scanner sc = new Scanner(System.in);
        System.out.println("Enter XML filepath (e.g. '../scenes/example4.xml'):");
        filepath = sc.nextLine();
        System.out.println("Enter Assets folderpath (e.g. '../scenes/'):");
        scenesFolder = sc.nextLine();
    	
        
    	String output_file = "";
    	
    	Color backgroundColor = new Color();
    	Camera camera = new Camera();
    	List<Light> lightList = new ArrayList<Light>();
    	List<Surface> surfaceList = new ArrayList<Surface>();
    	
    	
    	// Parsing the XML (valid until example3)
    	try {
    		// XML parser, base from https://mkyong.com/java/how-to-read-xml-file-in-java-jdom-example/#download-the-jdom-2x-library
            SAXBuilder sax = new SAXBuilder();
            Document doc = sax.build(new File(filepath));
            
            Element sceneNode = doc.getRootElement();
            List<Element> sceneChildren = sceneNode.getChildren();
            Element backgroundColorNode = sceneChildren.get(0);
            Element cameraNode = sceneChildren.get(1);
            Element lightsNode = sceneChildren.get(2);
            Element surfacesNode = sceneChildren.get(3);
            
            output_file = sceneNode.getAttributeValue("output_file");
            if(output_file.endsWith(".png")) {
            	output_file = output_file.replace(".png", ".ppm");
            }
            
            // Background Color
            backgroundColor = new Color();
            backgroundColor.r = Float.parseFloat(backgroundColorNode.getAttributeValue("r"));
            backgroundColor.g = Float.parseFloat(backgroundColorNode.getAttributeValue("g"));
            backgroundColor.b = Float.parseFloat(backgroundColorNode.getAttributeValue("b"));
            
            
            // Camera
            Element cPosition = cameraNode.getChild("position");
            camera.position.x = Float.parseFloat(cPosition.getAttributeValue("x"));
            camera.position.y = Float.parseFloat(cPosition.getAttributeValue("y"));
            camera.position.z = Float.parseFloat(cPosition.getAttributeValue("z"));
            
            Element cLookAt = cameraNode.getChild("lookat");
            camera.lookAt.x = Float.parseFloat(cLookAt.getAttributeValue("x"));
            camera.lookAt.y = Float.parseFloat(cLookAt.getAttributeValue("y"));
            camera.lookAt.z = Float.parseFloat(cLookAt.getAttributeValue("z"));
            
            Element cUp = cameraNode.getChild("up");
            camera.upVector.x = Float.parseFloat(cUp.getAttributeValue("x"));
            camera.upVector.y = Float.parseFloat(cUp.getAttributeValue("y"));
            camera.upVector.z = Float.parseFloat(cUp.getAttributeValue("z"));
            
            Element cHFovA = cameraNode.getChild("horizontal_fov");
            camera.horizontalFovAngle = Float.parseFloat(cHFovA.getAttributeValue("angle"));
            
            Element cResolution = cameraNode.getChild("resolution");
            camera.resolutionHorizontal = Integer.parseInt(cResolution.getAttributeValue("horizontal"));
            camera.resolutionVertical = Integer.parseInt(cResolution.getAttributeValue("vertical"));
            
            Element cMaxBounces= cameraNode.getChild("max_bounces");
            camera.maxBounces = Integer.parseInt(cMaxBounces.getAttributeValue("n"));
            
            
            // Lights
            for (Element targetLightNode : lightsNode.getChildren()) { 
            	Color c = new Color();

            	Element lightColorNode = targetLightNode.getChild("color");
           		c.r = Float.parseFloat(lightColorNode.getAttributeValue("r"));
           		c.g = Float.parseFloat(lightColorNode.getAttributeValue("g"));
           		c.b = Float.parseFloat(lightColorNode.getAttributeValue("b"));
            	
            	
                if(targetLightNode.getName().equals("ambient_light")) {
            		AmbientLight al = new AmbientLight();
            		al.color = c;
            		
            		lightList.add(al);
            	}
                else if(targetLightNode.getName().equals("parallel_light")) {
            		ParallelLight pl = new ParallelLight();
            		pl.color = c;

                	Element lightDirectionNode = targetLightNode.getChild("direction");
               		pl.direction.x = Float.parseFloat(lightDirectionNode.getAttributeValue("x"));
               		pl.direction.y = Float.parseFloat(lightDirectionNode.getAttributeValue("y"));
               		pl.direction.z = Float.parseFloat(lightDirectionNode.getAttributeValue("z"));

            		lightList.add(pl);
            	}
                else if(targetLightNode.getName().equals("point_light")) {
            		PointLight pol = new PointLight();
            		pol.color = c;

                	Element lightDirectionNode = targetLightNode.getChild("position");
                	pol.position.x = Float.parseFloat(lightDirectionNode.getAttributeValue("x"));
                	pol.position.y = Float.parseFloat(lightDirectionNode.getAttributeValue("y"));
                	pol.position.z = Float.parseFloat(lightDirectionNode.getAttributeValue("z"));

            		lightList.add(pol);
            	}
            }
            
            // Surfaces
            for (Element targetSurfaceNode : surfacesNode.getChildren()) { 
            	if(targetSurfaceNode.getName().equals("sphere")) {
            		Sphere s = new Sphere(true);
            		
            		s.radius = Float.parseFloat(targetSurfaceNode.getAttributeValue("radius"));
            		
            		Element positionNode = targetSurfaceNode.getChild("position");
            		s.position.x = Float.parseFloat(positionNode.getAttributeValue("x"));
            		s.position.y = Float.parseFloat(positionNode.getAttributeValue("y"));
            		s.position.z = Float.parseFloat(positionNode.getAttributeValue("z"));
            		
            		Element materialNode = targetSurfaceNode.getChild("material_solid");
            		if(materialNode != null) {
                		Element mColor = materialNode.getChild("color");
                		s.material.color.r = Float.parseFloat(mColor.getAttributeValue("r"));
                		s.material.color.g = Float.parseFloat(mColor.getAttributeValue("g"));
                		s.material.color.b = Float.parseFloat(mColor.getAttributeValue("b"));
            		}
            		else {
            			materialNode = targetSurfaceNode.getChild("material_textured");
                		Element mTexture = materialNode.getChild("texture");
                		s.material.textureName = mTexture.getAttributeValue("name");
                		s.material.solid = false;
                		s.material.texturePath = scenesFolder;
                		
                		s.material.texture = s.material.readPng(s.material.texturePath + s.material.textureName);
					}

            		Element mPhong = materialNode.getChild("phong");
            		s.material.phong.ka = Float.parseFloat(mPhong.getAttributeValue("ka"));
            		s.material.phong.kd = Float.parseFloat(mPhong.getAttributeValue("kd"));
            		s.material.phong.ks = Float.parseFloat(mPhong.getAttributeValue("ks"));
            		s.material.phong.exponent = Float.parseFloat(mPhong.getAttributeValue("exponent"));

            		Element mReflectance = materialNode.getChild("reflectance");
            		s.material.reflectance = Float.parseFloat(mReflectance.getAttributeValue("r"));

            		Element mTransmittance = materialNode.getChild("transmittance");
            		s.material.transmittance = Float.parseFloat(mTransmittance.getAttributeValue("t"));

            		Element mRefraction = materialNode.getChild("refraction");
            		s.material.refractioniof = Float.parseFloat(mRefraction.getAttributeValue("iof"));		
            		
            		surfaceList.add(s);
            	}
            	if(targetSurfaceNode.getName().equals("mesh")) {
            		Mesh m = new Mesh(true);

            		m.objName = targetSurfaceNode.getAttributeValue("name");
            		m.meshObj.loadOBJ(scenesFolder + m.objName);
            		
            		// Exactly the same as above in "sphere"
            		Element materialNode = targetSurfaceNode.getChild("material_solid");
            		if(materialNode != null) {
                		Element mColor = materialNode.getChild("color");
                		m.material.color.r = Float.parseFloat(mColor.getAttributeValue("r"));
                		m.material.color.g = Float.parseFloat(mColor.getAttributeValue("g"));
                		m.material.color.b = Float.parseFloat(mColor.getAttributeValue("b"));
            		}
            		else {
            			materialNode = targetSurfaceNode.getChild("material_textured");
                		Element mTexture = materialNode.getChild("texture");
                		m.material.textureName = mTexture.getAttributeValue("name");
                		m.material.solid = false;
                		m.material.texturePath = scenesFolder;
                		
                		m.material.texture = m.material.readPng(m.material.texturePath + m.material.textureName);
					}

            		Element mPhong = materialNode.getChild("phong");
            		m.material.phong.ka = Float.parseFloat(mPhong.getAttributeValue("ka"));
            		m.material.phong.kd = Float.parseFloat(mPhong.getAttributeValue("kd"));
            		m.material.phong.ks = Float.parseFloat(mPhong.getAttributeValue("ks"));
            		m.material.phong.exponent = Float.parseFloat(mPhong.getAttributeValue("exponent"));

            		Element mReflectance = materialNode.getChild("reflectance");
            		m.material.reflectance = Float.parseFloat(mReflectance.getAttributeValue("r"));

            		Element mTransmittance = materialNode.getChild("transmittance");
            		m.material.transmittance = Float.parseFloat(mTransmittance.getAttributeValue("t"));

            		Element mRefraction = materialNode.getChild("refraction");
            		m.material.refractioniof = Float.parseFloat(mRefraction.getAttributeValue("iof"));
            		// unitl here
            		surfaceList.add(m);
            	}
            }
        } catch (IOException | JDOMException e) {
            e.printStackTrace();
            System.out.println(e.toString());
        }
    	
    	System.out.println(output_file);
    	
    	System.out.println(backgroundColor.toString());
    	System.out.println(camera.toString());
    	System.out.println(lightList.toString());
    	System.out.println(surfaceList.toString());
        // XML einlesen erfolgreich (bis example3 getestet)
    	
    
//    	
//    	
//    	String objPath = "scenes/open_room.obj";
//    	OBJ object = new OBJ();
//    	OBJ obj = object.loadOBJ(objPath);
    	

    	
    	
    	// Raytracer
    	
        int width = camera.resolutionHorizontal;
        int height = camera.resolutionVertical;
    	
    	Color[][] image = new Color[width][height];
    	
    	StringBuilder ppmString = new StringBuilder("P3\n");
    	ppmString.append(width);
    	ppmString.append(" ");
    	ppmString.append(height);
    	ppmString.append("\n255\n");
    	
    	for (int y = height-1; y >= 0; y--) {
    		for (int x = 0; x < width; x++) {
    			image[x][y] = backgroundColor;

    			float intersectedDistance = 99999; // to start off (also is a cutoff range in this case)
    			Ray ray = camera.getRayToPixel(x, y);
    			for (Surface surface : surfaceList) {
    				Intersection intersection = surface.intersect(ray);
					if(intersection != null && intersectedDistance > intersection.distance) {
						intersectedDistance = intersection.distance;
		    			image[x][y] = new Color();
		    			// Normaltest image[x][y] = new Color((intersection.normal.x + 1) / 2, (intersection.normal.y + 1) / 2, (intersection.normal.z + 1) / 2);
		    			for (Light light : lightList) {
							if(light instanceof AmbientLight);
							else if(light instanceof ParallelLight){
								ParallelLight prl = (ParallelLight) light;
								Ray shadowRay = new Ray(intersection.intersectionPoint, prl.direction.Scale(-1));
								if(prl.shadowIntersection(shadowRay, surfaceList)) continue;
							}
							else if(light instanceof PointLight){
								PointLight pol = (PointLight) light;
								Ray shadowRay = new Ray();
								shadowRay = shadowRay.rayOriginToPoint(intersection.intersectionPoint, pol.position);
								if(pol.shadowIntersection(shadowRay, surfaceList)) continue;
							}
							image[x][y].addColor(light.illuminate(ray, intersection));
						}
					}
				}
    			
    			// Writing to string for ppm file
    			
    			int ir = (int) (255.999 * image[x][y].r);
    			int ig = (int) (255.999 * image[x][y].g);
    			int ib = (int) (255.999 * image[x][y].b);
    			ppmString.append(ir);
    			ppmString.append(" ");
    			ppmString.append(ig);
    			ppmString.append(" ");
    			ppmString.append(ib);
    			ppmString.append("\n");
    		}
		}
    	
    	// Write to file
        try {
        	Path path = Paths.get(output_file);
            byte[] strToBytes = ppmString.toString().getBytes();
			Files.write(path, strToBytes);
		} catch (IOException e) {
			e.printStackTrace();
		}
    	System.out.println("DONE");
    	
    }

}