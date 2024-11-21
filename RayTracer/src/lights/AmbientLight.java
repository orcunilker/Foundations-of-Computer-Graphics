package lights;

import model.Color;
import model.Intersection;
import model.Ray;

public class AmbientLight extends Light{

	public AmbientLight() {
		super();
	}

	public AmbientLight(Color color) {
		super(color);
	}
    
	@Override
    public Color illuminate(Ray ray, Intersection intersection){
		float ka = intersection.material.phong.ka;
		Color mC = intersection.material.color;
		
		// Ambient Coefficient * Material Color * Light Color
		Color c = new Color(ka * mC.r * this.color.r, ka * mC.g * this.color.g, ka * mC.b * this.color.b);
		return c;
    }
}
