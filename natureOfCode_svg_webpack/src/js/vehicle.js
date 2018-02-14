import Vector from "./vector.js";

export default class Vehicle {
  constructor(x,y,m,canvas,innerWidth,innerHeight) {
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

    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;

		this.maxspeed = 20;
		this.r = m;
		this.mass = 1;

    this.body = (function(r){
      let body = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      body.setAttribute("class","vehicle");

      let vehicle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      vehicle.setAttribute("d","M0 -" + r*2 + " L-"+ r + " " + r*2 + " L" + r + " " + r*2 + " Z");
      vehicle.setAttribute("fill","black");

      vehicle.addEventListener("mouseover",function(e) {
        this.setAttribute("fill","royalblue")
        this.setAttribute("stroke","orange")
        this.setAttribute("stroke-width",1)
        this.setAttribute("stroke-linecap","round")
      });
      vehicle.addEventListener("mouseout",function(e) {
        this.setAttribute("fill","black")
        this.removeAttribute("stroke")
        this.removeAttribute("stroke-linecap")
        this.removeAttribute("stroke-width")
      });

      body.appendChild(vehicle);
      return body;
    }(this.r));

    canvas.appendChild(this.body);
  }

  update(){
    this.location = Vector.add(this.location,this.velocity);
    this.velocity = Vector.add(this.velocity,this.acceleration);
    this.acceleration = Vector.mult(this.acceleration,0);

    let theta = Vector.heading(this.velocity)*180/Math.PI+90;
    this.body.setAttribute("transform", "translate(" + this.location.x + "," + this.location.y + ")rotate(" + theta + ")");

    if(this.location.x < 0){
			this.location.x = this.innerWidth;
		}else if(this.location.x > this.innerWidth){
			this.location.x = 0;
		}
		if(this.location.y < 0){
			this.location.y = this.innerHeight;
		}else if(this.location.y > this.innerHeight){
			this.location.y = 0;
		}
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
    this.desired = {
      x: Math.cos(Feild.lookUp(this.location)),
      y: Math.sin(Feild.lookUp(this.location))
    }

    this.desired = Vector.mult(this.desired,10);
    // console.log(Feild.lookUp(this.location));
    let steer = Vector.sub(this.desired,this.velocity);
    steer = Vector.mult(steer,0.1);
    this.applyForce(steer);
  }
}
