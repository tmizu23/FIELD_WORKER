<!doctype html>
<html lang="ja" manifest="ecorisnavi.appcache">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<title>ecoris navi</title>


<script type="text/javascript">
var canvas;
var context;

 
 var res = 30;

 var point_x = 136.81733128356934;
 var point_y = 35.200814937159784;
 var point_arealeft_sec;
 var point_areabottom_sec;
 
window.onload=function(){ 
 canvas = document.getElementById("canvas");
 context =canvas.getContext('2d');
 context.clearRect(0,0,canvas.width,canvas.height);
 var origin_x_sec = 439200;
 var origin_y_sec = 72000;
 point_arealeft_sec = Math.floor((point_x*3600-origin_x_sec)/res)*res+origin_x_sec;
 var point_arealeft = point_arealeft_sec/3600;
 var point_arearight = point_arealeft + res/3600;
 point_areabottom_sec = Math.floor((point_y*3600-origin_y_sec)/res)*res+origin_y_sec;
 var point_areabottom = point_areabottom_sec/3600;
 var point_areatop = point_areabottom + res/3600;
 startnavi();
}

function addTikeizu(){

 var origin_x_sec = 439200;
 var origin_y_sec = 72000;
 point_arealeft_sec = Math.floor((point_x*3600-origin_x_sec)/res)*res+origin_x_sec;
 var point_arealeft = point_arealeft_sec/3600;
 var point_arearight = point_arealeft + res/3600;
 point_areabottom_sec = Math.floor((point_y*3600-origin_y_sec)/res)*res+origin_y_sec;
 var point_areabottom = point_areabottom_sec/3600;
 var point_areatop = point_areabottom + res/3600;

 for(var xstep=-2;xstep<2;xstep++){
   for(var ystep=-2;ystep<2;ystep++){ 
     var foldername_a = point_arealeft_sec * 100 + res*100*xstep;
	 var foldername_b = point_areabottom_sec * 100 + res*100*ystep;
	 var imgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "nti/new/" + foldername_a + "/" + foldername_a + "-" + foldername_b + "-img.png";
	 var sizeWidth = 300;
	 var sizeHeight = 300;
	 var drawX = (xstep+2)*sizeWidth;
	 var drawY = 1200-(ystep+3)*sizeHeight;
	 loadImage(imgurl,drawX,drawY,sizeWidth,sizeHeight);
	 document.getElementById("tt").value= document.getElementById("tt").value +"\n"+ imgurl;
   }
 }
 //loadImage("icon01.gif",0,1150,50,50);

}

function loadImage(imgurl,drawX,drawY,sizeWidth,sizeHeight){
	var img = new Image();
	img.src = imgurl;
	img.onload = function(){
	  context.drawImage(img,drawX,drawY,sizeWidth,sizeHeight);
    }
}
function startnavi(){
 var canvas_arealeft_sec = point_arealeft_sec - 2*res;
 var canvas_areabottom_sec = point_areabottom_sec - 2*res;
  navigator.geolocation.watchPosition(function(position){
 var lat = position.coords.latitude;
 var lon = position.coords.longitude;
 var canvas_x = Math.round(1200*(3600*lon-canvas_arealeft_sec)/(res*4));
 var canvas_y = 1200-Math.round(1200*(3600*lat-canvas_areabottom_sec)/(res*4));
 context.fillStyle = 'yellow';
 context.strokeStyle = 'red';
 context.arc(canvas_x,canvas_y,5,0,360,false);
 //context.fill();
 context.stroke();
 },null,{ enableHighAccuracy: true });
}

</script>
</head>
<body style="margin:0px;">

<?php
$res = 30;
$meshcode = $_POST['meshcode'];
$n1 = floor($meshcode / 1000000);
$n2 = floor(($meshcode-$n1*1000000)/10000);
$n3 = floor(($meshcode-$n1*1000000-$n2*10000)/1000);
$n4 = floor(($meshcode-$n1*1000000-$n2*10000-$n3*1000)/100);
$n5 = floor(($meshcode-$n1*1000000-$n2*10000-$n3*1000-$n4*100)/10);
$n6 = $meshcode-$n1*1000000-$n2*10000-$n3*1000-$n4*100-$n5*10;
$mesh_arealeft_sec = ($n2+100)*3600+450*$n4+45*$n6;
$mesh_areabottom_sec = $n1*3600/1.5+300*$n3+30*$n5;

//$fp = @fopen("ecorisnavi.appcache", "w") or die("Error!!n");
//fputs($fp, "CACHE MANIFEST\n");
//fputs($fp, "CACHE:\n");
//fputs($fp, "icon01.gif\n");
for ($xstep=0;$xstep<4;$xstep++){
 $leftval = $xstep * 300;
 echo "<div style='top:0px;left:{$leftval}px;position:absolute;width:300px;height:1200px;z-index:1;'>\n";
 for ($ystep=3;$ystep>=0;$ystep--){
  $foldername_a = $mesh_arealeft_sec * 100 + $res*100*$xstep;
  $foldername_b = $mesh_areabottom_sec * 100 + $res*100*$ystep;
  $imgurl = "http://cyberjapandata.gsi.go.jp/data/" . $res . "nti/new/" . $foldername_a . "/" . $foldername_a . "-" . $foldername_b . "-img.png";
    
//  fputs($fp, "{$imgurl}\n");  
    
  echo "<img src='{$imgurl}' width='300px' height='300px' style='vertical-align: bottom;'>\n";

 }
 echo "</div>\n";
}
//fclose($fp);
?>

<div style="top:1150px;left:0px;position:absolute; z-index:2;">
<img src="icon01.gif" width="50px" height="50px">
</div>
<canvas style="top:0px;left:0px;position:absolute; z-index:3;" id="canvas" width="1200px" height="1200px"></canvas>
<!--<input type="button" value="watch position" onclick="startnavi();">-->

</body>
</html>
