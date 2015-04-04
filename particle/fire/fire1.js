
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
var drag=dampingf(0.975);
var lift=accelerationf(new Vec2(0,-100));//举力(火苗向上窜)

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
		if(Math.random() < 0.8){
			emit(system,images, canvas.width, canvas.height);
		}
		system.update(1/60);
		ctx.fillStyle='rgba(0,0,0,0.3)';  //模拟残影效果
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalCompositeOperation='lighter'; //混合模式改为叠加
		ctx.globalAlpha=0.6;
		renderCanvasImage(ctx,system.particles,5);
		ctx.globalAlpha=1.0;
		ctx.globalCompositeOperation='source-over';//渲染完成后,更改为默认的混合模式
	},1000/60);
}

/**
 * 粒子发射器(在一2维平面随机的一个点产生100个粒子,并出个随机速度)
 * @param {ParticleSystem} stystem
 * @param {Number} width
 * @param {Number} height
 */
function emit(system, images, width, height){
	for(var i=1;i<=3;i++){
		var position = new Vec2(width*i/4+fuzzy(10), height/2+height/4+fuzzy(3));
		var particle=new Particle(position);
		var alpha=fuzzy(Math.PI);
		var radius=Math.sqrt(Math.random()+0.1)*100;
		particle.image=choose(images);
		radius*=32/Math.max(25,particle.image.width);
		
		
		particle.velocity.x=Math.cos(alpha)*radius;
		particle.velocity.y=Math.sin(alpha)*radius-4;
		
		particle.maxAge=5;
		
		particle.angularVelocity=fuzzy(1.5);
		particle.angle=fuzzy(Math.PI);
		
		system.particles.push(particle);
	}
}
loadImage('flame.png flame.png flame0.png flame1.png flame2.png flame3.png smallspark.png smallspark.png'.split(' '),main);