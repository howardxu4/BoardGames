/*
 *  Poker Game - memory pair
 *	Howard Xu
 *  Copyright Jul. 2012
 */

var cmp=new Array();
var cur = 0;
var mythis = new Poker();
var cbk = mythis.cbk;
var cnt = 0;
var st = 0;
var sdt;
var clk = 0;

function process()
{
     if (cur == 2) {
	n = mythis.ispair( cmp[2], cmp[3]) ; 
        if (n) cnt++;
	n = n? !cbk: cbk;
	cmp[0].innerHTML = mythis.getback(n);
	cmp[1].innerHTML = mythis.getback(n);
	clk++;
	cur = 0;
	if (cnt == 26) {
	     st = 2;		
	     var cdt = new Date();
	     var dif = (cdt - sdt)/1000;
	     alert("     Congratulation!  \n(" + sdt.toLocaleTimeString() + " -- " + cdt.toLocaleTimeString() + ")\n You clicked " + clk*2 + " times\n spent total " + dif + " seconds \n     Try again" );
	     location.reload(true);
	}
     }
}

function doCheck(el, n)
{
    var t = el.innerHTML;
    if (cur < 2) {
	if (st == 0) {
		st = 1;
		sdt = new Date();
		changeTime();
	}
	if (t.search('bcard') > 0) {
	      p = (t.search('-72') > 0)? 1: 0;
	      if (cbk == p) {
	      cmp[cur] = el;
	      cmp[cur+2] = n;
	      cur++;
	      el.innerHTML = mythis.takecard(n);
	      if (cur == 2) 
		   setTimeout("process()", 1000);
	      }
	}
	else {
	      cur--;
	      el.innerHTML = mythis.getback(cbk);
        }
    }
}
function changeTime()
{
    var el = document.getElementById('tm');
    el.innerHTML = new Date().toLocaleTimeString();
    if (st == 1)
    setTimeout("changeTime()", 1000);
}
function mycmp()
{
    mythis.shuffle();
    document.write("<table>");
    for(j = 0, k=0; j < 4; j++) {
	document.write("<tr height='108'>");
    	for(i = 0; i < 13; i++) {
		document.write("<td width='74' onclick=doCheck(this," + k + ")>");
		document.write(mythis.getback(cbk));
		document.write("</td>");
		k++;
	}
	document.write("</tr>");
    }
    document.write("</table>");
    document.write("<p><b>Instruction: </b>Click two cards each time and try to find a matching pair. Test your brain memory and try to finish all cards in the least time.<b><div id='tm'></div></b></p>");
}
