<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8" />
</head>

<body>

<div id="PAPA">
    <div id="grand_frerot"></div>
    <div id="Gertrude" class="circle"></div>
    <div id="Iseult"   class="circle"></div>
    <div id="Pénélope" class="circle"></div>
</div>

<style>
div {height: 100px; width: 100px;}
#PAPA  {position: absolute; top:100px; left:100px;}
#grand_frerot{ z-index: 30; position: absolute; height:166px; width:166px; border:solid 2px black;}
#Gertrude { z-index: 10;                             background:red;   }
#Iseult   { z-index: 8;     top:66px; left:33px;     background:green; }
#Pénélope { z-index: 6;     top:33px; left:66px;     background:blue; }

.circle
{
    opacity:0.8;
    position: absolute;
/*    transition:border-radius; */
    transition:all;
    transition-duration: 2s;
}

#grand_frerot:hover ~ .circle
{
    border-radius: 50%;
    transform: rotate(1080deg);
}
</style>

<H1>
div {height: 100px; width: 100px;}
#PAPA  {position: absolute; top:100px; left:100px;}
</H1>
<H3>
<p>
#grand_frerot{ z-index: 30; position: absolute; height:166px; width:166px; border:solid 2px black;}
</p>
<p>
#Gertrude { z-index: 10;                             background:red;   }
#Iseult   { z-index: 8;     top:66px; left:33px;     background:green; }
#Pénélope { z-index: 6;     top:33px; left:66px;     background:blue; }
</p>
<p>
.circle
{
    opacity:0.8;
    position: absolute;
/*    transition:border-radius; */
    transition:all;
    transition-duration: 2s;
}

#grand_frerot:hover ~ .circle
{
    border-radius: 50%;
    transform: rotate(1080deg);
}
</p>
<p>
div {height: 100px; width: 100px;}
#PAPA  {position: fixed; top:100px; left:100px;}

#grand_frerot{ z-index: 30; position: absolute; height:166px; width:166px; border:solid 2px black;}
</p>
<p>
#Gertrude { z-index: 10;                             background:red;   } </br>
#Iseult   { z-index: 8;     top:66px; left:33px;     background:green; } </br>
#Pénélope { z-index: 6;     top:33px; left:66px;     background:blue; }  </br></br>

<H1>
.circle
{
    opacity:0.8;
    position: absolute;
/*    transition:border-radius; */
    transition:all;
    transition-duration: 2s;
}
</H3>
<H1>
#grand_frerot:hover ~ .circle   </br>
{                               </br>
    border-radius: 50%;         </br>
    transform: rotate(1080deg); </br>
}                               </br>
</H1>
</p>
</H3>
    </body>
<html>
