window.onload = function (){
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.getElementsByTagName('body')[0].appendChild(canvas);
let c = canvas.getContext("2d");

let mousePosition = {
	x:null,
	y:null
}
canvas.addEventListener('mousemove', function(e) {
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
}, false);

let Vector = {
	add : function(v1,v2){
		return {
			x : v1.x + v2.x,
			y : v1.y + v2.y
		}
	},
	sub : function(v1,v2){
		return {
			x : v1.x - v2.x,
			y : v1.y - v2.y
		}
	},
	mult : function(v,n){
		return {
			x : v.x * n,
			y : v.y * n
		}
	},
	normalize : function(v){
		let length = Math.sqrt(v.x*v.x + v.y*v.y)
		return {
			x : v.x/length,
			y : v.y/length
		}
	},
	mag : function(v){
		return Math.sqrt(v.x*v.x + v.y*v.y)
	},
	heading : function(v){
		return Math.atan2(v.y,v.x)
	}
}





class Vehicle{
	constructor(x,y,r) {
		this.location = {
			x:x,
			y:y
		};
		this.velocity = {
			x:0,
			y:0
		};
		this.acceleration = {
			x:0,
			y:0
		};
		this.maxspeed = 8;
		this.r = r;
	}

	display(){
		this.update();
		this.seek(mousePosition)
		// console.log(this.location)
		let theta = Vector.heading(this.velocity)+Math.PI/2;

		c.save();
		c.translate(this.location.x, this.location.y);
		c.rotate(theta);
		c.beginPath();
		c.moveTo(0,-this.r*2);
		c.lineTo(-this.r,this.r*2);
		c.lineTo(this.r,this.r*2);
		c.closePath();
		c.fill();
		c.restore();
	}

	update(){
		// console.log(this.location)
		this.location = Vector.add(this.location,this.velocity);
		this.velocity = Vector.add(this.velocity,this.acceleration);
		this.acceleration = Vector.mult(this.acceleration,0)
	}

	applyForce(force){
		this.acceleration = Vector.add(this.acceleration,force);
	}

	seek(target){
		let desired = Vector.sub(target,this.location);
		let d = Vector.mag(desired);


		desired = Vector.normalize(desired);

		if (d < 100) {
			let m = d/100*this.maxspeed;
			desired = Vector.mult(desired,m);
		}else{
			desired = Vector.mult(desired,this.maxspeed);
		}

		let steer = Vector.sub(desired,this.velocity);
		steer = Vector.mult(steer,0.1);
		this.applyForce(steer)
	}

}

let v = []
for (var i = 0; i <= 100 ; i++) {
 	v.push(new Vehicle(Math.random()*canvas.width,Math.random()*canvas.height,Math.random()*4+3))
 };


(function animate(){
	c.clearRect(0,0,canvas.width,canvas.height)
	
	for (var i = v.length - 1; i >= 0; i--) {
		v[i].display()
	}

	requestAnimationFrame(animate);
})()


}