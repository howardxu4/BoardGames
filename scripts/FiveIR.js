/*
 *  Five in Row Object
 *     Howard Xu
 *  Copyright Dev 8, 2012
 */

// Object constructor
function FiveIR( N ) {
   if (N == undefined) N = 0;			// num
   this.N = N?(N==1? 13:19):9;
   this.init();
}
// init
FiveIR.prototype.init = function()
{
   this.R = {0:[], 1:[]};
   this.M = {0:[], 1:[]};
   this.G = [];					// game
   this.Z = {0:[], 1:[]};			// 0: white, 1: black
   var b = [];
   var i;
   for ( i = 0; i < this.N; i++ ) b.push( 0 );
   for ( i = 0; i < this.N; i++ ) {
      this.G.push(b.slice(0));
      this.Z[0].push(b.slice(0));
      this.Z[1].push(b.slice(0));
   }
   this.getAll();
}
// getR
FiveIR.prototype.getR = function()
{
    var s = '';
    for( var c = 0; c < 2; ++c) {
       this.recd(c);
       s += c + ":: "
       for( var i = 0; i < this.R[c].length; ++i) {
	    s += this.R[c][i].w + " XY: " ; 
	    for (var j = 0; j < this.R[c][i].xy.length; j++)
		s += this.R[c][i].xy[j][1] + "-" + this.R[c][i].xy[j][0] + ", ";
       }
       s += "<br>   ";
    }
    for( var c = 0; c < 2; ++c) {
 //      s += c + ":: "
       var mi = 0
       var mx = 0;
	 this.M[c] = [];
       for( var i = 0; i < this.R[c].length; ++i)
	    for (var j = 0; j < this.R[c][i].xy.length; j++) {
	    	var x = this.R[c][i].xy[j][1];
	    	var y = this.R[c][i].xy[j][0];
		var w = this.R[c][i].w + this.Z[c?0:1][y][x];
//	    	s += "w: " + w + " " + x + '-' + y + "," ;
		if (w > mi) {
			if (w > mx) {
				mx = w;
				this.M[c].unshift( { 'w':w, 'xy':[[ x, y ]] } );
			}
			else {
			   var l = this.M[c].length;
				var f = true;
				for (var k=0; k<l; k++) {
				    if (w >= this.M[c][k].w) {
					if (w > this.M[c][k].w )
					    this.M[c].splice( k, 0, { 'w': w, 'xy':[[x,y]]});
				    	else
					    this.M[c][k].xy.push([x,y]);
					f = false;
				    	break;
				    }
				}
			    if (f && l < 4) this.M[c].push( {'w':w,'xy':[[x,y]]});
			    if (l >= 5) mi = this.M[c].pop().w;	
			}
	
	        }
            }
            s += "<br>   ";
    }
    for (var c = 0; c < 2; c++) {
	s += c + ":: ";
	for (var i = 0; i < this.M[c].length; i++) {
	     s += this.M[c][i].w + " XY: ";
	     for (var j=0; j<this.M[c][i].xy.length; j++) 
		 s += this.M[c][i].xy[j][0] + "-" + this.M[c][i].xy[j][1] + ", ";
	}
    	s += "<br>";
    }
    return s;
}
// hint
FiveIR.prototype.hint = function(c)
{
	var t = c?0:1;
	if (this.M[c][0].w >= 10000) return this.M[c][0].xy[0];
	if (this.M[t][0].w >= 10000) return this.M[t][0].xy[0];
	if (this.M[c][0].w >= 8000) return this.M[c][0].xy[0];
	if (this.M[t][0].w >= 8000) return this.M[t][0].xy[0];
	if (this.M[c][0].w > this.M[t][0].w) return this.M[c][0].xy[0];
	return this.M[t][0].xy[0];
}
// recd
FiveIR.prototype.recd = function(c)
{
   var mx = 0;
   var mi = 0;
   this.R[c] = [];
   for (var i = 0; i < this.N; i++) {
      for (var j = 0; j < this.N; j++) {
          var w = this.Z[c][i][j];
          if (w > mi) {
	      if (w > mx) {
                  mx = w;
	          this.R[c].unshift( { 'w': w, 'xy':[[i, j]] } ); 
              }
              else {
                  var l = this.R[c].length;
	            for (var k = 0; k < l; k++ ) {
		          if ( w >= this.R[c][k].w) {
			        if ( w > this.R[c][k].w ) 
			  	      this.R[c].splice( k, 0, { 'w': w, 'xy':[[i, j]] } );
			        else  
			            this.R[c][k].xy.push([i, j]);
			        break;
                          }
		      }
                  if ( l >= 5 ) mi = this.R[c].pop().w; 
              }
          }
      }
   } 
}
// move
FiveIR.prototype.move = function(y,x,c)
{
   if (x == undefined || y == undefined) { x = (this.N-1)/2; y = x; }
   if (c == undefined) c = 1;
   x %= this.N;
   y %= this.N;
   this.G[x][y] = c?1:-1;
   this.getLoc(x,y);
}
// undo
FiveIR.prototype.undo = function(y,x)
{
   if (x == undefined || y == undefined) { x = (this.N-1)/2; y = x; }
   x %= this.N;
   y %= this.N;
   this.G[x][y] = 0;
   this.getAll();
}

// dump
FiveIR.prototype.dump = function(A)
{
   var s = '';
   for (var i = 0; i < this.N; i++) {
      for (var j = 0; j < this.N; j++){
	 s += A[i][j] + ' ';
       if (A[i][j] < 10) s+= ' &nbsp;  ';
       if (A[i][j] < 100) s+= ' &nbsp;  ';
      }
      s += '<br>'
   }
   return s;
}
// calculate
FiveIR.prototype.calc = function(n, j) {
   var r = 10000;
   switch(n & 31) {
      case 1: case 16:			// ----o, o-----
         r = 1;
         break;
      case 2: case 4: case 8:		// ---o-, --o--, -o---
         r = 3;
	   break;
      case 17: 				// o---o 
         r = 10;
         break;
      case 3: case 5: case 9:  		// ---oo, --o-o, -o--o
      case 18: case 20: case 24:	// o--o-, o-o--, oo---
         r = j==0?10:30;
         break;
      case 6: case 10: case 12:		// --oo-, -o-o-, -oo--
         r = 30;
         break; 
      case 19: case 21: case 25:	// o--oo, o-o-o, oo--o
         r = 100;
         break;
      case 7: case 11: case 13:		// --ooo, -o-oo, -oo-o
      case 22: case 26: case 28:	// o-oo-, oo-o-, ooo--
         r = j==0?100:300;
         break;
      case 14: 				// -ooo-
         r = 300;
         break;
      case 23: case 27: case 29: 	// o-ooo, oo-oo, ooo-o
         r = 1000;
         break;
      case 15: case 30:			// -oooo, oooo-
         r = j==0?1000:3000;
         break;
      case 31:				// ooooo
      default:
         break;
   }
   return r;
}
// evaluation
FiveIR.prototype.eval = function(l, i) {
   var w = 0;
   var n = 0;
   var g = 0;
   var t;
   if (l.length >= 5) {
      var j;
      for (j = 0; j < 4; j++) {
         n &= 15;
         n <<= 1;
         if (l[j] != 0) n += 1;	    
      }
      for (j = 0; j <= l.length-5; j++) { 
         n <<= 1;
         if (l[j+4] != 0) n += 1;   
         t = this.calc(n, (j==l.length-5)?0:j);
         if (t > g) g = t; 
         w += t;
      }
   }
//if (l.length == 17)
// alert(l + " i: " + i + " w: " + w + " l:" + l.length);
   return [w, g];
}
// count 
FiveIR.prototype.count = function(x,y,d,c) {
   if (this.G[x][y] != 0) return [0, 0];   
   var l = [];
   var i = 0;
   var j = 0;
   var t;
   l[0] = c?1:-1;
   switch (d) {
      case 0:		// Horizontal
         for (j = 1; j < 5; j++) {
	      if (x-j < 0) break;
            t = this.G[x-j][y];
            if ((c && t < 0) || (!c && t > 0)) break;
	      l.unshift(t); i++;  
         }
	   for (j = 1; j < 5; j++) { 
	      if (x+j >= this.N) break;
	      t = this.G[x+j][y];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.push(t);
         }
	break;
      case 1:		// Vertical
         for (j = 1; j < 5; j++) {
	      if (y-j < 0) break;
            t = this.G[x][y-j];
            if ((c && t < 0) || (!c && t > 0)) break;
	      l.unshift(t); i++;  	
         }
	   for (j = 1; j < 5; j++) { 
 	      if (y+j >= this.N) break;
	      t = this.G[x][y+j];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.push(t);        
         }
      break;
      case 2:		// Slash
         for (j = 1; j < 5; j++) {
	      if (x+j >= this.N || y-j < 0) break;
	      t = this.G[x+j][y-j];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.unshift(t); i++;         
         }
	   for (j = 1; j < 5; j++) { 
 	      if (x-j < 0 || y+j >= this.N) break;
	      t = this.G[x-j][y+j];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.push(t);         
         }
      break;
      case 3:		// BackSlash
         for (j = 1; j < 5; j++) {
 	      if (x-j <0 || y-j < 0) break;
	      t = this.G[x-j][y-j];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.unshift(t); i++;         
         }
	   for (j = 1; j < 5; j++) { 
 	      if (x+j >= this.N || y+j >= this.N) break;
	      t = this.G[x+j][y+j];
            if ((c && t < 0) || (!c && t > 0)) break;
            l.push(t);              
         }
      break;
   }
   return this.eval(l, i);  
}
// scope
FiveIR.prototype.scope = function(x,y,d,c) {
   var j = 0;
   switch (d) {
      case 0:		// Horizontal
         for (j = 1; j < 5; j++) {
	      if (x-j < 0) break;
	      this.Z[c][x-j][y] = this.getWeight(x-j,y,c);
         }
	   for (j = 1; j < 5; j++) { 
	      if (x+j >= this.N) break;
	      this.Z[c][x+j][y] = this.getWeight(x+j,y,c);
         }
	break;
      case 1:		// Vertical
         for (j = 1; j < 5; j++) {
	      if (y-j < 0) break;
 	      this.Z[c][x][y-j] = this.getWeight(x,y-j,c);
        }
	   for (j = 1; j < 5; j++) { 
 	      if (y+j >= this.N) break;
 	      this.Z[c][x][y+j] = this.getWeight(x,y+j,c);
        }
      break;
      case 2:		// Slash
         for (j = 1; j < 5; j++) {
	      if (x+j >= this.N || y-j < 0) break;
	      this.Z[c][x+j][y-j] = this.getWeight(x+j,y-j,c);
         }
	   for (j = 1; j < 5; j++) { 
 	      if (x-j < 0 || y+j >= this.N) break;
	      this.Z[c][x-j][y+j] = this.getWeight(x-j,y+j,c);
         }
      break;
      case 3:		// BackSlash
         for (j = 1; j < 5; j++) {
 	      if (x-j <0 || y-j < 0) break;
 	      this.Z[c][x-j][y-j] = this.getWeight(x-j,y-j,c);
         }
	   for (j = 1; j < 5; j++) { 
 	      if (x+j >= this.N || y+j >= this.N) break;
	      this.Z[c][x+j][y+j] = this.getWeight(x+j,y+j,c);
         }
      break;
   }
}
// get weight
FiveIR.prototype.getWeight = function(x,y,c) {
   var w = 0;
   var m = 0;
   var ws = [];
   for (var i = 0; i < 4; i++) {
      ws[i] = this.count(x,y,i,c);
      w += ws[i][0];
      m += (ws[i][1] > 50)? ws[i][1]:0;
   }
   if(m == 600 || m == 900) 
	w = 4000;
   else if (m > 1100 && m < 3000)
      w = 8000;
   if (w > 1000 || m >= 600) { 
//	alert( "C: " + c + " W: " + w + " M: " + m + "   X: " + y + " Y: " + x + "   " + ws);
   }
   return w;
}
// get All
FiveIR.prototype.getAll = function() {
   for (var c = 0; c < 2; c++) 
      for (var i = 0; i < this.N; i++)
         for (var j = 0; j < this.N; j++)
	      this.Z[c][i][j] = this.getWeight(i,j,c);
}
// get Local
FiveIR.prototype.getLoc = function(x,y) {
   for (var c = 0; c < 2; ++c) {
      for (var i = 0; i < 4; i++)
         this.scope(x,y,i,c);
      this.Z[c][x][y] = this.getWeight(x,y,c); 
   }  
}
