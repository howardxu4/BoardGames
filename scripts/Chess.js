/*
 *  Chess Set Object
 *	Howard Xu
 *  Copyright 2012 July 14
 */

var mythis;

// Object constructor
function Chess() {
    this.set = 1;
    this.mode = 0;
//  this.codes  = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h' ];
    this.short = [ 'K' , 'Q', 'R', 'B', 'N', 'P' ];
//  this.piece = [ 'king', 'queen', 'rook', 'bishop', 'knight', 'pawn' ];
    this.index = [ 'Empty',
	'WKing', 'WQueen', 'WRook', 'WBishop', 'WKnight', 'WPawn',
	'BKing', 'BQueen', 'BRook', 'BBishop', 'BKnight', 'BPawn' ];
    this.board = [ [ 3, 5, 4, 2, 1, 4, 5, 3 ],
		   [ 6, 6, 6, 6, 6, 6, 6, 6 ],
		   [ 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [ 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [ 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [ 0, 0, 0, 0, 0, 0, 0, 0 ],
		   [ 12, 12, 12, 12, 12, 12, 12, 12 ],
		   [ 9, 11, 10, 8, 7, 10, 11, 9 ] ];
    this.game = [[],[],[],[],[],[],[],[]];
    this.saves = [];
    this.init();
    mythis = this;
}
// message show
Chess.prototype.status = function(s)
{
    var el = document.getElementById('msg');
    var t = this.turn? 'Black':'White';
    if (s) s+= '<br>';
    s += ' ' + t + ' to move';
    el.innerHTML = s;
    window.status = s;
}
// record movement
Chess.prototype.rec = function(f,t,x,y)
{
    var el = document.getElementById('rec');
    var n = ' ';
    if (!this.turn) n += ++this.cnt + '.'; 
    var s = el.innerHTML;
    s += n + this.short[((f-1)%6)] + x + y + " ";
    el.innerHTML = s;
    this.turn = !this.turn;
    if (t)
	this.status ( this.index[t] + " be captured" );
    else
	this.status( '');
    
}
// chess init
Chess.prototype.init = function()
{
    this.turn = 0;
    this.cnt = 0;
    for( var i=0; i<8; i++)
        this.game[i] = this.board[i].slice(0);
}
Chess.prototype.redisp = function()
{
    this.init();
    var el = document.getElementById('rec');
    el.innerHTML = '';
    this.status('');
    this.refresh();
}
// restart
Chess.prototype.restart = function()
{
    this.mode = 0;
    this.saves = [];
    this.redisp();
}
// animation
Chess.prototype.domove = function(a)
{
    this.show(a[0],a[1]);
    this.show(a[2],a[3]);
}
// play next
Chess.prototype.next = function()
{
    if (this.mode && this.cidx < this.saves.length) {
	var a = this.saves[this.cidx++];
    	if ( this.rules(a[0],a[1],a[2],a[3]) ) {
		this.domove(a);
	}
	if (this.late)
	setTimeout("mythis.next()", this.late);
    }
    else this.mode = 0;
}
// review
Chess.prototype.review = function()
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
	    setTimeout("mythis.next()", 1000);
	else
	    this.status("Type any key to play next");
    }
}
// Undo
Chess.prototype.undo = function()
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
// king move
Chess.prototype.king = function(i,j,x,y)
{
    return(Math.abs(i-x)<2 &&  Math.abs(j-y)<2);
}
// queen move
Chess.prototype.queen = function(i,j,x,y)
{
    return(this.rook(i,j,x,y) || this.bishop(i,j,x,y));
}
// rook move
Chess.prototype.rook = function(i,j,x,y)
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
// bishop move
Chess.prototype.bishop = function(i,j,x,y)
{
    var r = 0;
    if (Math.abs(i-x) == Math.abs(j-y)) {
	r = 1;
	var d = (j<y)?1:-1;
	if (i > x) {
	    while(--i > x) {
		j += d;
		if (this.game[i][j] > 0) r = 0;
	    }
	}
	else 
	    while(++i < x) {
		j += d;
		if (this.game[i][j] > 0) r = 0;
	}
    }
    return r;
}
// knight move
Chess.prototype.knight = function(i,j,x,y)
{
    var h = Math.abs(i-x);
    var v = Math.abs(j-y);
    return ( h && v && h+v == 3);
}
// pawn move
Chess.prototype.pawn = function(i,j,x,y,k)
{
    var r = 0;
    if (j == y) {
  	if (k) {
	    if((i-x) ==1) r=1;
	    else if((i-x) == 2) {
		if(i == 6 && this.game[i-1][j] == 0) r=1
	    }
	}
	else {
	    if((x-i) == 1) r=1;
	    else if((x-i) == 2) {
		if(i == 1 && this.game[i+1][j] == 0) r=1;
	    }
	} 
    }
    else if(Math.abs(j-y) == 1 && this.game[x][y] > 0) {
        if (k) {
	    if(i-x == 1) r = 1;
	}
	else {
	    if(x-i == 1) r = 1;
	}
    }
    if (r && (x==0 || x==7)){
	this.game[i][j] = x? 2: 8;	// pawn changes to queen
    }
    return r;
}
// chess rules
Chess.prototype.rules = function(i,j,x,y)
{
    var f = this.game[i][j];
    var t = this.game[x][y];
    var r = 0;
    if ( (this.turn && f < 7) || (!this.turn && f > 6) ) {
	this.status("Sorry, it is not your turn");
	return r;
    }
    if ( t > 0 ) {
	if((f > 6 && t > 6) || (f < 7 && t < 7)) { // self occupied
	    return r;	
	}
    }
    switch(f) {
	case 1:	// WKing
	case 7: // BKing
	r = this.king(i,j,x,y);
	break;
	case 2:	// WQueen
	case 8: // BQueen
	r = this.queen(i,j,x,y);
	break;
	case 3: // WRook
	case 9: // BRook
	r = this.rook(i,j,x,y);
	break;
	case 4: // WBishop
	case 10:// BBishop
	r = this.bishop(i,j,x,y);
	break
	case 5:	// WKnight
	case 11:// BKnight
	r = this.knight(i,j,x,y);
	break;
	case 6: // WPawn
	case 12:// BPawn
	r = this.pawn(i,j,x,y,(f>6));
	break;
	case 0: // Empty
	break;
    }
    if (r == 0)
	this.status( this.index[f] + " invalid moving" );
    else {
	if (t == 1 || t ==7)
	    alert( this.index[t] + " died, You win!");
	if(!this.mode)
            this.saves.push([i,j,x,y]);
	this.rec(f,t,x,y);
	this.game[x][y] = this.game[i][j];
	this.game[i][j] = 0;
    }
    return r;
} 
// change the chess piecw case
Chess.prototype.change = function()
{
    this.set = (this.set + 1)%2;
    this.refresh();
}
// get the piece of chess by image location
Chess.prototype.getshape = function(i, j)
{
   return 'style="width:72px; height:68px; opacity:0.6; background:url(images/chess.png) -' + i + 'px -' + j + 'px;"';
}
// get the piece of chess by color piece
Chess.prototype.getpiece = function(c, p, lc)
{
   var i = (p%6) * 64;
   var j = (c + this.set*2) * 70;
   return '<div id="' + lc + '" draggable="true" ondragstart="drag(event)" ' + this.getshape( i, j ) + ' ></div>';
}
// get the piece of chess by number
Chess.prototype.getnum = function(n, lc)
{
   if (n) {
	n--;
	return this.getpiece(Math.floor(n/6), n, lc);
   }
}
// get base piece style
Chess.prototype.getbase = function(i, j)
{
   var k = (i*8 + j + (i%2)) % 2;
   var r = " style='height:68px; width:72px; background-color:";
   if (k) r += '#d0e4fe';
   else r += '#f0f4fe';
   r += ";'";
   return r;
}
// get an empty piece
Chess.prototype.getempty = function(lc)
{
     return  "<div id='" + lc + "' style='height:68px; width:72px;'></div>";
}
// get the chess board
Chess.prototype.getboard = function()
{
   var bd = "<table border=0>"
   for (var i=0; i<8; i++) {
        bd += "<tr height=70>";
	for (var j=0; j<8; j++) {
	   bd += "<td id='T" + i + "_" + j + "' ";
 	   bd += ' ondrop="drop(event)" ondragover="allowDrop(event)" ';
	   bd += this.getbase(i, j) + ">";
	   bd += this.getempty("L" + i + "_" + j);
	   bd += "</td>";
	}
	bd += "</tr>";
   }
   bd += "</table>";
   return bd;
}
// display chess panel
Chess.prototype.dispanel = function()
{
    document.onkeypress=process_key;
    document.write("<center><table><tr><td width='240'>");
    document.write("<table border=0><tr height='30'> <td> <b>Instruction: </b></td></tr><tr><td>");
    document.write("<a href='http://www.chess.com/learn-how-to-play-chess.html'>how to play chess</a></tb></tr> <tr height='50'><td>");
    document.write("<p id='msg'>White to move</p> </td></tr>");
    document.write(" <tr height='10'><td> Move: " );
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; piece set: &nbsp;");
    document.write("<input type='button' value='change' onclick='change_set()'></input></td></tr>");
    document.write("<tr height='430'><td valign='top' style='border:double;'>");
    document.write("<h6 id='rec'></h6></td></tr><tr><td width='240' align='right'>");
    document.write("<input type='button' value='undo' onclick='mythis.undo();'></input>&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("<input type='button' value='Restart' onclick='mythis.restart();'></input>");
    document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
    document.write("<input type='button' value='Review' onclick='mythis.review();'>&nbsp;&nbsp;</input>");
    document.write("<select id='sel'><option>fast</option>");
    document.write("<option>medium</option><option>slow</option>");
    document.write("<option>manual</option></select></td></tr></table></td><td>");
    document.write(this.getboard());
    document.write("</td></tr></table>");

    setTimeout("mythis.refresh()", 500); 
}
// show borad by location
Chess.prototype.show = function(i, j)
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
Chess.prototype.refresh = function()
{
    for(var i = 0; i < 8; i++)
	for(var j = 0; j < 8; j++)
	    this.show(i, j);
}
// parse the location
Chess.prototype.parse = function(s)
{
   return [parseInt(s.charAt(1)), parseInt(s.charAt(3))];
}
// check the move
Chess.prototype.check = function(f, t)
{
    if (this.mode)
	this.status("Now it is in review mode");
    else {
    	var ptn = /\w\d_\d/;
    	if (f.match(ptn) && t.match(ptn)) {
            var ff = this.parse(f);
    	    var tt = this.parse(t);
    	    if ( this.rules(ff[0],ff[1],tt[0],tt[1]) ) {
	    	this.show(ff[0],ff[1]);
	    	this.show(tt[0],tt[1]);
	    }
    	}	
   	else alert("The game is messed up!!");
    }
}

// Drag and drop functions
function allowDrop(ev) { if(window.event) { ev=window.event; } ev.preventDefault(); }
function drag(ev) { if(window.event) { ev=window.event; }  ev.dataTransfer.setData("Text",ev.target.id); }
function drop(ev) { if(window.event) { ev=window.event; } ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    mythis.check( data, ev.target.id);
}
function process_key(event) {
    mythis.next();
}
function change_set() {
    mythis.change();
}
