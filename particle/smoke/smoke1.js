
/**
 * 加速度
 * @param {Vec2} force
 */
function accelerationf(force){
	return function(particle, td){
		particle.velocity.iadd(force.muls(td));
	};
}


/**
 * 阻力
 * @param {Number}  damping 阻力系数(阻尼)
 */
function dampingf(damping){
	return function(particle,td){
		particle.velocity.imuls(damping);
	};
}

/**
 * 空气阻力
 */
var drag=dampingf(0.985);
var lift=accelerationf(new Vec2(0,-50));//举力(火苗向上窜)

/**
 * 风力
 * @param {Particle} particle
 * @param {Number} td
 */
function wind(particle,td){
	particle.velocity.x += td*fuzzy(50);
}

function main(images){
	var canvas=document.getElementById('myCanvas');
	var ctx=canvas.getContext('2d');
	var system=new ParticleSystem();
	
	system.forces.push(drag);
	system.forces.push(lift);
	system.forces.push(wind);
	
	window.setInterval(function(){
		system.update(1/60);
		ctx.fillStyle='rgba(0,0,0,0.1)';  //模拟残影效果
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalCompositeOperation='lighter'; //混合模式改为叠加
		ctx.globalAlpha=0.1;
		renderCanvasImage(ctx,system.particles,5);
		ctx.globalAlpha=1.0;
		ctx.globalCompositeOperation='source-over';//渲染完成后,更改为默认的混合模式
	},1000/60);
	
	window.setInterval(function(){
		if(hasFocus){
			emit(system,images,mouseEvent.offsetX,mouseEvent.offsetY);
		}
	},1000/20);	//每秒产生20个粒子
	
	var hasFocus=false;
	var mouseEvent=null;
	canvas.onmousemove=function(ev){
		hasFocus=true;
		mouseEvent=ev;
	};
	canvas.onmouseleave=function(){
		hasFocus=false;
		mouseEvent=null;
	};
}

/**
 * 粒子发射器(在一2维平面随机的一个点产生100个粒子,并出个随机速度)
 * @param {ParticleSystem} stystem
 * @param {Number} x
 * @param {Number} y
 */
function emit(system, images, x, y){
	var position = new Vec2(x+fuzzy(5), y+fuzzy(5));
	var particle=new Particle(position);
	var alpha=fuzzy(Math.PI);
	var radius=Math.sqrt(Math.random()+0.1)*35;
	particle.image=choose(images);
	
	
	particle.velocity.x=Math.cos(alpha)*radius;
	particle.velocity.y=Math.sin(alpha)*radius-4;
	
	particle.maxAge=5;
	
	particle.angularVelocity=fuzzy(2.0);
	particle.angle=fuzzy(Math.PI);
	
	system.particles.push(particle);
}
loadImage('smoke.0.png smoke.1.png smoke.2.png smoke.3.png smoke.4.png'.split(' '),main);