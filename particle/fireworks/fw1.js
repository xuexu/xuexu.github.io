/**
 * 添加作用力
 */

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
 * 重力
 */
var gravity=accelerationf(new Vec2(0,10));

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
var drag=dampingf(0.99);

/**
 * 风力
 * @param {Particle} particle
 * @param {Number} td
 */
function wind(particle,td){
	particle.velocity.x += td*Math.random()*50;
}

function main(){
	var canvas=document.getElementById('myCanvas');
	var ctx=canvas.getContext('2d');
	var system=new ParticleSystem();
	
	system.forces.push(gravity);
	system.forces.push(wind);
	system.forces.push(drag);
	
	emit(system,canvas.width,canvas.height);
	
	window.setInterval(function(){
		if(Math.random() < 0.1){
			emit(system, canvas.width, canvas.height);
		}
		system.update(1/60);
		ctx.fillStyle='rgba(0,0,0,0.1)';  //模拟残影效果 低越小,残影存在越久(尾巴越长)
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.globalCompositeOperation='lighter'; //混合模式改为叠加
		renderCanvasImage(ctx,system.particles,false);
		ctx.globalCompositeOperation='source-over';//渲染完成后,更改为默认的混合模式
	},1000/60);
}

/**
 * 粒子发射器(在一2维平面随机的一个点产生100个粒子,并出个随机速度)
 * @param {ParticleSystem} stystem
 * @param {Number} width
 * @param {Number} height
 */
function emit(system, width, height){
	var position = new Vec2(Math.random()*width, Math.random()*height);
	for (var i = 0; i < 100; i++) {
		var particle=new Particle(position.copy());
		
		/*//产生的粒子似方形
		particle.velocity.x=fuzzy(100);
		particle.velocity.y=fuzzy(100);*/
		
		//产生球形火花
		var alpha=fuzzy(Math.PI);
		var radius=Math.random()*100;
		particle.velocity.x=Math.cos(alpha)*radius;
		particle.velocity.y=Math.sin(alpha)*radius;
		
		//粒子存活时间
		particle.maxAge=fuzzy(0.5,2);
		
		//圆圈形
		/*var alpha=fuzzy(Math.PI);
		var radius=50;
		particle.velocity.x=Math.cos(alpha)*radius;
		particle.velocity.y=Math.sin(alpha)*radius;*/
		
		particle.image=choose(imgs);
		system.particles.push(particle);
	}
}

var imgsrcs=[
	'spark.png',
	'blue.png',
	'green.png',
	'purple.png'
];
var imgs=null;
loadImage(imgsrcs,function(images){
	imgs=images;
	main();
});



