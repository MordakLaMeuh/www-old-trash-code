<?php
session_start();
if (($_SESSION['link']) != "0")
{
    echo ($_SESSION['link']);
    $_SESSION['link'] = "0";
}
?>