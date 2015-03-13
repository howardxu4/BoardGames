/*
 *  Go Game Object
 *     Howard Xu
 *  Copyright Nov. 4, 2012
 */

// Object constructor
function GoGame( N ) {
   if (N == undefined) N = 0;			// num
   this.N = N?(N==1? 13:19):9;
   this.init();
   this.A = 'abcdefghijklmnopqrstuvwxyz';	// index
   this.XY =[];
}
// clean game
GoGame.prototype.clean = function() {
   var b = [];
   var i;
   for ( i = 0; i < this.N; i++ ) b.push( 0 );
   this.G = [];					// game
   for ( i = 0; i < this.N; i++ ) this.G.push(b.slice(0));
}
// initialize
GoGame.prototype.init = function() {
   this.clean();
   this.C = 0;					// cnt
   this.U = [];					// recd
   this.M = 0;					// mode
   this.P = 0;					// type
}
// detect line
GoGame.prototype.line5 = function(x, y, i, j) {
   var cnt = 1;
   var c = this.G[x][y];
   var xi = x - i;
   var yj = y - j;
   while( xi >= 0 && yj >= 0 && xi < this.N && yj < this.N) 
      if (this.G[xi][yj] == c) {
         cnt++;
         xi -= i;
         yj -= j
      }
      else break;
   xi = x + i;
   yj = y + j;
   while( xi >= 0 && yj >= 0 && xi < this.N && yj < this.N) 
      if (this.G[xi][yj] == c) {
         cnt++;
         xi += i;
         yj += j;
      }
      else break;
   return cnt==5;
}
// push XY 
GoGame.prototype.pushxy = function(x, y){
   this.G[x][y] = 3;
   this.X.push(x);
   this.Y.push(y);
}
// lookup
GoGame.prototype.lkup = function(x, y, c) {
   var g = this.G[x][y];
   if (g == c) this.pushxy(x, y);
   return  g==0; 
}
// is dead
GoGame.prototype.isdead = function(x, y, c) {
   this.X = [];
   this.Y = [];
   this.pushxy(x,y);
   var cnt = 0;
   while( cnt < this.X.length ) {
      var i = this.X[cnt];
      var j = this.Y[cnt];
      if (i-1 >= 0) 
         if (this.lkup(i-1, j, c)) break;
      if (i+1 < this.N)
	 if (this.lkup(i+1, j, c)) break;
      if (j-1 >= 0)
         if (this.lkup(i, j-1, c)) break;
      if (j+1 < this.N)
         if (this.lkup(i, j+1, c)) break;
      cnt++; 
   }
   var rtn = cnt==this.X.length? cnt: 0;
   for( cnt=0; cnt<this.X.length; cnt++)
      this.G[this.X[cnt]][this.Y[cnt]] = c;
   return rtn;
}
// is eating
GoGame.prototype.iseating = function(x, y, c){
   var g = this.G[x][y];
   var n = 0;
   if (g > 0 && g != c)
      n = this.isdead(x, y, g) 
   return n;
} 
// check eating
GoGame.prototype.chkeating = function(x, y, c) {
   this.G[x][y] = c;
   var n = 0;    
   if (n == 0 && x-1 >= 0) n += this.iseating(x-1, y, c); 
   if (n == 0 && x+1 < this.N) n += this.iseating(x+1, y, c);
   if (n == 0 && y-1 >= 0) n += this.iseating(x, y-1, c); 
   if (n == 0 && y+1 < this.N) n+= this.iseating(x, y+1, c);
   this.G[x][y] = 0;
   return n;
}
// pre check
GoGame.prototype.check = function(x, y){
   if (this.P) {
      if (this.G[x][y] == 0) {
         var c = (this.C % 2) + 1;
         var n = this.isdead(x, y, c);
	 this.G[x][y] = 0;	
         if (n) {
	    if (n == 1) {
            // check U is single same eaten ? 
	       var s = this.U[this.C-1];
	       n = s.indexOf(',');
	       if (n != -1) {
		  var t = this.A[x] + this.A[y];
	          if (s.substr(n+1) == t){
	              alert("Invalid move!");
		      return false;
    	          }
	       }
            }
	    if (this.chkeating(x, y, c) == 0)
               return false;
         }
      }
   }
   return (this.G[x][y] == 0);
}
// is eaten
GoGame.prototype.iseaten = function(x, y, c){
   var g = this.G[x][y];
   if (g > 0 && g != c) {
      if ( this.isdead(x, y, g) ) {
      // take off be eaten on G and append to U
         var s='';
	 for (var i=0; i<this.X.length; i++){
	    this.G[this.X[i]][this.Y[i]] = 0;
            s += ',' + this.A[this.X[i]]  + this.A[this.Y[i]];
         }
         this.U[this.C] += s;
      }
   }
}
// after verify
GoGame.prototype.varify = function(x, y) {
   if (this.P) {
      var c = this.G[x][y];
      if (x-1 >= 0) this.iseaten(x-1, y, c); 
      if (x+1 < this.N) this.iseaten(x+1, y, c);
      if (y-1 >= 0) this.iseaten(x, y-1, c); 
      if (y+1 < this.N) this.iseaten(x, y+1, c);
   }
   else {
      if (this.line5(x, y, 1, 0) || this.line5(x, y, 0, 1) ||
         this.line5(x, y, 1, 1) || this.line5(x, y, 1, -1) ) { 
         var s = this.G[x][y]==1? "Black":"White";
	 alert( s + " Won!" );
      }
   }
}
// set stone
GoGame.prototype.setst = function(x, y) {
   if (x >= 0 && y >= 0 && x < this.N && y < this.N) {
      if (this.check( x, y )) {
         this.G[x][y] = (this.C % 2) + 1;
         this.U[this.C] = this.A[x] + this.A[y];
	 this.varify(x, y);
	 return ++this.C;
      }
   }
   return 0;
}
// set board
GoGame.prototype.setbd = function(z) {
   if ( z < 100 ) z = 100;
   this.Z = z;					// size
}
// set type
GoGame.prototype.setply = function(p) {
   this.P = p;					// type
}
// get definition
GoGame.prototype.getdf = function() {
   var s = '<defs>';
   s += '<radialGradient id="wst" cx="40%" cy="40%" r="45%" fx="40%" fy="40%">';
   s += '<stop offset="0%" style="stop-color:rgb(150,150,150);stop-opacity:0.99" />';
   s += '<stop offset="100%" style="stop-color:rgb(255,255,255);stop-opacity:1" />';
   s += '</radialGradient>';
   s += '<radialGradient id="bst" cx="40%" cy="40%" r="45%" fx="40%" fy="40%">';
   s += '<stop offset="0%" style="stop-color:rgb(100,100,100);stop-opacity:0.99" />';
   s += '<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />';
   s += '</radialGradient>';
   s += ' </defs>';
   return s;
}
// get stone
GoGame.prototype.getst = function(x, y, bw) {
   var grad = bw? "wst" : "bst";
   var cx = this.O + (this.T * x);
   var cy = this.O + (this.T * y);
   return '<circle cx="' + cx + '" cy="' + cy + '" r="' + this.R + '" fill="url(#' + grad + ')" />';
}
// get point
GoGame.prototype.getpt = function(cx, cy) {
   return '<circle cx="' + cx + '" cy="' + cy + '" r="3" stroke="black"  />';
}
// get line
GoGame.prototype.getln = function(x1, y1, x2, y2) {
   return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
	'" style="stroke:#111111;stroke-width:2;" />';
}
// get points
GoGame.prototype.getpts = function() {
   var s = '';
   var ht = this.O + this.T * Math.floor(this.N/2);
   s += this.getpt(ht, ht);
   if ( this.N > 9 ) {
      var ct = this.O + this.T * 3;
      var lt = this.O + this.L - this.T * 3;
      s += this.getpt(ct, ct);
      s += this.getpt(ct, lt);
      s += this.getpt(lt, ct);
      s += this.getpt(lt, lt);
      if ( this.N > 13 ) {
	  s += this.getpt(ct, ht);
	  s += this.getpt(ht, ct);
	  s += this.getpt(lt, ht);
	  s += this.getpt(ht, lt);
      }
   }
   return s;
}
// get board
GoGame.prototype.getbd = function() {
   var s = '';
   var z = this.Z - 50;
   s += '<rect x="10" y="10" width="' + z + '" height="' + z + '" ';
   s += 'style="fill:#FFCC66;stroke:green;stroke-width:5;fill-rule:evenodd;"/>';
   this.T = Math.floor(z/(this.N));		// step
   this.L = this.T*(this.N-1);			// width
   this.O = 10 + Math.floor((z-this.L)/2);	// orig
   this.R = Math.floor(this.T/2);		// radius
   var it = this.O;
   for (var i = 0; i < this.N; i++) {
      s += this.getln(it, this.O, it, this.O+this.L);
      s += this.getln(this.O, it, this.O+this.L, it);   
      it += this.T;
   }
   if (this.Z > 300) s += this.getpts();
   return s;
}
// get moves
GoGame.prototype.getmv = function() {
   var s = '';
   for( var i = 0; i < this.N; i++ )
      for (var j = 0; j < this.N; j++ )
	  if (this.G[i][j]) {
	      s += this.getst(i, j, this.G[i][j]==2);
          }
   return s;
}
// get game
GoGame.prototype.getgm = function() {
   var s = this.getdf();
   s += this.getmv();
   return s;
}
// display
GoGame.prototype.disp = function() {
   var s = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="';
   s += this.Z + '" width="' + this.Z + '">';
   s += this.getbd();
   s += this.getgm();
   s += '</svg>'
   return s;
}
// undo
GoGame.prototype.undo = function() {
   if (this.C > 0) {
      var id = this.U[this.C-1];
      var x = this.A.indexOf(id[0]);
      var y = this.A.indexOf(id[1]);
      this.G[x][y] = 0;
      this.XY[0] = x; this.XY[1] = y;
      var n = id.indexOf(',');
      var c = (this.C % 2) + 1;
      while( n != -1) {
	  id = id.substr(n+1);
          x = this.A.indexOf(id[0]);
          y = this.A.indexOf(id[1]);
	  this.G[x][y] = c;
	  n = id.indexOf(',');
      }
      return this.C--;
   }
   return 0;
}
// review
GoGame.prototype.review = function() {
   var id = '';
   if (this.M < this.C) {
      id = this.U[this.M];
      var x = this.A.indexOf(id[0]);
      var y = this.A.indexOf(id[1]);
      this.G[x][y] = (this.M%2) + 1;
      this.M++;
      this.varify(x,y);
      id = x + '_' + y + '  ' + id;
   }
   return id;
}
// get cursor
GoGame.prototype.getcsr = function() {
   var n = this.M? this.M:this.C; 
   var grad = (n%2)? "wst" : "bst";
   var s = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="' + this.T + '" width="' + this.T + '" >';
   s += '<circle cx="' + this.R + '" cy="' + this.R + '" r="' + this.R + '" fill="url(#' + grad + ')" stroke=black />';
   s += "</svg>";
   return s;
}
// get plays
GoGame.prototype.getplys = function(i)
{
   var a = [];
   var id = this.U[i];
   var x = this.A.indexOf(id[0]);
   var y = this.A.indexOf(id[1]);
   a.push(x);
   a.push(y);
   var n = id.indexOf(',');
   while( n != -1) {
	id = id.substr(n+1);
      x = this.A.indexOf(id[0]);
      y = this.A.indexOf(id[1]);
	a.push(x);
      a.push(y);
	n = id.indexOf(',');
   }
   return a;
}
