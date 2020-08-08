<!DOCTYPE html>
<html lang="en-US">

<head>
    <link rel='stylesheet' href='divbleuvert.css' type='text/css' media='all' />
    <style>
#baba
{
    background:#0f0;
    height:100px;
    width:100px;
    /*transition-duration: 1s;*/
    transition: all 1s;
}

#baba:hover
{
    background:#f00;
    border-radius: 50%;
    transform: rotate(1080deg);
}

#baba:hover ~ #manchot
{
    background:#0f0;
    border-radius: 50%;
    transform: rotate(-1080deg);
}

#baba:hover ~ #rasta
{
    border-radius: 50%;
    transform: rotate(-1080deg);
    -webkit-transform:translate(230px,0px);
    -ms-transform:translate(230px,0px);
    -moz-transform:translate(230px,0px);
    -o-transform:translate(230px,0px);
    transform:translate(230px,0px);
}

#rasta
{
    background:#ff0;
    height:100px;
    width:100px;
    transition: all 1s;
}

#manchot
{
    background:#f00;
    height:100px;
    width:100px;
    transition: all 1s;
}
    </style>
</head>

<body>

<div id="baba">
</div>

<div id="rasta">
</div>

<div id="manchot">
</div>

</body>
</html>

