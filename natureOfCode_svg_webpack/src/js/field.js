import Vector from "./vector.js";
import Noise from "./perlin.js";

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

export default class Field {
  constructor(rsl,canvas,innerWidth,innerHeight){
    this.counter = 0;
    this.turbulence = 4;
    this.resolution = rsl;
    this.field = [];
    this.cols = Math.round(innerWidth/this.resolution);
    this.rows = Math.round(innerHeight/this.resolution);
    this.fieldGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		this.fieldGroup.setAttribute("class","field");

    for (var i = 0; i<= this.cols; i++) {
      this.field.push([])
      for (var j = 0; j<= this.rows; j++) {
        let fieldVector = {
          x : j,
          y : i,
          theta: Noise(i/this.turbulence,j/this.turbulence)*Math.PI*2,
          // theta:0,
          body: document.createElementNS('http://www.w3.org/2000/svg', 'polyline'),
        };

        fieldVector.body.setAttribute("points","-10,0 10,0 7,-2 10,0 7,2")
        fieldVector.body.setAttribute("stroke","rgba(0,0,0,.5)");
        fieldVector.body.setAttribute("stroke-width","1");
        fieldVector.body.setAttribute("fill","none");

        this.field[i].push(fieldVector)
        fieldVector.body.setAttribute("transform", "translate("+ fieldVector.y*this.resolution +","+ fieldVector.x*this.resolution +")rotate(" + (fieldVector.theta/(Math.PI*2)*360) + ")");
        this.fieldGroup.appendChild(fieldVector.body);
      }
    }

    canvas.appendChild(this.fieldGroup);
  }

  update(){
    this.counter+=0.08;
    for (var i = 0; i<= this.cols; i++) {
      for (var j = 0; j<= this.rows; j++) {
        this.field[i][j].theta = Noise((i+this.counter)/this.turbulence,(j+this.counter)/this.turbulence)*Math.PI*2,
        this.field[i][j].body.setAttribute("transform", "translate("+ this.field[i][j].y*this.resolution +","+ this.field[i][j].x*this.resolution +")rotate(" + (this.field[i][j].theta/(Math.PI*2)*360) + ")");
      }
    }
  }

  lookUp(position){
    // console.log(this.field[Math.round(position.x/this.resolution)][Math.round(position.y/this.resolution)].theta);
    return this.field[Math.round(position.x/this.resolution).clamp(0,this.cols)][Math.round(position.y/this.resolution).clamp(0,this.rows)].theta;
  }

}
