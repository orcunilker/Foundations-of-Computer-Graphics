package model;

public class Vector {

	public float x, y, z;

	public Vector() {
	}
	
	public Vector(float x, float y, float z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	// Operators from https://github.com/yhcheer/RayTracingInOneWeekend/blob/master/Java_Version/RayTracing_ch03/src/main/java/Vector.java
    public float x() { return x; }
    public float y() { return y; }
    public float z() { return z; }
	
    public Vector Add(Vector a, Vector b)
    {
        return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    public Vector Add(Vector v)
    {
        return new Vector(x + v.x, y + v.y, z + v.z);
    }
    

    public Vector Subtract(Vector a, Vector b)
    {
        return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    public Vector Subtract(Vector v)
    {
        return new Vector(x - v.x, y - v.y, z - v.z);
    }
    

    public Vector Scale(Vector a, float c)
    {
        return new Vector(a.x * c, a.y * c, a.z * c);
    }
    public Vector Scale(float t)
    {
        return new Vector(x * t, y * t, z * t);
    }
    
    
    public float length()
    {
        return (float)Math.sqrt(
                //Math.pow((double)(x + x), 2.0) +
                // Math.pow((double)(y + y), 2.0) +
                // Math.pow((double)(z + z), 2.0)
                Math.pow((double)x, 2.0) +
                        Math.pow((double)y, 2.0) +
                        Math.pow((double)z, 2.0)
        );
    }

    public float sqrLength()
    {
        return (float)(
                //Math.pow((double)(x + x), 2.0) +
                // Math.pow((double)(y + y), 2.0) +
                // Math.pow((double)(z + z), 2.0));
                Math.pow((double)x, 2.0) +
                        Math.pow((double)y, 2.0) +
                        Math.pow((double)z, 2.0)
        );
    }
    
    
    public Vector normalize(Vector v)
    {
        float length = v.length();
        return new Vector(v.x()/length, v.y()/length, v.z()/length);
    }
    public Vector normalize()
    {
        float length = this.length();
        return new Vector(x / length, y / length, z / length);
    }
    

    public float dot(Vector a, Vector b)
    {
        return (a.x() * b.x() + a.y() * b.y() + a.z() * b.z());
    }
    public float dot(Vector v)
    {
        return (x* v.x + y * v.y + z * v.z);
    }
	
    
    public Vector cross(Vector a, Vector b)
    {
        return new Vector(a.y() * b.z() - a.z() * b.y(),
                a.z() * b.x() - a.x() * b.z(),
                a.x() * b.y() - a.y() * b.x());
    }
    
    public float getMagnitude() {
    	return (float) Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }
	
	
	
}
