package jp.kobe_u.capybara.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

@XmlRootElement(name="position")
public class Position {
	private int x;
	private int y;

	public Position() {
		this(-1, -1);
	}
    public Position(int x, int y) {
    	setX(x);
    	setY(y);
	}
	@XmlElement(name="x")
	public int getX() {
		return x;
	}
    @XmlElement(name="y")
	public int getY() {
		return y;
	}
	public void setX(int x) {
		this.x = x;
	}
	public void setY(int y) {
		this.y = y;
	}

	public String toString() {
		return String.format("{x:%d, y:%d}", x, y);
	}

	public DBObject toDBObject() {
		DBObject o = new BasicDBObject();
		o.put("x", x);
		o.put("y", y);
		return o;
	}
}
