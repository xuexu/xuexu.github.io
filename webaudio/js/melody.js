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


	/**
	 * 加速度
	 * @param {Vec2} force
	 */
	function accelerationf(force) {
		return function(particle, td) {
			particle.velocity.iadd(force.muls(td));
		};
	}


	/**
	 * 阻力
	 * @param {Number}  damping 阻力系数(阻尼)
	 */
	function dampingf(damping) {
		return function(particle, td) {
			particle.velocity.imuls(damping);
		};
	}

	/**
	 * 风力
	 * @param {Particle} particle
	 * @param {Number} td
	 */
	function wind(particle, td) {
			particle.velocity.x += td * fuzzy(20);
	}
	/**
	 * 空气阻力
	 */
	var drag = dampingf(0.985);
	/**
	 * 重力
	 */
	var gravity = accelerationf(new Vec2(0, 40));

	var particleSystem = new ParticleSystem();

	//粒子相关作用力
	//particleSystem.forces.push(drag);			//阻力(会减速)
	particleSystem.forces.push(wind);			//力及方向都变换的一个风力
	//particleSystem.forces.push(accelerationf(new Vec2(-20, 0)));  //恒定向左的一个风力
	//particleSystem.forces.push(gravity);		//向下的一个重力


	var tds = 0;
	var prevTd=0;
	var offsetY=0;
	var images=null;
	var playing=true;
	var fpsFlag=-1;
	var render = function(td) {
		//console.log("1:"+(td-tds)/1000);
		//console.log("2:"+offsetY);
		//console.log("3:"+(offsetY*(td-tds)/1000));
		//console.log("4:"+(canvas.height/2+offsetY*(td-tds)/1000));
		//console.log(Math.sin(2*Math.PI*(td-tds)/1000));
		//offsetY*Math.sin(2*Math.PI*(td-tds)/1000)  产生正弦波形图
		emit(particleSystem,images,canvas.width/2+200,canvas.height/2-100+offsetY*Math.sin(2*Math.PI*(td-tds)/1000)/2);
		//emit(particleSystem,images,canvas.width/2+100,canvas.height/2+offsetY1*Math.sin(2*Math.PI*(td-tds)/1000)/1);
		//emit(particleSystem,images,canvas.width/2,canvas.height/2);
		particleSystem.update((td-prevTd)/1000);
		
		ctx.fillStyle = 'rgba(0,0,0,0.3)';
		ctx.fillRect(0, 0, canvas.width, canvas.height-70);
		ctx.globalCompositeOperation='lighter'; //混合模式改为叠加
		ctx.globalAlpha = 0.6;
		renderCanvasImage(ctx,particleSystem.particles,3);
		//for (var i = 0, n = 0; i < lineCount; i++, n += step) {
		//	drawLine(30 + 35 * (i + 1), canvas.height - 100, 30 + 35 * (i + 1), canvas.height - 100 - data[n]);
		//}
		ctx.globalAlpha = 1.0;
		ctx.globalCompositeOperation='source-over';
		
		if(playing&&(td-tds>1000)){
			tds=td;
			offsetY=choose(data);
		}
		if(Math.floor((td-tds)/250)!=fpsFlag){
			fpsFlag=Math.floor((td-tds)/250);
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillRect(0, canvas.height-70, canvas.width, 70);
			ctx.fillStyle='rgba(255,255,255,1)';
			ctx.font="italic 30px sans-serif";
			ctx.fillText('FPS: '+(1000/(td-prevTd)).toFixed(0)+'   Particles: '+particleSystem.particles.length,20,canvas.height-20);
		}
		requestAnimationFrame(render);
		
		if(prevTd!=td){
			prevTd=td;
		}
	};
	
	function loadMain(imgs){
		images=imgs;
		//render(0);
		loadAudioElement('music/海绵宝宝.mp3').then(function(elem) {
			audio = Sound;
			audio.element = elem;
			audio.play();
			render(0);
		}, function(elem) {
			throw elem.error;
		});
	}
	
	loadImage('img/blue.png img/green.png img/purple.png img/purple.png img/spark.png'.split(' '),loadMain);

	function emit(system, images, x, y) {
		var position = new Vec2(x, y);
		//console.log(position.x+"  "+position.y);
		for(var i=0;i<5;i++){
			var particle = new Particle(position.copy());
			particle.image = choose(images);
			particle.velocity.x=fuzzy(30,-100);
			particle.velocity.y=fuzzy(30);
			particle.maxAge=3;
			
			system.particles.push(particle);
		}
	}
})();