function main(){
	var canvas=document.getElementById('myCanvas');
	var ctx=canvas.getContext('2d');
	var system=new ParticleSystem();
	
	emit(system,canvas.width,canvas.height);
	
	window.setInterval(function(){
		if(Math.random() < 0.01){
			emit(system, canvas.width, canvas.height);
		}
		system.update(1/60);
		ctx.fillRect(0,0,canvas.width,canvas.height);
		renderCanvasImage(ctx,system.particles,false);
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
		
		//圆圈形
		/*var alpha=fuzzy(Math.PI);
		var radius=50;
		particle.velocity.x=Math.cos(alpha)*radius;
		particle.velocity.y=Math.sin(alpha)*radius;*/
		
		particle.image=spark;
		system.particles.push(particle);
	}
}

var spark=new Image();
spark.onload=main;
spark.src='spark.png';



