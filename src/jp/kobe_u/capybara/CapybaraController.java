package jp.kobe_u.capybara;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.imageio.ImageIO;

import jp.kobe_u.capybara.model.Image;
import jp.kobe_u.capybara.model.MetaInfo;
import jp.kobe_u.capybara.model.MetaInfoList;
import jp.kobe_u.capybara.model.StrokeLogList;
import jp.kobe_u.capybara.util.DBUtils;

import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.sun.jersey.core.util.Base64;

public class CapybaraController {

	private final DBCollection ImgCol = DBUtils.getInstance().getDb().getCollection("img");
	private final DBCollection MetaCol = DBUtils.getInstance().getDb().getCollection("meta");
	private final DBCollection LogCol = DBUtils.getInstance().getDb().getCollection("log");

	public MetaInfo create() {
		String id = new ObjectId().toString();
		MetaInfo metaInfo = new MetaInfo(id);
		return metaInfo;
	}

	public Image saveImage(String id, String src) {
		Image image = new Image(id, src);
		ImgCol.save(image.toDBObject());

		int frame = getMetaInfo(id).getTotalFrame() + 1;
		updateMetaInfo(id, null, null, frame);
		return image;
	}

	public MetaInfo updateMetaInfo(String id, String title, List<String> tags, int totalPage) {
		MetaInfo metaInfo = getMetaInfo(id);

		if (id != null) {
			metaInfo.setId(id);
		}
		if (title != null) {
			metaInfo.setTitle(title);
		}
		if (tags != null) {
			metaInfo.setTags(tags);
		}
		if (totalPage > 0) {
			metaInfo.setTotalFrame(totalPage);
		}
		metaInfo.setLastUpdatedAt(new Date());
		MetaCol.save(metaInfo.toDBObject());

		return metaInfo;
	}

	/**
	 * DBからMetaInfoを取得する
	 * なければ新規MetaInfoを作成する．
	 * @param id
	 * @return
	 */
	public MetaInfo getMetaInfo(String id) {
		if (StringUtils.isEmpty(id)) {
			return null;
		}

		DBObject query = new BasicDBObject("_id", id);
		DBObject data = MetaCol.findOne(query);

		// DBになければ新規作成
		if (data == null) {
			return new MetaInfo(id);
		}
		return new MetaInfo(data);
	}

	public Image getImage(String id) {
		DBObject query = new BasicDBObject("_id", id);
		DBObject o = ImgCol.findOne(query);

		if (o == null) {
			return null;
		}
		return new Image(o);
	}

	public ByteArrayOutputStream getImageSrc(String id) {
		String src = getImage(id).getSrc();
		src = src.split(",")[1];
		byte[] bytes = Base64.decode(src);
		try {
			BufferedImage bImage = ImageIO.read(new ByteArrayInputStream(bytes));

			ByteArrayOutputStream baos = new ByteArrayOutputStream();;
			ImageIO.write(bImage, "png", baos);
			return baos;
		} catch (IOException e) {
			// TODO 自動生成された catch ブロック
			e.printStackTrace();
		}
		 return null;
	}

	public MetaInfoList getAllMetaInfo() {
		MetaInfoList list = new MetaInfoList();
		DBObject orderBy = new BasicDBObject("lastUpdatedAt", -1);
		DBCursor cursor = MetaCol.find().sort(orderBy);
		for (DBObject object : cursor) {
			list.add(new MetaInfo(object));
		}
		return list;
	}

	public void delete(String id) {
		DBObject query = new BasicDBObject();
		query.put("_id", id);
		MetaCol.remove(query);
		ImgCol.remove(query);
	}

	public void saveStrokeLog(StrokeLogList list) {
		LogCol.insert(list.toDBObject());
	}
}
