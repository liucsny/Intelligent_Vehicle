import Matter from "matter-js"
import { canvas } from "./script.js"

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
let engine = Engine.create();


export default class Box {
  constructor(x,y,w,h,options){
    // console.log(x,"  ",y,"  ",w,"  ",h);
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x, y, w, h, options);
    World.add(engine.world, this.body);

    this.svgBox = document.createElementNS('http://www.w3.org/2000/svg',"rect");
    canvas.appendChild(this.svgBox)
    this.svgBox.setAttribute("x",this.body.position.x-this.w/2);
    this.svgBox.setAttribute("y",this.body.position.y-this.h/2);
    this.svgBox.setAttribute("width",w);
    this.svgBox.setAttribute("height",h);

    Engine.run(engine);
    // console.log(this.body)
  }

  update(){
    this.svgBox.setAttribute("x",this.body.position.x-this.w/2);
    this.svgBox.setAttribute("y",this.body.position.y-this.h/2);
    this.svgBox.setAttribute("transform","rotate(" + this.body.angle/Math.PI*180 + " " + this.body.position.x + "," + this.body.position.y + ")");
  }
}
