package model;

public class Color {
	
    public float r, g, b;

    public Color() {
    }

    public Color(float r, float g, float b){
        this.r = r;
        this.g = g;
        this.b = b;
    }
    
    public void addColor(Color c) {
        this.r += c.r;
        this.g += c.g;
        this.b += c.b;
        
        if(this.r > 1) r = 1;
        if(this.g > 1) g = 1;
        if(this.b > 1) b = 1;
    }
    
}
