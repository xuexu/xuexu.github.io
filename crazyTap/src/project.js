window.__require=function t(e,i,s){function n(a,c){if(!i[a]){if(!e[a]){var h=a.split("/");if(h=h[h.length-1],!e[h]){var r="function"==typeof __require&&__require;if(!c&&r)return r(h,!0);if(o)return o(h,!0);throw new Error("Cannot find module '"+a+"'")}}var p=i[a]={exports:{}};e[a][0].call(p.exports,function(t){return n(e[a][1][t]||t)},p,p.exports,t,e,i,s)}return i[a].exports}for(var o="function"==typeof __require&&__require,a=0;a<s.length;a++)n(s[a]);return n}({CountUI:[function(t,e,i){"use strict";cc._RF.push(e,"1d071x089BOJqQEHsX369nX","CountUI"),cc.Class({extends:cc.Component,properties:{score:cc.Label,waves:cc.Label,combo:cc.Node},init:function(t){this.game=t},start:function(){},setScore:function(t){this.score.string=t},setWave:function(t,e){this.waves.string=t+"/"+e}}),cc._RF.pop()},{}],Foe:[function(t,e,i){"use strict";cc._RF.push(e,"29857XbviJOjYehZc+1posz","Foe");var s=t("Types").FoeType,n=t("Types").Pos,o=t("Types").PlayerState;cc.Class({extends:cc.Component,properties:{foeType:{default:s.Foe0,type:s},hp:10,speed:100,atkPower:1,atkRadius:40,isAlive:!0,foeCon:cc.Node,foeSprite:cc.Node,bloodNode:cc.Node,medal:cc.Node,medalActive:cc.Node,medalSpeed:10},onLoad:function(){this.isAtking=!1,this.medalRadius=this.game.medalArea.getContentSize().width/2,this.medaling=!1,this.runAni=this.foeSprite.getComponent(cc.Animation),this.jumpAni=this.foeCon.getComponent(cc.Animation);var t=this;this.node.on("freeze",function(){cc.log("freeze"),t.node.stopAllActions()})},init:function(t,e){this.game=t.game,this.player=this.game.player,this.spawn=t,this.maxHp=this.hp,this.foeSprite.opacity=255,this.isAlive=!0,this.dir=this.spawn.pos===n.Left?-1:1,this.foeSprite.scaleX=-this.dir,this.node.x=this.dir*e,this.node.y=120,this.spawn.wave.waveMng.foeContainer.addChild(this.node),this.bloodNode.scaleX=1;var i=this.node.x;this.runAni.play("stand");var s=cc.callFunc(function(){this.isAtking=!0,this.runAni.play("run_right")},this);this.node.runAction(cc.sequence(cc.moveTo(.5,cc.v2(i,0)),s)),this.hitPlayerHp=0},dead:function(){this.node.stopAllActions(),this.runAni.stop(),this.isAtking=!1,this.isAlive=!1,this.game.waveMng.hitFoe(),this.runAni.play("dead");var t=this;this.scheduleOnce(function(){t.game.poolManage.getPool(t.foeType).pool.put(t.node)},this.runAni.getAnimationState("dead").duration)},onDeadEnd:function(){cc.log("deadEnd")},update:function(t){if(this.game.isGaming&&this.isAtking){var e=this.player.node.position.sub(this.node.position),i=e.mag();if(this.dir=e.normalize().x<0?-1:1,this.foeSprite.scaleX=this.dir,this.node.x+=this.dir*this.speed*t,this.player.state===o.atking&&i<this.player.atkRadius){this.hp-=this.player.atkPower,this.hp<=0&&(this.hp=0);var s=this.hp/this.maxHp;this.bloodNode.runAction(cc.scaleTo(.1,s,1)),0===this.hp?(this.game.medalArea.children[0].active=!1,this.dead()):this.node.x-=this.dir*this.player.atkRadius*1}else i<this.atkRadius&&(this.player.node.x+=this.dir*this.atkRadius*.5);this.game.medalArea.position.sub(this.node.position).mag()<=this.medalRadius?(this.game.medalArea.children[0].active=!0,this.medaling=!0,this.medal.active=!0,this.hitPlayerHp+=this.atkPower*t,this.medalActive.height=this.medal.height*this.hitPlayerHp/this.player.hp,this.medalActive.height>=this.medal.height&&this.game.gameOver()):this.medaling&&(this.medaling=!1,this.medal.active=!1,this.hitPlayerHp=0,this.medalActive.height=0,this.game.medalArea.children[0].active=!1)}}}),cc._RF.pop()},{Types:"Types"}],Game:[function(t,e,i){"use strict";cc._RF.push(e,"2cae9jpKRdBRIxxpcWJGuqa","Game");t("Types").FoeType;cc.Class({extends:cc.Component,properties:{countUI:cc.Node,winUI:cc.Node,player:cc.Node,medalArea:cc.Node,touchHelper:cc.Node,poolManage:cc.Node,waveMng:cc.Node,poeContainer:cc.Node,bgm:{default:null,type:cc.AudioClip}},onLoad:function(){this.player=this.player.getComponent("Player"),this.player.init(this),this.touchHelper=this.touchHelper.getComponent("TouchHelper"),this.touchHelper.init(this),this.poolManage=this.poolManage.getComponent("PoolManage"),this.poolManage.init(),this.waveMng=this.waveMng.getComponent("WaveManage"),this.waveMng.init(this),this.countUI=this.countUI.getComponent("CountUI"),this.countUI.init(this),this.winUI=this.winUI.getComponent("WinUI"),this.winUI.init(this),this.bgm=cc.audioEngine.playMusic(this.bgm,!0,.4),this.isGaming=!0},start:function(){this.waveMng.startWave()},win:function(){this.isGaming&&(this.isGaming=!1,cc.log("you win!"),cc.audioEngine.pause(this.bgm),this.winUI.playAni(!0))},gameOver:function(){this.isGaming&&(this.isGaming=!1,cc.log("Game Over"),cc.audioEngine.pause(this.bgm),this.winUI.playAni(!1))},replay:function(){cc.director.resume(),cc.director.loadScene("PlayGame")}}),cc._RF.pop()},{Types:"Types"}],HomeUI:[function(t,e,i){"use strict";cc._RF.push(e,"9718cNqQ41IiKA/eJxxXkOl","HomeUI"),cc.Class({extends:cc.Component,properties:{},startGame:function(){cc.director.loadScene("PlayGame")},onLoad:function(){cc.log("load")},start:function(){cc.log("start")}}),cc._RF.pop()},{}],Player:[function(t,e,i){"use strict";cc._RF.push(e,"31837mpDyVOOZAXc5NOVrMC","Player");var s=t("Types").PlayerState;cc.Class({extends:cc.Component,properties:{sprite:cc.Sprite,state:{visible:!1,default:s.stand,type:s,notify:function(){this.state===s.stand?this.ani.play("stand"):this.ani.play("atk-right")}},atkRadius:50,atkPower:5,hp:30},init:function(t){this.maxX=this.node.parent.getContentSize().width/2,this.game=t,this.zIndex=100,this.ani=this.sprite.getComponent(cc.Animation),this.isBacking=!1;var e=this;this.node.on("freeze",function(){e.node.stopAllActions()})},atk:function(t){if(this.game.isGaming&&this.state!==s.atking){this.state=s.atking,this.dir=t<0?-1:1,this.node.scaleX=this.dir;var e=cc.callFunc(function(){this.state=s.stand},this);this.node.runAction(cc.sequence(cc.moveBy(.1,cc.v2(50*this.dir,this.node.y)),e))}},start:function(){},update:function(t){}}),cc._RF.pop()},{Types:"Types"}],PoolManage:[function(t,e,i){"use strict";cc._RF.push(e,"50ca5HmH4xHtZQyyLRrmMM9","PoolManage");var s=t("Types").FoeType,n=cc.Class({name:"FoePool",properties:{foeType:{default:s.Foe0,type:s},size:10,prefab:cc.Prefab},init:function(){this.pool=this.pool||new cc.NodePool("Foe");for(var t=0,e=this.size;t<e;++t)this.pool.put(cc.instantiate(this.prefab))}});cc.Class({extends:cc.Component,properties:{foePool:{default:[],type:n}},init:function(){var t=this;this.poolObj={},this.foePool.forEach(function(e){e.init(),t.poolObj[e.foeType]=e})},getPool:function(t){return this.poolObj[t]}}),cc._RF.pop()},{Types:"Types"}],SkillTypes:[function(t,e,i){"use strict";cc._RF.push(e,"4e35bQqOO1GE7bm1BIn1heK","SkillTypes"),Object.defineProperty(i,"__esModule",{value:!0});var s=cc.Enum({Skill0:-1,Skill1:-1});i.default=s,e.exports=i.default,cc._RF.pop()},{}],Skill:[function(t,e,i){"use strict";cc._RF.push(e,"b01839W5RtMBYiLYNyqDQpS","Skill"),cc.Class({extends:cc.Component,properties:{},start:function(){}}),cc._RF.pop()},{}],Spawn:[function(t,e,i){"use strict";cc._RF.push(e,"2a4f2uJk1BJU7VT1mferPcj","Spawn"),Object.defineProperty(i,"__esModule",{value:!0});var s=t("Types").FoeType,n=t("Types").Pos,o=cc.Class({name:"Spawn",properties:{foeType:{default:s.Foe0,type:s},total:0,pos:{default:n.Left,type:n}},ctor:function(){this.spawned=0,this.finished=!1},init:function(t){this.game=t.game,this.wave=t;this.pos,n.Left;for(var e=this.wave.waveMng.game.poolManage,i=320,s=0;s<this.total;++s){i=150+150*Math.random(),0===e.getPool(this.foeType).pool.size()&&e.getPool(this.foeType).init(),e.getPool(this.foeType).pool.get().getComponent("Foe").init(this,i)}}});i.default=o,e.exports=i.default,cc._RF.pop()},{Types:"Types"}],TouchHelper:[function(t,e,i){"use strict";cc._RF.push(e,"81e33yNt6tBoIN8OfgcoXVj","TouchHelper"),cc.Class({extends:cc.Component,properties:{},init:function(t){this.game=t,this.player=this.game.player,this.registerInput()},registerInput:function(){this.node.on("touchstart",function(t){return!0},this),this.node.on("touchend",function(t){var e=t.getLocation(),i=cc.v2(this.node.convertToNodeSpaceAR(e).x,0).normalize().x;this.player.atk(i)},this)},start:function(){}}),cc._RF.pop()},{}],Types:[function(t,e,i){"use strict";cc._RF.push(e,"94f2dNuoTlOOYWIZYrJGrrN","Types"),Object.defineProperty(i,"__esModule",{value:!0});var s=cc.Enum({Foe0:-1,Foe1:-1,Foe2:-1,Foe3:-1,Foe5:-1,Foe6:-1}),n=cc.Enum({Human:-1,None:-1}),o=cc.Enum({Left:-1,Right:-1}),a=cc.Enum({stand:-1,atking:-1});i.default={FoeType:s,BossType:n,Pos:o,PlayerState:a},e.exports=i.default,cc._RF.pop()},{}],WaveManage:[function(t,e,i){"use strict";cc._RF.push(e,"2cd68HN8zVHg4KB1PxAvZ6r","WaveManage");t("Types").FoeType;var s=t("Types").BossType,n=t("Types").Pos,o=t("Spawn"),a=cc.Class({name:"Wave",properties:{spawns:{default:[],type:o},boss:{default:s.None,type:s},bossPos:{default:n.Left,type:n}},init:function(t){var e=this;this.game=t.game,this.waveMng=t,this.totalFoes=0,this.spawns.forEach(function(t){t.init(e),e.totalFoes+=t.total})}});cc.Class({extends:cc.Component,properties:{waves:{default:[],type:a},startWaveIdx:0,killedFoe:{visible:!1,default:0,notify:function(){this.game.countUI.setScore(this.killedFoe),this.currWaveKilled>=this.currWave.totalFoes&&(this.currWaveIdx++,this.waves[this.currWaveIdx]?(this.currWave=this.waves[this.currWaveIdx],this.startWave()):this.game.win())}},foeContainer:cc.Node},init:function(t){this.game=t,this.currWaveKilled=0,this.currWaveIdx=this.startWaveIdx,this.currWave=this.waves[this.currWaveIdx]},startWave:function(){this.currWaveKilled=0,this.game.countUI.setWave(this.currWaveIdx+1,this.waves.length),this.currWave.init(this)},hitFoe:function(){this.currWaveKilled++,this.killedFoe++},start:function(){}}),cc._RF.pop()},{Spawn:"Spawn",Types:"Types"}],WinUI:[function(t,e,i){"use strict";cc._RF.push(e,"22143zrW2RLMrTSQYEpCNnx","WinUI"),cc.Class({extends:cc.Component,properties:{label:cc.Label},init:function(t){this.game=t,this.ani=this.node.getComponent(cc.Animation)},playAni:function(t){this.label.string=t?"You Win!":"You Lose!",cc.log(this.label.string),this.ani.play("win"),this.scheduleOnce(function(){cc.director.pause()},this.ani.getAnimationState("win").duration)},play:function(){this.game.replay()}}),cc._RF.pop()},{}]},{},["CountUI","Foe","Game","HomeUI","Player","PoolManage","Spawn","TouchHelper","Types","WaveManage","WinUI","Skill","SkillTypes"]);