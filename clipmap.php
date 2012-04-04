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

if ($_POST['center_x'] && $_POST['center_y']&& $_POST['res']) {
    
    $numx = 6;
    $numy = 6;
    $res = $_POST['res'];
    $point_x = $_POST['center_x'];
    $point_y = $_POST['center_y'];
    $point_arealeft_sec = round(($point_x*3600)/$res)*$res;
    $point_areabottom_sec = round($point_y*3600/$res)*$res;

    $mesh_arealeft_sec = $point_arealeft_sec;
    $mesh_areabottom_sec = $point_areabottom_sec;
    $canvas_area_val = "var mres = ".$res.";\n";
    $canvas_area_val = $canvas_area_val."var mnum = " . $numx .";\n";
    $canvas_area_val = $canvas_area_val."var mleft = ".($mesh_arealeft_sec - $res * $numx/2).";\n";
    $canvas_area_val = $canvas_area_val."var mbottom = ".($mesh_areabottom_sec - $res * $numy/2).";\n";

    $manifest = "CACHE MANIFEST\n";
    $manifest = $manifest."CACHE:\n";
    $manifest = $manifest."stamp.gif\n";
    $manifest = $manifest."arrow.png\n";
    $manifest = $manifest."pin.png\n";
    $manifest = $manifest."button.png\n";
    $manifest = $manifest."plus.png\n";
    $manifest = $manifest."minus.png\n";
    $manifest = $manifest."move.png\n";
    $manifest = $manifest."pleasewait.gif\n";
    $manifest = $manifest."styles.css\n";
    $manifest = $manifest."fieldworker_offline.js\n";
    $manifest = $manifest."jsgt_indicator003.js\n";
    $map_img_html = "";

    if($res <120)
     	$imgbaseurl = "http://cyberjapandata.gsi.go.jp/data/" . $res . "nti/new/";
    else if($res < 7680)
     	$imgbaseurl = "http://cyberjapandata.gsi.go.jp/data/" . $res . "bafd/new/";
    else
	$imgbaseurl = "http://cyberjapandata.gsi.go.jp/data/raster/" . $res . "/new/";


    for ($xstep = 0; $xstep < $numx; $xstep++) {
	$leftval = $xstep * 300;
	$map_img_html = $map_img_html."<div style='top:0px;left:{$leftval}px;position:absolute;width:300px;height:". 300*$numy ."px;z-index:1;'>\n";
	for ($ystep =$numy/2-1; $ystep >= -1*$numy/2; $ystep--) {
	    $foldername_a = $mesh_arealeft_sec * 100 + $res * 100 * ($xstep-$numx/2);
	    $foldername_b = $mesh_areabottom_sec * 100 + $res * 100 * $ystep;
	    $imgurl = $imgbaseurl . $foldername_a."/".$foldername_a."-".$foldername_b."-img.png";
	    $manifest = $manifest."{$imgurl}\n";
	    $map_img_html = $map_img_html."<img src='{$imgurl}' width='300px' height='300px' style='vertical-align: bottom;'>\n";
	}
	$map_img_html = $map_img_html."</div>\n";
    }



    // 乱数を生成してファイル名に
    $filename = "t" . rand(1000000, 9999999).".html";
    $manifest_filename = $filename.".appcache";

    // ※4 テンプレートファイルの読み込み
    $contents = file_get_contents($template);
    $contents = str_replace("<%MAPIMAGE>", $map_img_html, $contents);
    $contents = str_replace("<%MANIFEST>", $manifest_filename, $contents);
    $contents = str_replace("<%CANVAS_AREA_VAL>", $canvas_area_val, $contents);
    $contents = str_replace("<%WIDTH>", 300*$numx, $contents);
    $contents = str_replace("<%HEIGHT>", 300*$numy, $contents);
    $contents = str_replace("<%STAMP_HEIGHT>", 300*$numy-50, $contents);

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
    echo "<p>↑リンク先のページを<br>iPhoneで「ホーム画面に追加」すると<br>オフラインで地図&GPSを利用できます。</p>";
} else {
    echo "エラー";
}

?>
</body >
</html >
