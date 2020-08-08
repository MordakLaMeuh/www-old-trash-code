<!DOCTYPE HTML>
<html lang="fr">

<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
   <link href="../ttf/DoppioOne-Regular.ttf" rel='stylesheet' type='text/css'>
   <link href="StyleChat.css" rel="stylesheet" type="text/css">
   <link rel="shortcut icon" href="../img/favicon.ico" type="image/x-icon" />
   <link rel="icon" href="../img/favicon.ico" type="image/x-icon" />
   <title>Portail Libre VPN</title>
      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>

<body>

<div id="temp" class="red bar chacal police"> </div>

<div class="ligne paire"></div>
<div class="ligne impaire"></div>
<div class="ligne paire"></div>
<div class="ligne impaire"></div>
<div class="ligne paire"></div>
<div class="ligne impaire"></div>
<div class="ligne paire"></div>
<div class="ligne impaire"></div>

<script>

({
var x;

function Fruit()
{
    this.color;

    this.changeColor = function( col )
    {
        this.color = col;
        x = ;
    }
}

monProjet.Banane = new Fruit();

monProjet.constructeurFruit = Fruit;

})

var monProjet = {};
monProjet.Banane = {};
monProjet.constructeurFruit = function(){};

var Banane = new monProjet.constructeurFruit();

//Fruit();

var Banane = new Fruit();
var Pomme = new Fruit();
console.log(Banane.color);
Banane.color = "yellow";
console.log(Banane.color);
Banane.changeColor( "green" );

console.log(Banane.color);

Banane.truc = function()
{
    this.color = null;
}

Banane.truc();

console.log(Banane.color);

Fruit.prototype.echo = function()
{
    console.log( this.color );
}

Banane.echo();
Pomme.echo();

var interval_id;

function hard_work()
{
    document.body.style.backgroundColor="red";
    console.log("red");
}


var _tmp = obj.obj2.enfant.truc;

_tmp.method();
_tmp.entier = 2;

window.addEventListener("focus", function()
    {
        if (!interval_id)
        {
            interval_id = setInterval(hard_work, 1000);
        }
    }, false);


window.addEventListener("blur", function()
    {
        clearInterval(interval_id);
        interval_id = false;
        document.body.style.backgroundColor="yellow";
        console.log("yellow");
    }, false);


</script>




</body>
</html>
