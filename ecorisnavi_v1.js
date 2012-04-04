var canvas;
var context;
var map;
 
 var res = 30;

 var point_x = 136.81733128356934;
 var point_y = 35.200814937159784;
 var point_arealeft_sec;
 var point_areabottom_sec;
 const BGPSupportsTouches = ("createTouch" in document);
const BGPStartEvent = BGPSupportsTouches ? "touchstart" : "mousedown";
const BGPMoveEvent  = BGPSupportsTouches ? "touchmove"  : "mousemove";
const BGPEndEvent   = BGPSupportsTouches ? "touchend"   : "mouseup";

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
 

 map = document.getElementById("map");

 map.addEventListener(BGPStartEvent,touchStart,false);
 map.addEventListener(BGPMoveEvent,touchMove,false);
 map.addEventListener(BGPEndEvent,touchEnd,false);
 map.addEventListener("gesturechange",gestureChange,false);
 
 document.getElementById("drawbtn").addEventListener("click",drawStart,false);
 document.getElementById("savebtn").addEventListener("click",savedata,false);
 document.getElementById("loadbtn").addEventListener("click",loaddata,false);
 document.getElementById("navibtn").addEventListener("click",naviStart,false);
 canvas = document.getElementById("canvas");
 context = canvas.getContext('2d');
}

function drawStart(){
 drawmode=!drawmode;
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
function naviStart(){
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

function savedata(){
localStorage.setItem('test',JSON.stringify(drawdata));
alert("保存しました。");
}

function loaddata(){
var data = JSON.parse(localStorage.getItem('test'));
   for(var i=0;i<data.length-1;i++){
	context.lineWidth = 3;
	context.beginPath();
   //context.arc((centerx-mapleft)/scale,(centery-maptop)/scale,5,0,360,false);
    context.moveTo(data[i].x,data[i].y);
    context.lineTo(data[i+1].x,data[i+1].y);
    context.closePath();
    context.stroke();
   }
}

var sx=0;
var sy=0;
var moveflag=false;
var drawmode=false;
var centerx;
var centery;
var newleft=0;
var newtop=0;
var mapleft=0;
var maptop=0;
var scale=1.0;

var olddx;
var olddy;

function touchStart(event) {
 // if(drawmode) return; 
  if(BGPSupportsTouches){
   var i=0;
   var l=event.touches.length;
   var x=0;
   var y=0;
   
   for(i=0;i<l;i++){
    x+=event.touches[i].pageX;
    y+=event.touches[i].pageY;
   }
   sx = x/l;
   sy = y/l;
  }else{
   sx=event.x;
   sy=event.y;
  }
  moveflag = true;
  olddx=(sx-mapleft)/scale;
  olddy=(sy-maptop)/scale;
  drawdata[0]={x:olddx,y:olddy};
}

var drawdata = new Array();

function touchMove(event) {
  if(!moveflag) return;
  event.preventDefault();
  if(BGPSupportsTouches){
   var i=0;
   var l=event.touches.length;
   var x=0;
   var y=0;
   for(i=0;i<l;i++){
    x+=event.touches[i].pageX;
    y+=event.touches[i].pageY;
   }
   centerx = x/l;
   centery = y/l
   newleft = mapleft + centerx - sx;
   newtop = maptop + centery - sy;
  }else{
   newleft = mapleft + event.x - sx;
   newtop = maptop + event.y - sy;
  }
  if(!drawmode){
   map.style.webkitTransform = "translate(" + newleft + "px," + newtop + "px) scale(" + scale + ")";
  }else{
   dx=(centerx-mapleft)/scale;
   dy=(centery-maptop)/scale;
   context.lineWidth = 3;
   context.beginPath();
   //context.arc((centerx-mapleft)/scale,(centery-maptop)/scale,5,0,360,false);
   context.moveTo(olddx,olddy);
   context.lineTo(dx,dy);
   context.closePath();
   context.stroke();
   drawdata.push({x:dx,y:dy});
   olddx = dx;
   olddy = dy;
  }
}

function touchEnd(event) {  
  moveflag=false;
  if(!drawmode){
   mapleft = newleft;
   maptop = newtop;
  }
}

function gestureChange(event){
 if(drawmode) return;
 event.preventDefault();
 var s;
 if(event.scale>1) s = 1.03; else s = 0.97;	
 mapleft = (centerx-s*(centerx-mapleft));
 maptop = (centery-s*(centery-maptop));
 scale = scale*s;
 map.style.webkitTransformOrigin = "0px 0px";
 map.style.webkitTransform = "translate(" +  mapleft + "px," + maptop + "px) scale(" + scale + ")";
}




window.document.onmousemove = function(e){
	centerx = e.pageX;
	centery = e.pageY;	
}

function handle(delta) {
 if(drawmode) return;
 var s;
 if (delta < 0) s=0.8; else s=1.2;	
 mapleft = (centerx-s*(centerx-mapleft));
 maptop = (centery-s*(centery-maptop));
 scale = scale*s;
 map.style.webkitTransformOrigin = "0px 0px";
 map.style.webkitTransform = "translate(" +  mapleft + "px," + maptop + "px) scale(" + scale + ")";
}

function wheel(event){
        var delta = 0;
        if (!event) /* For IE. */
                event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta/120;
                if (window.opera)
                        delta = -delta;
        } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail/3;
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
if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;