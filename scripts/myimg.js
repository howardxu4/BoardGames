/*
 *  Puzzle Game User Interface
 *	Howard Xu
 *  Copyright Jun. 2012
 */

var mxrow = 4;
var mxcol = 8;
var row = mxrow;
var col = mxcol;
var prv = 0;
var cur = Math.floor(Math.random()*col*row);
var flg = 0;
var img = 'images/tiger.jpg';
var hit = 145;
var wid = 100;
var spd = 200;
var newImg = new Image();

function chkSize()
{
newImg.src = img;
row = mxrow;
col = mxcol;
var curRow = Math.floor(newImg.height/hit);
var curCol = Math.floor(newImg.width/wid);
if (row > curRow && curRow != 0) row = curRow; 
if (col > curCol && curCol != 0) col = curCol;
cur = Math.floor(Math.random()*col*row);
}

function getline(i, j, k)
{
var line = '<div id="I' + k + '" style="height:' + hit + 'px;width:' + wid + "px;background:url('" + img + "') -" + (i*wid) + 'px -' + (j*hit) + 'px;"></div>';
return line;
}

function getHtml()
{
var i, j, k = 0;
var html = '<table>';
    chkSize();	
    for (j = 0; j < row; j++) {
    	html += '<tr height="' + hit + '">';
	    for (i = 0; i < col; i ++) {
		if ( k == cur)
			html += '<td id="T' + k + '"> </td>';
		else
			html += '<td id="T' + k + '"> ' + getline(i,j,k) + '</td>';
		k++;
    	}	
    	html += '</tr>';
    }
    html +=  '</table>';
    return html;
}
function valImg(f)
{
	var tmpImg = new Image();
	tmpImg.src = f;
	tmpImg.onload = function() {
	      if (tmpImg.height && tmpImg.width) {
		    img = f;
		    newImg.src = img;
	      }
	      else alert( "No Image in " + f);
	}
}
function valWidth(v)
{
	if (v < 20) v = 20;
	wid = parseInt(v);
}
function valHeight(v)
{
	if (v < 20) v = 20;
	hit = parseInt(v);
}
function valCol(v)
{
	if (v) mxcol = parseInt(v);
}
function valRow(v)
{
 	if (v) mxrow = parseInt(v);
}
function valSpd(v)
{
	if (v < 10) v = 10;
	spd = parseInt(v);
}
function createObjectURL(object) {
    return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function chgHandle(evt)
{
 	var files = evt.target.files;
	if (files.length) {
	    for(var i in files) {
		var src = createObjectURL(files[i]);
		newImg.src = src;
	    }
	}
}
function getAll()
{
    var html = "<table> <tr><td width='%10'><table>";
    html += "<tr><td><h3>Instruction of playing Puzzle Game</h3></td></tr>";
    html += "<tr><td height=10></td></tr>"
    html += "<tr><td>Picture can be cut into M by N blocks.</td></tr>";
    html += "<tr><td>There is one free block [empty] to move into.</td></tr>";
    html += "<tr><td>Start the shuffle then stop it, {toggle}</td></tr>";
    html += "<tr><td>Challenge to use Up, Left, Down, Right keys</td></tr>";
    html += "<tr><td>moving blocks back to their original positions.</td></tr>";
    html += "<tr><td height='20'></td></tr>"
    html += "<tr><td>Select an image url link using copy/paste:</td></tr>";
    html += "<tr><td><input type='text' id='IT' value='" + img + "' size='30' onChange='valImg(this.value);'/><td/></tr>";
    html += "<tr><td>or find an image file from local disk:</td></tr>";
    html += "<tr><td><input type='file' id='IF' onChange='chgHandle(event);'/></td></tr>";
    html += "<tr><td>Block Width:<input type='text' id='IW'value='" + wid + "' size='3' onChange='valWidth(this.value);'/>&nbsp;pixel<td/></tr>";
    html += "<tr><td>Block Height:<input type='text' id='IH'value='" + hit + "' size='3' onChange='valHeight(this.value);'/>&nbsp;pixel<td/></tr>";
    html += "<tr><td>Max Col:<input type='text' id='IC'value='" + mxcol + "' size='2' onChange='valCol(this.value);'/><td/></tr>";
    html += "<tr><td>Max Row:<input type='text' id='IR' value='" + mxrow + "'size='2' onChange='valRow(this.value);'/><td/></tr>";
    html += "<tr><td>Shuffle Speed:<input type='text' id='IS'value='" + spd + "' size='4' onChange='valSpd(this.value);'/>&nbsp; msec.<td/></tr>";
    html += "<tr><td>Space Key toggle  <input type='button' value='Shuffle' onclick='toggle();'/><td/></tr>";
    html += "<tr><td>Enter Key perform  <input type='button' value='Refresh' onclick='refresh();'/><td/></tr>";
    html += "<tr><td height='20'></td></tr>"
    html += "<tr><td align='center'><input type='button' value='^' onclick='mov(2);'/><td></tr>";
    html += "<tr><td align='center'><input type='button' value='<' onclick='mov(1);'/> <input type='button' value='>' onclick='mov(3);'/><td></tr>";
    html += "<tr><td align='center'><input type='button' value='V' onclick='mov(4);'/><td></tr>";
    html += "</table></td><td id='HERE'>";
    html += getHtml();
    html += "</td></tr></table>";
    return html;
}

function myimg()
{
    document.onkeypress=process_key;
    document.onkeydown=process_spk;
    document.write("<center><div id='HH'>");
    document.write(getAll());
    document.write("</div>");
}

function rmc(pr, tg)
{
    var x = pr.firstChild;
    while( x ) {
	var c = pr.removeChild(x);
	if (tg && c) {
		tg.appendChild(c);
	}
	x = pr.firstChild;
    }
}

function mov(i)
{
    var nxt = cur;
    switch(i) {
	case 1:		// L
	    if ((cur + 1) % col) 
		nxt = cur+1;
	break;
	case 2:		// U
	    if ((cur + col) < row*col)
		nxt = cur+col;
	break;
	case 3:		// R
	    if (cur) {
	    	if (((cur - 1) % col) != col-1)
		     nxt = cur-1;
	    }
	break;
	case 4:		// D
	    if ((cur - col) >= 0)
		nxt = cur-col;
	break;
    }
    if (cur != nxt) {
	var TC = document.getElementById("T" + cur);
	var TN = document.getElementById("T" + nxt);
	rmc(TN, TC);
	cur = nxt;
    }
}

function auto()
{
    var d = Math.floor(Math.random()*4) + 1;
    while( d == prv )
	d = Math.floor(Math.random()*4) + 1;
    mov( d );
    prv = (d + 2)%4;
    if (prv == 0) prv = 4;
    if (flg) setTimeout("auto()", spd);
}

function toggle()
{
    flg = !flg;
    if (flg) auto();
}

function refresh()
{
    flg = 0;
    var t = document.getElementById('HH');
    rmc(t, null);
    t.innerHTML = getAll();
}

function process_spk(event) {
//    if(window.event)
        process_key(event);
    return false;
}

function process_key(event) {
    if(window.event)
	event = window.event;
    switch( event.keyCode ) {
	case 37: //L
		mov( 1 );
	break;
	case 38: //U
		mov ( 2 );
	break;
	case 39: //R
		mov ( 3 );
	break;
	case 40: //D
		mov ( 4 );
	break;
    }
    if (event.which == 32) // SPC
    {
	toggle();
    }
    else if (event.which == 10 || event.which == 13) // ENT
    {
	refresh();
    }
    return false;
}
