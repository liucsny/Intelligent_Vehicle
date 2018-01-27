window.onload = function (){
let canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 800;
let margin = {
	top:100,
	bottom:100,
	left:100,
	right:100,
},
	innerWidth = canvas.width - margin.left - margin.right,
	innerHeight = canvas.height - margin.top - margin.bottom;

document.getElementsByTagName('body')[0].appendChild(canvas);
let c = canvas.getContext("2d");

let mousePosition = {
	x:null,
	y:null
};

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
	constructor(x,y,m) {
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
		this.maxspeed = 2;
		this.r = m;
		this.mass = 1;
	}

	display(){
		this.update();
		// console.log(this.location)
		let theta = Vector.heading(this.velocity)+Math.PI/2;

		c.save();
		c.translate(this.location.x, this.location.y);
		c.rotate(theta);
		c.fillStyle = "rgba(0,0,0)"
		c.beginPath();
		c.moveTo(0,-this.r*2);
		c.lineTo(-this.r,this.r*2);
		c.lineTo(this.r,this.r*2);
		c.closePath();
		c.fill();
		c.restore();

		if(this.location.x < 0){
			this.location.x = innerWidth;
		}else if(this.location.x > innerWidth){
			this.location.x = 0;
		}

		if(this.location.y < 0){
			this.location.y = innerHeight;
		}else if(this.location.y > innerHeight){
			this.location.y = 0;
		}
	}

	update(){
		// console.log(this.location)
		this.location = Vector.add(this.location,this.velocity);
		this.velocity = Vector.add(this.velocity,this.acceleration);
		this.acceleration = Vector.mult(this.acceleration,0)
	}

	applyForce(force){
		this.acceleration = Vector.mult(Vector.add(this.acceleration,force),1/this.mass);
	}

	seek(target){
		this.desired = Vector.sub(target,this.location);
		let d = Vector.mag(this.desired);


		this.desired = Vector.normalize(this.desired);

		if (d < 100) {
			let m = d/100*this.maxspeed;
			this.desired = Vector.mult(this.desired,m);
		}else{
			this.desired = Vector.mult(this.desired,this.maxspeed);
		}

		let steer = Vector.sub(this.desired,this.velocity);
		steer = Vector.mult(steer,0.1);
		this.applyForce(steer);
	}

	followFeild(Feild){
		// this.desired = {
		// 	x:1,
		// 	y:1
		// }
		this.desired = Vector.mult(Vector.normalize(Feild.lookUp(this.location)),2)
		this.desired = Vector.mult(this.desired,this.maxspeed);
		let steer = Vector.sub(this.desired,this.velocity);
		steer = Vector.mult(steer,0.1);
		this.applyForce(steer)
	}

}





class Field{
	constructor(rsl){
		this.resolution = rsl;
		this.field = [];
		this.cols = Math.round(innerWidth/this.resolution);
		this.rows = Math.round(innerHeight/this.resolution);

		for (var i = 0; i<= this.cols; i++) {
			this.field.push([])
			for (var j = 0; j<= this.rows; j++) {
				this.field[i].push({
					// x : 1,
					// y : 1
					x : Math.random()*2-0.8,
					y : Math.random()*2-0.8
				})
			}
		}
	}

	update(){
		for (var i = 0 ; i <= this.field.length - 1; i++) {
			for (var j = 0 ; j <= this.field[i].length - 1; j++) {
				this.field[i][j].x += (Math.random()-0.5)*0.3;
				this.field[i][j].y += (Math.random()-0.5)*0.3;
				// console.log(this.field[i][j].x)
			}
		}

	}

	display(){
		// this.update();

		for (var i = 0 ; i <= this.field.length - 1; i++) {
			for (var j = 0 ; j <= this.field[i].length - 1; j++) {
				this.field[i][j].theta = Vector.heading(this.field[i][j])
				// console.log(this.field[i][j])
				c.save();
				c.translate(i*this.resolution, j*this.resolution);
				c.rotate(this.field[i][j].theta - Math.PI/2);      //还要减Math.PI/2，坑爹
				c.beginPath();
				c.moveTo(0,0);
				c.lineTo(0,this.resolution/2);
				c.moveTo(-0.2*this.resolution/2,0.8*this.resolution/2);
				c.lineTo(0,this.resolution/2);
				c.lineTo(0.2*this.resolution/2,0.8*this.resolution/2);
				c.stroke();
				c.restore();
			}
		}
	}

	lookUp(position){
		let column = Math.round(Math.min(position.x/this.resolution, this.cols-1));
		let row = Math.round(Math.min(position.y/this.resolution, this.rows-1));
		return {
			x: this.field[column][row].x,
			y: this.field[column][row].y,
		}
	}

}




let v = []
for (var i = 0; i <= 400 ; i++) {
 	v.push(new Vehicle(Math.random()*innerWidth,Math.random()*innerHeight,Math.random()*5+3))
 };

let flowField = new Field(50);

(function animate(){

	c.clearRect(0,0,canvas.width,canvas.height)

	c.save();
	c.translate(margin.left,margin.top);

	// flowField.display();

	for (var i = v.length - 1; i >= 0; i--) {
		v[i].display()
		v[i].followFeild(flowField)
	}
	c.restore();

	requestAnimationFrame(animate);
})()


}
