import Noise from "./perlin.js";
import Vehicle from "./vehicle.js";
import Field from "./field.js"

let outterWidth = 1200,
    outterHeight = 800,
    margin = {
    	top:100,
    	bottom:100,
    	left:100,
    	right:100,
    },
    innerWidth = outterWidth - margin.left - margin.right,
    innerHeight = outterHeight - margin.top - margin.bottom;

let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute("width",outterWidth);
svg.setAttribute("height",outterHeight);
document.querySelector('body').appendChild(svg);

let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
g.setAttribute("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.appendChild(g)



let mousePosition = {
	x:100,
	y:100
};
svg.addEventListener('mousemove', function(e) {
    mousePosition.x = e.pageX - margin.left;
    mousePosition.y = e.pageY - margin.top;
}, false);


let v = []
for (var i = 0; i <= 600 ; i++) {
 	v.push(new Vehicle(Math.random()*innerWidth,Math.random()*innerHeight,Math.random()*2+2,g,innerWidth,innerHeight))
 };

let field = new Field(30,g,innerWidth,innerHeight)

;(function animate(){
		v.forEach(function(vehicle){
      vehicle.followFeild(field);
      vehicle.update();
    })
  field.update()

	requestAnimationFrame(animate);
})();
