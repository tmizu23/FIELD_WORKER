var map;
var canvas;
var context;

var clip;
var zoomout;
var zoomin;
var stamp;

var mapimgurl;
var dragflag = false;

var res;
var resarray =[30720, 15360, 7680, 3840, 1920, 960, 480, 240, 120, 60, 30, 15];
var scalelevel = 0;
var _xstepmax;			//X方向のタイル取得枚数の半分
var _ystepmax;			//Y方向のタイル取得枚数の半分
var tileWidth = 300;		//タイルの幅
var tileHeight = 300;		//タイルの高さ

var lon;			//GPSのX座標
var lat;			//GPSのY座標

var cwidth;			//canvasの幅（ピクセル）
var cheight;			//canvasの高さ（ピクセル）

var start_sx = 0;		//移動開始のscreenX座標
var start_sy = 0;		//移動開始のscreenY座標
var swidth;			//screenの幅（幅）
var sheight;			//screenの高さ（高さ）

var center_x = 139;		//中心X座標
var center_y = 37.5;		//中心Y座標
var new_center_x = center_x;	//移動後の中心X座標
var new_center_y = center_y;	//移動後の中心Y座標

var move_count = 0;		//移動時の再描画の間隔に使用
var gesture_count = 0;		//拡大縮小時の再描画の間隔に使用


var BGPSupportsTouches = ("createTouch" in document);
var BGPStartEvent = BGPSupportsTouches ? "touchstart" : "mousedown";
var BGPMoveEvent = BGPSupportsTouches ? "touchmove" : "mousemove";
var BGPEndEvent = BGPSupportsTouches ? "touchend" : "mouseup";


window.onresize = function()
{
    swidth = cwidth = document.documentElement.clientWidth;
    sheight = cheight = document.documentElement.clientHeight;
    _xstepmax = Math.ceil(swidth / tileWidth / 2) + 1;
    _ystepmax = Math.ceil(sheight / tileHeight / 2) + 1;
    canvas.setAttribute("width", cwidth + "px");
    canvas.setAttribute("height", cheight + "px");
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (sheight - 30) + "px;left:0px;position:absolute; z-index:3;";
    clip.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (sheight - 36) + "px;left:" + (swidth - 62) + "px;position:absolute; z-index:3;";
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:30px;left:" + (swidth - 27) + "px;position:absolute; z-index:3;";
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:2px;left:" + (swidth - 27) + "px;position:absolute; z-index:3;";
    addTikeizu(center_x, center_y);
}

window.onload = function()
{
    map = document.getElementById("map");
    swidth = cwidth = document.documentElement.clientWidth;
    sheight = cheight = document.documentElement.clientHeight;
    _xstepmax = Math.ceil(cwidth / tileWidth / 2) + 1;
    _ystepmax = Math.ceil(cheight / tileHeight / 2) + 1;

    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", cwidth + "px");
    canvas.setAttribute("height", cheight + "px");
    canvas.style.cssText = "top:0px;left:0px;position:absolute; z-index:1;";
    map.appendChild(canvas);

    stamp = document.createElement("div");
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (sheight - 30) + "px;left:0px;position:absolute; z-index:3;";
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "stamp.gif");
    stampimg.setAttribute("width", "30px");
    stampimg.setAttribute("height", "30px");
    stampimg.setAttribute("onclick", "document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'");
    stamp.appendChild(stampimg);
    map.appendChild(stamp);

    zoomout = document.createElement("div");
    zoomout.setAttribute("id", "zoomoutbtn");
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:30px;left:" + (swidth - 27) + "px;position:absolute; z-index:3;";
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "minus.png");
    stampimg.setAttribute("width", "25px");
    stampimg.setAttribute("height", "25px");
    zoomout.appendChild(stampimg);
    map.appendChild(zoomout);

    zoomin = document.createElement("div");
    zoomin.setAttribute("id", "zoominbtn");
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:2px;left:" + (swidth - 27) + "px;position:absolute; z-index:3;";
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "plus.png");
    stampimg.setAttribute("width", "25px");
    stampimg.setAttribute("height", "25px");
    zoomin.appendChild(stampimg);
    map.appendChild(zoomin);

    clip = document.createElement("div");
    clip.setAttribute("id", "clipbtn");
    clip.setAttribute("class", "button blue");
    clip.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (sheight - 36) + "px;left:" + (swidth - 62) + "px;position:absolute; z-index:3;";
    if (typeof clip.textContent != "undefined") {
	clip.textContent = "CLIP";
    } else {
	clip.innerText = "CLIP";
    }
    map.appendChild(clip);

    var arrow = document.createElement("div");
    arrow.setAttribute("id", "arrow");
    arrow.style.cssText = "user-select: none;-webkit-user-select: none;-moz-user-select: none;position:absolute;width:30px;height:30px;top:-100px;left:-100px;z-index:3;";
    var arrowimg = document.createElement("img");
    arrowimg.setAttribute("src", "arrow.png");
    arrowimg.setAttribute("width", "30px");
    arrowimg.setAttribute("height", "30px");
    arrow.appendChild(arrowimg);
    map.appendChild(arrow);

    var navibtn = document.createElement("div");
    navibtn.setAttribute("id", "navibtn");
    navibtn.setAttribute("class", "navibtn");
    navibtn.style.cssText = "user-select: none;-webkit-user-select: none;-moz-user-select: none;top:5px;left:2px;position:absolute; z-index:3;";
    var arrowimg = document.createElement("img");
    arrowimg.setAttribute("src", "arrow.png");
    arrowimg.setAttribute("width", "15px");
    arrowimg.setAttribute("height", "18px");
    navibtn.appendChild(arrowimg);
    map.appendChild(navibtn);
    navibtn.addEventListener("click", naviStart, false);

    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    map.addEventListener(BGPStartEvent, touchStart, false);
    map.addEventListener(BGPMoveEvent, touchMove, false);
    map.addEventListener(BGPEndEvent, touchEnd, false);
    map.addEventListener("gesturechange", gestureChange, false);

    document.getElementById("clipbtn").addEventListener("click", clipMap, false);
    document.getElementById("zoomoutbtn").addEventListener("click", zoomOut, false);
    document.getElementById("zoominbtn").addEventListener("click", zoomIn, false);

    res = 30720;
    mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    scalelevel = 0;

    addTikeizu(center_x, center_y);

}

function zoomIn()
{
    handle(1);
}

function zoomOut()
{
    handle(-1);
}

function addTikeizu(point_x, point_y)
{

    point_arealeft_sec = Math.floor((point_x * 3600) / res) * res;
    var point_arealeft = point_arealeft_sec / 3600;
    var point_arearight = point_arealeft + res / 3600;

    point_areabottom_sec = Math.floor(point_y * 3600 / res) * res;
    var point_areabottom = point_areabottom_sec / 3600;
    var point_areatop = point_areabottom + res / 3600;

    var diffx = (point_x - point_arealeft) * 3600 * tileWidth / res;
    var diffy = (point_y - point_areabottom) * 3600 * tileHeight / res;


    for (var xstep = -1 * _xstepmax + 1; xstep < _xstepmax; xstep++) {
	for (var ystep = -1 * _ystepmax + 1; ystep < _ystepmax; ystep++) {
	    var foldername_a = point_arealeft_sec * 100 + res * 100 * xstep;
	    var foldername_b = point_areabottom_sec * 100 + res * 100 * ystep;
	    var imgurl = mapimgurl + foldername_a + "/" + foldername_a + "-" + foldername_b + "-img.png";
	    var drawX = (cwidth / 2) + xstep * tileWidth;
	    var drawY = (cheight / 2) - (ystep + 1) * tileHeight;
	    loadImage(imgurl, drawX - diffx, drawY + diffy, tileWidth, tileHeight);
	}
    }

}

function loadImage(imgurl, drawX, drawY, tileWidth, tileHeight)
{
    var img = new Image();
    img.src = imgurl;
    img.onload = function() {
	context.drawImage(img, drawX, drawY, tileWidth, tileHeight);
    }
}


function clipMap()
{
    document.getElementById("center_x").value = center_x;
    document.getElementById("center_y").value = center_y;
    document.getElementById("res").value = res;
    document.getElementById("clipform").submit();
}

function navi(position)
{
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    var accuracy = position.coords.accuracy;

    addTikeizu(lon, lat);

    center_x = new_center_x = lon;	//ズームボタンを押した時にtouchendが呼ばれる関係でnew_center_xにも代入しておく。
    center_y = new_center_y = lat;

    var heading = position.coords.heading;
    if (heading) {
	document.getElementById('arrow').style.WebkitTransform = "rotate(" + heading + "deg)";
    }
//    if (accuracy < 50) {
    document.getElementById('arrow').style.left = cwidth / 2 - 15 + "px";
    document.getElementById('arrow').style.top = cheight / 2 - 15 + "px";
//    }

}


var watchId = null;
function naviStart()
{
    if (watchId !== null) {
	document.getElementById("navibtn").setAttribute("class", "navibtn");
	navigator.geolocation.clearWatch(watchId);
	document.getElementById('arrow').style.left = "-100px";
	document.getElementById('arrow').style.top = "-100px";
	watchId = null;
    } else {
	document.getElementById("navibtn").setAttribute("class", "navibtn2");
	watchId = navigator.geolocation.watchPosition(navi, null, {
      enableHighAccuracy:			      true}
	);
    }
}

function touchStart(event)
{
    dragflag = true;
    if (BGPSupportsTouches) {
	var i = 0;
	var l = event.touches.length;
	var x = 0;
	var y = 0;
	for (i = 0; i < l; i++) {
	    x += event.touches[i].pageX;
	    y += event.touches[i].pageY;
	}
	start_sx = x / l;
	start_sy = y / l;
    } else {
	if (typeof event.x != "undefined") {
	    start_sx = event.x;
	    start_sy = event.y;

	} else {
	    start_sx = event.clientX;
	    start_sy = event.clientY;
	}

    }

}

function touchMove(event)
{
    if (!dragflag)
	return;
    event.preventDefault();
    if (BGPSupportsTouches) {
	var i = 0;
	var l = event.touches.length;
	var x = 0;
	var y = 0;
	for (i = 0; i < l; i++) {
	    x += event.touches[i].pageX;
	    y += event.touches[i].pageY;
	}
	var _sx = x / l;
	var _sy = y / l;

	new_center_x = center_x - (_sx - start_sx) * res / (tileWidth * 3600);
	new_center_y = center_y + (_sy - start_sy) * res / (tileHeight * 3600);
    } else {
	var _eventx, _eventy;
	if (typeof event.x != "undefined") {
	    _eventx = event.x;
	    _eventy = event.y;

	} else {
	    _eventx = event.clientX;
	    _eventy = event.clientY;
	}

	new_center_x = center_x - (_eventx - start_sx) * res / (tileWidth * 3600);
	new_center_y = center_y + (_eventy - start_sy) * res / (tileHeight * 3600);
    }

    move_count++;

    if (move_count % 10 == 0) {	//再描画が追いつかないので15回に一回だけ
	addTikeizu(new_center_x, new_center_y);
    }
}


function touchEnd(event)
{
    dragflag = false;
    center_x = new_center_x;
    center_y = new_center_y;

}


function gestureChange(event)
{
    if (gesture_count++ % 15 != 0)
	return;
    var s;
   
    if (event.scale < 1 && scalelevel > 0) {	//縮小の余地があるなら
	scalelevel = (scalelevel == 0) ? 0 : scalelevel - 1;
	s = 0.5;
    } else if (event.scale > 1 && scalelevel < 11) {	//拡大の余地があるなら
	scalelevel = (scalelevel == 11) ? 11 : scalelevel + 1;
	s = 2.0;
    } else {
	return;
    }

    res = resarray[scalelevel];
    if (res < 120)
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "nti/new/";
    else if (res < 7680)
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "bafd/new/";
    else
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    context.clearRect(0, 0, canvas.width, canvas.height);
    addTikeizu(center_x, center_y);
}

function handle(delta)
{
    if (delta < 0 && scalelevel > 0) {	//縮小の余地があるなら
	scalelevel = (scalelevel == 0) ? 0 : scalelevel - 1;
	s = 0.5;
    } else if (delta > 0 && scalelevel < 11) {	//拡大の余地があるなら
	scalelevel = (scalelevel == 11) ? 11 : scalelevel + 1;
	s = 2.0;
    } else {
	return;
    }

    res = resarray[scalelevel];
    if (res < 120)
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "nti/new/";
    else if (res < 7680)
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "bafd/new/";
    else
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    context.clearRect(0, 0, canvas.width, canvas.height);
    addTikeizu(center_x, center_y);

}

function wheel(event)
{
    var delta = 0;
    if (!event)			/* For IE. */
	event = window.event;
    if (event.wheelDelta) {	/* IE/Opera. */
	delta = event.wheelDelta / 120;
	if (window.opera)
	    delta = -delta;
    } else if (event.detail) {	   /** Mozilla case. */
	delta = -event.detail / 3;
    }
    if (delta)
	handle(delta);
    if (event.preventDefault) {
	event.preventDefault();
    }
    event.returnValue = false;
}

if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = wheel;
//= document.onmousewheel = wheel;
