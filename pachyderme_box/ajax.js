<script type="text/javascript">

    var identification_area_DOM = document.getElementById("identification_area");    /*** Formulaire d'identification.         ***/
    var login_box_DOM;                                                               /*** Endroit précis du formulaire.        ***/
    var identified_status_DOM = document.getElementById("identified_status");        /*** Statut d'identification.             ***/
    var chat_DOM = document.getElementById("chatbox");                               /*** Div principale de la chatbox.        ***/
    var send_DOM = document.getElementById("send_box");                              /*** Espace d'envoi des messages.         ***/
    var text_area_DOM;                                                               /*** Espace du text_area de send msg.     ***/
    var text_single_DOM = document.getElementById("send_line");                      /*** Espace d'envoi d'un message simple   ***/
    var line_area_DOM;                                                               /*** Espace de saisie du texte line only. ***/
    var play_DOM = document.getElementById("play_pause_button");                     /*** Bouton play/pause musique.           ***/
    var user_list_DOM = document.getElementById("user_list");                        /*** Liste des utilisateurs connectés.    ***/
    var display_hide_date_DOM = document.getElementById("display_hide_date_button"); /*** bouton pour cacher et voir la date.  ***/
    var history_DOM = document.getElementById("history_space");                      /*** bouton de demande de l'historique.   ***/

    var intervalRefreshMsg;                                                          /*** Utilisé pour le refresh des messages ***/
    var intervalRefreshUser;                                                         /*** Refresh des utilisateurs connectés.  ***/

    var music_ambiance = document.createElement("Audio");
    var beginPlay = false;
    var onPlaying = false;                                        /*** VARIABLES MUSICALES ***/


    var music_animal   = document.createElement("Audio");                             /*** Création de 2 objets de type musique. ***/

    var special_action = false;    /* SPECIAL_ACTION prépare des actions spéciales à venir après lecture et décodage des flux recus. */
    var refresh_user = false;      /* refresh_user est une action spéciale, qui met à jour loa liste des utilisateurs connectés.     */

    var after_exit = false;        /* Protection à l'execution de la comande /exit (en raison de bugs chaffouins) */

    var chatbox_json;              /* Objet JSON contenant le contenu total de la shout. */
    var display_date;              /* True ou False selon si on veut afficher la date.   */
    var number_json_chat_line;     /* Nombre de ligne affichés sur la chatbox jusque là. */
    var user_name;                 /* Nom ou login de l'utilisateur enregistré.          */

    /*** Mise en place du bouton de lecture / pause de la musique. ***/
    play_DOM.innerHTML =
            "<button style='background:none; cursor:hand;' id='play_pause_button' onclick='play_pause_Audio(music_ambiance);'>" +
            "<img src='./images/linux.gif' id='play_img' height='85px' alt='restart'/>" +
            "</button>";
/******************************************************************************************************************************************/
    function default_value()
    {
        user_name = "";
        display_date = false;
        number_json_chat_line = 0;

        login_box_DOM = text_area_DOM = line_area_DOM = null;
    }
    default_value();

/*******************************************************************************************************************************************/
/********************************************* REDIMENTIONNEMENT DE LA CHATBOX EN FONCTION DE LA FENETRE ***********************************/
    var resizeChatbox;             /* Résultat de la hauteur affichée de la chatbox, utilisé par le scrolling auto ou NEW_MSG_SYSTEM */

    function resizeElements()
    {
        var x = window.innerHeight - 560;    //console.log("horizon" + window.innerWidth + "hauteur" + window.innerHeight);

        var resizeFooter = 60 + (0.1*x);
        resizeChatbox = Math.round(250 + (0.9*x) - 10); /* le -10 devra etre enlevé ! */

        //console.log("taille chatbox =" + resizeChatbox);

        chat_DOM.style.height=resizeChatbox+'px';
        text_area_DOM.style.height=resizeFooter+'px';
        document.getElementById("bouton_send_area").style.top=(resizeFooter-15)+'px';

        chat_DOM.scrollTop = chat_DOM.scrollHeight;
    }

/*******************************************************************************************************************************************/
/******************************************* AVERTISSEMENT CLIGNOTANT DES NOUVEAUX MESSAGES ************************************************/

    var intervalState;              /* Variable utilisée pour le setInterval d'alternance NEW MESSAGE                                       */
    var onNewMessage = false;       /* Passe à TRUE si le clignotement NEW-MESSAGE s'active. (protection de fonction executées multiples)   */
    var onFocus      = true;        /* FALSE si l'utilisateur n'est pas sur l'onglet, TRUE s'il est dessus. (défault TRUE)                  */

/***************************** Gestion de l'affichage final du clignotement NEWMSG *********************/
    function displayNewMessage(arg)
    {
        var boolNewMsg = false;
        function new_msg()
        {
            if (boolNewMsg == false)     document.title = "Nouveau Message !";
            else                         document.title = "Pachydermes box.";

            boolNewMsg = ! boolNewMsg;
        }

        if (arg == false)
        {
            clearInterval(intervalState);
            document.title = "Pachydermes box.";
            onNewMessage = false;
            //console.log("Fermeture des events NEW MESSAGE");
        }
        else if (onNewMessage == false)
        {
            if (arg == true)
            {
                intervalState = setInterval(function(){new_msg();}, 1000);
                onNewMessage = true;
            }
        }
    }
/************************** L'utilisateur est sur l'onglet, répond onFocus = TRUE. ***********************/
    window.addEventListener("focus", function()
    {
        onFocus = true;        //console.log("focus="+onFocus);
        if (chat_DOM.scrollHeight == (chat_DOM.scrollTop + resizeChatbox + 10))
        {
            displayNewMessage(0);
        }
    },  false);

/************************* L'utilisateur n'est pas sur l'onglet, répond onFocus = FALSE. *****************/
    window.addEventListener("blur", function()
    {
        onFocus = false;        //console.log("focus="+onFocus);
    },  false);

/********************Appelée par un scroll de souris sur la Chatbox, vérifie si les msg sont lus *********/
    function disableNewMessage()
    {
        if (onNewMessage == true)
        {
            //console.log("scrolling charbox, onfocus="+onFocus);
            if ((chat_DOM.scrollHeight == (chat_DOM.scrollTop + resizeChatbox + 10)) && (onFocus == true))
            {   /* Ici, il faut se preserver de l'autoscroll quand l'utilisateur n'est pas devant la page d'ou le "&& (onFocus == true)" */
                onmouseover = displayNewMessage(0);
                onkeypress = displayNewMessage(0);
            }
        }
    }

    chat_DOM.onscroll = disableNewMessage;    /* EVENT appelant la fonction ci-dessus au mouvent de scroll chatbox. */

/********************************************************************************************************************************/
/*********************************************** FONCTION getXMLHttpRequest(). **************************************************/
    function getXMLHttpRequest()
    {
        var xhr = null;
        if (window.XMLHttpRequest || window.ActiveXObject)
        {
            if (window.ActiveXObject)
            {
                try
                {
                    xhr = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch(e)
                {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
            }
            else
            {
                xhr = new XMLHttpRequest();
            }
        }
        else
        {
            alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
            return null;
        }
        return xhr;
    }
/********************************************************************************************************************************/
/************************* FONCTION D'ACCEUIL DE DEMANDE LOGIN. (retry à 1 si detection d'une erreure) **************************/
    function display_login_id(retry)
    {
        var no_id = "Veuillez déposer un pseudonyme :"

        if (retry == 1) identified_status_DOM.innerHTML = "Ce fut une malencontreuse erreure ! " + no_id;
        else identified_status_DOM.innerHTML = no_id;

        identification_area_DOM.innerHTML =
            "<form name='register' method='POST' action='javascript:register_login()'>" +
            "<input type='text' name='login' spellcheck='false' autocomplete='off' id='login' size='25'>" +
            "<input type='button' id='identification_button' value='OK' onclick='register_login()'>" +
            "</form>";

        login_box_DOM = document.getElementById("login");
        login_box_DOM.focus();           /* Focus curseur automatique sur la zone de texte pour le login. */
    }
/********************************************************************************************************************************/
/************************************** FONCTION D'AFFICHAGE DE L'ESPACE CLIENT COMPLET. ****************************************/
    function display_all_stuff(login)
    {
        user_name = login;

        display_hide_date_DOM.innerHTML =
            "<button style='background:none' id='horloge' onclick='change_display_date();'>" +
            "<img src='./images/time.png' id='time_img' alt='time'/>" +
            "</button>";

    /*** Mise en place du message connecté as ... & suppression du formulaire d'identification. ***/
        identified_status_DOM.innerHTML = "Salut à toi " + login +" !";
        identification_area_DOM.innerHTML = null;   /*** Suppression de l'espace d'identification. ***/

    /*** Mise en place de l'espace de visualisation de la chatbox. : Création d'une nouvelle balise chatbox dans pré_chat_box. ***/
         /*** Association de chat_DOM à cette nouvelle balise => création chatbox. ***/
        chat_DOM.style.display='block';
        user_list_DOM.style.display='block';

    /*** Affichage du text_area pour passer plusieurs lignes de suite. ***/
        send_DOM.innerHTML =
            "<form name='sending_box' method='POST'>" +
            "<textarea name='msg_send_name' spellcheck='false' id='msg_send_id' rows='5' cols='100'>" +
            "</textarea><IMG src='.\/images\/elephant.png' id='bouton_send_area' onclick='send_msg(1)' border=0>" +
            "</form>";

        text_area_DOM = document.getElementById("msg_send_id");
        text_area_DOM.innerHTML =
            "INFOS: /nick (pseudo) pour changer de pseudo. /roll pour lancer les dés. /kick (pseudo) appel votre ami. /exit termine votre session." +
            " Cet espace d'échange rouge peut servir à tous types d'écrits sur plusieurs lignes, mails, code, liste de noel etc..." +
            " Pour envoyer vos longs textes, il suffit de cliquer sur l'éléPHPant !" +
            " La petite balle en haut à droite sert à mettre en pause la musique ou la redémarrer."

    /*** Affichage de de ligne simple d'envoi. balise de texte=line_send. id=line_box. value function send_msg=2. ***/
        text_single_DOM.innerHTML =
            "<form name='one_line_msg' method='POST' action='javascript:send_msg(2)'>" +
            "<input name='line_send' id='line_box' spellcheck='false' autocomplete='off' type='text'>" +
            "<input type='button' id='bouton_send_line' value='OK' onclick='send_msg(2)'>" +
            "</form>";

         history_DOM.innerHTML =
            "<button style='background:none; cursor:hand;' id='history_button' ONCLICK='pop_up_history()'>" +
            "HYSTORY_POP_UP" +
            "</button>";

        line_area_DOM = document.getElementById("line_box");
        line_area_DOM.focus();

   //     if (after_exit == false)
   //     else after_exit = false;

        refresh_msg(0);
        intervalRefreshMsg = setInterval(function(){refresh_msg(0);}, 1500);

        refresh_user_list(0);
        intervalRefreshUser = setInterval(function(){refresh_user_list(0);}, 30000);

        resizeElements();
        window.onresize = resizeElements;
    }
/********************************************************************************************************************************/
/****************** Dissimulation du curseur de texte lors du clic simple sur valider : Defectueuse :( **************************/
    function hide_cursor()   { }

/********************************************************************************************************************************/
/************************************ FONCTION D'ENVOI DU LOGIN TAPE AU SERVEUR. ************************************************/
    function register_login()
    {
        var xhr = getXMLHttpRequest();

        var LOGIN_ENTERED = document.getElementById("login").value;     /* Récupération de la valeur ciblée par l'ID login. */

        xhr.open("POST", "register.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function()
        {
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                if (xhr.responseText != 0)
                {
                    display_all_stuff(xhr.responseText);
                }
                else    display_login_id("1");
            }
        };
        xhr.send("login="+LOGIN_ENTERED);
    }

/********************************************************************************************************************************/
/**************************************** FONCTION D'ENVOI DES MESSAGES AU SERVEUR.**********************************************/
    function send_msg(value)  /*** value = 1 si simple ligne, value = 2 si textaréa.    ***/
    {
        var msg_xhr = getXMLHttpRequest();

        msg_xhr.open("POST", "post_msg.php");
        msg_xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        msg_xhr.onreadystatechange = function()
        {
            if(msg_xhr.readyState == 4 && msg_xhr.status == 200)
            {
                if (msg_xhr.responseText != 0)   /*** Vérifie si la réponse n'est pas vide. ***/
                {
                    var obj = JSON.parse(msg_xhr.responseText);

                    display_on_chatbox(obj,display_date,0);
                    if (after_exit) return;

                    chat_DOM.scrollTop = 1000000;
                }
            }
        };

        if (value == 1)                 /*** Envoi d'un message au serveur : 1 provient de l'entrée d'une seule ligne. ***/
        {
            var msgToSend = encodeURIComponent(text_area_DOM.value);         /* Récupération du champs frappé dans text_area.               */

            msg_xhr.send("txt="+msgToSend);
            text_area_DOM.value = "";                                        /* Suppression de l'ancien texte frappé.                       */
            text_area_DOM.focus();                                           /* Méthode focus() mise du curseur auto au début du text_aréa. */
        }
        else /* if (value == 2) */      /*** Envoi d'un message au serveur : 2 provient de l'entrée de plusieurs lignes. ***/
        {
            var msgToSend = encodeURIComponent(line_area_DOM.value);

            msg_xhr.send("txt="+msgToSend);
            line_area_DOM.value = "";                                        /* Suppression de l'ancien texte frappé. */
            line_area_DOM.focus();
        }
    }
/********************************************************************************************************************************/
/*********************** Fonction automatique de rafraichissement des messages. Méthode GET vide utilisée. **********************/
    function refresh_msg()
    {
        var refresh_xhr = getXMLHttpRequest();
        refresh_xhr.open("GET", "post_msg.php", true);

        //console.log("scrollHeight = " + chat_DOM.scrollHeight + " scrollTop    = " + chat_DOM.scrollTop);

        refresh_xhr.onreadystatechange = function()
        {
            if (refresh_xhr.readyState == 4 && (refresh_xhr.status == 200 || refresh_xhr.status == 0))
            {
                if (refresh_xhr.responseText != 0)   /* Vérifie si la réponse n'est pas vide. */
                {
                    var obj = JSON.parse(refresh_xhr.responseText);

                    display_on_chatbox(obj,display_date,0);
                    if (after_exit) return;

                    if (((chat_DOM.scrollTop + resizeChatbox + 1000) >= (chat_DOM.scrollHeight)) || (chat_DOM.scrollTop == 0))   /*** Dans le cas ou le client regarde "l'historique", ne force pas le descente auto du scroll. ***/
                    {
                        chat_DOM.scrollTop = (chat_DOM.scrollHeight - resizeChatbox - 10);
                        if (onFocus == false) displayNewMessage(1);
                    }
                    else    displayNewMessage(1);
                }
            }
        };
        refresh_xhr.send(null);
    }

    var start_display_line;   /* Determine la première ligne qui sera affichée dans lma chatbox à partir de ce qui a été recu de la BDD. */
/******************************************************************************************************************************************************************/
/*** Fonction appelée par deux autre gérant spécialement l'affichage du texte sur le chatbox : -obj   : Objet issue d'un parse JSON recu (ferérence)            ***/
    function display_on_chatbox(obj,date,reset)                                         /*** : -date  : affiche la date des msg ou non (true=yes)               ***/
    {                                                                                   /*** : -reset : SPECIAL, regénère totalement l'affichage de la chatbox  ***/
        //console.log("begin" +number_json_chat_line);

        /*** Patch d'affichage que des 500 derniers messages. ****************/
        if (obj[0].A > 500)                start_display_line = obj[0].A - 500;
        else                               start_display_line = 1;
        /* "document.getElementsByTagName('*').length" permet de voir le nombre d'éléments DOM dans la page, passé 1000 tout est ralentit. */
        /*** Fin du patch ****************************************************/

        if (reset)
        {
            //console.log("Reset total de la chatbox : nombre ligne à re-afficher=" + number_json_chat_line);
            var Z = number_json_chat_line;
            chat_DOM.innerHTML = "";
        }
        else
        {
            //console.log("Ajout de " + obj[0].A + " lignes à l'objet JSON");
            number_json_chat_line += obj[0].A;
            //console.log("Résultat de ligne final=" + number_json_chat_line);

            var Z = obj[0].A;

            if (! chatbox_json)
            {
                chatbox_json = obj;
                //console.log("Création d'un nouvel objet JSON");
            }
            else
            {
                //console.log("Ajout de " + obj[0].A + " éléments à chatbox_json");
                for (var j=1 ; j <= obj[0].A ; ++j )    chatbox_json = chatbox_json.concat(obj[j]);
            }
        }
        //console.log("bend" +number_json_chat_line);

    /*** obj[0].A == 0 est renvoyé quand l'utilisateur a émis la commande /exit. ***/
        if (obj[0].A == 0)
        {
            if (obj[0].M == 1)  /*** Réponse recu d'un changement de pseudo /nick. ***/
            {
                identified_status_DOM.innerHTML = "Vous êtes un tricheur " + obj[0].U +" !";
            }
            else                /*** Réponse recu d'une demande de sorite /exit.   ***/
            {
                clearInterval(intervalRefreshMsg);      /* Destruction de la MAJ des messages en attente.           */
                clearInterval(intervalRefreshUser);     /* Destruction de la MAJ des utilisateurs connectés.        */

                display_hide_date_DOM.innerHTML = "";   /* play_DOM.innerHTML = ""; Le bouton de la musique reste.  */
                identified_status_DOM.innerHTML = "";
                send_DOM.innerHTML = "";
                text_area_DOM.innerHTML = "";
                text_single_DOM.innerHTML = "";
                user_list_DOM.innerHTML = "";
                chat_DOM.innerHTML = "";
                history_DOM.innerHTML = "";

                chat_DOM.style.display='none';
                user_list_DOM.style.display='none';

                delete chatbox_json;
                chatbox_json = "";                      /* "delete chatbox_json" seul fonctionne très mal !!! chatbox_json = ""; doit être rajouté !    */

                displayNewMessage(0);
                default_value();                        /* Appel d'une fonction remettant les quelques variables globales en "défault"                  */

                after_exit = true;                      /* Précise qu'un exit a déjà été fait, celà de ne pas couper la musique en se reconnectant.     */

                display_login_id();                     /* location.reload() permet de recharger entièrement la page php (ici on préfère un pure AJAX); */
            }
            return;
        }
        var view_chat = "";

        if (date)
        {
            for (var i = start_display_line ; i <= Z; ++i )
            {
                switch (obj[i].A)   {
                    case "0":
                        view_chat += "<br/><span class='light_black'>"+ obj[i].D +" </span><span class='red_txt'>"+obj[i].U+"</span> : "+obj[i].M;
                        break;
                    case "1":
                        view_chat += "<br/><span class='green_txt'>"+obj[i].M+" ("+obj[i].D+")</span>";
                        special_action = true;
                        refresh_user = true;
                        break;
                    case "2":
                        view_chat += "<br/><span class=\"blue_txt\">"+obj[i].U+" "+obj[i].M+"</span>";
                        break;
                    case "3":
                        view_chat += "<br/><span class=\"blue_txt\"> Au loin, l'on entend crier un animal...</span>";
                        if (user_name.trim() == obj[i].M.trim() && reset == false) play_music(music_animal,find_animal(),0);
                        break;
                    case "4":
                        view_chat += "<br/><span class='purple_txt'>(private) </span><span class='red_txt'>" +obj[i].U+ "</span> : " + obj[i].M + "</span>";
                        break;      }
            }
        }
        else
        {
            for (var i = start_display_line ; i <= Z; ++i )
            {
                switch (obj[i].A)   {
                    case "0":
                        view_chat += "<br/><span class='red_txt'>"+obj[i].U+"</span> : "+obj[i].M;
                        break;
                    case "1":
                        view_chat += "<br/><span class='green_txt'>"+obj[i].M+"</span>";
                        special_action = true;
                        refresh_user = true;
                        break;
                    case "2":
                        view_chat += "<br/><span class=\"blue_txt\">"+obj[i].U+" "+obj[i].M+"</span>";
                        break;
                    case "3":
                        view_chat += "<br/><span class=\"blue_txt\"> Au loin, l'on entend crier un animal...</span>";
                        if (user_name.trim() == obj[i].M.trim() && reset == false) play_music(music_animal,find_animal(),0);
                        break;
                    case "4":
                        view_chat += "<br/><span class='purple_txt'>(private) </span><span class='red_txt'>" +obj[i].U+ "</span> : " + obj[i].M + "</span>";
                        break;      }
            }
        }


        chat_DOM.innerHTML += view_chat;

        if (special_action && !reset)
        {
            if (refresh_user) { refresh_user_list(); refresh_user = false; }
            special_action = false;
        }
    }

/*********************************************************************************************************************/
/*** Affichage du pop_up de l'historique. ****************************************************************************/
    function pop_up_history()
    {
        chatbox_json[0].A = number_json_chat_line;
        localStorage.setItem("historique",JSON.stringify(chatbox_json));

        window.open('history.php', 'HISTORY', config='height=' + (1/2*(window.innerHeight)) + ', width=' + (3/4*(window.innerWidth)) + ',left=' + (1/100*(window.innerWidth)) + ', top=25, toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, directories=no, status=no');
    }
/*********************************************************************************************************************/
/*** Appelée par un bouton, cette fonction se charge de switcher entre l'affichage de la date des messages ou non. ***/
    function change_display_date()
    {
        display_date = ! display_date;
        display_on_chatbox(chatbox_json,display_date,1);

        chat_DOM.scrollTop = 1000000;

        line_area_DOM.focus();
    }

/***************************************************************************************************************/
/*** Cette fonction affichera tout simplement la liste des utilisateurs connectés. *****************************/
    function refresh_user_list()
    {
        var refresh_user = getXMLHttpRequest();
        refresh_user.open("GET", "request_user_list.php", true);

        refresh_user.onreadystatechange = function()
        {
            if (refresh_user.readyState == 4 && (refresh_user.status == 200 || refresh_user.status == 0))
            {
                user_list_DOM.innerHTML = "Utilisateurs connectés.  <span class='strong_green'>" + refresh_user.responseText + "</span>";
            }
        };
        refresh_user.send(null);
    }
/***************************************************************************************************************/
/******************* FONCTIONS SPECIALISEES DANS LA GESTION DE LA MUSIQUE **************************************/
/***************************************************************************************************************/
    function play_music(music,src,loop)        /*** LECTURE STANDARd D'UN FICHIER SON : var, source et lopp. ***/
    {
        music.src = src;
        music.volume = 1;
        music.loop = loop;

        music.play();					  /*** Lancement de la méthode play de l'objet music de type "Audio" ***/
    }
/***************************************************************************************************************/
    function play_pause_Audio(music)                              /*** BOUTON DE PAUSE / RESTART LA MUSIQUE. ***/
    {
        if (window.HTMLAudioElement)
        {
            try
            {
                if (beginPlay == false)
                {
                    play_music(music_ambiance,"./musique/Bob Marley & The Wailers Live At Zurich , Hallenstadion  May 30th 1980.mp3",1);
                    beginPlay = true;

                }
                else if (onPlaying == true)     music.pause();
                else                            music.play();

                onPlaying = ! onPlaying;            /*** <== Changement de l'état onPlaying, opération NO, ! ***/
            }
            catch (e)  {                              if(window.console && console.error("Error:" + e));}
        }
    }
/***************************************************************************************************************/
/*************************** RECHERCHE D'UN ANIMAL : RETOURNE UNE STRING CONTENANT LA SOURCE DU MP3 ANIMAL.  ***/
    function find_animal()
    {
        var animal = Math.floor(Math.random() * 3); var src; var num;
        switch (animal) {
        case 0:
            num = Math.floor((Math.random() * 6) + 1);
            src = "./musique/elephant" + num + ".mp3";
            break;
        case 1:
            num = Math.floor((Math.random() * 2) + 1);
            src = "./musique/vache" + num + ".mp3";
            break;
        case 2:
            src = "./musique/cochon1.mp3";
            break;      }
        return src;
    }
/***************************************************************************************************************/
</script>
