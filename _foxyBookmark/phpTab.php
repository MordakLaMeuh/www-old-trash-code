<?php
$cars = array
  (
  array("Volvo",22,18),
  array("BMW",15,13),
  array("Saab",5,2),
  array("Land Rover",17,15)
  );
echo ($cars[0][0]."<br>");

/* IMAGE MEMOIRE BRUTE */
$folder=array();
$folder[0][0]='root';
$folder[0][1]=&$folder[1][0];
$folder[0][2]=&$folder[2][0];
$folder[0][3]=&$folder[3][0];

$folder[1][0]='linux';
$folder[1][1]=&$folder[4][0];
$folder[1][2]=&$folder[5][0];
$folder[1][3]=&$folder[6][0];

$folder[2][0]='coquin';
$folder[2][1]=&$folder[7][0];
$folder[2][2]=&$folder[8][0];

$folder[3][0]='cheval';

$folder[4][0]='startx';
$folder[5][0]='kvm';
$folder[6][0]='hackTools';

$folder[7][0]='ass';
$folder[8][0]='gay';

/* LECTURE BDD */
/*
1 ROOT NULL 	-> CREATE $folder [0][0] = 'root'
2 LINUX ROOT	-> CREATE $folder [0][1] = &$folder[1][0]; && $folder[1][0]='linux'
3 STARTX LINUX	-> CREATE $folder [1][1] = &$folder[2][0]; && $folder[2][0]='startx'
4 KVM LINUX	-> CREATE $folder [1][2] = &$folder[3][0]; && $folder[3][0]='kvm'
5 COQUIN ROOT	-> CREATE $folder [0][2] = &$folder[4][0]; && $folder[4][0]='coquin'
6 ASS COQUIN	-> CREATE $folder [4][1] = &$folder[5][0]; && $folder[5][0]='ass'
7 CHEVAL ROOT	-> CREATE $folder [0][3] = &$folder[6][0]; && $folder[6][0]='cheval'
8 HACK LINUX	-> CREATE $folder [1][3] = &$folder[7][0]; && $folder[7][0]='hack'
9 GAY COQUIN	-> CREATE $folder [4][2] = &$folder[8][0]; && $folder[8][0]='gay'
*/

/*
1 ROOT NULL 	-> CREATE $folder [0][0] = 'root'
2 LINUX 0	-> CREATE $folder [0][1] = &$folder[1][0]; && $folder[1][0]='linux'
3 STARTX 1	-> CREATE $folder [1][1] = &$folder[2][0]; && $folder[2][0]='startx'
4 KVM 1		-> CREATE $folder [1][2] = &$folder[3][0]; && $folder[3][0]='kvm'
5 COQUIN 0	-> CREATE $folder [0][2] = &$folder[4][0]; && $folder[4][0]='coquin'
6 ASS 2		-> CREATE $folder [4][1] = &$folder[5][0]; && $folder[5][0]='ass'
7 CHEVAL 0	-> CREATE $folder [0][3] = &$folder[6][0]; && $folder[6][0]='cheval'
8 HACK 1	-> CREATE $folder [1][3] = &$folder[7][0]; && $folder[7][0]='hack'
9 GAY 2		-> CREATE $folder [4][2] = &$folder[8][0]; && $folder[8][0]='gay'
*/


echo ($toto);

echo($folder[2][2]);
?>