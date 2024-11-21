package surfaces;

import model.Color;
import model.Intersection;
import model.Ray;
import model.Vector;

public class Sphere extends Surface{

	public Vector position;
	public float radius;
	
	public float t, t0, t1;
	
	public Sphere(boolean solidMaterial) {
		super(solidMaterial);
		position = new Vector();
	}

	
	// Taken from and written to java: https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-sphere-intersection.html
	@Override
	public Intersection intersect(Ray ray)
	{
		Vector L = ray.origin.Subtract(position);
        float a = ray.direction.dot(ray.direction);
        float b = 2 * ray.direction.dot(L);
        float c = (float) (L.dot(L) - Math.pow(radius,2));
		
        if (!solveQuadratic(a, b, c)) return null;

        if (t0 < 0) {
            t0 = t1; // if t0 is negative, let's use t1 instead
            if (t0 < 0) return null; // both t0 and t1 are negative
        }

        t = t0;

        
		Vector intersectionPoint = ray.direction.Scale(t).Add(ray.origin);
		Vector normal = intersectionPoint.Subtract(position);
		normal = normal.normalize();
		
		Intersection intersection = null;
		// If material is textured:
		// PNG is read while reading properties off of xml (main.java)
		if(!material.solid) { // textured
			Vector d = intersectionPoint.Subtract(position).normalize();
			
			float u = (float) ((float)0.5 + (float)((float)Math.atan2(d.x, d.z) / ((float)2*(float)Math.PI)));
			float v = (float) ((float)0.5 - (float)((float)Math.asin(d.y) / (float)Math.PI));
			
			int x = (int) ((float)(material.textureWidth-1) * u);
			int y = (int) ((float)(material.textureHeight-1) * v);
			
			Color colorAtIntersection = material.texture[x][y]; // and then it worked
	        intersection = new Intersection(colorAtIntersection, t, intersectionPoint, normal, material);
		}
		else {
	        intersection = new Intersection(material.color, t, intersectionPoint, normal, material);
		}
        return intersection;
	}
	
	boolean solveQuadratic(float a, float b, float c)
	{
	    float discr = b * b - 4 * a * c;
	    if (discr < 0) return false;
	    else if (discr == 0) t0 = t1 = (float) (- 0.5 * b / a);
	    else {
	    	float q;
	    	if(b > 0) 	q = (float) (-0.5 * (b + Math.sqrt(discr)));
	    	else 		q = (float) (-0.5 * (b - Math.sqrt(discr)));
	        t0 = q / a;
	        t1 = c / q;
	    }
	    if (t0 > t1) {
	    	float temp;
	    	temp = t1;
	    	t0 = t1;
	    	t1 = temp;
	    }
	    return true;
	}
	
}
