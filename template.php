<!doctype html>
<html lang="ja" manifest="<%MANIFEST>">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>FIELD_WORKER(α版)</title>
<link rel="stylesheet" type="text/css" href="styles.css">
<script type="text/javascript">
<%CANVAS_AREA_VAL>
</script>
<script src = "jsgt_indicator003.js" charset="utf-8"></script>
<script src="fieldworker_offline.js" charset="utf-8"></script>
</head>
<body style="margin:0px;">

<div id="main" style="position:absolute;width:100%;height:100%;overflow: hidden;">
<div id="navbar" style="top:5px;left:35px;position:absolute; z-index:10;">
<ul>
<li id="editor_li" onmouseover="document.getElementById('z_pop').style.visibility='visible'" onmouseout="document.getElementById('z_pop').style.visibility='hidden'">
<div id="pointbtn">POINT</div>
  <ul id="z_pop">
    <li id="linebtn"><div>LINE</div></li>
    <li id="polybtn"><div>POLYGON</div></li>
  </ul>
</li>
<li onmouseover="document.getElementById('a_pop').style.visibility='visible'" onmouseout="document.getElementById('a_pop').style.visibility='hidden'">
<div id="exportbtn">EXPORT</div>
  <ul id="a_pop">
    <li id="importbtn"><div>IMPORT</div></li>
    <li id="loadbtn"><div>LOAD</div></li>
    <li id="clearbtn"><div>CLEAR</div></li>
    <li id="loginbtn"><div>LOGIN</div></li>
  </ul>
</li>
</ul>
</div>
<div id="indidiv" style="top:-100px;left:-100px;position:absolute;z-index:1003;"></div>
<div id="map" style="position: absolute;width:<%WIDTH>px;height:<%HEIGHT>px;overflow: hidden;">
<%MAPIMAGE>
<!------------------------- popup ----------------------->
<div id="attribute_popup" style="visibility:hidden;top:-100px;left:-100px;position:absolute; z-index:10;">
<div class="balloon-body">
<input id="lon" type="hidden">
<input id="lat" type="hidden">
<input id="markid" type="hidden">
<table>
<tbody>
<tr>
<td>
NAME<br>
<input id="name" type="text">
</td>
</tr>
<tr>

<td>
MEMO<br>
<textarea id="memo"></textarea>
</td>
</tr>
</tbody>
</table>
<span id="deletebtn" class="btn">削除</span><span id="cancelbtn" class="btn">キャンセル</span><span id="okbtn" class="btn">OK</span>
<div class="balloon-triangle">
</div>
</div>
</div>
<!--------------------------------------------------------------->
<!--
<div style="top:<%STAMP_HEIGHT>px;left:0px;position:absolute; z-index:2;">
<img src="stamp.gif" width="50px" height="50px">
</div>
-->
<div id="arrow" style="user-select: none;-webkit-user-select: none;position:absolute;width:30px;height:30px;top:-100px;left:-100px;z-index:2;">
<img src="arrow.png">
</div>
<svg id="svg" style="top:0px;left:0px;position:absolute; z-index:3;" width="<%WIDTH>px" height="<%HEIGHT>px">
</svg>
<canvas style="top:0px;left:0px;position:absolute; z-index:3;" id="canvas" width="<%WIDTH>px" height="<%HEIGHT>px"></canvas>
</div>
<div id="light" class="white_content">
<div style="text-align:right">
<a href = "javascript:void(0)"  onclick = "document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'">Close</a>
</div>
<h3>FIELD_WORKER(α版)の使い方</h3>
<p>
国土地理院の地形図をスマートフォンから閲覧できるウェブアプリです。
<br>
特定の場所をCLIPしておくと圏外でも地形図を表示できます。
</p>
<p>
ナビ、データ入力（飛翔図、確認地点、植生図）の機能を追加予定...
</p>
<p>
最終的には、現場に持っていける電子野帳を目指してます。
</p>

<h4>使い方</h4>
<ol>
<li>ドラッグで移動、ホイールで拡大縮小</li>
<li>切り出したい場所を画面の中心にあわせて"CLIP"を押す。</li>
<li>切り出した地図のページをiphoneで「ホーム画面に追加」する。</li>
<li>圏外の場所で表示させる。</li>
</ol>
<p>
<a href="http://portal.cyberjapan.jp/kiyaku.html#haikei">国土地理院背景地図等データ利用規約</a>
</p>
</div>
<div id="fade" class="black_overlay"></div>
</div>
</body>
</html>
