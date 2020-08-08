<?php
session_start();
$_SESSION['test'] = $_GET['xSS'];
?>