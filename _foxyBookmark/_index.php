<?php session_start(); ?>

<!DOCTYPE HTML>
<html lang="fr">

<head>
<meta charset="UTF-8">
<meta http-equiv="content-type" content="text/html; charset=utf-8">
   <link href="index.css" rel="stylesheet" type="text/css"> 
   <link rel="shortcut icon" href="./renardico.png" type="image/x-icon" />
   <link rel="icon" href="./renardico.png" type="image/x-icon" />
   <title>Foxy Bookmarks</title>
      <!--[if lt IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>

<body>

<div id='frameSpace'>
    <!-- ........................................................................; -->
</div>

<img id='backgroundImage' src="renard.jpg" alt="don't hurt the web, use open standards"/> 

<div id="menu">

  <br/>
    <H1>Foxy Bookmarks</H1>
  <br/>

  <ul id="navigation">
    <li>duckduckgo.com</li>
    <li>w3schools.com</li>
    <li>Xhamster.com</li>
    <li>RealityRevisited.eu</li>
    <li>grosdada.eu</li>
  </ul>

</div>
  
<div id="extendBookmarkBouton">
    Extend Bookmarks
<div>

</body>	
<script type="text/javascript">

  document.documentElement.style.overflow = 'hidden';  // firefox, chrome
  document.body.scroll = "no"; // ie only
   
  var backgroundImage_DOM = document.getElementById("backgroundImage");
  var frameSpace = document.getElementById("frameSpace"); 
  var src="http://www.w3schools.com";
  frameSpace.innerHTML="<iframe id='frame' src='"+src+"'></iframe>"
  var frame = document.getElementById("frame");
  frame.style.display='block';
  // SKIP WITHOUT JS
  
  function AdjustBackgroundHeight(){
      backgroundImage_DOM.height=window.innerHeight;
      backgroundImage_DOM.style.marginLeft=((window.innerWidth/2)-(backgroundImage_DOM.width/2))+'px';
      
      frame.height=window.innerHeight;
      frame.width=(window.innerWidth-backgroundImage_DOM.width)/2;
      
      extendBookmarkBouton.style.top=0.9*window.innerHeight+"px";
      
      console.log(backgroundImage_DOM.height+':'+backgroundImage_DOM.width+".Window="+window.innerHeight+':'+window.innerWidth);}
    
  var DisplayWelcomeFox = (function()
  {
    backgroundImage_DOM.style.display='block';
    
    var extendBookmarkBouton=document.getElementById("extendBookmarkBouton");
    
    var navigation = document.getElementById("navigation")
    var list = navigation.getElementsByTagName("li")
    
    for (var i=0; i<list.length; i++)
    {	
      list[i].onclick=function(){window.open("http://www."+this.innerHTML);};
      list[i].onmouseover=function(){frame.src="http://www."+this.innerHTML;};
    }
    
    AdjustBackgroundHeight();
    document.body.onresize=function(){AdjustBackgroundHeight();};
    
    return function()
    {};
  })();
  
  var enlargeBookmark = (function()
  {
    var state = false;

    function Enlarge()                          // Fonction appelée pèriodiquement pour réajuster les images et la vidéo à la résolution d'écran.
    {
        if (state == false)  						{
	  state=true;
	  frame.width=(backgroundImage_DOM.width+window.innerWidth)/2;
	  backgroundImage_DOM.style.display='none'; 			}
        else
        {
        // ---------------------------------------------> Doit faire référence à AdjustBackgroundheight
	  backgroundImage_DOM.style.display='block';
	  backgroundImage_DOM.height=window.innerHeight;
	  
	  backgroundImage_DOM.style.marginLeft=((window.innerWidth/2)-(backgroundImage_DOM.width/2))+'px';
	  frame.width=(window.innerWidth-backgroundImage_DOM.width)/2;
	  
	  state=false;
        }
    }
    extendBookmarkBouton.onmouseover=function(){Enlarge();};
    return function()
    {};
  })();  
</script>
</html>