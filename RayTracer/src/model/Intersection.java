package model;

import surfaces.Material;

public class Intersection {
	
	public float distance;
	public Vector intersectionPoint, normal;
	public Material material;
	
	public Color colorAtIntersection;
	
	public Intersection() {
	}

	public Intersection(float distance, Vector intersectionPoint, Vector normal, Material material) {
		this.distance = distance;
		this.intersectionPoint = intersectionPoint;
		this.normal = normal;
		this.material = material;
		
		this.colorAtIntersection = material.color;
	}
	
	public Intersection(Color colorAtIntersection, float distance, Vector intersectionPoint, Vector normal, Material material) {
		this.distance = distance;
		this.intersectionPoint = intersectionPoint;
		this.normal = normal;
		this.material = material;
		
		this.colorAtIntersection = colorAtIntersection;
	}
	
}
