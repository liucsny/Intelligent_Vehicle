window.onload = function (){
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.getElementsByTagName('body')[0].appendChild(canvas);
let c = canvas.getContext("2d")


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
	}
}



class Vehicle{
	constructor(x,y) {
		this.name = name;
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
		this.maxspeed = 3;
	}

	update(){
		this.velocity = Vector.add(this.velocity,this.acceleration.x);
		this.location = Vector.add(this.location,this.velocity.x);
		this.acceleration = Vector.mult(this.acceleration,0)
	}

	applyForce(force){
		this.acceleration = Vector.add(this.acceleration,force);
	}

	seek(target){
		this.desired = Vector.sub(target,this.location);
		this.desired = Vector.normalize(this.desired);
		this.desired = Vector.mult(this.desired,maxspeed);
		this.steer = Vector.sub(this.desired,this.velocity);
		this.applyForce(this.steer)

	}

	display(){
		// this.update();
		c.beginPath();
		c.arc(this.location.x,this.location.y,40,0,Math.PI*2,true);
		c.stroke();
	}

}

let v = new Vehicle(100,400);


(function animate(){
	c.clearRect(0,0,canvas.width,canvas.height)
	
	v.display();


	requestAnimationFrame(animate);
})()


}