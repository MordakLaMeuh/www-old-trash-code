<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8" />
</head>

<body>

<div id="papa">
    <div id="image1" class="transition">
        <img src="http://realityrevisited.eu/photos/BLIGHT.jpg"/>
    </div>
    <div id="image2" class="transition">
        <img src="http://realityrevisited.eu/photos/BLIGHT/03.jpg"/>
    </div>
</div>

<div id="maman">
    <div id="image3" class="transition">
        <img src="http://realityrevisited.eu/photos/BREAT.jpg"/>
    </div>
    <div id="image4" class="transition">
        <img src="http://realityrevisited.eu/photos/BREAT/4187_1130350908897_3229933_n.jpg"/>
    </div>
</div>

<style>
* {margin:0;}

#papa   {  position:relative; width:295px; display:inline-block; vertical-align: top;}
#maman  {  position:relative; display:inline-block; vertical-align: top;}

#image1,#image3 { opacity:1; }
#image2,#image4 { opacity:0; }

img { width:300px;}

.transition
{
    position:absolute;
    transition: all 3s;
}

#papa:hover > #image1 { opacity:0; }
#papa:hover > #image2 { opacity:1; }

#maman:hover > #image3 { opacity:0; }
#maman:hover > #image4 { opacity:1; }
</style>

    </body>
</body>

