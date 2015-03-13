/*  
 *  Sudoku Object 
 *    Howard Xu
 *  Copyright Nov. 18, 2012
 */

var mythis;
// Object constructor
function Sudoku (num ) {
    if ( num == undefined ) num = 9;
    this.num = num;
    this.idx;			// current index
    this.obj;			// current object
    this.chk = [];		// checking
    this.prob = probs[0];	// from Sudoku.data
    this.resl = [];		// resoltion
    this.sdt;			// start time
    this.gen = new SudokuGen();
    mythis = this;		// global variable
}
// Initialization
Sudoku.prototype.init = function ()
{
    for (var i=0; i<this.prob.length; i++)
        this.resl[i] = this.prob[i]<0? -this.prob[i]: 0;
    document.getElementById('cont').innerHTML = this.getbd(0);
    document.getElementById('ctrl').innerHTML = this.getnum();
    this.timer = 0;		// timer
    this.spd = 0;		// spent
    document.getElementById('timer').innerHTML= this.gettm(0);
    this.msg ("Welcome to Sudoku");
}
// Message
Sudoku.prototype.msg = function( s ) 
{
    document.getElementById('msg').innerHTML = s;
}
// Get Format Time
Sudoku.prototype.gettm = function(tm)
{
    var h = Math.floor(tm/3600);
    var m = Math.floor((tm%3600)/60);
    var s = Math.floor(tm%60);
    if (h < 10) h = '0' + h;
    if (m < 10) m = '0' + m;
    if (s < 10) s = '0' + s;
    return  h + ':' + m + ':' + s;
}
// Time Callback
Sudoku.prototype.time = function()
{
    if (this.timer) {
        var dif = this.spd + (new Date() - this.sdt)/1000;
        document.getElementById('timer').innerHTML= this.gettm(dif);
        setTimeout("mythis.time()", 1000);
    }
}
// Toggle
Sudoku.prototype.toggle = function( o, f ) 
{
    if (f) {
	o.style.opacity=1;
        o.style.filter='alpha(opacity=100)';
    }  
    else {
     	o.style.opacity=0.5; 
        o.style.filter='alpha(opacity=50)';
    }
}
// Check A Line (row | col)
Sudoku.prototype.chkline = function( s, l )
{
    var rtn = 0;
    var b = [ 0,0,0,0,0,0,0,0,0,0 ];
    for (var j = 0; j < this.num; j++ ) {
	var n = s + j*l;
	var k = this.resl[n];
        if (k) {
            if (k < 0) k = -k;
            if (b[k] != 0) {
		 if( this.prob[n] < 0 ) n = b[k]-1;
		 this.chk.push(n);
	    }
            b[k] = n+1;
        }
        else rtn = 1;
    }    
    return rtn;
}
// Check All
Sudoku.prototype.check = function ()
{
    var rtn = 0;
    this.chk = [];
    for (var i = 0; i < this.num; i++) {
        rtn += this.chkline( i*this.num, 1 );
	  rtn += this.chkline( i, this.num );
    }
    if (this.chk.length == 0) {
        if (rtn == 0) { 
            if (this.timer) this.pause();
	      alert("You are done! ");
	      this.msg ("Congratulation! Total time spent " + this.gettm(this.spd));
        }
        else 
            this.msg ("All right, keep doing " );
    } else {
        this.msg ( 'There has confliction!  ' + this.chk ); 
        var tbl = document.getElementById('board');
        var cells = tbl.getElementsByTagName('td');
	  cells[this.chk[0]].style.color='red';
    }
}
// Check Object
Sudoku.prototype.chkobj = function()
{
    this.chk = [];
    var col = this.idx % this.num; 
    var rtn = 1;
    this.chkline( this.idx - col, 1 );
    this.chkline( col, this.num );
    if (this.chk.length > 0) { 
        this.obj.style.color='red';
	  this.msg( 'This is conflicted!' );
        rtn = 0; 
    }
    else { this.obj.style.color='blue'; }
    return rtn;
}
// Select Number
Sudoku.prototype.selnum = function( o, i )
{
    if (this.obj) { this.toggle(this.obj, 1); }
    this.idx = i;
    this.obj = o;
    this.toggle(this.obj, 0);
    i = i % this.num;
    this.msg("Working on row:" + (this.idx-i)/this.num + " col:" + i + " now.");
}
// Get Board
Sudoku.prototype.getbd = function( f )
{
   var sz = this.num*50;
   var s = "<table id='board' width='" + sz + "' height='" + sz + "' >";
   for( var i=0; i< this.num; i++ ) {
      s += "<tr>";
      for( var j = 0; j < this.num; j++ ) {
         var v = this.prob[i*this.num + j];
         if (v < 0) {
	       s += "<td class='bdf' ";
               v = '<center><B>' + (-v);
         }
         else {
	       if (f == 0) v = this.resl[i*this.num + j];
	       s += "<td class='bd' onclick='mythis.selnum(this, " + (i*this.num + j) + ");' ";
	       if ( v == 0 ) v = '&nbsp;';
	       else v = '<center><B>' + v;
         }
	 if ((j % 4) && (i % 4))
	      s += " bgcolor='#CACAC8'>" + v + " </td>";
	 else
	      s += " bgcolor='#D7D7CE'>" + v + " </td>";
      }
      s += "</tr>";
   }
   s += "</table>";
   return s;
}
// Take Number
Sudoku.prototype.takenum = function(i)
{
    if (this.obj) {
        if (this.timer == 0) this.pause();
        this.obj.innerHTML = "<center><B>" + (i? i : '&nbsp;');
        this.resl[this.idx] = i;
        if (this.chkobj()) this.check();
    }
    else this.msg ("Select working cell first.");
}
// Get Number
Sudoku.prototype.getnum = function()
{
    var s = "<table width='50' height='450'>"
    for( var i = 0; i < 10; i++) {
	  s += "<tr><td class='nm' bgcolor='#99C2FF' onclick='mythis.takenum(" + i + ");' ";
          s += "onmouseover='mythis.toggle(this, 0);' onmouseout='mythis.toggle(this, 1);' >";
	  if (i) s += "<center><B>" + i + "</td></tr>";
	  else s += "&nbsp;</td></tr>";
    }
    s += "</table>";
    return s;
}
// Reload 
Sudoku.prototype.reload = function(i)
{
    if (i < 3)    
	  this.prob = probs[i];
    else
        this.prob = this.gen.getGame(i-3);
    this.init();
}
// Refresh
Sudoku.prototype.refresh = function()
{
    document.getElementById('cont').innerHTML = this.getbd(0);
    this.check();
}
// Hint
Sudoku.prototype.hint = function()
{
    var n = Math.floor( Math.random()*81);
    var i = n;
    if ( this.resl[i] != 0 ) {
         do {  
	     i = (i+1) % 81;
             if (i == n) return;
         } while(this.resl[i] != 0);
    }
    this.resl[i] = this.prob[i];
    var tbl = document.getElementById('board');
    var cells = tbl.getElementsByTagName('td');
    cells[i].innerHTML = '<center><B>' + this.resl[i];
}
// Resolve
Sudoku.prototype.resolve = function()
{
    document.getElementById('cont').innerHTML = this.getbd(1);
}
// Pause
Sudoku.prototype.pause = function()
{
   if (this.timer)  {
       this.timer = 0;
       this.spd += (new Date() - this.sdt) / 1000;
   }
   else  { 
       this.timer = 1; 
       this.sdt = new Date();
       this.time(); 
   }
}
