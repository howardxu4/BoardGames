/*
 *	XiangQi Object
 *	   Howard Xu
 *	Copyright 2012
 */

var self;

// Object constructor
function XiangQi() {
    this.set = 0;
    this.mode = 0;
    this.short = [ 'G', 'S', 'X', 'B', 'J', 'M', 'P', 'G' ];
//  this.piece = [ 'General', 'Advisor', 'Elephant', 'Soldier',
//		 'Chariot', 'Horse', 'Cannon', 'PowerSoldier' ]; 
    this.index = [ 'Empty',
	'RShui', 'RShi', 'RXiang', 'RBin', 'RJu', 'RMa', 'RPao', 'RGHBin',
	'GJiang', 'GShi', 'GXiang', 'GZu', 'GJu', 'GMa', 'GPao', 'GGHZu' ];
    this.board = [ [5, 6, 3, 2, 1, 2, 3, 6, 5 ],
		   [0, 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [0, 7, 0, 0, 0, 0, 0, 7, 0 ],
		   [4, 0, 4, 0, 4, 0, 4, 0, 4 ],
		   [0, 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [0, 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [12,0, 12,0, 12,0, 12,0, 12],
		   [0, 15,0, 0, 0, 0, 0, 15,0 ],
		   [0, 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [13,14,11,10,9, 10,11,14,13] ];
    this.game = [ [],[],[],[],[],[],[],[],[],[] ];
    this.saves = [];
    this.init();
    self = this;
}
// message show
XiangQi.prototype.status = function(s)
{
    var el = document.getElementById('msg');
    var t = this.turn? 'Green':'Red';
    if (s) s+= '<br>';
    s += ' ' + t + ' to move';
    if (el)
    	el.innerHTML = s;
    window.status = s;
}
// record movement
XiangQi.prototype.rec = function(f,t,x,y)
{
    var el = document.getElementById('rec');
    var n = ' ';
    if (!this.turn) n += ++this.cnt + '.';
    var s = el.innerHTML;
    s += n + this.short[((f-1)%8)] + x + y + " ";
    el.innerHTML = s;
    this.turn = !this.turn;
    if (t)
        this.status ( this.index[t] + " be captured" );
    else
        this.status( '');

}
// init
XiangQi.prototype.init = function()
{
    this.turn = 0;
    this.cnt = 0;
    for( var i=0; i<10; i++)
        this.game[i] = this.board[i].slice(0);
}
XiangQi.prototype.redisp = function()
{
    this.init();
    var el = document.getElementById('rec');
    el.innerHTML = '';
    this.status('');
    this.refresh();
}
// restart
XiangQi.prototype.restart = function()
{
    this.mode = 0;
    this.saves = [];
    this.redisp();
}
// animation
XiangQi.prototype.domove = function(a)
{
    this.show(a[0],a[1]);
    this.show(a[2],a[3]);
}
// play next
XiangQi.prototype.next = function()
{
    if (this.mode && this.cidx < this.saves.length) {
        var a = this.saves[this.cidx++];
        if ( this.rules(a[0],a[1],a[2],a[3]) ) {
                this.domove(a);
        }
        if (this.late)
        setTimeout("self.next()", this.late);
    }
    else this.mode = 0;
}
// review
XiangQi.prototype.review = function()
{
    if(!this.mode) {
        var el = document.getElementById('sel');
        if (el.selectedIndex == 3)
            this.late = 0;
        else
            this.late = el.selectedIndex*2000 + 1000;
        this.mode=1;
        this.cidx=0;
        this.redisp();
        if (this.late)
            setTimeout("self.next()", 1000);
        else
            this.status("Type any key to play next");
    }
}
// Undo
XiangQi.prototype.undo = function()
{
    if (!this.mode && this.saves.length) {
         this.saves.pop();
         this.mode = 1;
 	   this.cidx = 0;
         this.redisp();
         while (this.mode && this.cidx < this.saves.length) {
             var a = this.saves[this.cidx++];
             if (this.rules(a[0],a[1],a[2],a[3]) )
                 this.domove(a);
         }
         this.mode = 0;
         this.status("Sorry, I take back");
    }
    else this.status("");
}
// JSH move
XiangQi.prototype.jsh = function(i,j,x,y)
{
    var r = 0;
    if(Math.abs(i-x) + Math.abs(j-y) == 1) 
	if (y >=3 && y<=5 && (x < 3 || x > 6))
	    r = 1;
    return r;
}
// SHI move
XiangQi.prototype.shi = function(i,j,x,y)
{
    var r = 0;
    if(Math.abs(i-x) + Math.abs(j-y) == 2) 
	if (y >=3 && y<=5 && (x < 3 || x > 6))
	    r = 1;
    return r;
}
// XIANG move
XiangQi.prototype.xiang = function(i,j,x,y)
{
    var r = 0;
    if(Math.abs(i-x) == 2 && Math.abs(j-y) == 2) { 
	if (x ==0  || x == 2 || x == 4 || x == 5 || x == 7 || x == 9)
	    if (this.game[(i+x)/2][(j+y)/2] == 0)
	        r = 1;
    }
    return r;
}
// BINZU move
XiangQi.prototype.binzu = function(i,j,x,y,k)
{
    var r = 0;
    if (j == y && Math.abs(i-x) == 1) 
	if ( x == 4 || x == 5)
	    r = 1;
    if (r) {
	if (k && x == 5) this.game[i][j] = 8;	// changes to GH
	else if (!k && x == 4) this.game[i][j] = 16;
    }
    return r;
}
// JU move
XiangQi.prototype.ju = function(i,j,x,y)
{
    var r = 0;
    if(i == x) {
        r = 1;
        if (j < y) {
            while(++j < y)
                if(this.game[i][j]) r = 0;
        }
        else {
            while(--j > y)
                if(this.game[i][j]) r = 0;
        }
    }
    else if (j == y) {
        r = 1;
        if (i < x) {
           while(++i < x)
                if(this.game[i][j]) r = 0;
        }
        else {
            while(--i > x)
                if(this.game[i][j]) r = 0;
        }
    }
    return r;
}
// MA move
XiangQi.prototype.ma = function(i,j,x,y)
{
    var r = 0;
    var h = Math.abs(i-x);
    var v = Math.abs(j-y);
    if ( h && v && h+v == 3) {
	if (h > v) {
	    if (this.game[(i+x)/2][j] == 0) r = 1;
	}
	else {
	    if (this.game[i][(j+y)/2] == 0) r = 1;
	}
    }
    return r;
}
// PAO move
XiangQi.prototype.pao = function(i,j,x,y)
{
    var r = this.ju(i,j,x,y);
    if (r == 0 && this.game[x][y] != 0) {
	var k = 0;
	if (i == x) {
	    if (j < y) {
		while(++j < y)
		    if (this.game[i][j]) k++;
		}
	    else {
		while(--j > y)
		    if (this.game[i][j]) k++;
	    }
	}
	else if (j == y) {
	    if (i < x) {
		while(++i < x)
		    if (this.game[i][j]) k++;
	    }
	    else {
		while(--i > x)
		    if (this.game[i][j]) k++;
	    }
	}
	if (k == 1) r = 1;
    }
    return r;
}
// GHBINZU move
XiangQi.prototype.ghbinzu = function(i,j,x,y,k)
{
    var r = 0;
    var v = Math.abs(i-x);
    var h = Math.abs(j-y);
    if (v + h == 1) {
	if (k) {
	    if (x >= i) r = 1;
        }
        else {
	    if (x <= i) r = 1;
	}
    }
    return r;
}
// XiangQi rules
XiangQi.prototype.rules = function(i,j,x,y)
{
    var f = this.game[i][j];
    var t = this.game[x][y];
    var r = 0;
    if ( (this.turn && f < 9) || (!this.turn && f > 8) ) {
	this.status("Sorry, it is not your turn");
	return r;
    } 
    if (t > 0) {
	if ((f > 8 && t > 8) || (f < 9 && t < 9)) { // self occupies
	    return r;
	}
    }
    switch(f) {
	case 1: // SHUAI
	case 9: // JIANG
	r = this.jsh(i,j,x,y);
	break;
	case 2: // SHI
	case 10:
	r = this.shi(i,j,x,y);
	break;
	case 3: // XIANG
	case 11:
	r = this.xiang(i,j,x,y);
	break;
	case 4: //BING
	case 12://ZU
	r = this.binzu(i,j,x,y,f==4);
	break;
	case 5: //JU
	case 13:
	r = this.ju(i,j,x,y);
	break;
	case 6: // MA
	case 14:
	r = this.ma(i,j,x,y);
	break;
	case 7: // PAO
	case 15:
	r = this.pao(i,j,x,y);
	break;
	case 8: // GHBIN
	case 16:// GHZU
	r = this.ghbinzu(i,j,x,y,f==8);
	break;
	case 0: // EMPTY
	break;
    }
    if (r == 0)
	this.status( this.index[f] + " invalid moving" );
    else {
	if (t == 1 || t == 9)
	    alert( this.index[t] + " died, You win!");
	if (!this.mode)
	    this.saves.push([i,j,x,y]);
	this.rec(f,t,x,y);
    	this.game[x][y] = this.game[i][j];
    	this.game[i][j] = 0;
    }
    return r;
}
// change the chess piece set
XiangQi.prototype.change = function()
{
    this.set = (this.set + 1)%3;
    this.refresh();
}
// get a piece object string by image location
XiangQi.prototype.getshape = function(num)
{
    var row, col;
    if (this.set) {
	row = Math.floor(num/8)*2 + (this.set-1);
	col = num%8;
        return ' style="position:relative; top:4px; left:4px; height:54px;width:55px;background:url(' + "'images/piece.png') -" + (row*55) + 'px -' + (col*55) + 'px;"';
    }
    row = num%4;
    col = Math.floor(num/4);
    return ' style="height:56px;width:56px;background:url(' + "'images/XiangQi.png') -" + (row*56) + 'px -' + (col*57) + 'px;"';
}
// get a piece object string by number 
XiangQi.prototype.getnum = function(num, lc)
{
    if (num) {
	num--;
        return '<div id="' + lc + '" draggable="true" ondragstart="drag(event)" ' + this.getshape(num) + ' ></div>';
    }
}
// get empty piece
XiangQi.prototype.getempty = function(lc)
{
    return ( '<div id="' + lc + '" style="height:55px;width:55px;"></div>');
}
// get the chess board
XiangQi.prototype.getboard = function()
{
    var bd = "<div style='height:609px;width:554px;background:url(images/xiangqi_plate.png)' > ";
    bd += "<table border='0' > ";
    for (var i=0; i<10; i++) {
	bd += "<tr height=58>";
	for (var j=0; j<9; j++) {
	    bd += "<td id='T" + i + "_" + j + "' width=56 height=56 ";
	    bd += ' ondrop="drop(event)" ondragover="allowDrop(event)" >';
	    bd += this.getempty("L" + i + "_" + j);
	    bd += "</td>";
	}
	bd += "</tr>" ;
    }
    bd += "</table></div>";
    return bd;
}
// show borad by location
XiangQi.prototype.show = function(i, j)
{
    var id = "T" + i + "_" + j;
    var el = document.getElementById(id);
    var lc = "L" + i + "_" + j;
    if (this.game[i][j]) {
        el.innerHTML = this.getnum(this.game[i][j], lc);
    }
    else
        el.innerHTML = this.getempty(lc);
}

// show all board
XiangQi.prototype.refresh = function()
{
    for(var i = 0; i < 10; i++)
        for(var j = 0; j < 9; j++)
            this.show(i, j);
}
// parse the location
XiangQi.prototype.parse = function(s)
{
   return [parseInt(s.charAt(1)), parseInt(s.charAt(3))];
}
// check the move
XiangQi.prototype.check = function(f, t)
{
    if (this.mode)
	this.status("Now it is in review mode");
    else {
	var ptn = /\w\d_\d/;
	if (f.match(ptn) && t.match(ptn)) {
	    var ff = this.parse(f);
	    var tt = this.parse(t);
 	    if (this.rules(ff[0],ff[1],tt[0],tt[1])) {
		this.show(ff[0],ff[1]);
		this.show(tt[0],tt[1]);
	    }
	}
	else alert("The game is messed up!!");
    }
}

// dispanel
XiangQi.prototype.dispanel = function()
{
    document.onkeypress=process_key;
    document.write("<center><table><tr><td width='240'>");
    document.write("<table border=0><tr height='30'> <td> <b>Instruction: </b></td></tr><tr><td>");
    document.write("<a href='http://www.chessvariants.org/xiangqi.html'>how to play Chinese chess</a></tb></tr> <tr height='50'><td>");
    document.write("<p id='msg'>Red to move</p> </td></tr>");
    document.write(" <tr height='10'><td> Move: ");
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; piece set: &nbsp;");
    document.write("<input type='button' value='change' onclick='change_set()'></input></td></tr>");
    document.write("<tr height='430'><td valign='top' style='border:double;'>");
    document.write("<h6 id='rec'></h6></td></tr><tr><td width='240' align='right'>");
    document.write("<input type='button' value='undo' onclick='self.undo();'></input>&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("<input type='button' value='Restart' onclick='self.restart();'></input>");
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("<input type='button' value='Review' onclick='self.review();'>&nbsp;&nbsp;</input>");
    document.write("<select id='sel'><option>fast</option>");
    document.write("<option>medium</option><option>slow</option>");
    document.write("<option>manual</option></select></td></tr></table></td><td>");
    document.write( this.getboard() );
    document.write("</td></tr></table>");

    setTimeout("self.refresh()", 500);
}
// Drag and drop functions
function allowDrop(ev) { ev.preventDefault(); }
function drag(ev) { ev.dataTransfer.setData("Text",ev.target.id); }
function drop(ev) { ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    self.check( data, ev.target.id);
}
function process_key(event) {
    self.next();
}
function change_set() {
    self.change();
}

