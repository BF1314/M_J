// 全局参数定义
var radius = 240; // 相册的半径
var autoRotate = true; // 是否自动旋转
var rotateSpeed = -30; // 旋转速度
var imgWidth = 170; // 照片宽度 (unit: px)
var imgHeight = 220; // 照片高度 (unit: px)
 
//背景音乐地址
var bgMusicURL = '244682821.mp3  '; 
var bgMusicControls = true; //是否显示背景音乐播放器
 
 
// ===================== start =======================
setTimeout(init, 1000);
 
var odrag = document.getElementById('drag-container');// 获取拖动容器
var ospin = document.getElementById('spin-container');// 获取旋转容器
var aImg = ospin.getElementsByTagName('img');// 获取所有的图片元素
var aVid = ospin.getElementsByTagName('video');// 获取所有的视频元素
var aEle = [...aImg, ...aVid];// 将图片和视频元素合并为一个数组
 
// 设置图片大小
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";
 
var ground = document.getElementById('ground');// 获取地面元素
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";
 
// 相册初始化时候的动画特效
function init(delayTime) {
	for (var i = 0; i < aEle.length; i++) {
		aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
		aEle[i].style.transition = "transform 1s";
		aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
	}
}
 
function applyTranform(obj) {
	// 限制相机角度（在0到180度之间）
	if (tY > 180) tY = 180;
	if (tY < 0) tY = 0;
 
	// Apply the angle
	obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}
 
function playSpin(yes) {
	ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}
 
var sX, sY, nX, nY, desX = 0,
	desY = 0,
	tX = 0,
	tY = 10;// 初始化触摸坐标和旋转角度
 
// 自动旋转
if (autoRotate) {
	var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
	ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}
 
// 添加背景音乐
if (bgMusicURL) {
	document.getElementById('music-container').innerHTML += `
<audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
<p>If you are reading this, it is because your browser does not support the audio element.</p>
</audio>
`;
}
 
// 设置事件
document.onpointerdown = function(e) {
	 // 触摸或鼠标按下时的事件处理
	clearInterval(odrag.timer);
	e = e || window.event;
	var sX = e.clientX,
		sY = e.clientY;
 
	this.onpointermove = function(e) {
		e = e || window.event;
		var nX = e.clientX,
			nY = e.clientY;
		desX = nX - sX;
		desY = nY - sY;
		tX += desX * 0.1;
		tY += desY * 0.1;
		applyTranform(odrag);
		sX = nX;
		sY = nY;
	};
 
	this.onpointerup = function(e) {
		// 鼠标滚轮事件，用于缩放
		odrag.timer = setInterval(function() {
			desX *= 0.95;
			desY *= 0.95;
			tX += desX * 0.1;
			tY += desY * 0.1;
			applyTranform(odrag);
			playSpin(false);
			if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
				clearInterval(odrag.timer);
				playSpin(true);
			}
		}, 17);
		this.onpointermove = this.onpointerup = null;
	};
 
	return false;
};
 
document.onmousewheel = function(e) {
	e = e || window.event;
	var d = e.wheelDelta / 20 || -e.detail;
	radius += d;
	init(1);
};