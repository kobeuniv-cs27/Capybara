package jp.kobe_u.capybara.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="metainfos")
@XmlAccessorType(XmlAccessType.FIELD)
public class MetaInfoList {

    @XmlElement(name="metainfo")
	private List<MetaInfo> metaInfos;

	public MetaInfoList() {
		metaInfos = new ArrayList<MetaInfo>();
	}

	public MetaInfo[] getMetaInfos() {
		return metaInfos.toArray(new MetaInfo[metaInfos.size()]);
	}

	public void add(MetaInfo metaInfo) {
		metaInfos.add(metaInfo);
	}

	public String toString() {
		String ret = "[";
		for (MetaInfo info : metaInfos) {
			ret += "" + info.toString() + ",\n";
		}
		ret += "]";
		return ret;
	}
}
