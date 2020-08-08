
<script>

    var alternateStatusTXT = (function()
    {
        var elmt;
        var interval = 6;
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

</script>
