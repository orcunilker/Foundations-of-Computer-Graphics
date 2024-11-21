package lights;

import java.util.List;

import model.Color;
import model.Intersection;
import model.Ray;
import surfaces.Surface;

public class Light {
    public Color color;

    public Light() {
        this.color = new Color();
    }
    
    public Light(Color color) {
    	this.color = color;
    }
    
    public Color illuminate(Ray ray, Intersection intersection){
		return null;
    }
    
    public boolean shadowIntersection(Ray ray, List<Surface> surfaceList) {
    	return false;
	}
}
