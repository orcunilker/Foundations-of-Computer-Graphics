package surfaces;

import model.Color;
import model.Intersection;
import model.Ray;
import model.Vector;

public class Surface {

	public Material material;
	
	public Surface(boolean solidMaterial) {
		material = new Material(solidMaterial);
	}

	public Intersection intersect(Ray ray) {
		return null;
	}
	
}
