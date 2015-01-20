package jp.kobe_u.capybara.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

@XmlRootElement(name="metainfo")
public class MetaInfo {

	private String id;
	private String title;
	private List<String> tags;
	private int totalFrame;
	private Date createdAt;
	private Date lastUpdatedAt;

	public MetaInfo() {
		this("");
	}
	public MetaInfo(String id) {
		this(id, "", new ArrayList<String>(), 0, new Date(), new Date());
	}
	public MetaInfo(String id, String title, List<String> tags, int totalFrame, Date createdAt, Date lastUpdatedAt) {
		setId(id);
		setTitle(title);
		setTags(tags);
		setTotalFrame(totalFrame);
		setCreatedAt(createdAt);
		setLastUpdatedAt(lastUpdatedAt);
	}
	/**
	 * DBObjectからのマッピングコンストラクタ
	 * @param o
	 */
	@SuppressWarnings("unchecked")
	public MetaInfo(DBObject o) {
		this((String)o.get("_id"),
			(String)o.get("title"),
			(List<String>)o.get("tags"),
			(int)o.get("totalFrame"),
			(Date)o.get("createdAt"),
			(Date)o.get("lastUpdatedAt"));
	}

    @XmlElement(name="id")
	public String getId() {
		return id;
	}
    @XmlElement(name="title")
	public String getTitle() {
		return title;
	}
    @XmlElement(name="tags")
	public List<String> getTags() {
		return tags;
	}
    @XmlElement(name="totalFrame")
	public int getTotalFrame() {
		return totalFrame;
	}
    @XmlElement(name="createdAt")
	public Date getCreatedAt() {
		return createdAt;
	}
    @XmlElement(name="lastUpdatedAt")
	public Date getLastUpdatedAt() {
		return lastUpdatedAt;
	}
	public void setId(String id) {
		this.id = id;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public void setTotalFrame(int totalFrame) {
		this.totalFrame = totalFrame;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public void setLastUpdatedAt(Date lastUpdatedAt) {
		this.lastUpdatedAt = lastUpdatedAt;
	}


	public DBObject toDBObject() {
		DBObject o = new BasicDBObject();
		o.put("_id", getId()); // override _id in mongodb
		o.put("title", getTitle());
		o.put("tags", getTags());
		o.put("totalFrame", getTotalFrame());
		o.put("createdAt", getCreatedAt());
		o.put("lastUpdatedAt", getLastUpdatedAt());
		return o;
	}

	public String toString() {
		String ret = String.format("meta  {id:%s, title:%s, totalFrame:%d, createdAt:%s, lastUpdatedAt:%s, ",
				id, title, totalFrame, createdAt, lastUpdatedAt );
		ret += "tags:[";
		for (String tag : tags) {
			ret += tag + ",";
		}
		ret += "]}";
		return ret;
	}
}
