package jp.kobe_u.capybara.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.mongodb.DBObject;

@XmlRootElement(name="strokelogs")
public class StrokeLogList {
	private List<StrokeLog> strokeLogs;
	private boolean isClear;

    @XmlElement(name="strokelogs")
	public StrokeLog[] getStrokeLogs() {
		return strokeLogs.toArray(new StrokeLog[strokeLogs.size()]);
	}

	public StrokeLogList() {
		strokeLogs = new ArrayList<StrokeLog>();
	}

	public void setStrokeLogs(StrokeLog[] strokeLogs) {
		this.strokeLogs = Arrays.asList(strokeLogs);
	}

	public void addStrokeLog(StrokeLog strokeLog) {
		strokeLogs.add(strokeLog);
	}

    @XmlElement(name="clear")
	public boolean isClear() {
		return isClear;
	}

	public void setClear(boolean isClear) {
		this.isClear = isClear;
	}


	public String toString() {
		return String.format("{strokelogs:%s}", strokeLogs);
	}

	public List<DBObject> toDBObject() {
		List<DBObject> list = new ArrayList<DBObject>();

		for (StrokeLog log : strokeLogs) {
			list.add(log.toDBObject());
		}
		//list.addAll(strokeLogs);
		System.out.println("--" + list);
		return list;
	}


}