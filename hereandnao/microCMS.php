<?php
$favicon = "icone-renard-web.png";
$main_picture = "./nao.jpg";

$logo_type = "txt";                                                      // Peut prendre la valeur "txt".
$logo_txt ="<H4>Nao Nao Nao</H4>";
$logo_img = "naologo.jpg";
$visible_main_logo = false;

$a = array("PARIS","Paris","パリ");
$b = array("AMSTERDAM","Amsterdam","アムステルダム");
$c = array("JPN","Japan","日本");
$d = array("THAI","Thailand","タイ国");
$e = array("PRAGUE","Prague","プラハ");
$f = array("MACARON","The Macaron","ビーチ");

$box = array($a,$b,$c,$d,$e,$f);


class Topic {
    public $title;
    public $ID;
    public $sub;
}

$a = new Topic();   $a->title = 'Diaporama';    $a->ID = 2;
$a->sub = array("FullScreen");

/***
$a = new Topic();   $a->title = 'Portfolio';    $a->ID = 2;
$a->sub = array("Stage","Concerts","Artists","Backroom","Portraits");

$b = new Topic();   $b->title = 'Diaporama';    $b->ID = 3;
$b->sub = array("Fullscreen","Horizontal","PRIVATE");

$menu = array($a,$b);                                       ***/
$menu = array($a);
?>
