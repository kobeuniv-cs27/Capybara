var endpoint = 'api';
//var endpoint = 'http://133.30.159.3:8080/Capybara';


function PrototypeCanvas(div) {
	this.canvas = document.getElementById(div);
	if (this.canvas != undefined) {
		this.context = this.canvas.getContext("2d");
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;

		// disable dragging mode
		this.canvas.onselectstart = function() {return false;}
	}
	this.observers = new Array();
}

PrototypeCanvas.prototype.addObserver = function(observer) {
	this.observers.push(observer);
}

PrototypeCanvas.prototype.notifyObservers = function() {
	for (var i=0; i<this.observers.length; i++) {
		this.notify(this.observers[i]);
	}
}

PrototypeCanvas.prototype.notify = function(observer) {
	this.warnInherit();
}

PrototypeCanvas.prototype.setFillStyle = function(style) {
	this.context.fillStyle = style;
}

PrototypeCanvas.prototype.setStrokeStyle = function(style) {
	this.context.strokeStyle = style;
}

PrototypeCanvas.prototype.setAllStyle = function(style) {
	this.setStrokeStyle(style);
	this.setFillStyle(style);
}

PrototypeCanvas.prototype.setLineWidth = function(width) {
	this.context.lineWidth = width;
}

PrototypeCanvas.prototype.clear = function() {
	// alternative fast clear method
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	//this.canvas.width = this.canvas.width;
}

PrototypeCanvas.prototype.drawDefault = function() {
	this.warnInherit();
}

PrototypeCanvas.prototype.mouseDown = function(x, y) {
	this.warnInherit();
}

PrototypeCanvas.prototype.mouseMove = function(x, y) {
	this.warnInherit();
}

PrototypeCanvas.prototype.mouseUp = function(x, y) {
	this.warnInherit();
}

PrototypeCanvas.prototype.redraw = function() {
	this.warnInherit();
}

PrototypeCanvas.prototype.warnInherit = function() {
	console.log('Abstract method called. Override me.');
	console.log(this);
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function DrawCanvas(div, id) {
	PrototypeCanvas.call(this, div);
	this.id = id;
	this.chunkid = -1;

	this.context.lineCap = "round";
	this.context.lineJoin = "round";
	this.undoBuffer = new Array();
	this.undoStep = 0;
	this.undoMaxSize = 30 + 1; // 画像の枚数なので現画像分を+1してステップ数とする

	this.drawDefault();

	this.positions = new Array();
	this.strokeLogs = new Array();
}


DrawCanvas.prototype = new PrototypeCanvas();
DrawCanvas.prototype.constructor = DrawCanvas;


DrawCanvas.prototype.drawDefault = function() {
	this.setFillStyle('#ffffff');
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.pushUndo();
}

DrawCanvas.prototype.notify = function(observer) {
	observer.update();
}

DrawCanvas.prototype.mouseDown = function(x, y) {
	clearTimeout(this.chunkid);
	this.beginPath(x, y);
	this.newPosition();
}

DrawCanvas.prototype.mouseMove = function(x, y) {
	this.lineTo(x, y);
	this.pushPosition(x, y);

}

DrawCanvas.prototype.mouseUp = function(x, y) {
	//this.context.quadraticCurveTo(p2.x, p2.y, p1.x, p1.y);
	if (this.chunkid > 0) {
		clearTimeout(this.chunkid);
	}
	var self = this;
	this.chunkid = setTimeout(function() {
		self.pushUndo();
		self.pushStrokeLog();
		self.save();
		self.chunkid = -1;
	}, 500);
}

DrawCanvas.prototype.newPosition = function() {
	this.positions = new Array();
}

DrawCanvas.prototype.pushPosition = function(x, y) {
	this.positions.push({x:x, y:y});
}

DrawCanvas.prototype.pushStrokeLog = function() {
	this.strokeLogs.push({
		id: this.id,
		color: this.context.strokeStyle,
		brushsize: this.context.lineWidth,
		positions: this.positions
	});
}

DrawCanvas.prototype.mouseLeave = function(x, y) {
}

DrawCanvas.prototype.beginPath = function(x, y) {
	this.context.beginPath();
	this.context.arc(x, y, this.context.lineWidth/2, 0, Math.PI*2, false);
	/*
	p1.x = x;
	p2.x = x;
	p1.y = y;
	p2.y = y;
	*/
	this.context.fill();
	pts = [];
	this.context.beginPath();
	this.context.moveTo(x, y);
}
var p1 = {x:0, y:0};
var p2 = {x:0, y:0};
var pts = [];

DrawCanvas.prototype.lineTo = function(x, y) {
/*
	pts.push({x:x, y:y});
	cl(pts.length);
	this.context.moveTo(pts[0].x, pts[0].y);
	for (var i = 0; i< pts.length-2; i++) {
		var tmp = {x:(pts[i].x + pts[i+1].x)/2, y:(pts[i].y+pts[i+1].y)/2};
		this.context.quadraticCurveTo(pts[i].x, pts[i].y, tmp.x, tmp.y);
	}
	//this.context.quadraticCurveTo(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
*/
/*
	//this.context.beginPath();
	//this.context.moveTo(p2.x, p2.y);
	this.context.quadraticCurveTo(
		p1.x,
		p1.y,
		(x + p1.x)/2,
		(y + p1.y)/2
	);

	p2 = p1;
	p1 = {x:x, y:y};
*/

	this.context.lineTo(x, y);

	this.context.stroke();
	//this.save();
}

DrawCanvas.prototype.clear = function() {
	PrototypeCanvas.prototype.clear.call(this);
	this.drawDefault();
	this.save();
}

DrawCanvas.prototype.undo = function() {
	if (this.undoBuffer[this.undoStep + 1] === undefined) {
		return;
	}
	this.undoStep ++;
	this.loadUndoBuffer();
}

DrawCanvas.prototype.redo = function() {
	if (this.undoBuffer[this.undoStep - 1] === undefined) {
		return;
	}
	this.undoStep --;
	this.loadUndoBuffer();
}

DrawCanvas.prototype.pushUndo = function() {
	for (var i=0; i<this.undoStep; i++) {
		this.undoBuffer.shift();
	}
	this.undoStep = 0;
	this.undoBuffer.unshift(this.canvas.toDataURL());
	if (this.undoBuffer.length > this.undoMaxSize) {
		this.undoBuffer.pop();
	}
}

DrawCanvas.prototype.t = function() {
	cl('undoStep;' + this.undoStep + '     undoBuffer.length;' + this.undoBuffer.length);
}

DrawCanvas.prototype.loadUndoBuffer = function() {
	this.setImage(this.undoBuffer[this.undoStep]);
	this.save();
}

DrawCanvas.prototype.saveStrokeLogs = function() {
	var self = this;
	$.ajax({
		url: endpoint + '/savelog',
		type: 'POST',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify({strokelogs: self.strokeLogs}),
		success: function(data) {
			self.strokeLogs = new Array();
		},
		error: function(e) {
			cl(e);
		}
	});
};

DrawCanvas.prototype.save = function() {
	var self = this;
	$.ajax({
		url: endpoint + '/save',
		type: 'POST',
		data: {id: self.id, img: self.canvas.toDataURL()},
		success: function(data) {
		}
	});
};

DrawCanvas.prototype.syncSave = function() {
	var self = this;
	$.ajax({
		url: endpoint + '/save',
		type: 'POST',
		async: false,
		data: {id: self.id, img: self.canvas.toDataURL()},
		success: function(data) {
		}
	});
};

DrawCanvas.prototype.updateMetaInfo = function(title, tags) {
	var self = this;
	cl({id: self.id, title: title, tags: tags});
	$.ajax({
		url: endpoint + '/update',
		type: 'POST',
		traditional: true,
		data: {id: self.id, title: title, tags: tags},
		success: function(data) {

		}
	});
};


DrawCanvas.prototype.setImage = function(src) {
	var img = new Image();
	img.src = src;

	var self = this;
	img.onload = function() {
		self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
		self.context.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
		self.notifyObservers();
	}
}


DrawCanvas.prototype.restore = function() {
	cl('restore');
	var self = this;
	$.ajax({
		url: endpoint + '/restore',
		type: 'GET',
		cache: false, //
		data: {id: this.id},
		success: function(data) {
			var storedImg = new Image();
			storedImg.src = data.src;
			self.context.drawImage(storedImg, 0,0);
		},
		error: function() {
			cl('a');
		}
	});
}

DrawCanvas.prototype.togglePen = function() {

}
DrawCanvas.prototype.redraw = function() {
	// override & ignore
}

