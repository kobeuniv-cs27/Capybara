
var a;
var isPainting;

var isDrawing;
var isPressed;
var isRectErasing;
var isTouch = ('ontouchstart' in window);

var drawCanvas;
var mouseCanvas;
var displayCanvas;

var previewCanvas;
var brushSizeCanvas;
var colorPickCanvas;

init();



function init() {
	var id = getUrlParams()['id'];
	if (id !== undefined) {
		drawCanvas = new DrawCanvas('draw_canvas', id);
		drawCanvas.restore();
	}
	else {
		id = createNewCanvasId();
		if (id === undefined) return;

		window.location = window.location.href + "?id=" + id;
	}

	//displayCanvas = new DisplayCanvas('display_canvas');
	/*
	setInterval(function() {
		drawCanvas.saveStrokeLogs();
	}, 100000);
	*/

	//mouseCanvas = new CanvasManager('mouse_canvas', displayCanvas);

	//displayCanvas.addLayer(drawCanvas);
	//drawCanvas.addObserver(displayCanvas);

	previewCanvas = new PreviewCanvas('preview_canvas');



	brushSizeCanvas = new BrushSizeCanvas('brush_size_canvas');
	brushSizeCanvas.addObserver(previewCanvas);
	brushSizeCanvas.addObserver(drawCanvas);


	colorPickCanvas = new ColorPickCanvas('color_pick_canvas');
	colorPickCanvas.addObserver(previewCanvas);
	colorPickCanvas.addObserver(drawCanvas);
	colorPickCanvas.addObserver(brushSizeCanvas);

	// size=2
	brushSizeCanvas.defaultClick(1);


	// level 2をクリック＝黒
	colorPickCanvas.defaultClick(2);
}

function createNewCanvasId() {
	var id;
	$.ajax({
		url: endpoint + '/create',
		async: false,
		success: function(data) {
			id = data.id;
		}
	})
	return id;
}

$('#brush_size_canvas').bind({
	'mousedown touchstart': function(e) {
		e.preventDefault();
		var pos = currentPosition(e.originalEvent);
		brushSizeCanvas.mouseDown(pos.x - this.offsetLeft, pos.y - this.offsetTop);
		$(this).bind('mousemove touchmove', function(e) {
			e.preventDefault();
			var pos = currentPosition(e.originalEvent);
			brushSizeCanvas.mouseMove(pos.x - this.offsetLeft, pos.y - this.offsetTop);
		});
	},
	'mouseup touchend touchleave': function(e) {
		brushSizeCanvas.mouseUp();
		$(this).off('mousemove touchmove');
	}
});


$('#color_pick_canvas').bind({
	'mousedown touchstart': function(e) {
		e.preventDefault();
		var pos = currentPosition(e.originalEvent);
		colorPickCanvas.mouseDown(pos.x - this.offsetLeft, pos.y - this.offsetTop)

		$(this).bind('mousemove touchmove', function(e) {
			e.preventDefault();
			var pos = currentPosition(e.originalEvent);
			colorPickCanvas.mouseMove(pos.x - this.offsetLeft, pos.y - this.offsetTop)
		});
	},
	'mouseup mouseleave touchend touchleave': function(e) {
		colorPickCanvas.mouseUp();
		$(this).off('mousemove touchmove');
	}
});

$('#draw_canvas').bind({
	'mousedown touchstart': function(e) {
		e.preventDefault();
		var pos = currentPosition(e.originalEvent);
		drawCanvas.mouseDown(pos.x - this.offsetLeft, pos.y - this.offsetTop);

		$(this).bind('mousemove touchmove', function(e) {
			e.preventDefault();
			var pos = currentPosition(e.originalEvent);
			drawCanvas.mouseMove(pos.x - this.offsetLeft, pos.y - this.offsetTop);
		});
		//$(this).trigger('mv', e);
	},
	'mouseup touchend': function(e) {
		drawCanvas.mouseUp();
		$(this).off('mousemove touchmove');
	},
	'mouseleave touchleave': function(e) {
		drawCanvas.mouseLeave();
	},
	'contextmenu': function(e) {
		//drawCanvas.togglePen();
	}
});

var isTouch = function(e) {
	return (e.touches != undefined);
}

var currentPosition = function(e) {
	return {
		x: (isTouch(e) ? e.touches[0].pageX : e.pageX),
		y: (isTouch(e) ? e.touches[0].pageY : e.pageY)
	}
}


$(window).on("beforeunload",function(e){
	var blank = document.createElement('canvas');
	blank.width = drawCanvas.canvas.width;
	blank.height = drawCanvas.canvas.height;

	var context = blank.getContext("2d");
	context.fillStyle = '#ffffff';
	context.fillRect(0, 0, blank.width, blank.height);

	if (drawCanvas.canvas.toDataURL() != blank.toDataURL()) {
		drawCanvas.syncSave();
	}
});

//################################################################################
// undo/redo



$('#undo').click(function() {
	drawCanvas.undo();
})

$('#redo').click(function() {
	drawCanvas.redo();
})

$('#clear').click(function() {
	drawCanvas.clear();
})

var id;
$('#create').click(function() {
	console.log('create');
	$.ajax({
		url: endpoint + '/create',
		type: 'GET',
		success: function(data) {
			id = data.id;
		}
	});
})

$('#save').click(function() {
	console.log('save');
	$.ajax({
		url: endpoint + '/save',
		type: 'POST',
		data: {id: id, img: drawCanvas.canvas.toDataURL()},
		success: function(data) {
			cl(data);
		}
	});
})


$('#restore').click(function() {
	console.log('restore');
	$.ajax({
		url: endpoint + '/restore',
		type: 'GET',
		data: {id: id},
		success: function(data) {
			drawCanvas.setImage(data.imgData);
		}
	});
})

$('#test').click(function() {
	cl('caliling');
	var tags = [];
	tags[0] = "a";
	tags[1] = "b";
	//var tags = ["a", "b"];
	$.ajax({
		url: "http://localhost:8080/Capybara/update",
		type: "POST",
		traditional: true,
		//contentType: "application/json",
		data: {id: "001", title:"titleX", tags:tags},
		success: function(data) {

		}
	})
})

$('#meta form').submit(function(){
	$('input', this).blur();
	return false;
})

$('#meta form input').blur(function(e) {
	var title = $('#title input').val();
	var tags = $('#tags input').tagify('serialize');
	drawCanvas.save();
	drawCanvas.updateMetaInfo(title, tags);

})

/*
$('#meta form').keypress(function(e) {
	cl(e.which);
	if (e.which == 32) {
		$(this).submit();
	}
})
*/
//################################################################################

//################################################################################
