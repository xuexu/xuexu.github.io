function Fish(posx,posy,posz,imgSrc,imgWidth,imgHeight){
	var TO_RADIANS=Math.PI/180;
	this.domElement=document.createElement('div');
	this.domElement.style.background='url('+imgSrc+') transparent';
	this.domElement.style.position='absolute';
	this.domElement.style.display='block';
	this.domElement.style.width=imgWidth+'px';
	this.domElement.style.height=imgHeight+'px';
	/*var tranO=(this.domElement.style.webkitTransformOrigin
	||this.domElement.style.MozTransformOrigin
	||this.domElement.style.oTransformOrigin
	||this.domElement.style.msTransformOrigin);
	tranO=(imgWidth/2)+'px '+(imgHeight/2)+'px';*/
	this.domElement.style.webkitTransformOrigin=(imgWidth/2)+'px '+(imgHeight/2)+'px';
	this.domElement.style.pointerEvents='auto';
	
	//小鱼的坐标
	this.posX=posx;
	this.posY=posy;
	this.posZ=posz;
	
	//小鱼的速度
	this.vx=0;
	this.vy=0;
	this.vz=0;
	
	this.size=1;
	this.enabled=true;
	
	//重力
	this.gravlity=0;
	
	var counter=0;
	
	//更新
	this.update=function(){
		this.vy+=this.gravlity;
		
		this.posX+=this.vx;
		this.posY+=this.vy;
		this.posZ+=this.vz;
		
		counter++;
		this.rotate(2);
	};
	
	//渲染
	this.render=function(){
		var dom=this.domElement,
		sx=Math.sin(counter*0.4)*0.04+this.size,
		sy=Math.sin(Math.PI+counter*0.4)*0.04+this.size;
		
		/*var tranf=(dom.style.webkitTransform
		||dom.style.MozTransform
		||dom.style.oTransform
		||dom.style.msTransform);
		tranf='translate3d('+this.posX+'px, '+this.posY+'px, '+this.posZ
		+'px) scale('+sx+','+sy+') rotate('+Math.sin(counter*0.05)*20+'deg)';*/
		
		dom.style.webkitTransform='translate3d('+this.posX+'px, '+this.posY+'px, '+this.posZ
		+'px) scale('+sx+','+sy+') rotate('+Math.sin(counter*0.05)*20+'deg)';
	};
	
	this.rotate=function(angle,useRadians){
		//绕y轴旋转(会影响到x和z轴)
		var cosRY=Math.cos(angle*(useRadians ? 1:TO_RADIANS));
		var sinRY=Math.sin(angle * (useRadians?1:TO_RADIANS));
		
		var tempx=this.posX-HALF_WIDTH;
		this.posX=(tempx*cosRY)-(this.posZ*sinRY)+HALF_WIDTH;
		this.posZ=(tempx*sinRY)+(this.posZ*cosRY);
		
		tempx=this.vx;
		this.vx=(tempx*cosRY)-(this.vz*sinRY);
		this.vz=(tempx*sinRY)+(this.vz*cosRY);
	};
}




















