<?php
$conf = array(
  'consKey'
        => '122054407841.apps.googleusercontent.com',
  'consSecret'
        => 'K-J5lAdso0rjwIC-FGdF1ZZd',
  'callbackUrl'
        => 'http://www.ecoris.co.jp/fieldworker/callback.php',
  'authUrl'
        => 'https://accounts.google.com/o/oauth2/auth',
  'acsTokenUrl'
        => 'https://accounts.google.com/o/oauth2/token'
);

/**
 * file_get_contents()関数でPOSTする。
 * @param string $url リクエストURL
 * @param array  $params パラメータの連想配列
 * @return string レスポンスボディ
 */
function doPost($url, $params) {
  $headers = array(
    'Content-Type: application/x-www-form-urlencoded',
  );
  $requestOptions = array(
    'http' => array(
      'method'  => 'POST',
      'header'  => implode('\r\n', $headers),
      'content' => http_build_query($params)
    )
  );
  return file_get_contents($url, false,
    stream_context_create($requestOptions)
  );
}
