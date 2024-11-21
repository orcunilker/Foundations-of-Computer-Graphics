package model;

public class Ray {

	public Vector origin, direction;
	
	public Ray() {
		this.origin = new Vector();
		this.direction = new Vector();
	}
	
	public Ray(Vector origin, Vector direction) {
		this.origin = origin;
		this.direction = direction.normalize();
	}
	
	public Ray rayOriginToPoint(Vector origin, Vector destination) {
		return new Ray(origin, destination.Subtract(origin).normalize());
	}
}
