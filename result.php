<?php
require_once('oauth_conf.php');
session_start();
if (!isset($_SESSION['acsToken'])) {
  header('Location: /gps/a.html');
  exit();
}

$url = 'https://www.google.com/fusiontables/api/query';
$url .= '?access_token=' . $_SESSION['acsToken'];

$query = 'SHOW TABLES';
$params = array('sql' => $query);
$response = doPost($url, $params);
echo "{$response}";
//$data = json_decode($response);


?>
