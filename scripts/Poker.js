/*
 *	Poker Deck Object
 *	   Howard Xu
 *	Copyright 2012
 */

// Object constructor
function Poker() {
   this.deck = new Array();
   this.cbk = 1; // Math.random() > 0.5;
   for (var i=0; i<52; i++)
	this.deck[i] = i;
   // order of suit: HART, SPADE, DIAMOND, CLUB
}
// shuffle -- Donald Knuth
Poker.prototype.shuffle = function()
{
    var i, j, k;
    for(i=51; i>0; i--) {
	j = Math.floor(Math.random()*i);
	k = this.deck[i];
	this.deck[i] = this.deck[j];
	this.deck[j] = k;
    }
}
// get a card object string by number and suit
Poker.prototype.getcard = function(num, suit)
{
    var card = '<div style="height:104px;width:74px;background:url(' + "'images/scards.png') -" + (num*73) + 'px -' + (suit*102) + 'px;"></div>';
    return card;
}
// get a card object string by index of deck
Poker.prototype.takecard = function(k)
{
     k %= 52;
     return (this.getcard(this.deck[k]%13,Math.floor(this.deck[k]/13)));
}
// get a back card object string
Poker.prototype.getback = function(n)
{
    var back = '<div style="width:72px; height:108px; background:url(' + "'images/bcard.png') -"; 
    n = n? 72: 1;
    back += n;
    back += 'px 1px;"></div>';
    return back;
}
// compare two index in deck wether is pair
Poker.prototype.ispair = function(i, j)
{
    return ((this.deck[i % 52] % 13) == (this.deck[j % 52] % 13));
}

