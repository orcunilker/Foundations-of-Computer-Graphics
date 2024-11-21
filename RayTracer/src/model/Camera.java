package model;

public class Camera {
    public Vector position, lookAt, upVector;
    
    public float horizontalFovAngle;
    public int maxBounces, resolutionHorizontal, resolutionVertical;
    

	public Camera() {
		position = new Vector();
		lookAt = new Vector();
		upVector = new Vector();
		
	}
	
	public Camera(Vector position, Vector lookAt, Vector upVector, float horizontalFovAngle, 
			int resolutionHorizontal, int resolutionVertical, int maxBounces) {
		this.position = position;
		this.lookAt = lookAt;
		this.upVector = upVector;
		this.horizontalFovAngle = horizontalFovAngle;
		this.resolutionHorizontal = resolutionHorizontal;
		this.resolutionVertical = resolutionVertical;
		this.maxBounces = maxBounces;
	}
	
    
	public Ray getRayToPixel(float x, float y) {
		// Image Plane at (0,0,-1)
		// TODO: Image Plane dynamic with lookAt
		Vector rayDirection = new Vector(0,0,-1);
		rayDirection.x = 2 * (float)x/resolutionHorizontal - 1; // -1 to +1
		rayDirection.y = 2 * (float)y/resolutionVertical - 1;
		// TODO: FOV, not important for now
		rayDirection = rayDirection.normalize();
		
		return new Ray(position, rayDirection);
	}
    
}
