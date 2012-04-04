<!doctype html>
<html lang = "ja" >
<head>
<meta charset = "utf-8" />
<meta name = "viewport" content = "initial-scale=1.0, user-scalable=no" />
<title> ecoris navi </title>
<body>
<?php

$template = "template.php";
$pagetitle = "私のページ";

if ($_POST["meshcode"]) {
    $res = 30;
    $meshcode = $_POST['meshcode'];
    $n1 = floor($meshcode / 1000000);
    $n2 = floor(($meshcode - $n1 * 1000000) / 10000);
    $n3 = floor(($meshcode - $n1 * 1000000 - $n2 * 10000) / 1000);
    $n4 = floor(($meshcode - $n1 * 1000000 - $n2 * 10000 - $n3 * 1000) / 100);
    $n5 = floor(($meshcode - $n1 * 1000000 - $n2 * 10000 - $n3 * 1000 - $n4 * 100) / 10);
    $n6 = $meshcode - $n1 * 1000000 - $n2 * 10000 - $n3 * 1000 - $n4 * 100 - $n5 * 10;
    echo "$n1 $n2 $n3 $n4 $n5 $n6\n";
    $mesh_arealeft_sec = ($n2 + 100) * 3600 + 450 * $n4 + 30 * $n6;
    $mesh_areabottom_sec = $n1 * 3600 / 1.5 + 300 * $n3 + 30 * $n5;
    $canvas_area_val = "var mleft = ".$mesh_arealeft_sec.";\n";
    $canvas_area_val = $canvas_area_val."var mbottom = ".$mesh_areabottom_sec.";\n";

    $manifest = "CACHE MANIFEST\n";
    $manifest = $manifest."CACHE:\n";
    $manifest = $manifest."icon01.gif\n";
    $manifest = $manifest."arrow.png\n";
    $manifest = $manifest."pin.png\n";
    $manifest = $manifest."button.png\n";
    $manifest = $manifest."styles.css\n";
    $manifest = $manifest."ecorisnavi.js\n";
    $map_img_html = "";
    for ($xstep = 0; $xstep < 4; $xstep++) {
	$leftval = $xstep * 300;
	$map_img_html = $map_img_html."<div style='top:0px;left:{$leftval}px;position:absolute;width:300px;height:1200px;z-index:1;'>\n";
	for ($ystep = 3; $ystep >= 0; $ystep--) {
	    $foldername_a = $mesh_arealeft_sec * 100 + $res * 100 * $xstep;
	    $foldername_b = $mesh_areabottom_sec * 100 + $res * 100 * $ystep;
	    $imgurl = "http://cyberjapandata.gsi.go.jp/data/".$res."nti/new/".$foldername_a."/".$foldername_a."-".$foldername_b."-img.png";

	    $manifest = $manifest."{$imgurl}\n";

	    $map_img_html = $map_img_html."<img src='{$imgurl}' width='300px' height='300px' style='vertical-align: bottom;'>\n";

	}
	$map_img_html = $map_img_html."</div>\n";
    }



    // 乱数を生成してファイル名に
    $filename = rand(1000000, 9999999).".html";
    $manifest_filename = $filename.".appcache";

    // ※4 テンプレートファイルの読み込み
    $contents = file_get_contents($template);
    $contents = str_replace("<%MAPIMAGE>", $map_img_html, $contents);
    $contents = str_replace("<%MANIFEST>", $manifest_filename, $contents);
    $contents = str_replace("<%CANVAS_AREA_VAL>", $canvas_area_val, $contents);

    // ファイル生成＆書き込み
    $handle = fopen($filename, 'w');
    fwrite($handle, $contents);
    fclose($handle);
    //マニフェスト生成
    $handle = fopen($manifest_filename, 'w');
    fwrite($handle, $manifest);
    fclose($handle);

    // メッセージ表示
    echo "<a href='$filename'>$filename</a>";
} else {
    echo "フォームから記事の内容を送信してください。";
}

?>
</body >
</html >
