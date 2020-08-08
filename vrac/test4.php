<!DOCTYPE html>
<html lang="fr-FR">

<head>
    <meta charset="UTF-8" />
</head>

</body>

<style>
#main
{
    opacity: 0;
    filter: alpha(opacity=100);
    -webkit-transition: opacity 0.5s ease-in-out;
       -moz-transition: opacity 0.5s ease-in-out;
        -ms-transition: opacity 0.5s ease-in-out;
         -o-transition: opacity 0.5s ease-in-out;
            transition: opacity 0.5s ease-in-out;
}
</style>

<div id="main"><span style="font-size:6em">Loading process...</span></div>

<button id="bouton">Active Cycle</button>

<script>
var alternate = (function()
{
    var elmt;
    var interval;
    var state = false;
    return function(idName)
    {
        console.log("call Me !");
        if (elmt) if (elmt.id == idName)  { clearInterval(interval); elmt = null; return; }
        elmt = document.getElementById(idName);
        interval = setInterval(function(){
            if (state) { state=false; elmt.style.opacity = 0; }
            else       { state=true;  elmt.style.opacity = 1; }
            },500);
    };
})();

var bouton = document.getElementById("bouton");
bouton.addEventListener("click", function(){alternate("main");} , false);
</script>

    </body>
</html>
