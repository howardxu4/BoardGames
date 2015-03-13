/*  
 *  Sudoku Generator Object 
 *    Howard Xu
 *  Copyright Nov. 22, 2012
 */
// Object constructor
function SudokuGen(r, c)
{
    if (r == undefined) { r = 3; c = 3 }
    else if (c == undefined) c = r;
    this.nr = r;
    this.nc = c;
    this.N = r*c;
    this.NT = this.N * this.N;
    this.C = this.getArray(this.NT);
}
// Array Initialization
SudokuGen.prototype.getArray = function(n, m)
{
    var b = [];
    var i;
    for ( i = 0; i < n; i++ ) b.push( 0 );
    if (m == undefined) return b;
    a = [];					
    for ( i = 0; i < m; i++ ) a.push(b.slice(0));
    return a;
}
// Copy Array
SudokuGen.prototype.copy = function(d, e)
{
    var f = (d.length == this.N) ? ((e.length == this.N)? 0: 1):((e.length == this.N)? 2: 3);
    var k = 0;
    for (var i=0; i<this.N; i++)
        for (var j=0; j<this.N; j++) {
	      if ( f == 0 ) 
                d[i][j] = e[i][j];
	      else {
                if ( f == 1 )
                    d[i][j] = e[k];
		    else if ( f == 2 )
		        d[k] = e[i][j];
                else
                    d[k] = e[k] 
		    k++;	
            }
        }
}
// Check Row
SudokuGen.prototype.checkRow = function(d, n, i)
{
    for (var j=0; j<this.N; j++)
	if (n == d[i][j]) return 1;
    return 0
}
// Check Col
SudokuGen.prototype.checkCol = function(d, n, j)
{
    for (var i=0; i<this.N; i++)
	if (n == d[i][j]) return 1;
    return 0
}
// Assign
SudokuGen.prototype.assign = function(d, n, i, j)
{
    var ret = d[i][j];
    if (ret == 0) {
        if (this.checkCol(d, n, j) == 0 && this.checkRow(d, n, i) == 0)
            d[i][j] = n;
        else {
            ret = 1;
            if (this.h++ > 20) ret = 0;
        }
    }
    return ret;
}
// Clean
SudokuGen.prototype.clean = function(d, n, m, e, x, y)
{
    if (x == undefined) { x = 0; y = 0; }
    for (var k = 0; k < this.N; k++) {
        var i = Math.floor(k/this.nr) + n*this.nc + x;
        var j = k%this.nr + m*this.nr + y;
        d[i][j] = e[i][j];
    }
}
// Block
SudokuGen.prototype.block = function(d, n, m, e, x, y)
{
    if (x == undefined) { x = 0; y = 0; }
    var k = Math.floor(Math.random()*this.N);
    var i = Math.floor(k/this.nr) + n*this.nc;
    var j = k%this.nr + m*this.nr;
    var t = 0;
    this.h = 0;
    this.clean(d, n, m, e, x, y);
    do {
        for (var v = 1; v <= this.N; v++) {
	      while (this.assign(d, v, i+x, j+y) != 0) {
		    k = Math.floor(Math.random()*this.N);
                i = Math.floor(k/this.nr) + n*this.nc;
                j = k%this.nr + m*this.nr;
		}
        }
        if (this.h > 10) {
            this.h = 0;
            this.clean(d, n, m, e, x, y);
            t++;
            if (t > 10) break;
        }
        else {
            t = 0;
            break;
        }
    } while(true);
    return t;
}
// Go On Process
SudokuGen.prototype.goon = function (d, e)
{
    var l = 0;
    var o = 0;
    this.R = this.getArray(this.N);
    while (l < this.N) {
        var n = Math.floor(l/this.nc);
        var m = l%this.nc;
        this.R[l]++;
        if (this.block(d, n, m, e) > 0) {
            if (l > 0) {
                this.R[l] = 0;
                l--;
                if (this.R[l] > this.NT) {
                    this.R[l] = 0;
                    if (l > 0) l--;
                }
            }
        }
        else l++;
        if (o++ > 20000) {
            if (confirm("It's realy hard! continue? ") == 0) break;
            else o = 0;
        }
    }
}
// Vclean
SudokuGen.prototype.vclean = function(d, n, m, e, x, y)
{
    for (var k = 0; k < this.nr; k++) {
        var i = n + k*x;
	  for (var l = 0; l < this.nc; l++) {
        	var j = m + l*y;
        	d[i][j] = e[i][j];
        }
    }
}
// Vblock
SudokuGen.prototype.vblock = function(d, l, e)
{
    var n, m, x, y;
    switch(l) {
	  case 4:
		n = 0; m = 1; x = 4; y = 1;
        break;
	  case 7:
		n = 0; m = 5; x = 4; y = 1;
        break;
	  case 5:
		n = 1; m = 0; x = 1; y = 4;
        break;
	  case 8:
		n = 5; m = 0; x = 1; y = 4;
        break;
	  case 6:
		n = 0; m = 0; x = 4; y = 4;
        break;
    }
    var t = 0;
    this.h = 0;
    this.vclean(d, n, m, e, x, y);
    do {
        for (var k = 0; k < this.nr; k++) {
            var i = n + k*x;
	      for (l = 0; l < this.nc; l++) {
        	    var j = m + l*y;
                var v = Math.floor(Math.random()*this.N) + 1;
	          while (this.assign(d, v, i, j) != 0) {
		        v = Math.floor(Math.random()*this.N) + 1;
                }
		}
        }
        if (this.h > 10) {
            this.h = 0;
            this.vclean(d, n, m, e, x, y);
            t++;
            if (t > 10) break;
        }
        else {
            t = 0;
            break;
        }
    } while(true);
    return t;  
}
// Go Of Process
SudokuGen.prototype.goof = function (d, e)
{
    var l = 0;
    var o = 0;
    var t = 0;
    this.R = this.getArray(4);
    while (l < this.N-2) {
        this.R[l]++;
        if (l < 4) {
            var n = Math.floor(l/2);
            var m = l%2;
            var y = l%2 ? 2:1;
            var x = l<2 ? 1:2;
            t = this.block(d, n, m, e, x, y);
        }
        else {          
            t = this.vblock(d, l, e);
        }
        if (t > 0) {
            if (l > 0) {
                this.R[l] = 0;
                l--;
                if (this.R[l] > this.NT) {
                    this.R[l] = 0;
                    if (l > 0) l--;
                }
            }
        }
        else l++;
        if (o++ > 30000) {
            if (confirm("It's realy hard! continue? ") == 0) break;
            else o = 0;
        }
    }
}
// Setup
SudokuGen.prototype.setup = function(n)
{
    this.a = this.getArray(this.N, this.N);
    this.b = this.getArray(this.N, this.N);
    if (n == 0)this.goon(this.a, this.b);
    else this.goof(this.a, this.b);
}
// Take
SudokuGen.prototype.take = function(n)
{
    if ( n == undefined ) 
        n = Math.floor(Math.random() * this.NT/2) + Math.floor(Math.random() * this.NT/3);
    var m = 0;
    this.copy(this.C, this.a);
    var l = 0;
    while (l < 15) {
        while( m++ < n || l < 15) {
            var k = Math.floor(Math.random()*this.NT);
            this.C[k] *= -1;
            if (this.C[k] < 0) l++; else l--;
            if (l > 25) break;
        }
    }
}
// Get Game
SudokuGen.prototype.getGame = function(n)
{ 
    this.setup(n);
    if (n == 0) this.take();
    else {
	  this.copy(this.C, this.a);
        for (var k = 0; k < this.NT; k++)
		this.C[k] *= -1;
    }
    return this.C;
}
