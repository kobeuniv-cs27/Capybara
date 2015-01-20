/*
function DrawCanvas(div) {
	PrototypeCanvas.call(this, div);
	this.undoBuffer = new Array();
}

DrawCanvas.prototype = new PrototypeCanvas();
DrawCanvas.prototype.constructor = DrawCanvas;
DrawCanvas.prototype.test2 = function() {
	cl('new');
}
DrawCanvas.prototype.notify = function() {
	cl('overr');
	PrototypeCanvas.prototype.notify.call(this);
}


var p = new PrototypeCanvas('');
p.addObserver('a');
p.addObserver('aa');
p.addObserver('aaa');

var s = new DrawCanvas('testt');
s.addObserver('b');
s.addObserver('bb');
s.notify();
*/