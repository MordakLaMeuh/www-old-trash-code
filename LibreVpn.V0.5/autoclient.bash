#!/bin/bash
client=$1
clientmail=$2

# TEST si variable client entrée est bonne.
if [ 0$client = 0 ]
   then
   echo "Mauvais client / Mauvaise entrée"
   exit 1
   fi

# Des vérifs supplémentaires DEVRONT être placées
echo "Bon client / Bonne entrée"

# VERIF IMPORTANTE A FAIRE / => CLIENT DEJA PRESENT !

# Se place dans le dossier des keys
cd /gate/vpn/config/keys/

# Vérifie que le client n'est pas déjà enregistré
# Condition : SI client n'existe pas
# Done => Fais lui un fichier client.key

if [ ! -e $client.key ]
   then
   # Se place dans le dossier commandes
   cd /gate/vpn/config
   echo "Création d'une clef client"
   . vars
   ./pkitool $client
   echo "Clef client générée !"
   else
   echo "Fichier client déjà présent"
   fi

# Retour dans le dossier des clés
# Test si le zip existe
cd /gate/vpn/client/$client
zip=$client.zip

if [ ! -e $zip ]
   then

   echo "Fabrication du zip"
   mkdir /gate/vpn/client/$client # crée dossier client
   cd /gate/vpn/
   cp ca.crt ta.key /gate/vpn/client/$client/
   cd /gate/vpn/config/keys/
   cp $client.crt $client.key /gate/vpn/client/$client/

   cd /gate/vpn/
   addr=$(cat IP) # Va chercher l'addresse du serveur - fichier IP
   echo -e "client\ndev tun\nproto tcp-client\nremote $addr 443\nresolv-retry infinite\ncipher AES-256-CBC\n; client-config-dir ccd\n" > client1.ovpn
   echo -e "ca ca.crt\ncert $client.crt\nkey $client.key\ntls-auth ta.key 1\n" > client2.ovpn
   echo -e "nobind\npersist-key\npersist-tun\ncomp-lzo\nverb 3\n" > client3.ovpn
   cat client1.ovpn client2.ovpn client3.ovpn > client.ovpn

   cp client.ovpn /gate/vpn/client/$client/client.ovpn
   cd /gate/vpn/client/$client/
   cp client.ovpn client.conf # Compatibilité Windows : .conf <=> .ovpn

   zip $client.zip * # Fabrique le fichier .zip

   echo -e "Ci-joint, vos fichiers de configurations VPN, prenez-en soin !" | mutt -s "VPN gratos - L'essayer c'est l'adopter." -a $client.zip -- $clientmail
   echo -e "Fichier envoyé !"

   else

   # Peut renvoyer client déjà pris, qui sait !
   echo -e "Fichier zip déjà présent et/ou envoyé"

   fi

echo "Processus terminé"
exit 0
