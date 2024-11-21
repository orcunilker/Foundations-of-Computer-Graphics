package surfaces;

public class Phong {
	
	public float ka, kd, ks, exponent;

	public Phong() {	
	}
	
	public Phong(float ka, float kd, float ks, float exponent) {
		this.ka = ka;
		this.kd = kd;
		this.ks = ks;
		this.exponent = exponent;
	}

}
