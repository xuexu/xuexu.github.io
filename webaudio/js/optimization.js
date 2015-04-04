(function() {
	var audio, audioContext, processor, analyer;
	try {
		audioContext = new(window.AudioContext || window.webkitAudioContext)()
	} catch (e) {
		alert('您的浏览器不支持Web Audio API');
		throw new Error('您的浏览器不支持Web Audio API');
	}
	//创建一个1024字节的缓冲区
	processor = audioContext.createScriptProcessor(1024);
	//创建一个分析节点
	analyer = audioContext.createAnalyser();
	processor.connect(audioContext.destination);
	analyer.connect(processor);

	var data = new Uint8Array(analyer.frequencyBinCount);

	var Sound = {
		element: undefined,
		play: function() {
			var sound = audioContext.createMediaElementSource(this.element);
			this.element.onended = function() {
				sound.disconnect();
				sound = null;
				processor.onaudioprocess = function() {};
			};
			sound.connect(analyer);
			sound.connect(audioContext.destination);

			processor.onaudioprocess = function() {
				analyer.getByteTimeDomainData(data);
				//console.log(data);
			};

			this.element.play();
		}
	};

	var loadAudioElement = function(url) {
		return new Promise(function(resolve, reject) {
			var audio = new Audio();
			audio.addEventListener('canplay', function() {
				resolve(audio);
			});
			audio.addEventListener('error', reject);
			audio.addEventListener('ended',function(){
				offsetY=0;
				playing=false;
			});
			audio.src = url;
		});
	};

	requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');


	var MAX_PARTICLES=20000;		//最大20000个粒子
	var NFIELDS=5;		//x,y,vx,vy,age  粒子域
	var PARTICLES_LENGTH=NFIELDS*MAX_PARTICLES;		//总长度(数组长度)
	
	var Float32Array=window.Float32Array||Array;
	
	var particles=new Float32Array(PARTICLES_LENGTH);
	//插入粒子的位置
	var particles_i=0,MAX_AGE=2;

	var tds = 0;
	var prevTd=0;
	var offsetY=0;		//振幅
	var playing=true;
	var fpsFlag=-1;
	var drag=1;			//1 表示无阻力
	var gravity=0;
	var render = function(td) {
		//offsetY*Math.sin(2*Math.PI*(td-tds)/1000)  产生正弦波形图
		emit(canvas.width/2-200,canvas.height/2-135+offsetY*Math.sin(2*Math.PI*(td-tds)/1000)/2);
		emit(canvas.width/2+200+offsetY*Math.cos(2*Math.PI*(td-tds)/1000)/2,canvas.height/2-135);
		var t0=(td-prevTd)/1000;
		
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height-70);
		//ctx.globalCompositeOperation='lighter'; //混合模式改为叠加
		//ctx.globalAlpha = 0.6;
		
		var imgData=ctx.getImageData(0,0,canvas.width,canvas.height-70);
		var colorDatas=imgData.data;
		
		for (var i=0;i<PARTICLES_LENGTH;i+=NFIELDS) {
			//检查寿命
			if((particles[i+4]+=t0)>MAX_AGE) {
				continue;
			}
			var x=~~(particles[i]=(particles[i]+(particles[i+2]*=drag)*t0));
			var y=~~(particles[i+1]=(particles[i+1]+(particles[i+3]=(particles[i+3]+gravity*t0)*drag)*t0));
			
			//检查边界
			if(x<0 ||x>=canvas.width||y<0||y>=canvas.height-70){
				continue;
			}
			//偏移量
			var offset=(x+y*canvas.width)*4;
			colorDatas[offset] += 120;		//r
			colorDatas[offset+1] += 55;		//g
			colorDatas[offset+2] += 10;		//b
			//colorDatas[offset+3] +=0;		//a 不改变透明度
			
		}
		ctx.putImageData(imgData,0,0);
		//ctx.globalAlpha = 1.0;
		//ctx.globalCompositeOperation='source-over';
		
		
		if(playing&&(td-tds>1000)){
			tds=td;
			offsetY=data[400];
		}
		if(Math.floor((td-tds)/250)!=fpsFlag){
			fpsFlag=Math.floor((td-tds)/250);
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillRect(0, canvas.height-70, canvas.width, 70);
			ctx.fillStyle='rgba(255,255,255,1)';
			ctx.font="italic 30px sans-serif";
			ctx.fillText('FPS: '+(1/t0).toFixed(0)+'   Particles: '+(particles[PARTICLES_LENGTH-1]?MAX_PARTICLES:particles_i),20,canvas.height-20);
		}
		
		requestAnimationFrame(render);
		
		if(prevTd!=td){
			prevTd=td;
		}
	};
	
	loadAudioElement('music/海绵宝宝.mp3').then(function(elem) {
		audio = Sound;
		audio.element = elem;
		audio.play();
		render(0);
	}, function(elem) {
		throw elem.error;
	});
	
	function emit(x, y) {
		for(var i=0;i<100;i++){		//每次产生150个粒子
			particles_i=(particles_i+NFIELDS)%PARTICLES_LENGTH;
			particles[particles_i]=x;
			particles[particles_i+1]=y;
			var alpha= fuzzy(Math.PI)
				,radius=Math.random()*100
				,vx=Math.cos(alpha)*radius
				,vy=Math.sign(alpha)*radius;
			particles[particles_i+2]=vx;	//vx
			//particles[particles_i+3]=fuzzy(30);	//vy
			//particles[particles_i+3]=vy;	//vy
			particles[particles_i+3]=fuzzy(50,100);
			particles[particles_i+4]=0;		//age
		}
	}
	
	function fuzzy(range, base) {
		return (base || 0) + (Math.random() - 0.5) * range * 2;
	}
})();