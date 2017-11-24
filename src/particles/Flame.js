//DevKit demo

import device;
import ui.View as View;
import ui.ImageView as ImageView;
import ui.ParticleEngine as ParticleEngine;

exports = Class(View, function(supr) {
	var FLAME_WIDTH = 64,
		FLAME_HEIGHT = 96,
		FLAME_R = -Math.PI / 18,
		FLAMES = [
			"resources/images/particles/flames/fire1Left.png",
			"resources/images/particles/flames/fire2Left.png",
			"resources/images/particles/flames/fire3Left.png",
			"resources/images/particles/flames/fire4Left.png",
			"resources/images/particles/flames/fire1Right.png",
			"resources/images/particles/flames/fire2Right.png",
			"resources/images/particles/flames/fire3Right.png",
			"resources/images/particles/flames/fire4Right.png"
		],
		SPARK_IMAGE = "resources/images/particles/flames/spark.png",
		SMOKE_IMAGE = "resources/images/particles/flames/smoke.png";
		
    this.init = function(opts) {
		supr(this, 'init', [opts]);      
        FLAME_WIDTH = opts.width;
		FLAME_HEIGHT = opts.height;
    	this.torchFlame = new ParticleEngine({
			parent: this,
			r: FLAME_R,
			width: FLAME_WIDTH,
			height: FLAME_HEIGHT,
			centerAnchor: true
		});
	};

	this.runTick = function(dt) {
        this.torchFlame.runTick(dt);
    };
    
	this.emitFlameParticles = function() {
		var data = this.torchFlame.obtainParticleArray(10);
		for (var i = 0; i < 10; i++) {
			var pObj = data[i];
			var roll = Math.random();
			if (roll < 0.8) {
				var ttl = Math.random() * 1200 + 400;
				var width = Math.random() * FLAME_WIDTH + FLAME_WIDTH / 2;
				var height = FLAME_HEIGHT * width / FLAME_WIDTH;

				pObj.image = FLAMES[~~(Math.random() * FLAMES.length)];
				pObj.x = Math.random() * FLAME_WIDTH / 3 - FLAME_WIDTH / 6 + 3 + Math.random() * 3;
				pObj.y = FLAME_HEIGHT - 1.2 * height;
				pObj.dr = -FLAME_R * 1000 / ttl;
				pObj.ax = width / 2;
				pObj.ay = height / 2;
				pObj.width = width;
				pObj.height = height;
				pObj.dheight = pObj.ddheight = Math.random() * 200;
				pObj.dy = pObj.ddy = -pObj.dheight;
				pObj.dscale = 0.2;
				pObj.opacity = 0;
				pObj.dopacity = 4000 / ttl;
				pObj.ddopacity = -4 * pObj.dopacity;
				pObj.ttl = ttl;
			} else if (roll < 0.9) {
				var ttl = Math.random() * 6000 + 2000;
				var width = Math.random() * 10 + 2;
				var height = width;

				pObj.image = SPARK_IMAGE;
				pObj.x = FLAME_WIDTH / 2 - width / 2 + Math.random() * 16 + 8;
				pObj.y = Math.random() * FLAME_HEIGHT - height;
				pObj.dx = Math.random() * 50 - 25;
				pObj.dy = -Math.random() * 150 - 75;
				pObj.dr = Math.random() * 2 * Math.PI;
				pObj.ddx = Math.random() * 100 - 50;
				pObj.ddy = -Math.random() * 75;
				pObj.ax = width / 2;
				pObj.ay = height / 2;
				pObj.dax = Math.random() * 60 - 30;
				pObj.day = Math.random() * 60 - 30;
				pObj.ddax = -pObj.dax / 2;
				pObj.dday = -pObj.day / 2;
				pObj.width = width;
				pObj.height = height;
				pObj.dopacity = -1000 / ttl;
				pObj.ttl = ttl;
			} else if (roll < 1) {
				var ttl = Math.random() * 20000 + 10000;
				var width = Math.random() * 32 + 32;
				var height = width;

				pObj.image = SMOKE_IMAGE;
				pObj.x = FLAME_WIDTH / 2 - width / 2 + Math.random() * 16 + 8;
				pObj.y = -height;
				pObj.dx = Math.random() * 10 - 5;
				pObj.dy = -Math.random() * 140 - 70;
				pObj.dr = Math.random() * Math.PI / 4;
				pObj.ddx = Math.random() * 36 - 18;
				pObj.ddy = -Math.random() * 44 + 6;
				pObj.ax = width / 2;
				pObj.ay = height / 2;
				pObj.width = width;
				pObj.height = height;
				pObj.dscale = Math.random() * 0.5 + 0.25,
				pObj.opacity = 0.6,
				pObj.dopacity = -1000 / ttl;
				pObj.ddopacity = -Math.random() * 1000 / ttl;
				pObj.ttl = ttl;
			}
		}
		this.torchFlame.emitParticles(data);
	};
});