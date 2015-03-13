
var fnm = new Array("mypic.html", "Puzzle",
		    "mytet.html", "Tetris",
		    "myimg.html", "puzzzz...",
		    "myluk.html", "Forturn",
		    "myxqi.html", "C-chess",
		    "mychs.html", "chess",
		    "myrubix.html", "Rubix",
		    "mycmp.html", "Card_pair",
		    "mybrn.html", "more_pair",
            "myfgo.html", "Go - 5inline",
		    "mysdk.html", "Sudoku",
		    "mygo.html",  "WeiQi",
		    "myalt.html", "Animations" );

function redisp(i)
{
	var fr = document.getElementById('WD');
	fr.src = fnm[i];
}
function setlink()
{
	for( i= 0; i < fnm.length; i+=2) {
	var line = "<a href='#' onclick='redisp(" + i +");' >" + fnm[i+1] + "</a><br/>";
	document.write(line);
	}
}	
