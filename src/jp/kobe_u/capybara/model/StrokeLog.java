package jp.kobe_u.capybara.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

@XmlRootElement(name="strokelog")
public class StrokeLog {
	private String id;
	private String color;
	private int brushSize;
	private List<Position> positions;

	public StrokeLog() {
		positions = new ArrayList<Position>();
	}

    @XmlElement(name="id")
	public String getId() {
		return id;
	}
    @XmlElement(name="color")
	public String getColor() {
		return color;
	}
    @XmlElement(name="brushsize")
	public int getBrushSize() {
		return brushSize;
	}
    @XmlElement(name="positions")
	public Position[] getPositions() {
		return positions.toArray(new Position[positions.size()]);
	}

	public void setId(String id) {
		this.id = id;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public void setBrushSize(int brushSize) {
		this.brushSize = brushSize;
	}
	public void setPositions(Position[] positions) {
		this.positions = Arrays.asList(positions);
	}


	public void addPosition(Position position) {
		positions.add(position);
	}

	public String toString() {
		return String.format("{id:%s, color:%s, brushsize:%s, positions:%s}", id, color, brushSize, positions);
	}

	public DBObject toDBObject() {
		DBObject o = new BasicDBObject();
		o.put("id", id);
		o.put("color", color);
		o.put("brushsize", brushSize);

		List<DBObject> list = new ArrayList<DBObject>();
		for (Position pos : positions) {
			list.add(pos.toDBObject());
		}
		o.put("positions", list);
		return o;
	}

}
