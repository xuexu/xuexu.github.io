var DEBUG = true;

/**
 * 给某一对象添加非数字检测
 * @param {Object} obj
 * @param {String} name 属性名
 */
function notNaN(obj, name) {
	var key = "__" + name;
	obj.__defineGetter__(name, function() {
		return this[key];
	});
	obj.__defineSetter__(name, function(v) {
		if (typeof v !== 'number' || isNaN(v)) {
			throw new TypeError(name + ' isNaN');
		}
		this[key] = v;
	});
}

/**
 * 向量
 * @param {Number} x
 * @param {Number} y
 */
function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

Vec2.prototype = {
	muls: function(n) {
		return new Vec2(this.x * n, this.y * n);
	},
	imuls: function(n) {
		this.x *= n;
		this.y *= n;
		return this;
	},
	mul: function(v) {
		return new Vec2(this.x * v.x, this.y * v.y);
	},
	imul: function(v) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	},
	divs: function(n) {
		return new Vec2(this.x / n, this.y / n);
	},
	div: function(v) {
		return new Vec2(this.x / v.x, this.y / v.y);
	},
	adds: function(n) {
		return new Vec2(this.x + n, thos.y + n);
	},
	iadds: function(s) {
		this.x += s;
		this.y += s;
		return this;
	},
	add: function(v) {
		return new Vec2(this.x + v.x, this.y + v.y);
	},
	iadd: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},
	subs: function(n) {
		return new Vec2(this.x - n, this.y - n);
	},
	isubs: function(s) {
		this.x -= s;
		this.y -= s;
		return this;
	},
	sub: function(v) {
		return new Vec2(this.x - v.x, this.y - v.y);
	},
	isub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},
	mag: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	mag2: function() {
		return this.x * this.x + this.y * this.y;
	},

	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y + this.y * v.x;
	},
	normalize: function() {
		return this.muls(1.0 / this.mag());
	},

	negate: function() {
		return new Vec2(-this.x, -this.y);
	},
	inegate: function() {
		this.x *= -1;
		this.y *= -1;
	},

	round: function() {
		return new Vec2(~~this.x, ~~this.y);
	},
	iround: function() {
		this.x = ~~this.x;
		this.y = ~~this.y;
		return this;
	},
	atan2: function() {
		return Math.atan2(this.x, this.y);
	},

	abs: function() {
		return new Vec2(Math.abs(this.x), Math.abs(this.y));
	},

	copy: function() {
		return new Vec2(this.x, this.y);
	},

	set: function(x, y) {
		this.x = x;
		this.y = u;
	},
	izero: function() {
		this.x = 0;
		this.y = 0;
		return this;
	}
};

if (DEBUG) {
	notNaN(Vec2.prototype, 'x');
	notNaN(Vec2.prototype, 'y');
}

/**
 * 在某个基值上产生一个随机值,如 fuzzy(9,63) 表 63 +/- 9 区间的随机值
 * @param {Number} range
 * @param {Number} base
 */
function fuzzy(range, base) {
	return (base || 0) + (Math.random() - 0.5) * range * 2;
}

/**
 * 在某个数组列表中随机选择一项
 * @param {Array} array
 */
function choose(array) {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * 粒子
 * @param {Vec2} position
 * @param {Vec2} velocity
 */
function Particle(position) {
	this.position = position;
	this.velocity = new Vec2(0.0, 0.0);
	this.angle = 0;		//角度
	this.angularVelocity = 0;	//角速度
	this.age = 0;
}

Particle.prototype = {
	maxAge: Infinity,
	update: function(td) {
		this.age += td;
		this.position.iadd(this.velocity.muls(td));
		this.angle += this.angularVelocity * td;
		return this.age < this.maxAge;
	}
};

/**
 * 简单的canvas图片渲染器
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<Particle>} particles
 * @param {Number} fade 渐隐时间(一般等于粒子maxAge)
 */
function renderCanvasImage(ctx, particles, fade) {
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i];
		ctx.save();
		if (fade) {
			ctx.globalAlpha *= (fade - particle.age) / fade;
		}
		ctx.translate(particle.position.x, particle.position.y);
		ctx.rotate(particle.angle);
		ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
		ctx.restore();
	}
}

/**
 * 粒子系统
 */
function ParticleSystem() {
	this.particles = [];
	this.forces = []; //对粒子的所有作用力
}

ParticleSystem.prototype = {
	update: function(td) {
		var alive = []; //存活的粒子
		for (var i = 0; i < this.particles.length; i++) {
			var particle = this.particles[i];
			for (var j = 0; j < this.forces.length; j++) {
				var force = this.forces[j];
				force(particle, td);
			}
			if (particle.update(td)) {
				alive.push(particle);
			}
		}
		this.particles = alive;
	},
};

/**
 * 加载图片
 * @param {String[]} srcs
 * @param {Function} callback
 */
function loadImage(srcs, callback) {
	var loaded = 0,
		imgs = [];

	function onload() {
		if (++loaded == srcs.length) callback(imgs);
	}
	for (var i = 0; i < srcs.length; i++) {
		var src = srcs[i];
		var img = new Image();
		imgs.push(img);
		img.onload = onload;
		img.src = src;
	}
}
