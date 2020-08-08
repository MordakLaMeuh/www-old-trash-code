#!/bin/bash
echo "param 1 : $1"
echo "param 2 : $2"
echo -e "La somme que vous recherchez est $2 !" | sudo mutt -s "L elePHPant bleu a fait votre calcul :" -- $1
echo -e "state Online : $1" | sudo mutt -s "Calculs elephant" -- smartrabbitbeta@gmail.com
