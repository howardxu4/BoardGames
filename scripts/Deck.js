/*	
 *	Deck Playing Cards Object
 *	    Howard Xu
 *	Copyright 2012
 */

// Object constructor
function Deck() {
    this.deck = new Array();
    // order of suit: HART, SPADE, DIAMOND, CLUB
    for (var i=0; i<52; i++)
        this.deck[i] = i;
    // configure the cards image and size
    this.conf( 'images/poker.png', 158, 113 );
    this.cnfb( 'images/bcard1.png', 4, 120, 2 );
}
// configure the cards
Deck.prototype.conf = function(image, height, width)
{
    this.img = image;
    this.h = height;
    this.w = width;
}
// configure the card back
Deck.prototype.cnfb = function(image, offx, offxn,  offy)
{
    this.bimg = image;
    this.x = offx;
    this.xn = offxn;
    this.y = offy;
}
// shuffle -- Donald Knuth Algorithm
Deck.prototype.shuffle = function()
{
    var i,j,k;
    for(i=51; i>0; i--) {
	j = Math.floor(Math.random()*i);
	k = this.deck[i];
	this.deck[i] = this.deck[j];
	this.deck[j] = k;
    }
    this.seq = 0;	
    this.hand = [ [],[],[],[] ];
}
// get a card object string by number and suit
Deck.prototype.getcard = function(num, suit)
{
    var card = '<div style="height:' + this.h + 'px; width:' + this.w + "px; background:url('" + this.img + "') -" + (num*this.w) + 'px -' + (suit*this.h) + 'px;"></div>';
return card;
}
// take a card object from deck by seq
Deck.prototype.takecard = function(n)
{
    return (this.getcard(this.deck[n]%13,Math.floor(this.deck[n]/13)));
}
// get a back card object string by option
Deck.prototype.getback = function(n)
{
    var bcard = '<div style="height:' + this.h + 'px; width:' + this.w + "px; background:url('" + this.bimg +"') -";
    if (n) bcard += this.xn;
    else bcard += this.x;
    bcard += "px -" + this.y + 'px;" ></div>';  
    return bcard;
}
// get an empty card
Deck.prototype.getempty = function()
{
    return '<div style="height:' + this.h + 'px; width:' + this.w + 'px; "></div>';
}
// get suit of the card value
Deck.prototype.getsuit = function(v)
{
    return (Math.floor(v / 13));
}
// get num of the card value
Deck.prototype.getnum = function(v)
{
    return (v % 13);
}
// get a card value from seq
Deck.prototype.getvalue = function(n)
{
    return (this.deck[n]);
}
// draw a card from deck to hand k
Deck.prototype.drawcard = function(k)
{
    if (this.seq<52) {
	this.hand[k].push(this.seq);
	this.seq++;
    } 
    return this.seq;
}
// withdraw the last card from hand k
Deck.prototype.withdraw = function(k)
{
    this.hand[k].pop();
    return this.hand[k].length;
}
// add a card to hand k by seq
Deck.prototype.cardin = function(k, n)
{
    this.hand[k].push(n);
}
// take out the card from hand k by value
Deck.prototype.cardout = function(k, v)
{
    var n = this.hand[k].length-1;
    while (n > 0) {
	if ( v == this.deck[ this.hand[k][n] ] )
	    break;
	n--;
    }
    if (n >= 0)
        this.hand[k].splice(n, 1);
}
// get the full cards of hand k
Deck.prototype.gethand = function(k)
{
    return this.hand[k].slice(0);
}
