var canvas;
var context;
var map;
var svg;
var clip;
var zoomout;
var zoomin;
var stamp;
var res;
var resarray = [30720,15360,7680,3840,1920,960,480,240,120,60,30,15];
var mapimgurl;
var dragflag = false;
var moveflag = true;
var pointflag = false;
var lineflag = false;
var polyflag = false;

var lon;			//GPSのX座標
var lat;			//GPSのY座標

var mx;				//mapX座標（経度）
var my;				//mapY座標（緯度）
var mwidth;			//mapの幅（秒）
var mheight;			//mapの高さ（秒）
//var mres = 30;			//mapのセルサイズ(秒)
//var mnum = 4;			//mapの1辺の枚数

var cx;				//canvasX座標
var cy;				//canvasY座標
var start_cx = 0;		//移動開始のcanvasX座標
var start_cy = 0;		//移動開始のcanvasX座標
var cleft = 0;			//canvas左座標
var ctop = 0;			//canvas上座標
var new_cleft = 0;		//移動後のcanvas左座標
var new_ctop = 0;		//移動後のcanvas上座標
var cscale = 1.0;		//canvasスケール
var cwidth;			//canvasの幅（ピクセル）
var cheight;			//canvasの高さ（ピクセル）

var sx;				//screenX座標
var sy;				//screenY座標
var start_sx = 0;		//移動開始のscreenX座標
var start_sy = 0;		//移動開始のscreenY座標
//var swidth = 320;		//screenの幅（幅）使用しない？
//var sheight = 480;		//screenの高さ（高さ）使用しない？

var center_x = 139;		//canvasの中心X座標
var center_y = 37.5;		//canvasの中心Y座標
var new_center_x = center_x;	//移動後のcanvasの中心X座標
var new_center_y = center_y;	//移動後のcanvasの中心Y座標

var pinimg;
var linedata;
var polydata;

var line;
var polygon;
var dbltap = false;
var oldpoints;

var loginflag = false;

var mleft;//範囲の左の緯度経度の秒
var mbottom;//範囲の下の緯度経度の秒

var BGPSupportsTouches = ("createTouch" in document);
var BGPStartEvent = BGPSupportsTouches ? "touchstart" : "mousedown";
var BGPMoveEvent = BGPSupportsTouches ? "touchmove" : "mousemove";
var BGPEndEvent = BGPSupportsTouches ? "touchend" : "mouseup";

function m2c(_mxy)
{
    var _cx = Math.round(cwidth * (3600 * _mxy.x - mleft) / mwidth);
    var _cy = cheight - Math.round(cheight * (3600 * _mxy.y - mbottom) / mheight);
    return {
  x: _cx, y:_cy};
}

function c2m(_cxy)
{
    var _mx = (_cxy.x * mwidth / cwidth + mleft) / 3600;
    var _my = (mheight * (cheight - _cxy.y) / cheight + mbottom) / 3600;
    return {
  x: _mx, y:_my};
}

var _xstepmax;		//X方向のタイル取得枚数の半分
var _ystepmax;		//Y方向のタイル取得枚数の半分
var tileWidth = 300;	//タイルの幅
var tileHeight = 300;	//タイルの高さ

window.onresize =function(){
    cwidth = document.documentElement.clientWidth;
    cheight = document.documentElement.clientHeight;
    _xstepmax = Math.ceil(cwidth/tileWidth/2)+1;
    _ystepmax = Math.ceil(cheight/tileHeight/2)+1;
    canvas.setAttribute("width", cwidth + "px");
    canvas.setAttribute("height", cheight + "px");
    svg.setAttribute("width", cwidth*3 + "px");
    svg.setAttribute("height", cheight*3 + "px");
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (cheight - 30) + "px;left:0px;position:absolute; z-index:3;"
    clip.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (cheight - 36) + "px;left:" + (cwidth - 62) + "px;position:absolute; z-index:3;"
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:30px;left:" + (cwidth-27) + "px;position:absolute; z-index:3;"
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:2px;left:" + (cwidth-27) + "px;position:absolute; z-index:3;"
    addTikeizu(center_x,center_y);
}

window.onload = function()
{
    map = document.getElementById("map");
    //cwidth = cwidth = document.getElementById("map").style.width.replace("px","");
    //cheight = cheight = document.getElementById("map").style.height.replace("px","");
    cwidth = document.documentElement.clientWidth;
    cheight = document.documentElement.clientHeight;
    _xstepmax = Math.ceil(cwidth/tileWidth/2)+1;
    _ystepmax = Math.ceil(cheight/tileHeight/2)+1;
   
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", cwidth + "px");
    canvas.setAttribute("height", cheight + "px");
    canvas.style.cssText = "top:0px;left:0px;position:absolute; z-index:1;"
    map.appendChild(canvas);

    svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("id", "svg");
    svg.setAttribute("width", cwidth*3 + "px");
    svg.setAttribute("height", cheight*3 + "px");
    svg.style.cssText = "top:0px;left:0px;position:absolute; z-index:3;"
    map.appendChild(svg);

    stamp = document.createElement("div");
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (cheight - 30) + "px;left:0px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "icon01.gif");
    stampimg.setAttribute("width","30px");
    stampimg.setAttribute("height","30px");
    stampimg.setAttribute("onclick","document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'");
    stamp.appendChild(stampimg);
    map.appendChild(stamp);
    
    zoomout = document.createElement("div");
    zoomout.setAttribute("id", "zoomoutbtn");
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:30px;left:" + (cwidth-27) + "px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "minus.png");
    stampimg.setAttribute("width","25px");
    stampimg.setAttribute("height","25px");
    zoomout.appendChild(stampimg);
    map.appendChild(zoomout);

    zoomin = document.createElement("div");
    zoomin.setAttribute("id", "zoominbtn");
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:2px;left:" + (cwidth-27) + "px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "plus.png");
    stampimg.setAttribute("width","25px");
    stampimg.setAttribute("height","25px");
    zoomin.appendChild(stampimg);
    map.appendChild(zoomin);

    clip = document.createElement("div");
    clip.setAttribute("id", "clipbtn");
    clip.setAttribute("class", "button blue");
    clip.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;-moz-user-select: none;top:" + (cheight - 36) + "px;left:" + (cwidth - 62) + "px;position:absolute; z-index:3;"
    if (typeof clip.textContent != "undefined") {
	clip.textContent = "CLIP";
    } else {
	clip.innerText = "CLIP";
    }
    map.appendChild(clip);

    var arrow = document.createElement("div");
    arrow.setAttribute("id", "arrow");
    arrow.style.cssText = "user-select: none;-webkit-user-select: none;-moz-user-select: none;position:absolute;width:30px;height:30px;top:-100px;left:-100px;z-index:3;"
    var arrowimg = document.createElement("img");
    arrowimg.setAttribute("src", "arrow.png");
    arrowimg.setAttribute("width","30px");
    arrowimg.setAttribute("height","30px");
    arrow.appendChild(arrowimg);
    map.appendChild(arrow);
    
    
    var navibtn = document.createElement("div");
    navibtn.setAttribute("id", "navibtn");
    navibtn.setAttribute("class", "navibtn");
    //navibtn.setAttribute("onclick", "button small");
    navibtn.style.cssText = "user-select: none;-webkit-user-select: none;-moz-user-select: none;top:5px;left:2px;position:absolute; z-index:3;"
    var arrowimg = document.createElement("img");
    arrowimg.setAttribute("src", "arrow.png");
    arrowimg.setAttribute("width","15px");
    arrowimg.setAttribute("height","18px");
    navibtn.appendChild(arrowimg);
    map.appendChild(navibtn);
    navibtn.addEventListener("click", naviStart, false);

    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    pinimg = new Image();
    pinimg.src = "pin.png";
    map.addEventListener(BGPStartEvent, touchStart, false);
    map.addEventListener(BGPMoveEvent, touchMove, false);
    map.addEventListener(BGPEndEvent, touchEnd, false);
    map.addEventListener("gesturechange", gestureChange, false);
    //map.addEventListener("mousemove", mouseMove, false);

    document.getElementById("clipbtn").addEventListener("click", clipMap, false);
    document.getElementById("zoomoutbtn").addEventListener("click", zoomOut, false);
    document.getElementById("zoominbtn").addEventListener("click", zoomIn, false);
/*
    document.getElementById("loadbtn").addEventListener("click", loadData, false);
    document.getElementById("importbtn").addEventListener("click", dataImport, false);
    document.getElementById("exportbtn").addEventListener("click", dataExport, false);
    
    document.getElementById("markbtn").addEventListener("click", positionMark, false);
    document.getElementById("movebtn").addEventListener("click", moveStart, false);
    document.getElementById("pointbtn").addEventListener("click", pointDraw, false);
    document.getElementById("linebtn").addEventListener("click", lineDraw, false);
    document.getElementById("polybtn").addEventListener("click", polyDraw, false);
    document.getElementById("clearbtn").addEventListener("click", dataClear, false);
    document.getElementById("loginbtn").addEventListener("click", googleLogin, false);
*/
    loginflag=(location.search.substring(1).split("="))[1];
    if(loginflag){
	 document.getElementById("login").href = "/gps/logout.php";
	 document.getElementById("login").innerText = "logout";
    }
    res = 30720;
    mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    scalelevel = 0;
    
    addTikeizu(center_x,center_y);

}

function zoomIn(){
  handle(1);
}
function zoomOut(){
  handle(-1);
}
 
function addTikeizu(point_x,point_y){
 
 point_arealeft_sec = Math.floor((point_x*3600)/res)*res;
 var point_arealeft = point_arealeft_sec/3600;
 var point_arearight = point_arealeft + res/3600;
 
 point_areabottom_sec = Math.floor(point_y*3600/res)*res;
 var point_areabottom = point_areabottom_sec/3600;
 var point_areatop = point_areabottom + res/3600;

 var diffx = (point_x-point_arealeft)*3600*300/res;
 var diffy = (point_y-point_areabottom)*3600*300/res;


 for(var xstep=-1*_xstepmax+1;xstep<_xstepmax;xstep++){
   for(var ystep=-1*_ystepmax+1;ystep<_ystepmax;ystep++){ 
     	 var foldername_a = point_arealeft_sec * 100 + res*100*xstep;
	 var foldername_b = point_areabottom_sec * 100 + res*100*ystep;
	 var imgurl = mapimgurl + foldername_a + "/" + foldername_a + "-" + foldername_b + "-img.png";	 
	 var drawX = (cwidth/2)+xstep*tileWidth;;
	 var drawY = (cheight/2)-(ystep+1)*tileHeight;
	 loadImage(imgurl,drawX-diffx,drawY+diffy,tileWidth,tileHeight);
   }
 }

 	mwidth = cwidth*res/tileWidth;
        mheight= cheight*res/tileHeight; 
        mleft = center_x*3600-mwidth/2;
        mbottom = center_y*3600-mheight/2;
}

function loadImage(imgurl,drawX,drawY,tileWidth,tileHeight){
	var img = new Image();
	img.src = imgurl;
	img.onload = function(){
	  context.drawImage(img,drawX,drawY,tileWidth,tileHeight);
    }
}

function googleLogin(){

}


function clipMap()
{
    document.getElementById("center_x").value = center_x;
    document.getElementById("center_y").value = center_y;
    document.getElementById("res").value = res;
    document.getElementById("clipform").submit();
}

function dataClear()
{
    if (window.confirm("ストレージ内のデータをすべて削除します。")) {
	localStorage.clear();
	svg.parentNode.replaceChild(svg.cloneNode(false), svg);
	svg = document.getElementById("svg");
    }
}

function pointDraw()
{
    pointflag = true;
    lineflag = false;
    polyflag = false;
    moveflag = false;
    document.getElementById("movebtn").className = "button black";
}

function lineDraw()
{
    lineflag = true;
    pointflag = false;
    polyflag = false;
    moveflag = false;
    document.getElementById("movebtn").className = "button black";
}

function polyDraw()
{
    pointflag = false;
    lineflag = false;
    polyflag = true;
    moveflag = false;
    document.getElementById("movebtn").className = "button black";
}

function moveStart()
{
    document.getElementById("movebtn").className = "button red";
    pointflag = false;
    lineflag = false;
    polyflag = false;
    moveflag = true;
}

function positionMark()
{
    var mapIdx = localStorage.length;
    var memo = "test";
    localStorage.setItem('m' + mapIdx, lat + "," + lon + "," + memo);
    var _cxy = m2c({
      x: lon, y:  lat
		   }
    );
    context.drawImage(pinimg, _cxy.x - 7, _cxy.y - 34);
    /*
       context.fillStyle = 'yellow';
       context.strokeStyle = 'red';
       context.beginPath();
       context.arc(_cxy.x, _cxy.y, 5 / cscale, 0, 360, false);
       context.closePath();
       context.stroke();
       context.fill();
     */
}

function navi(position)
{
    lon = position.coords.longitude;
    lat = position.coords.latitude;
    var accuracy = position.coords.accuracy;
    var _cxy = m2c({
      x: lon, y:  lat
		   }
    );
    var _centerxy = m2c({x:center_x,y:center_y});
    addTikeizu(lon,lat);
    cleft = cleft + _centerxy.x -  _cxy.x;
    ctop = ctop +  _centerxy.y - _cxy.y;
    center_x = new_center_x = lon; //ズームボタンを押した時にtouchendが呼ばれる関係でnew_center_xにも代入しておく。
    center_y = new_center_y = lat;
   /*
    context.fillStyle = 'yellow';
    context.strokeStyle = 'red';
    context.beginPath();
    context.arc(_cxy.x, _cxy.y, 2 / cscale, 0, 360, false);
    context.closePath();
    context.stroke();
    */
    var heading = position.coords.heading;
    if (heading) {
	document.getElementById('arrow').style.WebkitTransform = "rotate(" + heading + "deg)";
    }
//    if (accuracy < 50) {
	document.getElementById('arrow').style.left = cwidth/2 - 15 + "px";
	document.getElementById('arrow').style.top = cheight/2 - 15 + "px";
//    }
    
}


var watchId=null;
function naviStart()
{
   if (watchId !== null){
      document.getElementById("navibtn").setAttribute("class", "navibtn");
      navigator.geolocation.clearWatch(watchId);
      document.getElementById('arrow').style.left = "-100px";
	document.getElementById('arrow').style.top = "-100px";
      watchId = null;
   }else{
      document.getElementById("navibtn").setAttribute("class", "navibtn2");
      watchId = navigator.geolocation.watchPosition(navi, null, {enableHighAccuracy:true});
   }
}

function dataExport()
{
    var _point = "";
    var _line = "";
    var _poly = "";
    for (var i = 0; i <= localStorage.length; i++) {
	var _p = localStorage.getItem('p' + i);
	var _l = localStorage.getItem('l' + i);
	var _y = localStorage.getItem('y' + i);
	if (_p) {
	    _point = _p + "-" + _point;
	} else if (_l) {
	    _line = _l + "-" + _line;
	} else if (_y) {
	    _poly = _y + "-" + _poly;
	}


    }

    var fd = new FormData();
    fd.append("pdata", _point);
    fd.append("ldata", _line);
    fd.append("ydata", _poly);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "export.php",true);
    xhr.send(fd);
    xhr.onload = function(e) {
	alert(e.target.responseText);
    }
}

function dataImport()
{
    var data = JSON.parse(localStorage.getItem('test'));
    for (var i = 0; i < data.length - 1; i++) {
	context.lineWidth = 3;
	context.beginPath();
	context.moveTo(data[i].x, data[i].y);
	context.lineTo(data[i + 1].x, data[i + 1].y);
	context.closePath();
	context.stroke();
    }
}

function loadData()
{
    for (var i = 0; i <= localStorage.length; i++) {
	var _p = localStorage.getItem('p' + i);
	var _l = localStorage.getItem('l' + i);
	var _y = localStorage.getItem('y' + i);
	if (_p) {
	    var _point = _p.split("/");
	    var p_id = _point[0];
	    var attribute = _point[1];
	    var _pp = _point[2].split(",");
	    var _cxy = m2c({
	      x: _pp[0], y:_pp[1]
			   }
	    )
		context.drawImage(pinimg, _cxy.x - 7, _cxy.y - 34);
	} else if (_l) {
	    var _points = "";
	    var _line = _l.split("/");
	    var l_id = _line[0];
	    var attribute = _line[1];
	    var _lp = _line[2].split(" ");
	    for (var k = 0; k < _lp.length; k++) {
		var _lpxy = _lp[k].split(",");
		var _mxy0 = m2c({
		  x: _lpxy[0], y:_lpxy[1]
				}
		);
		_points = _points + " " + _mxy0.x + "," + _mxy0.y;
	    }
	    line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	    line.setAttribute('points', _points);
	    line.setAttribute('stroke', "#ff0000");
	    line.setAttribute('fill', 'none');
	    svg.appendChild(line);
	} else if (_y) {
	    var _points = "";
	    var _poly = _y.split("/");
	    var y_id = _poly[0];
	    var attribute = _poly[1];
	    var _yp = _poly[2].split(" ");
	    for (var k = 0; k < _yp.length - 1; k++) {
		var _ypxy = _yp[k].split(",");
		var _mxy0 = m2c({
		  x: _ypxy[0], y:_ypxy[1]
				}
		);
		_points = _points + " " + _mxy0.x + "," + _mxy0.y;
	    }
	    polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	    polygon.setAttribute('points', _points);
	    polygon.setAttribute('stroke', "#ff0000");
	    polygon.setAttribute('fill', '#ffff00');
	    svg.appendChild(polygon);
	    polygon = null;
	}

    }
}

function mouseMove(event)
{
    if (typeof event.pageX != "undefined") {
		sx = event.pageX;
		sy = event.pageY;
		
    } else {
		sx = event.clientX;
		sy = event.clientY;
    }
    if (polyflag && polygon != null) {
//       polygon.setAttribute('points', oldpoints + " " + sx + "," + sy);
    }
}

function touchStart(event)
{
    
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

    if (dbltap && polyflag) {
	polygon = null;
	dbltap = false;
	return;
    } else if(dbltap){
    /*  ダブルタップの位置に移動拡大 採用検討 
        var _cxy = m2c({x: center_x, y:center_y});
        new_center_x = center_x  - (_cxy.x - start_sx)*res/(300*3600);
	new_center_y = center_y + (_cxy.y - start_sy)*res/(300*3600);
        mwidth = cwidth*res/tileWidth;
        mheight= cheight*res/tileHeight; 
        mleft = center_x*3600-mwidth/2;
        mbottom = center_y*3600-mheight/2;
        center_x = new_center_x;
        center_y = new_center_y;
        handle(2);
    */
        dbltap = false;
	return;
    
    }else {
	dbltap = true;
    }
    setTimeout(function() {dbltap = false;}, 500);
    
    dragflag = true;
    start_cx = (start_sx - cleft) / cscale;
    start_cy = (start_sy - ctop) / cscale;
 
    var _mxy = c2m({
      x: start_cx, y:start_cy
		   }
    );
    linedata = "";
    polydata = "";
    if (lineflag) {
	linedata = _mxy.x + "," + _mxy.y;
	line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	line.setAttribute('points', start_cx + "," + start_cy);
	line.setAttribute('stroke', "#ff0000");
	line.setAttribute('stroke-width', "1");
	line.setAttribute('fill', 'none');
	svg.appendChild(line);
    } else if (polyflag) {
	polydata = _mxy.x + "," + _mxy.y;
	if (polygon == null) {
	    polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	}
	var _points = (polygon.getAttribute('points') == null) ? "" : polygon.getAttribute('points');
	polygon.setAttribute('points', _points + " " + start_cx + "," + start_cy);
	polygon.setAttribute('stroke', "#ff0000");
	polygon.setAttribute('fill', '#ffff00');
	svg.appendChild(polygon);
	oldpoints = polygon.getAttribute('points');
    }
}
var move_count = 0;

var startTime=0;
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
	sx = x / l;
	sy = y / l;
	new_cleft = cleft + sx - start_sx;
	new_ctop = ctop + sy - start_sy;
	new_center_x = center_x  - (sx - start_sx)*res/(300*3600);
	new_center_y = center_y + (sy-start_sy)*res/(300*3600);
    } else {
        var _eventx,_eventy;
        if (typeof event.x != "undefined") {
                _eventx = event.x;
		_eventy = event.y;
		
    	} else {
		_eventx = event.clientX;
		_eventy = event.clientY;
    	}

	new_cleft = cleft + _eventx - start_sx;
	new_ctop = ctop + _eventy - start_sy;
	new_center_x = center_x  - (_eventx - start_sx)*res/(300*3600);
	new_center_y = center_y + (_eventy-start_sy)*res/(300*3600);
    }
    
    move_count++;

    
    if (moveflag) {
	if (move_count % 10 == 0){//再描画が追いつかないので15回に一回だけ
         //var endTime = new Date();
	 //var msec = endTime - startTime;
         //console.log(msec);
	 addTikeizu(new_center_x,new_center_y); 
	 svg.style.webkitTransform = "translate(" + new_cleft + "px," + new_ctop + "px) scale(" + cscale + ")";
	 //map.style.webkitTransform = "translate(" + new_cleft + "px," + new_ctop + "px) scale(" + cscale + ")";
	 //startTime = new Date();
	}
    } else {
	cx = (sx - cleft) / cscale;
	cy = (sy - ctop) / cscale;
	//cx = sx;
	//cy = sy;
	if (lineflag) {

	    line.setAttribute('points', line.getAttribute('points') + " " + cx + "," + cy);
	    var _mxy = c2m({
	      x: cx, y:   cy
			   }
	    );
	    linedata = linedata + " " + _mxy.x + "," + _mxy.y;
	} else if (polyflag) {
	    polygon.setAttribute('points', polygon.getAttribute('points') + " " + cx + "," + cy);
	    var _mxy = c2m({
	      x: cx, y:   cy
			   }
	    );
	    polydata = polydata + " " + _mxy.x + "," + _mxy.y;
	}
	start_cx = cx;
	start_cy = cy;
    }
}


function touchEnd(event)
{
    dragflag = false;
    if (moveflag) {
	cleft = new_cleft;
	ctop = new_ctop;
        center_x = new_center_x;
	center_y = new_center_y;



    } else if (pointflag) {
	var _mxy = c2m({
	  x: start_cx, y:start_cy
		       }
	);
	var mapIdx = localStorage.length;
	var attribute = "test";
	var p_id = "0";
	localStorage.setItem('p' + mapIdx, p_id + "/" + attribute + "/" + _mxy.x + "," + _mxy.y);
//      context.drawImage(pinimg, start_cx - 7, start_cy - 34);
	var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', start_cx);
	circle.setAttribute('cy', start_cy);
	circle.setAttribute('r', 5/cscale);
	svg.appendChild(circle);
    } else if (lineflag) {
	var attribute = "test";
	var l_id = "1";
	var mapIdx = localStorage.length;
	localStorage.setItem('l' + mapIdx, l_id + "/" + attribute + "/" + linedata);
    } else if (polyflag) {
	var attribute = "test";
	var y_id = "2";
	var mapIdx = localStorage.length;
	localStorage.setItem('y' + mapIdx, y_id + "/" + attribute + "/" + polydata);
	polygon = null;
    }
}

var gesture_count = 0;
function gestureChange(event)
{
   if (gesture_count++ % 15 != 0) return;
    var s;
    if (!moveflag)
	return;
    if (event.scale < 1 && scalelevel>0){//縮小の余地があるなら
	scalelevel = (scalelevel==0) ? 0:scalelevel-1;
	s = 0.5;
    }else if(event.scale > 1 && scalelevel<11){//拡大の余地があるなら
	scalelevel = (scalelevel==11) ? 11:scalelevel+1;
	s = 2.0;
    }else{
	return;
    }

    cscale = cscale * s;
    var circle = document.getElementsByTagName("circle");
    for(var i=0; i < circle.length;i++){
    	circle[i].setAttribute("r",5/cscale);
    }
    var polyline = document.getElementsByTagName("polyline");
    for(var i=0; i < polyline.length;i++){
    	polyline[i].setAttribute('stroke-width',1/cscale);
    }
 
    cleft = (cwidth/2.0 - s * (cwidth/2.0 - cleft));
    ctop = (cheight/2.0 - s * (cheight/2.0 - ctop));
    

    res = resarray[scalelevel];
    if(res <120)
     	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "nti/new/";
    else if(res < 7680)
     	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "bafd/new/";
    else
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    context.clearRect(0, 0, canvas.width, canvas.height);
    addTikeizu(center_x,center_y);
    svg.style.webkitTransformOrigin = "0px 0px";
    svg.style.webkitTransform = "translate(" + cleft + "px," + ctop + "px) scale(" + cscale + ")";

    mwidth = cwidth*res/tileWidth;
    mheight= cheight*res/tileHeight; 
    mleft = center_x*3600-mwidth/2;
    mbottom = center_y*3600-mheight/2;

}


var scalelevel=0;
function handle(delta)
{
    if (!moveflag)
	return;
    if (delta < 0 && scalelevel>0){//縮小の余地があるなら
	scalelevel = (scalelevel==0) ? 0:scalelevel-1;
	s = 0.5;
    }else if(delta > 0 && scalelevel<11){//拡大の余地があるなら
	scalelevel = (scalelevel==11) ? 11:scalelevel+1;
	s = 2.0;
    }else{
	return;
    }
    cscale = cscale * s;
    var circle = document.getElementsByTagName("circle");
    for(var i=0; i < circle.length;i++){
    	circle[i].setAttribute("r",5/cscale);
    }
    var polyline = document.getElementsByTagName("polyline");
    for(var i=0; i < polyline.length;i++){
    	polyline[i].setAttribute('stroke-width',1/cscale);
    }
 
    cleft = (cwidth/2.0 - s * (cwidth/2.0 - cleft));
    ctop = (cheight/2.0 - s * (cheight/2.0 - ctop));
    

    res = resarray[scalelevel];
    if(res <120)
     	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "nti/new/";
    else if(res < 7680)
     	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/" + res + "bafd/new/";
    else
	mapimgurl = "http://cyberjapandata.gsi.go.jp/data/raster/" + res + "/new/";
    context.clearRect(0, 0, canvas.width, canvas.height);
    addTikeizu(center_x,center_y);
    svg.style.webkitTransformOrigin = "0px 0px";
    svg.style.webkitTransform = "translate(" + cleft + "px," + ctop + "px) scale(" + cscale + ")";

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
window.onmousewheel =wheel;
//= document.onmousewheel = wheel;
