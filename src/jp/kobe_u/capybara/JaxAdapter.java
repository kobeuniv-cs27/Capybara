package jp.kobe_u.capybara;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import jp.kobe_u.capybara.model.Image;
import jp.kobe_u.capybara.model.MetaInfo;
import jp.kobe_u.capybara.model.MetaInfoList;
import jp.kobe_u.capybara.model.StrokeLog;
import jp.kobe_u.capybara.model.StrokeLogList;

@Path("/")
public class JaxAdapter {

	private CapybaraController controller;
	public JaxAdapter() {
		controller = new CapybaraController();
	}


	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/create")
	public Response create() {
		MetaInfo metaInfo = controller.create();
		return Response.ok().entity(metaInfo).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/save")
	public Response saveImage(
			@FormParam("id") String id,
			@FormParam("img") String imgData) {
		Image image = controller.saveImage(id, imgData);
		return Response.ok().entity(image).build();
	}

	@POST
	@Path("/update")
	public Response updateMeta(
			@FormParam("id") String id,
			@FormParam("title") String title,
			@FormParam("tags") List<String> tags) {
		MetaInfo metaInfo = controller.updateMetaInfo(id, title, tags, 0);
		return Response.ok(metaInfo).build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/restore")
	public Response getImage(
			@QueryParam("id") String id) {
		System.out.println("aa");
		Image image = controller.getImage(id);
		if (image == null) {
			return Response.ok().build();
		}
		//System.out.println(image.getSrc());
		return Response.ok().entity(image).build();
	}
	@GET
	@Produces("image/png")
	@Path("/img/{id}.png")
	public Response getImageSrc(
			@PathParam("id") String id) {
		byte[] imageData = controller.getImageSrc(id).toByteArray();
		return Response.ok(new ByteArrayInputStream(imageData)).
				//header("content-disposition","inline; filename = test.png").
				build();
	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/list")
	public Response getAllMetaInfo() {
		MetaInfoList list = controller.getAllMetaInfo();
		return Response.ok().entity(list).build();
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/savelog")
	public Response saveLog(StrokeLogList list) {
		controller.saveStrokeLog(list);
		return Response.ok().entity(list).build();

	}


	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Path("/test")
	public Response test(
			StrokeLogList list
			) {
		return Response.ok().entity(list).build();

	}


	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/test2")
	public Response test2() {
		StrokeLogList list = new StrokeLogList();
		List<StrokeLog> a = new ArrayList<StrokeLog>();
		a.add(new StrokeLog());
		a.add(new StrokeLog());
		list.setStrokeLogs(a.toArray(new StrokeLog[a.size()]));
		System.out.println(list);
		return Response.ok().entity(list).build();

	}

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/test3")
	public Response test3() {
		ArrayList<MetaInfo> list = new ArrayList<MetaInfo>();
		list.add(new MetaInfo());
		//list.add(new MetaInfo());
	     GenericEntity<List<MetaInfo>> entity = new GenericEntity<List<MetaInfo>>(list) {};
		return Response.ok().entity(entity).build();

	}

}
