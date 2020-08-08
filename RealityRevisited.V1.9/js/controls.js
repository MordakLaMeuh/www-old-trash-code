
function InitControls()
{
    function MouseScroll (event)
    {
        if ('wheelDelta' in event)  {
            if (level == 1)         {
		alert("event.wheelDelta="+event.wheelDelta);
                if (event.wheelDelta > 0)   corpus.scrollLeft -= 80;
                else                        corpus.scrollLeft += 80;
            }
            else                    {
                if (event.wheelDelta > 0)   corpus.scrollTop -= 80;
                else                        corpus.scrollTop += 80;                 }}
        else                        {
            if (level == 1)         {
		alert("event.detail="+event.detail);
                if ((-40 * event.detail) > 0)   corpus.scrollLeft -= 80;
                else                            corpus.scrollLeft += 80;
            }
            else                   {
                if ((-40 * event.detail) > 0)   corpus.scrollTop -= 80;
                else                                    corpus.scrollTop += 80;     }}
    }

    corpus.addEventListener("mousedown", function() {
        console.log("Votre bouton de souris est enfoncé.");
        }
    );
    corpus.addEventListener("mouseup", function() {
        console.log("Votre bouton de souris est relaché.");
        }
    );

    var elem = document.getElementById ("wrapper");
    if (elem.addEventListener)
    {
        elem.addEventListener ("mousewheel", MouseScroll, false);         // all browsers except IE before version 9 - Internet Explorer, Opera, Google Chrome and Safari
        elem.addEventListener ("DOMMouseScroll", MouseScroll, false);     // Firefox
    }
    else    if (elem.attachEvent)   elem.attachEvent ("onmousewheel", MouseScroll);   // IE before version 9
}
