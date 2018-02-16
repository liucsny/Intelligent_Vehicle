import Box from "./box.js";

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

let canvas = document.createElementNS('http://www.w3.org/2000/svg', 'g');
export { canvas };
svg.appendChild(canvas)
canvas.setAttribute("transform", "translate(" + margin.left + "," + margin.top + ")");



let ground = new Box(500,300,1000,10,{ isStatic: true });

let boxes = [];

svg.addEventListener("mousedown",function(e){
  let mousePositionX = e.pageX - margin.left;
  let mousePositionY = e.pageY - margin.top;
  boxes.push(new Box(mousePositionX,mousePositionY,20,20,{
    friction:0.01
  }))

  // console.log(boxes)
})



// ========================================
// let mousePosition = {
// 	x:100,
// 	y:100
// };
// svg.addEventListener('mousemove', function(e) {
//     mousePosition.x = e.pageX - margin.left;
//     mousePosition.y = e.pageY - margin.top;
// }, false);
// let testBox = document.createElementNS('http://www.w3.org/2000/svg',"rect");
// canvas.appendChild(testBox)
// ========================================


;(function animate(){
  // testBox.setAttribute("x",mousePosition.x);
  // testBox.setAttribute("y",mousePosition.y);
  // testBox.setAttribute("width",30);
  // testBox.setAttribute("height",30);
  // box1.update();
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].update()
  }


	requestAnimationFrame(animate);
})();
