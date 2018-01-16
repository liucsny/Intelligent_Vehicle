window.onload = function (){
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.getElementsByTagName('body')[0].appendChild(canvas);
let c = canvas.getContext("2d")


class Vehicle{
	constructor(name) {
		this.name = name;
		this.location;
		this.velocity;
		this.acceleration;
	}
}

let v = new Vehicle("processing!");


(function animate(){

	v.sayHi();

	requestAnimationFrame(animate);
})()


}