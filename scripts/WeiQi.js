/*
 *  WeiQi Set Object
 *	Howard Xu
 *  Copyright 2012 Dec 30
 */

var mythis;

// Object constructor
function WeiQi() {
	this.fl = new GoGame(2);
	this.vid;
	this.trc = false;
	this.late = 1000;
      this.tm = null;
	mythis = this;
}
WeiQi.prototype.init = function()
{
   var str = '';
   for ( i=0; i<19; i++ ) {
      str += '<tr>';
      for( j=0; j<19; j++ ) 
	 str += '<td id="l' + i + '_' + j + '">  </td>';
      str += '</tr>';
   }
   document.getElementById('tb').innerHTML = str;
   this.fl.init();
   this.fl.setply(1)
   this.setc();
   document.onkeypress=this.process_key;
}
WeiQi.prototype.msg = function(s)
{
   var el = document.getElementById('msg');
   el.innerHTML = s;
}
WeiQi.prototype.setc = function()
{
   var itm = document.getElementById('sp'); 
   if (this.fl.C % 2)
      itm.className = 'w';
   else
      itm.className = 'b';
}
WeiQi.prototype.undo = function()
{
   if (this.fl.M > 0) this.fl.C = this.fl.M;
   if (this.fl.C > 0) {
      var a = this.fl.getplys(this.fl.C-1);
      var lid = 'l' + a[1] + '_' + a[0];
      document.getElementById(lid).className = ' ';
      var c = (this.fl.C % 2)? 'w': 'b';
      for (var i = 2; i < a.length; i+=2) {
	   lid = 'l' + a[i+1] + '_' + a[i];
         document.getElementById(lid).className = c;
      }
      this.fl.undo()
      if (this.fl.C > 0) {
	   a = this.fl.getplys(this.fl.C-1);
	   lid = 'l' + a[1] + '_' + a[0];
	   c = (this.fl.C % 2)? 'cb': 'cw';
         document.getElementById(lid).className = c;
      }
      this.setc();
   }
}
WeiQi.prototype.dorevw = function() {
   if (this.fl.M >= this.fl.C) {
      this.fl.M = 0;
      this.msg( 'Review is Done!' );
   }
   else {
      var s = this.fl.review();
      var a = this.fl.getplys(this.fl.M - 1);
      var lid = 'l' + a[1] + '_' + a[0];
      if (this.fl.M > 1) {
	    document.getElementById(this.vid).className = (this.fl.M%2)? 'w' : 'b';
      }
      document.getElementById(lid).className = (this.fl.M%2)? 'cb' : 'cw';
	this.vid = lid;
      for (var i = 2; i < a.length; i+=2) {
	   lid = 'l' + a[i+1] + '_' + a[i];
         document.getElementById(lid).className =''; 
      }
      this.msg( s );
      if (this.late)
      	this.tm = setTimeout( "mythis.dorevw()", this.late );
	else 
		this.msg("Type any key to play next");
   }
}
WeiQi.prototype.revw = function() {
   if (this.fl.C) {
      if (this.tm) clearTimeout(this.tm);
      this.fl.M = 0;
      this.fl.clean();
      var str = '';
      for ( i=0; i<19; i++ ) {
         str += '<tr>';
         for( j=0; j<19; j++ ) 
	       str += '<td id="l' + i + '_' + j + '">  </td>';
         str += '</tr>';
      }
      document.getElementById('tb').innerHTML = str;
      vid = '';
	var el = document.getElementById('sel');
	if (el.selectedIndex == 3) {
	    this.late = 0;
          el.focus();
      }
	else
	    this.late = el.selectedIndex*2000 + 1000;
      setTimeout( "mythis.dorevw()", 1000 );
   }
}
WeiQi.prototype.parse = function(ctx) {
     var t = {};
     var s = '';
     var i = 0;
     var j = 0;
     var l = ctx.length;
     var p = '';
     while (i < l && j >= 0) {
         var c = ctx.charAt(i);
         switch(c) {
            case ' ':
	    case '\r':
	    case '\n': break;
	    case ')':  j = -1; break; // end
            case '(': break; // begin
            case ';': break; // property
            case '[': 
	        var v = '';
                while(ctx.charAt(++i) != ']')
		    v += ctx.charAt(i);
                if (p == 'B' || p == 'W') {
		    s += p+':'+v +',';
	            if (++j == 10) {
			j = 0;
			s += '\n';
		    }
                }
                else if (s == '') {
		    t[p] = v ;
                }
                p = '';
		break; // value
	    default:
		p += c;
	        break;
         }
         i++;
     } 
     return  [t, s];
}
WeiQi.prototype.read = function(s)
{
    this.init();
    var l = s.length;
    var i = 0;
    while (i < l) {
	 if (s.charAt(i) == ':') {
	     var x = this.fl.A.indexOf(s.charAt(++i));
	     var y = this.fl.A.indexOf(s.charAt(++i));
	     this.moveto( x, y );
       }
       i++;
    }
}
WeiQi.prototype.ckfl = function(t)
{
    var p = '';
    if (t['FF'] == 4) {
        p = 'Date: ' + t['DT'] + ' ' + t['EV'] +'<br>';
        p += 'Black: ' + t['PB'] + ' ' + t['BR'] +'<br>';
        p += 'White: ' + t['PW'] + ' ' + t['WR'] + '<br>';
        p += 'Win: ' + t['RE'] + ' Komi: ' + t['KM'];
    }
    else p = "Bad format<br> Requirs SGF 4 format";
    return p;
}
WeiQi.prototype.load = function( event )
{
    var f = event.target.files[0]; 
    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	      var contents = e.target.result;
      	var ts = mythis.parse(contents);
          var t = ts[0];
          var s = ts[1];
            var p = mythis.ckfl(t);
            if (p) {
                if (mythis.trc) {
		    	   document.getElementById('trace').checked = false;
          		   document.getElementById('sp').style.display = 'none';
			   mythis.trc = false;
		    }
                mythis.msg(p);
		    mythis.read(s);
	      }
	}
      r.readAsText(f);
    } 
}

WeiQi.prototype.unset = function( c )
{
    var a = this.fl.getplys(this.fl.C-2);
    var lid = 'l' + a[1] + '_' + a[0];
    document.getElementById(lid).className = c;
    a = this.fl.getplys(this.fl.C-1);
    for (var i = 2; i < a.length; i+=2) {
	 lid = 'l' + a[i+1] + '_' + a[i];
       document.getElementById(lid).className =''; 
    }
}
WeiQi.prototype.moveto = function(x, y)
{
   if ( this.fl.setst(x, y) ) {
       var lid = 'l' + y + '_' + x;
       var itm = document.getElementById(lid);
       if (this.fl.C % 2) {
	    if (this.fl.C > 1) this.unset( 'w' );
          itm.className = 'cb';
       }
       else {
	    this.unset( 'b' );
          itm.className = 'cw';
       }
       this.setc();
    }
}
WeiQi.prototype.trac = function()
{
	this.trc = !this.trc;
}
WeiQi.prototype.process_mouse = function(event, l) {
   if (this.fl.M) return; 
   var docX= event.pageX;
   var docY= event.pageY;
   if (window.event) {
       event = window.event;
       // IE case
       var d= (document.documentElement && 
               document.documentElement.scrollLeft != null) ?
              document.documentElement : document.body;
       docX= event.clientX + d.scrollLeft;
       docY= event.clientY + d.scrollTop;
   }  
   
	 var x = Math.floor((docX - 54) / 31);
       var y = Math.floor((docY - 50) / 31);
       if (x >=0 && x < 19 && y >= 0 && y < 19) {
          if ( l == 0 )
	    	  this.moveto(x, y);
	    else if (this.trc){
       	  var sp = document.getElementById('sp');
       	  sp.style.display = 'block';
       	  sp.style.left = (docX - 10) + 'px';
       	  sp.style.top = (docY - 10) + 'px';
          	  this.msg("X: " + x + "  Y: " + y );
	    }
	 }
	 else if (this.trc) {
          var sp = document.getElementById('sp');
          sp.style.display = 'none';
          this.msg ("");
       }
   
}
WeiQi.prototype.process_key = function(event) {
   if (mythis.fl.M) mythis.dorevw();
}
