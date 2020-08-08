<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="UTF-8" />
</head>

<body>

<div id="papa">
    <div id="Gertrude" class="giron"></div>
    <div id="Iseult"   class="giron"></div>
    <div id="Pénélope" class="giron"></div>
</div>

<style>
#papa { width:100px; opacity:1; }

.giron
{
    height:100px;
    width:100px;
    opacity:0.5;
    transition:all;
    transition-duration:1s;
}

#papa:hover > .giron:hover   { opacity:1; }
#papa:hover > .giron         { opacity:0; }

#Gertrude   { background:green; }
#Iseult     { background:#ff0;  }
#Pénélope   { background:red;   }
</style>

    </body>
</html>
