package surfaces;

import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

import model.Color;

public class Material {
	
	public boolean solid;
	
	public Color color; // only initialized if solid material
	public String textureName; // only initialized if textured material
	
	public Phong phong;
	public float reflectance, transmittance, refractioniof;
	
	public Color[][] texture;
	public int textureWidth;
	public int textureHeight;
	public String texturePath;
	
	
	public Material(boolean solid) {
		if(solid) {
			this.solid = true;
			color = new Color(1,1,1);
		}
		phong = new Phong();
	}
	
	// With help of Stackoverflow
	public Color[][] readPng(String path) {
		try {
            File file = new File(path);
            BufferedImage image = ImageIO.read(file);
            
            textureWidth = image.getWidth();
            textureHeight = image.getHeight();

			Color[][] texture = new Color[textureWidth][textureHeight];
            for (int y = 0; y < textureHeight; y++) {
                for (int x = 0; x < textureWidth; x++) {
                	int rgb = image.getRGB(x, y);
                	texture[x][y] = new Color();
                	texture[x][y].r = (float)(((rgb >> 16) & 0xFF) / (float)255);
                	texture[x][y].g = (float)(((rgb >> 8) & 0xFF) / (float)255);
                	texture[x][y].b = (float)((rgb & 0xFF) / (float)255);
                }
            }
            
    		return texture;
    		
        } catch (Exception e) {
            e.printStackTrace();
        }
		return null;
	}
	
}
