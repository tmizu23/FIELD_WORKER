var canvas;
var context;
var map;
var svg;
var stamp;
var zoomout;
var zoomin;

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
var swidth;		//screenの幅（幅）
var sheight;		//screenの高さ（高さ）

var pinimg;
var linedata;
var polydata;

var line;
var polygon;
var dbltap = false;
var oldpoints;

var loginflag = false;

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

window.onresize =function(){
    swidth = document.documentElement.clientWidth;
    sheight = document.documentElement.clientHeight;
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:" + (sheight - 30) + "px;left:0px;position:absolute; z-index:3;"
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:30px;left:" + (swidth-27) + "px;position:absolute; z-index:3;"
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:2px;left:" + (swidth-27) + "px;position:absolute; z-index:3;"
    //addTikeizu(center_x,center_y);
}


window.onload = function()
{
    map = document.getElementById("map");
    swidth = document.documentElement.clientWidth;
    sheight = document.documentElement.clientHeight;
    cwidth = map_width = document.getElementById("map").style.width.replace("px","");
    cheight = map_height = document.getElementById("map").style.height.replace("px","");
    canvas = document.getElementById("canvas");
    svg = document.getElementById("svg");
    
    stamp = document.createElement("div");
    stamp.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:" + (sheight - 30) + "px;left:0px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "icon01.gif");
    stampimg.setAttribute("width","30px");
    stampimg.setAttribute("height","30px");
    stampimg.setAttribute("onclick","document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'");
    stamp.appendChild(stampimg);
    document.getElementById("main").appendChild(stamp);

    var navibtn = document.createElement("div");
    navibtn.setAttribute("id", "navibtn");
    navibtn.setAttribute("class", "navibtn");
    navibtn.style.cssText = "user-select: none;-webkit-user-select: none;top:5px;left:2px;position:absolute; z-index:3;"
    var arrowimg = document.createElement("img");
    arrowimg.setAttribute("src", "arrow.png");
    arrowimg.setAttribute("width","15px");
    arrowimg.setAttribute("height","18px");
    navibtn.appendChild(arrowimg);
    document.getElementById("main").appendChild(navibtn);

    zoomout = document.createElement("div");
    zoomout.setAttribute("id", "zoomoutbtn");
    zoomout.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:30px;left:" + (swidth-27) + "px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "minus.png");
    stampimg.setAttribute("width","25px");
    stampimg.setAttribute("height","25px");
    zoomout.appendChild(stampimg);
    document.getElementById("main").appendChild(zoomout);

    zoomin = document.createElement("div");
    zoomin.setAttribute("id", "zoominbtn");
    zoomin.style.cssText = "cursor: pointer;user-select: none;-webkit-user-select: none;top:2px;left:" + (swidth-27) + "px;position:absolute; z-index:3;"
    var stampimg = document.createElement("img");
    stampimg.setAttribute("src", "plus.png");
    stampimg.setAttribute("width","25px");
    stampimg.setAttribute("height","25px");
    zoomin.appendChild(stampimg);
    document.getElementById("main").appendChild(zoomin);



    context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    mheight = mres * mnum;
    mwidth = mres * mnum;
    pinimg = new Image();
    pinimg.src = "pin.png";
    map.addEventListener(BGPStartEvent, touchStart, false);
    map.addEventListener(BGPMoveEvent, touchMove, false);
    map.addEventListener(BGPEndEvent, touchEnd, false);
    map.addEventListener("gesturechange", gestureChange, false);
    map.addEventListener("mousemove", mouseMove, false);
    document.getElementById("navibtn").addEventListener("click", naviStart, false);
    document.getElementById("zoomoutbtn").addEventListener("click", zoomOut, false);
    document.getElementById("zoominbtn").addEventListener("click", zoomIn, false);
/*
    document.getElementById("loadbtn").addEventListener("click", loadData, false);
    document.getElementById("importbtn").addEventListener("click", dataImport, false);
    document.getElementById("exportbtn").addEventListener("click", dataExport, false);
    document.getElementById("navibtn").addEventListener("click", naviStart, false);
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
    cleft = (swidth - mnum*300)/2;
    ctop = (sheight - mnum*300)/2;
    map.style.webkitTransform = "translate(" + cleft + "px," + ctop + "px) scale(" + cscale + ")";
}

function zoomIn(){
  sx = swidth/2;
  sy = sheight/2;
  handle(1);
}
function zoomOut(){
  sx = swidth/2;
  sy = sheight/2;
  handle(-1);
}

function googleLogin(){

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
    context.fillStyle = 'yellow';
    context.strokeStyle = 'red';
    context.beginPath();
    context.arc(_cxy.x, _cxy.y, 2 / cscale, 0, 360, false);
    context.closePath();
    context.stroke();
    var heading = position.coords.heading;
    if (heading) {
	document.getElementById('arrow').style.WebkitTransform = "rotate(" + heading + "deg)";
    }
//    if (accuracy < 50) {
	document.getElementById('arrow').style.left = _cxy.x - 15 + "px";
	document.getElementById('arrow').style.top = _cxy.y - 15 + "px";
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

function mouseMove(e)
{
    sx = e.pageX;
    sy = e.pageY;
    if (polyflag && polygon != null) {
//       polygon.setAttribute('points', oldpoints + " " + sx + "," + sy);
    }
}

function touchStart(event)
{
    if (dbltap) {
	polygon = null;
	dbltap = false;
	return;
    } else {
	dbltap = true;
    }
    setTimeout(function() {
	       dbltap = false;
	       }
	       , 500);
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
	start_sx = event.x;
	start_sy = event.y;
    }
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
    } else {
	new_cleft = cleft + event.x - start_sx;
	new_ctop = ctop + event.y - start_sy;
    }
    if (moveflag) {
	map.style.webkitTransform = "translate(" + new_cleft + "px," + new_ctop + "px) scale(" + cscale + ")";
    } else {
	cx = (sx - cleft) / cscale;
	cy = (sy - ctop) / cscale;
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
	circle.setAttribute('r', '5');
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

function gestureChange(event)
{
    if (!moveflag)
	return;
    event.preventDefault();
    var s;
    if (event.scale > 1)
	s = 1.03;
    else
	s = 0.97;
    cleft = (sx - s * (sx - cleft));
    ctop = (sy - s * (sy - ctop));
    cscale = cscale * s;
    map.style.webkitTransformOrigin = "0px 0px";
    map.style.webkitTransform = "translate(" + cleft + "px," + ctop + "px) scale(" + cscale + ")";
}



function handle(delta)
{
    if (!moveflag)
	return;
    var s;
    if (delta < 0)
	s = 0.8;
    else
	s = 1.2;
    cleft = (sx - s * (sx - cleft));
    ctop = (sy - s * (sy - ctop));
    cscale = cscale * s;
    map.style.webkitTransformOrigin = "0px 0px";
    map.style.webkitTransform = "translate(" + cleft + "px," + ctop + "px) scale(" + cscale + ")";
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
	/** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
    if (delta)
	handle(delta);
    if (event.preventDefault) {
	event.preventDefault();
    }
    event.returnValue = false;
}

if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;
