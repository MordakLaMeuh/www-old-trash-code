<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Document sans nom</title>
</head>

<body>

    <div id="test"></div>

    <script type="text/javascript">

        var x = 0;
        var y = 0;
        var xPrecedent=0;
        var yPrecedent=0;
        var sens;

        if (document.getElementById)
        {
            if(navigator.appName.substring(0,3) == "Net")
                document.captureEvents(Event.MOUSEMOVE);
            document.onmousemove = Pos_Souris;
        }

        function Pos_Souris(e)
        {
            xPrecedent=x;
            yPrecedent=y;
            x = (navigator.appName.substring(0,3) == "Net") ? e.pageX : event.x+document.body.scrollLeft;
            y = (navigator.appName.substring(0,3) == "Net") ? e.pageY : event.y+document.body.scrollTop;

            if(x<xPrecedent) sens = 'gauche';
            if(x>xPrecedent) sens = 'droite';
            document.getElementById("test").innerHTML=sens;
        }



    </script>





</body>
<script type="text/javascript">
    var canvas = document.getElementsByTagName('body')[0];
    canvas.addEventListener("mousedown", function() {
        console.log("Votre bouton de souris est enfoncé.");
    }
    );
</script>
</html>
