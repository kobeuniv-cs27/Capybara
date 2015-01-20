
function PreviewCanvas(div) {
	PrototypeCanvas.call(this, div);
	this.centerX = this.canvas.width/2;
	this.centerY = this.canvas.height/2;
	this.radius = 2;
	this.drawDefault();
}

PreviewCanvas.prototype = new PrototypeCanvas();
PreviewCanvas.prototype.constructor = PreviewCanvas;

PreviewCanvas.prototype.drawDefault = function() {
	this.clear();
	this.drawHorizontalLine();
	this.drawVerticalLine();
};

PreviewCanvas.prototype.drawHorizontalLine = function() {
	this.context.strokeStyle = '#bbbbbb';
	this.context.beginPath();
	this.context.moveTo(0, this.canvas.height/2);
	this.context.lineTo(this.canvas.width, this.canvas.height/2);
	this.context.stroke();
};

PreviewCanvas.prototype.drawVerticalLine = function() {
	this.context.strokeStyle = '#bbbbbb';
	this.context.beginPath();
	this.context.moveTo(this.canvas.width/2, 0);
	this.context.lineTo(this.canvas.width/2, this.canvas.height);
	this.context.stroke();
};

PreviewCanvas.prototype.drawCircle = function() {
	this.context.beginPath();
	if (this.context.fillStyle == '#ffffff') {
		this.setStrokeStyle('#888888');
		this.context.arc(this.centerX, this.centerY, this.radius, 0, 2*Math.PI, false);
		this.context.fill();
		this.context.stroke();

	} else {
		this.context.arc(this.centerX, this.centerY, this.radius, 0, 2*Math.PI, false);
		this.context.fill();
	}
};

PreviewCanvas.prototype.setRadius = function(radius) {
	this.radius = radius;
};

PreviewCanvas.prototype.redraw = function() {
	this.drawDefault();
	this.drawCircle();
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function BrushSizeCanvas(div) {
	PrototypeCanvas.call(this, div);
	this.isChanging = false;

	this.margin = {left: 20, top: 6, right: 4, bottom: 6};
	this.lineX = this.margin.left + (this.canvas.width - (this.margin.left+this.margin.right)) / 2;

	this.color;
	this.tickWidth = 12;
	this.tickSteps = 7;
	this.tickMarginHeight = (this.canvas.height - (this.margin.top+this.margin.bottom)) / this.tickSteps;

	this.level;
	this.drawDefault();
};

BrushSizeCanvas.prototype = new PrototypeCanvas();
BrushSizeCanvas.prototype.constructor = BrushSizeCanvas;

BrushSizeCanvas.prototype.drawDefault = function() {
	this.clear();
	this.drawMeter();
}

BrushSizeCanvas.prototype.drawMeter = function() {
	this.context.strokeStyle = '#555555';
	this.context.font = '12px Monospace';

	this.context.beginPath();
	this.context.moveTo(this.lineX, this.margin.top);
	this.context.lineTo(this.lineX, this.canvas.height-this.margin.bottom);


	var font = {x: 8, y: 8}
	for (var i=0; i<this.tickSteps+1; i++) {
		var y = this.toY(i);
		this.context.moveTo(this.lineX-this.tickWidth/2, y);
		this.context.lineTo(this.lineX+this.tickWidth/2, y);
		// テキストの描画
		/*
		if (i == this.tickSteps) {
			continue;
		}
		var label = Math.pow(2, i);
		var len = 4-String(label).length;
		var text = new Array(len).join(' ') + label;
		this.context.strokeText(text, this.lineX-this.tickWidth/2 - 20, y + font.y/2 + 12);
		*/
	}

	this.context.stroke();
};

BrushSizeCanvas.prototype.drawFocus = function() {
	var len = 18;

	var px = this.margin.left-len;
	var py = this.margin.top + (this.level-0.5) * (
		(this.canvas.height-(this.margin.top+this.margin.bottom))/this.tickSteps
	);

	this.context.fillStyle = this.color;//"#000000";//this.color;
	this.context.strokeStyle = this.color;
	//this.context.fillStyle = '#222222';
	this.context.beginPath();
	this.context.moveTo(px, py - len/2);
	this.context.lineTo(px+len/2*Math.sqrt(3), py);
	this.context.lineTo(px, py + len/2);
	this.context.lineTo(px, py - len/2);
	if (this.context.fillStyle == '#ffffff') {
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#888888';
		this.context.stroke();
	}
	this.context.fill();
}


BrushSizeCanvas.prototype.mouseDown = function(x, y) {
	this.isChanging = true;
	this.mouseMove(x, y);
}

BrushSizeCanvas.prototype.mouseMove = function(x, y) {
	this.level = this.toLevel(y);

	this.drawDefault();
	this.drawFocus();
	this.notifyObservers();
	//this.drawCircle();
}
BrushSizeCanvas.prototype.mouseUp = function(x, y) {
}



BrushSizeCanvas.prototype.notify = function(observer) {
	if (observer instanceof DrawCanvas) {
		observer.setLineWidth(Math.pow(this.level, 2));
	}
	if (observer instanceof PreviewCanvas) {
		observer.setRadius(Math.pow(this.level, 2));
		observer.redraw();
	}
}

BrushSizeCanvas.prototype.toLevel = function(y) {
	var level = Math.floor((y - this.margin.top) / this.tickMarginHeight) + 1;
	return level < 1 ? 1 : (level > this.tickSteps ? this.tickSteps : level);
}

BrushSizeCanvas.prototype.toY = function(level) {
	return this.margin.top + (level * this.tickMarginHeight);
}

BrushSizeCanvas.prototype.defaultClick = function(level) {
	this.mouseDown(brushSizeCanvas.canvas.width/2, this.toY(level));
	this.mouseUp();
}

BrushSizeCanvas.prototype.redraw = function() {

		this.drawDefault();
		this.drawFocus();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////


function ColorPickCanvas(div) {
	PrototypeCanvas.call(this, div);
	this.color;

	this.margin = {left: 20, top: 5, right: 4, bottom: 5};
	this.bawSteps = 6;
	this.graySteps = 2;
	this.gradSteps = 20;
	this.totalSteps = this.bawSteps + this.graySteps + this.gradSteps;

	this.drawDefault();
}

ColorPickCanvas.prototype = new PrototypeCanvas();
ColorPickCanvas.prototype.constructor = ColorPickCanvas;

ColorPickCanvas.prototype.drawDefault = function() {
	this.clear();
	this.context.beginPath();

	var bawHeight  = this.canvas.height/this.totalSteps * this.bawSteps;
	var grayHeight = this.canvas.height/this.totalSteps * this.graySteps;
	var gradHeight = this.canvas.height/this.totalSteps * this.gradSteps;

	var x = this.margin.left;
	var w = this.canvas.width-(this.margin.left+this.margin.right);
	var h =(this.canvas.height-(this.margin.top+this.margin.bottom))/this.totalSteps;

	var level = 0;

	// black and white
	for (var i = 0; i < this.bawSteps; i++) {
		var y = level++ * h + this.margin.top;
		var l = Math.floor(i/(this.bawSteps/2)) * 100;
		this.context.fillStyle = 'hsl(0, 0%,' + l +'%)';
		this.context.fillRect(x, y, w, h+1);
	}
	// gray
	for (var i = 0; i < this.graySteps; i++) {
		var y = level++ * h + this.margin.top;
		var l = (i+1) * 100/(this.graySteps+1);
		this.context.fillStyle = 'hsl(0, 0%,' + l +'%)';
		this.context.fillRect(x, y, w, h+1);
	}

	// gradation
	for (var i = 0; i < this.gradSteps; i++) {
		var y = level++ * h + this.margin.top;
		var s = i/this.gradSteps*360;
		this.context.fillStyle = 'hsl(' + s +', 100%, 50%)';
		this.context.fillRect(x, y, w, h+1);
	}
};

ColorPickCanvas.prototype.notify = function(observer) {
	observer.setAllStyle(this.color);
	if (observer instanceof PreviewCanvas || observer instanceof BrushSizeCanvas) {
		observer.redraw();
	}
}

ColorPickCanvas.prototype.mouseDown = function(x, y) {
	this.mouseMove(x, y);
}

ColorPickCanvas.prototype.isInGradation = function(x, y) {
	return (
		x >= this.margin.left &&
		x <= this.canvas.width-this.margin.right &&
		y >= this.margin.top &&
		y <= this.canvas.height-this.margin.bottom);
}

ColorPickCanvas.prototype.mouseMove = function(x, y) {
	if (this.isInGradation(x, y)) {
		var level = Math.floor(
			(y - this.margin.top) /
			(this.canvas.height-(this.margin.top+this.margin.bottom)) *
			this.totalSteps);
		if (level < this.bawSteps) {
			var l = Math.floor(level/(this.bawSteps/2)) * 100;
			this.color = 'hsl(0, 0%,' + l +'%)';
		} else if (level < this.bawSteps + this.graySteps) {
			var n = level - this.bawSteps;
			var l = (n+1) * 100/(this.graySteps+1);
			this.color = 'hsl(0, 0%,' + l +'%)';
		} else if (level < this.bawSteps + this.graySteps + this.gradSteps) {
			var n = level - (this.bawSteps + this.graySteps);
			var s = n/this.gradSteps*360;
			this.color = 'hsl(' + s +', 100%, 50%)';
		}
		this.drawDefault();
		this.drawFocus(level);
		this.notifyObservers();
	}
}

ColorPickCanvas.prototype.drawFocus = function(level) {
	var len = 18;

	if (level < this.bawSteps) {
		var nblocks = this.bawSteps/2;
		level = Math.floor(level/nblocks) * nblocks + Math.floor(nblocks/2);
	}
	var px = this.margin.left-len;
	var py = this.margin.top + (level+0.5) * (
		(this.canvas.height-(this.margin.top+this.margin.bottom))/this.totalSteps
	);


	this.context.fillStyle = this.color;
	//this.context.fillStyle = '#222222';
	this.context.beginPath();
	this.context.moveTo(px, py - len/2);
	this.context.lineTo(px+len/2*Math.sqrt(3), py);
	this.context.lineTo(px, py + len/2);
	this.context.lineTo(px, py - len/2);
	if (this.context.fillStyle == '#ffffff') {
		this.context.lineWidth = 2;
		this.context.strokeStyle = '#888888';
		this.context.stroke();
	}
	this.context.fill();
}

ColorPickCanvas.prototype.mouseUp = function() {
}

ColorPickCanvas.prototype.defaultClick = function(level) {
	this.mouseDown(
		this.canvas.width-this.margin.left + 1,
		(this.canvas.height-this.margin.top)/this.totalSteps*level + 1);
	this.mouseUp();
}
