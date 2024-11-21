package lights;

import java.util.List;

import model.Color;
import model.Intersection;
import model.Ray;
import model.Vector;
import surfaces.Surface;

public class ParallelLight extends Light{
	public Vector direction;

	public ParallelLight() {
		super();
		direction = new Vector();
	}

	public ParallelLight(Color color, Vector direction) {
		super(color);
		this.direction = direction.normalize();
	}
	
	@Override
    public boolean shadowIntersection(Ray ray, List<Surface> surfaceList) {
		for (Surface surface : surfaceList) {
			Intersection intersection = surface.intersect(ray);
			if(intersection != null) {
				if(intersection.distance > 0.0001) {
					return true;
				}
			}
		}
    	return false;
	}

	@Override
    public Color illuminate(Ray ray, Intersection intersection){
		Color mC = intersection.material.color;
		float kd = intersection.material.phong.kd;
		float ks = intersection.material.phong.ks;
		float exponent = intersection.material.phong.exponent;

		// Diffuse
		float diffuse = (float) -Math.min(0.0, direction.normalize().dot(intersection.normal.normalize())); // Minus (which becomes a postive number) because of reversing one vector (if Normal and Light to same direction, then no illumination)
		
		// Diffuse Coefficient * Diffuse Part * Material Color * Light Color
		float rd = kd * diffuse * mC.r * this.color.r;
		float gd = kd * diffuse * mC.g * this.color.g;
		float bd = kd * diffuse * mC.b * this.color.b;
		Color c = new Color(rd, gd, bd);
		
		// Specular
		Vector viewVector = ray.direction.Scale(-1).normalize();
		Vector lightVector = direction.Scale(-1).normalize();
		Vector normal = intersection.normal.normalize();
		Vector reflectionVector = normal.Scale( normal.dot(lightVector) ) . Scale(2) . Subtract(lightVector) . normalize(); // r = 2(n ⋅ l)n – l
		float specular = (float) Math.pow(Math.max(0, reflectionVector.dot(viewVector)), exponent);
		
		float rs = ks * specular * this.color.r;
		float gs = ks * specular * this.color.g;
		float bs = ks * specular * this.color.b;
		c.addColor(new Color(rs, gs, bs));
		
		return c;
    }
	
}
