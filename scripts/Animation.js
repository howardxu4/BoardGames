/*
 *  Animation Object
 *	Howard Xu
 *  Copyright 2012 July
 */

var Animation_this;
// Object constructor
function Animation(el, nm) {
    this.el = el;
    if (nm) this.nm = nm;
    else {
    	this.nm = "Animation_this";
        Animation_this = this;
    }
    this.deg = 0;
    this.dir = 0;  // Direction: 0 N, 1 X, 2 Y, other O
    this.spd = 10;
    this.id = null;
}
// set element
Animation.prototype.setelem = function(el) {
    this.el = el;
}
// get element
Animation.prototype.getelem = function() {
    return this.el;
}
// set data
Animation.prototype.setdata = function(data) {
    this.data = data;
}
// get data
Animation.prototype.getdata = function() {
    return this.data;
}
// set degree
Animation.prototype.setdegree = function(deg) {
    this.deg = deg;
    return this.deg;
}
// get degree
Animation.prototype.getdegree = function() {
    return this.deg;
}
// set direction
Animation.prototype.setdir = function(dir) {
    this.dir = dir;
    return this.dir;
}
// get direction
Animation.prototype.getdir = function() {
    return this.dir;
}
// set speed
Animation.prototype.setspeed = function(spd) {
    this.spd = spd;
}
// rotate:  perform a type of rotation
Animation.prototype.rotate = function() {
    var n = (this.deg + 1) % 360;
    if (this.dir == 1) {
    	this.el.style.transform="rotateX(" + n + "deg)"
    	this.el.style.webkitTransform="rotateX(" + n + "deg)"
    	this.el.style.OTransform="rotateX(" + n + "deg)"
    	this.el.style.MozTransform="rotateX(" + n + "deg)"
    }
    else if (this.dir == 2) {
    	this.el.style.transform="rotateY(" + n + "deg)"
    	this.el.style.webkitTransform="rotateY(" + n + "deg)"
   	this.el.style.OTransform="rotateY(" + n + "deg)"
    	this.el.style.MozTransform="rotateY(" + n + "deg)"
    }
    else if (this.dir) {
        this.el.style.transform="rotate(" + n + "deg)"
        this.el.style.webkitTransform="rotate(" + n + "deg)"
        this.el.style.OTransform="rotate(" + n + "deg)"
        this.el.style.MozTransform="rotate(" + n + "deg)"
    }
    return n;
}
// startRotate
Animation.prototype.startRotate = function() {
     this.deg = this.rotate();
     if (this.deg == this.e) {
        clearInterval(this.rid)
	this.rid = null;
	if (this.nxt) this.nxt(this);
    }
}
// rotates: animation of rotation
// e   -- end degree
// d   -- direction
// nxt -- next function
Animation.prototype.rotates = function(e, d, nxt) {
    this.e = e % 360;
    this.dir = d;
    this.nxt = nxt;
    if (this.rid == null) {
    	this.rid=setInterval(this.nm + ".startRotate()", this.spd)
    }
}
// startMove
Animation.prototype.startMove = function() {
    this.cnt++;
    if (this.x) {
        var i = parseInt(this.el.style.left) + this.x;
	if (isNaN(i)) i = this.x;
        this.el.style.left = i + 'px';
    }
    if (this.y) {
        var i = parseInt(this.el.style.top) + this.y;
	if (isNaN(i)) i = this.y;
        this.el.style.top = i + 'px';
    }
    this.deg = this.rotate();
    if (this.cnt == this.e) {
        clearInterval(this.id);
	this.id = null;
        if (this.nxt) this.nxt(this);
    }
}
// moves: animation of moves [with rotations]
// x  -- incX
// y  -- incY
// e  -- end_cnt
// d  -- direction: 0 N, 1 X, 2 Y, other O
// nxt -- next function
Animation.prototype.moves = function(x, y, e, d, nxt) {
   this.x = x;
   this.y = y;
   this.e = e;
   this.dir = d;
   this.nxt = nxt;
   this.cnt = 0;
   if (this.id == null) {
   	this.id = setInterval( this.nm + ".startMove()", this.spd);
   }
}
