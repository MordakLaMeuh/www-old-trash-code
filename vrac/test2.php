<!DOCTYPE HTML>
<html>
<body>

<canvas id="myCanvas" width="400" height="300" style="border:1px solid black;">
    Votre navigateur ne supporte pas canvas.
</canvas>


<script type="text/javascript">
window.onload = function()
{
    var canvas = document.getElementById("myCanvas");
    if(!canvas)
    {
        alert("Impossible de récupérer le canvas");
        return;
    }

    var context = canvas.getContext("2d");
    if(!context)
    {
        alert("Impossible de récupérer le context");
        return;
    }

    var diametreBalle = 20;

    var posX = 1+diametreBalle/2;
    var posY = 1+diametreBalle/2;
    var vitesseX = 3;
    var vitesseY = 3;

    var myInterval = setInterval(animate, 1000/30);

    function animate()
    {
        context.clearRect(0, 0, canvas.width, canvas.height);

        //Tracé de la balle
        context.beginPath();
        context.arc(posX, posY, diametreBalle/2, 0, Math.PI*2);
        context.fill();

        //On va vérifier si la balle à toucher l'un des bords du canvas.
        if(posX+diametreBalle/2 >= canvas.width || posX <= 0+diametreBalle/2)//Si on touche le bord gauche ou droit
        {
            vitesseX *= -1;//On inverse la vitesse de déplacement sur l'axe horizontal.
        }

        if(posY+diametreBalle/2 >= canvas.height || posY <= 0+diametreBalle/2)//Si on touche le bord du bas ou du haut
        {
            vitesseY *= -1;//On inverse la vitesse de déplacement sur l'axe vertical.
        }

        //On additionne les vitesses de déplacement avec les positions
        posX += vitesseX;
        posY += vitesseY;
    }

}

</script>

</body>
</html>
