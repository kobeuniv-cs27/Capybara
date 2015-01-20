package jp.kobe_u.capybara.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;


@XmlRootElement(name="image")
public class Image {
	private String id;
	private String src;

	public Image() {
		this("", "");
	}
	public Image(String id, String src) {
		setId(id);
		setSrc(src);
	}
	/**
	 * DBObjectからのマッピングコンストラクタ
	 * @param o
	 */
	public Image(DBObject o) {
		this((String)o.get("_id"),
			(String)o.get("src"));
	}


	@XmlElement(name="id")
	public String getId() {
		return id;
	}
	@XmlElement(name="src")
	public String getSrc() {
		return src;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setSrc(String src) {
		this.src = src;
	}

	public DBObject toDBObject() {
		DBObject o = new BasicDBObject();
		o.put("_id", id); //override _id in mongodb
		o.put("src", getSrc());
		return o;
	}

	public void fromDBObject(DBObject o) {
		setId((String)o.get("id"));
		setSrc((String)o.get("src"));
	}

	public String toString() {
		return String.format("image {id:%s, src:%s}", id, src);
	}
}
