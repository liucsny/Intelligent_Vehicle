/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


var PERLIN_YWRAPB = 4;
var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
var PERLIN_ZWRAPB = 8;
var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
var PERLIN_SIZE = 4095;

var perlin_octaves = 4; // default to medium smooth
var perlin_amp_falloff = 0.5; // 50% reduction/octave

var scaled_cosine = function(i) {
  return 0.5 * (1.0 - Math.cos(i * Math.PI));
};

var perlin; // will be initialized lazily by noise() or noiseSeed()

var noise = function(x, y, z) {
  y = y || 0;
  z = z || 0;

  if (perlin == null) {
    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = Math.random();
    }
  }

  if (x < 0) {
    x = -x;
  }
  if (y < 0) {
    y = -y;
  }
  if (z < 0) {
    z = -z;
  }

  var xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  var xf = x - xi;
  var yf = y - yi;
  var zf = z - zi;
  var rxf, ryf;

  var r = 0;
  var ampl = 0.5;

  var n1, n2, n3;

  for (var o = 0; o < perlin_octaves; o++) {
    var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

    rxf = scaled_cosine(xf);
    ryf = scaled_cosine(yf);

    n1 = perlin[of & PERLIN_SIZE];
    n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
    n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
    n1 += ryf * (n2 - n1);

    of += PERLIN_ZWRAP;
    n2 = perlin[of & PERLIN_SIZE];
    n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
    n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
    n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
    n2 += ryf * (n3 - n2);

    n1 += scaled_cosine(zf) * (n2 - n1);

    r += n1 * ampl;
    ampl *= perlin_amp_falloff;
    xi <<= 1;
    xf *= 2;
    yi <<= 1;
    yf *= 2;
    zi <<= 1;
    zf *= 2;

    if (xf >= 1.0) {
      xi++;
      xf--;
    }
    if (yf >= 1.0) {
      yi++;
      yf--;
    }
    if (zf >= 1.0) {
      zi++;
      zf--;
    }
  }
  return r;
};

/**
 *
 * Adjusts the character and level of detail produced by the Perlin noise
 * function. Similar to harmonics in physics, noise is computed over
 * several octaves. Lower octaves contribute more to the output signal and
 * as such define the overall intensity of the noise, whereas higher octaves
 * create finer grained details in the noise sequence.
 * <br><br>
 * By default, noise is computed over 4 octaves with each octave contributing
 * exactly half than its predecessor, starting at 50% strength for the 1st
 * octave. This falloff amount can be changed by adding an additional function
 * parameter. Eg. a falloff factor of 0.75 means each octave will now have
 * 75% impact (25% less) of the previous lower octave. Any value between
 * 0.0 and 1.0 is valid, however note that values greater than 0.5 might
 * result in greater than 1.0 values returned by <b>noise()</b>.
 * <br><br>
 * By changing these parameters, the signal created by the <b>noise()</b>
 * function can be adapted to fit very specific needs and characteristics.
 *
 * @method noiseDetail
 * @param {Number} lod number of octaves to be used by the noise
 * @param {Number} falloff falloff factor for each octave
 * @example
 * <div>
 * <code>
 * var noiseVal;
 * var noiseScale = 0.02;
 *
 * function setup() {
 *   createCanvas(100, 100);
 * }
 *
 * function draw() {
 *   background(0);
 *   for (var y = 0; y < height; y++) {
 *     for (var x = 0; x < width / 2; x++) {
 *       noiseDetail(2, 0.2);
 *       noiseVal = noise((mouseX + x) * noiseScale, (mouseY + y) * noiseScale);
 *       stroke(noiseVal * 255);
 *       point(x, y);
 *       noiseDetail(8, 0.65);
 *       noiseVal = noise(
 *         (mouseX + x + width / 2) * noiseScale,
 *         (mouseY + y) * noiseScale
 *       );
 *       stroke(noiseVal * 255);
 *       point(x + width / 2, y);
 *     }
 *   }
 * }
 * </code>
 * </div>
 *
 * @alt
 * 2 vertical grey smokey patterns affected my mouse x-position and noise.
 *
 */
var noiseDetail = function(lod, falloff) {
  if (lod > 0) {
    perlin_octaves = lod;
  }
  if (falloff > 0) {
    perlin_amp_falloff = falloff;
  }
};

/**
 * Sets the seed value for <b>noise()</b>. By default, <b>noise()</b>
 * produces different results each time the program is run. Set the
 * <b>value</b> parameter to a constant to return the same pseudo-random
 * numbers each time the software is run.
 *
 * @method noiseSeed
 * @param {Number} seed   the seed value
 * @example
 * <div>
 * <code>var xoff = 0.0;
 *
 * function setup() {
 *   noiseSeed(99);
 *   stroke(0, 10);
 * }
 *
 * function draw() {
 *   xoff = xoff + .01;
 *   var n = noise(xoff) * width;
 *   line(n, 0, n, height);
 * }
 * </code>
 * </div>
 *
 * @alt
 * vertical grey lines drawing in pattern affected by noise.
 *
 */
var noiseSeed = function(seed) {
  // Linear Congruential Generator
  // Variant of a Lehman Generator
  var lcg = (function() {
    // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
    // m is basically chosen to be large (as it is the max period)
    // and for its relationships to a and c
    var m = 4294967296;
    // a - 1 should be divisible by m's prime factors
    var a = 1664525;
    // c and m should be co-prime
    var c = 1013904223;
    var seed, z;
    return {
      setSeed: function(val) {
        // pick a random seed if val is undefined or null
        // the >>> 0 casts the seed to an unsigned 32-bit integer
        z = seed = (val == null ? Math.random() * m : val) >>> 0;
      },
      getSeed: function() {
        return seed;
      },
      rand: function() {
        // define the recurrence relationship
        z = (a * z + c) % m;
        // return a float in [0, 1)
        // if z = m then z / m = 0 therefore (z % m) / m < 1 always
        return z / m;
      }
    };
  })();

  lcg.setSeed(seed);
  perlin = new Array(PERLIN_SIZE + 1);
  for (var i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
};

/* harmony default export */ __webpack_exports__["default"] = (noise);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Vector);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__perlin_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__vehicle_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__field_js__ = __webpack_require__(4);




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
for (var i = 0; i <= 300 ; i++) {
 	v.push(new __WEBPACK_IMPORTED_MODULE_1__vehicle_js__["a" /* default */](Math.random()*innerWidth,Math.random()*innerHeight,Math.random()*5+3,g,innerWidth,innerHeight))
 };

let field = new __WEBPACK_IMPORTED_MODULE_2__field_js__["a" /* default */](30,g,innerWidth,innerHeight)

;(function animate(){
  for (var i = v.length - 1; i >= 0; i--) {
		v[i].followFeild(field);
		v[i].update();
	}
  field.update()

	requestAnimationFrame(animate);
})();


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(1);


class Vehicle {
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
    this.location = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].add(this.location,this.velocity);
    this.velocity = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].add(this.velocity,this.acceleration);
    this.acceleration = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(this.acceleration,0);

    let theta = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].heading(this.velocity)*180/Math.PI+90;
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
		this.acceleration = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(__WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].add(this.acceleration,force),1/this.mass);
	}

  seek(target){
		this.desired = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].sub(target,this.location);
		let d = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mag(this.desired);
		this.desired = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].normalize(this.desired);
		if (d < 100) {
			let m = d/100*this.maxspeed;
			this.desired = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(this.desired,m);
		}else{
			this.desired = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(this.desired,this.maxspeed);
		}

		let steer = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].sub(this.desired,this.velocity);
		steer = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(steer,0.1);
		this.applyForce(steer);
	}

  followFeild(Feild){
    this.desired = {
      x: Math.cos(Feild.lookUp(this.location)),
      y: Math.sin(Feild.lookUp(this.location))
    }

    this.desired = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(this.desired,10);
    // console.log(Feild.lookUp(this.location));
    let steer = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].sub(this.desired,this.velocity);
    steer = __WEBPACK_IMPORTED_MODULE_0__vector_js__["a" /* default */].mult(steer,0.1);
    this.applyForce(steer);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Vehicle;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__vector_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__perlin_js__ = __webpack_require__(0);



Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

class Field {
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
          theta: Object(__WEBPACK_IMPORTED_MODULE_1__perlin_js__["default"])(i/this.turbulence,j/this.turbulence)*Math.PI*2 - 3/2*Math.PI,
          // theta: Math.PI,
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
        this.field[i][j].theta = Object(__WEBPACK_IMPORTED_MODULE_1__perlin_js__["default"])((i+this.counter)/this.turbulence,(j+this.counter)/this.turbulence)*Math.PI*2,
        this.field[i][j].body.setAttribute("transform", "translate("+ this.field[i][j].y*this.resolution +","+ this.field[i][j].x*this.resolution +")rotate(" + (this.field[i][j].theta/(Math.PI*2)*360) + ")");
      }
    }
  }

  lookUp(position){
    // console.log(this.field[Math.round(position.x/this.resolution)][Math.round(position.y/this.resolution)].theta);
    return this.field[Math.round(position.x/this.resolution).clamp(0,this.cols)][Math.round(position.y/this.resolution).clamp(0,this.rows)].theta;
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Field;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTQ0ZmNhNTEzZDJhYjU0ZDkxZGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3Blcmxpbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdmVjdG9yLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9zY3JpcHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3ZlaGljbGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2ZpZWxkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDN0RBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBOztBQUVBLFdBQVc7O0FBRVg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIsb0JBQW9CO0FBQ3JDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNB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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7O0FDMUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQUE7QUFBQSIsImZpbGUiOiJzY3JpcHQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTQ0ZmNhNTEzZDJhYjU0ZDkxZGIiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQRVJMSU5fWVdSQVBCID0gNDtcbnZhciBQRVJMSU5fWVdSQVAgPSAxIDw8IFBFUkxJTl9ZV1JBUEI7XG52YXIgUEVSTElOX1pXUkFQQiA9IDg7XG52YXIgUEVSTElOX1pXUkFQID0gMSA8PCBQRVJMSU5fWldSQVBCO1xudmFyIFBFUkxJTl9TSVpFID0gNDA5NTtcblxudmFyIHBlcmxpbl9vY3RhdmVzID0gNDsgLy8gZGVmYXVsdCB0byBtZWRpdW0gc21vb3RoXG52YXIgcGVybGluX2FtcF9mYWxsb2ZmID0gMC41OyAvLyA1MCUgcmVkdWN0aW9uL29jdGF2ZVxuXG52YXIgc2NhbGVkX2Nvc2luZSA9IGZ1bmN0aW9uKGkpIHtcbiAgcmV0dXJuIDAuNSAqICgxLjAgLSBNYXRoLmNvcyhpICogTWF0aC5QSSkpO1xufTtcblxudmFyIHBlcmxpbjsgLy8gd2lsbCBiZSBpbml0aWFsaXplZCBsYXppbHkgYnkgbm9pc2UoKSBvciBub2lzZVNlZWQoKVxuXG52YXIgbm9pc2UgPSBmdW5jdGlvbih4LCB5LCB6KSB7XG4gIHkgPSB5IHx8IDA7XG4gIHogPSB6IHx8IDA7XG5cbiAgaWYgKHBlcmxpbiA9PSBudWxsKSB7XG4gICAgcGVybGluID0gbmV3IEFycmF5KFBFUkxJTl9TSVpFICsgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBQRVJMSU5fU0laRSArIDE7IGkrKykge1xuICAgICAgcGVybGluW2ldID0gTWF0aC5yYW5kb20oKTtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IDApIHtcbiAgICB4ID0gLXg7XG4gIH1cbiAgaWYgKHkgPCAwKSB7XG4gICAgeSA9IC15O1xuICB9XG4gIGlmICh6IDwgMCkge1xuICAgIHogPSAtejtcbiAgfVxuXG4gIHZhciB4aSA9IE1hdGguZmxvb3IoeCksXG4gICAgeWkgPSBNYXRoLmZsb29yKHkpLFxuICAgIHppID0gTWF0aC5mbG9vcih6KTtcbiAgdmFyIHhmID0geCAtIHhpO1xuICB2YXIgeWYgPSB5IC0geWk7XG4gIHZhciB6ZiA9IHogLSB6aTtcbiAgdmFyIHJ4ZiwgcnlmO1xuXG4gIHZhciByID0gMDtcbiAgdmFyIGFtcGwgPSAwLjU7XG5cbiAgdmFyIG4xLCBuMiwgbjM7XG5cbiAgZm9yICh2YXIgbyA9IDA7IG8gPCBwZXJsaW5fb2N0YXZlczsgbysrKSB7XG4gICAgdmFyIG9mID0geGkgKyAoeWkgPDwgUEVSTElOX1lXUkFQQikgKyAoemkgPDwgUEVSTElOX1pXUkFQQik7XG5cbiAgICByeGYgPSBzY2FsZWRfY29zaW5lKHhmKTtcbiAgICByeWYgPSBzY2FsZWRfY29zaW5lKHlmKTtcblxuICAgIG4xID0gcGVybGluW29mICYgUEVSTElOX1NJWkVdO1xuICAgIG4xICs9IHJ4ZiAqIChwZXJsaW5bKG9mICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMSk7XG4gICAgbjIgPSBwZXJsaW5bKG9mICsgUEVSTElOX1lXUkFQKSAmIFBFUkxJTl9TSVpFXTtcbiAgICBuMiArPSByeGYgKiAocGVybGluWyhvZiArIFBFUkxJTl9ZV1JBUCArIDEpICYgUEVSTElOX1NJWkVdIC0gbjIpO1xuICAgIG4xICs9IHJ5ZiAqIChuMiAtIG4xKTtcblxuICAgIG9mICs9IFBFUkxJTl9aV1JBUDtcbiAgICBuMiA9IHBlcmxpbltvZiAmIFBFUkxJTl9TSVpFXTtcbiAgICBuMiArPSByeGYgKiAocGVybGluWyhvZiArIDEpICYgUEVSTElOX1NJWkVdIC0gbjIpO1xuICAgIG4zID0gcGVybGluWyhvZiArIFBFUkxJTl9ZV1JBUCkgJiBQRVJMSU5fU0laRV07XG4gICAgbjMgKz0gcnhmICogKHBlcmxpblsob2YgKyBQRVJMSU5fWVdSQVAgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4zKTtcbiAgICBuMiArPSByeWYgKiAobjMgLSBuMik7XG5cbiAgICBuMSArPSBzY2FsZWRfY29zaW5lKHpmKSAqIChuMiAtIG4xKTtcblxuICAgIHIgKz0gbjEgKiBhbXBsO1xuICAgIGFtcGwgKj0gcGVybGluX2FtcF9mYWxsb2ZmO1xuICAgIHhpIDw8PSAxO1xuICAgIHhmICo9IDI7XG4gICAgeWkgPDw9IDE7XG4gICAgeWYgKj0gMjtcbiAgICB6aSA8PD0gMTtcbiAgICB6ZiAqPSAyO1xuXG4gICAgaWYgKHhmID49IDEuMCkge1xuICAgICAgeGkrKztcbiAgICAgIHhmLS07XG4gICAgfVxuICAgIGlmICh5ZiA+PSAxLjApIHtcbiAgICAgIHlpKys7XG4gICAgICB5Zi0tO1xuICAgIH1cbiAgICBpZiAoemYgPj0gMS4wKSB7XG4gICAgICB6aSsrO1xuICAgICAgemYtLTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59O1xuXG4vKipcbiAqXG4gKiBBZGp1c3RzIHRoZSBjaGFyYWN0ZXIgYW5kIGxldmVsIG9mIGRldGFpbCBwcm9kdWNlZCBieSB0aGUgUGVybGluIG5vaXNlXG4gKiBmdW5jdGlvbi4gU2ltaWxhciB0byBoYXJtb25pY3MgaW4gcGh5c2ljcywgbm9pc2UgaXMgY29tcHV0ZWQgb3ZlclxuICogc2V2ZXJhbCBvY3RhdmVzLiBMb3dlciBvY3RhdmVzIGNvbnRyaWJ1dGUgbW9yZSB0byB0aGUgb3V0cHV0IHNpZ25hbCBhbmRcbiAqIGFzIHN1Y2ggZGVmaW5lIHRoZSBvdmVyYWxsIGludGVuc2l0eSBvZiB0aGUgbm9pc2UsIHdoZXJlYXMgaGlnaGVyIG9jdGF2ZXNcbiAqIGNyZWF0ZSBmaW5lciBncmFpbmVkIGRldGFpbHMgaW4gdGhlIG5vaXNlIHNlcXVlbmNlLlxuICogPGJyPjxicj5cbiAqIEJ5IGRlZmF1bHQsIG5vaXNlIGlzIGNvbXB1dGVkIG92ZXIgNCBvY3RhdmVzIHdpdGggZWFjaCBvY3RhdmUgY29udHJpYnV0aW5nXG4gKiBleGFjdGx5IGhhbGYgdGhhbiBpdHMgcHJlZGVjZXNzb3IsIHN0YXJ0aW5nIGF0IDUwJSBzdHJlbmd0aCBmb3IgdGhlIDFzdFxuICogb2N0YXZlLiBUaGlzIGZhbGxvZmYgYW1vdW50IGNhbiBiZSBjaGFuZ2VkIGJ5IGFkZGluZyBhbiBhZGRpdGlvbmFsIGZ1bmN0aW9uXG4gKiBwYXJhbWV0ZXIuIEVnLiBhIGZhbGxvZmYgZmFjdG9yIG9mIDAuNzUgbWVhbnMgZWFjaCBvY3RhdmUgd2lsbCBub3cgaGF2ZVxuICogNzUlIGltcGFjdCAoMjUlIGxlc3MpIG9mIHRoZSBwcmV2aW91cyBsb3dlciBvY3RhdmUuIEFueSB2YWx1ZSBiZXR3ZWVuXG4gKiAwLjAgYW5kIDEuMCBpcyB2YWxpZCwgaG93ZXZlciBub3RlIHRoYXQgdmFsdWVzIGdyZWF0ZXIgdGhhbiAwLjUgbWlnaHRcbiAqIHJlc3VsdCBpbiBncmVhdGVyIHRoYW4gMS4wIHZhbHVlcyByZXR1cm5lZCBieSA8Yj5ub2lzZSgpPC9iPi5cbiAqIDxicj48YnI+XG4gKiBCeSBjaGFuZ2luZyB0aGVzZSBwYXJhbWV0ZXJzLCB0aGUgc2lnbmFsIGNyZWF0ZWQgYnkgdGhlIDxiPm5vaXNlKCk8L2I+XG4gKiBmdW5jdGlvbiBjYW4gYmUgYWRhcHRlZCB0byBmaXQgdmVyeSBzcGVjaWZpYyBuZWVkcyBhbmQgY2hhcmFjdGVyaXN0aWNzLlxuICpcbiAqIEBtZXRob2Qgbm9pc2VEZXRhaWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBsb2QgbnVtYmVyIG9mIG9jdGF2ZXMgdG8gYmUgdXNlZCBieSB0aGUgbm9pc2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBmYWxsb2ZmIGZhbGxvZmYgZmFjdG9yIGZvciBlYWNoIG9jdGF2ZVxuICogQGV4YW1wbGVcbiAqIDxkaXY+XG4gKiA8Y29kZT5cbiAqIHZhciBub2lzZVZhbDtcbiAqIHZhciBub2lzZVNjYWxlID0gMC4wMjtcbiAqXG4gKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAqICAgY3JlYXRlQ2FudmFzKDEwMCwgMTAwKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBkcmF3KCkge1xuICogICBiYWNrZ3JvdW5kKDApO1xuICogICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSsrKSB7XG4gKiAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aCAvIDI7IHgrKykge1xuICogICAgICAgbm9pc2VEZXRhaWwoMiwgMC4yKTtcbiAqICAgICAgIG5vaXNlVmFsID0gbm9pc2UoKG1vdXNlWCArIHgpICogbm9pc2VTY2FsZSwgKG1vdXNlWSArIHkpICogbm9pc2VTY2FsZSk7XG4gKiAgICAgICBzdHJva2Uobm9pc2VWYWwgKiAyNTUpO1xuICogICAgICAgcG9pbnQoeCwgeSk7XG4gKiAgICAgICBub2lzZURldGFpbCg4LCAwLjY1KTtcbiAqICAgICAgIG5vaXNlVmFsID0gbm9pc2UoXG4gKiAgICAgICAgIChtb3VzZVggKyB4ICsgd2lkdGggLyAyKSAqIG5vaXNlU2NhbGUsXG4gKiAgICAgICAgIChtb3VzZVkgKyB5KSAqIG5vaXNlU2NhbGVcbiAqICAgICAgICk7XG4gKiAgICAgICBzdHJva2Uobm9pc2VWYWwgKiAyNTUpO1xuICogICAgICAgcG9pbnQoeCArIHdpZHRoIC8gMiwgeSk7XG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKiA8L2NvZGU+XG4gKiA8L2Rpdj5cbiAqXG4gKiBAYWx0XG4gKiAyIHZlcnRpY2FsIGdyZXkgc21va2V5IHBhdHRlcm5zIGFmZmVjdGVkIG15IG1vdXNlIHgtcG9zaXRpb24gYW5kIG5vaXNlLlxuICpcbiAqL1xudmFyIG5vaXNlRGV0YWlsID0gZnVuY3Rpb24obG9kLCBmYWxsb2ZmKSB7XG4gIGlmIChsb2QgPiAwKSB7XG4gICAgcGVybGluX29jdGF2ZXMgPSBsb2Q7XG4gIH1cbiAgaWYgKGZhbGxvZmYgPiAwKSB7XG4gICAgcGVybGluX2FtcF9mYWxsb2ZmID0gZmFsbG9mZjtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBzZWVkIHZhbHVlIGZvciA8Yj5ub2lzZSgpPC9iPi4gQnkgZGVmYXVsdCwgPGI+bm9pc2UoKTwvYj5cbiAqIHByb2R1Y2VzIGRpZmZlcmVudCByZXN1bHRzIGVhY2ggdGltZSB0aGUgcHJvZ3JhbSBpcyBydW4uIFNldCB0aGVcbiAqIDxiPnZhbHVlPC9iPiBwYXJhbWV0ZXIgdG8gYSBjb25zdGFudCB0byByZXR1cm4gdGhlIHNhbWUgcHNldWRvLXJhbmRvbVxuICogbnVtYmVycyBlYWNoIHRpbWUgdGhlIHNvZnR3YXJlIGlzIHJ1bi5cbiAqXG4gKiBAbWV0aG9kIG5vaXNlU2VlZFxuICogQHBhcmFtIHtOdW1iZXJ9IHNlZWQgICB0aGUgc2VlZCB2YWx1ZVxuICogQGV4YW1wbGVcbiAqIDxkaXY+XG4gKiA8Y29kZT52YXIgeG9mZiA9IDAuMDtcbiAqXG4gKiBmdW5jdGlvbiBzZXR1cCgpIHtcbiAqICAgbm9pc2VTZWVkKDk5KTtcbiAqICAgc3Ryb2tlKDAsIDEwKTtcbiAqIH1cbiAqXG4gKiBmdW5jdGlvbiBkcmF3KCkge1xuICogICB4b2ZmID0geG9mZiArIC4wMTtcbiAqICAgdmFyIG4gPSBub2lzZSh4b2ZmKSAqIHdpZHRoO1xuICogICBsaW5lKG4sIDAsIG4sIGhlaWdodCk7XG4gKiB9XG4gKiA8L2NvZGU+XG4gKiA8L2Rpdj5cbiAqXG4gKiBAYWx0XG4gKiB2ZXJ0aWNhbCBncmV5IGxpbmVzIGRyYXdpbmcgaW4gcGF0dGVybiBhZmZlY3RlZCBieSBub2lzZS5cbiAqXG4gKi9cbnZhciBub2lzZVNlZWQgPSBmdW5jdGlvbihzZWVkKSB7XG4gIC8vIExpbmVhciBDb25ncnVlbnRpYWwgR2VuZXJhdG9yXG4gIC8vIFZhcmlhbnQgb2YgYSBMZWhtYW4gR2VuZXJhdG9yXG4gIHZhciBsY2cgPSAoZnVuY3Rpb24oKSB7XG4gICAgLy8gU2V0IHRvIHZhbHVlcyBmcm9tIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTnVtZXJpY2FsX1JlY2lwZXNcbiAgICAvLyBtIGlzIGJhc2ljYWxseSBjaG9zZW4gdG8gYmUgbGFyZ2UgKGFzIGl0IGlzIHRoZSBtYXggcGVyaW9kKVxuICAgIC8vIGFuZCBmb3IgaXRzIHJlbGF0aW9uc2hpcHMgdG8gYSBhbmQgY1xuICAgIHZhciBtID0gNDI5NDk2NzI5NjtcbiAgICAvLyBhIC0gMSBzaG91bGQgYmUgZGl2aXNpYmxlIGJ5IG0ncyBwcmltZSBmYWN0b3JzXG4gICAgdmFyIGEgPSAxNjY0NTI1O1xuICAgIC8vIGMgYW5kIG0gc2hvdWxkIGJlIGNvLXByaW1lXG4gICAgdmFyIGMgPSAxMDEzOTA0MjIzO1xuICAgIHZhciBzZWVkLCB6O1xuICAgIHJldHVybiB7XG4gICAgICBzZXRTZWVkOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgLy8gcGljayBhIHJhbmRvbSBzZWVkIGlmIHZhbCBpcyB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgICAvLyB0aGUgPj4+IDAgY2FzdHMgdGhlIHNlZWQgdG8gYW4gdW5zaWduZWQgMzItYml0IGludGVnZXJcbiAgICAgICAgeiA9IHNlZWQgPSAodmFsID09IG51bGwgPyBNYXRoLnJhbmRvbSgpICogbSA6IHZhbCkgPj4+IDA7XG4gICAgICB9LFxuICAgICAgZ2V0U2VlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBzZWVkO1xuICAgICAgfSxcbiAgICAgIHJhbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBkZWZpbmUgdGhlIHJlY3VycmVuY2UgcmVsYXRpb25zaGlwXG4gICAgICAgIHogPSAoYSAqIHogKyBjKSAlIG07XG4gICAgICAgIC8vIHJldHVybiBhIGZsb2F0IGluIFswLCAxKVxuICAgICAgICAvLyBpZiB6ID0gbSB0aGVuIHogLyBtID0gMCB0aGVyZWZvcmUgKHogJSBtKSAvIG0gPCAxIGFsd2F5c1xuICAgICAgICByZXR1cm4geiAvIG07XG4gICAgICB9XG4gICAgfTtcbiAgfSkoKTtcblxuICBsY2cuc2V0U2VlZChzZWVkKTtcbiAgcGVybGluID0gbmV3IEFycmF5KFBFUkxJTl9TSVpFICsgMSk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgUEVSTElOX1NJWkUgKyAxOyBpKyspIHtcbiAgICBwZXJsaW5baV0gPSBsY2cucmFuZCgpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBub2lzZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL3Blcmxpbi5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImxldCBWZWN0b3IgPSB7XG5cdGFkZCA6IGZ1bmN0aW9uKHYxLHYyKXtcblx0XHRyZXR1cm4ge1xuXHRcdFx0eCA6IHYxLnggKyB2Mi54LFxuXHRcdFx0eSA6IHYxLnkgKyB2Mi55XG5cdFx0fVxuXHR9LFxuXHRzdWIgOiBmdW5jdGlvbih2MSx2Mil7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHggOiB2MS54IC0gdjIueCxcblx0XHRcdHkgOiB2MS55IC0gdjIueVxuXHRcdH1cblx0fSxcblx0bXVsdCA6IGZ1bmN0aW9uKHYsbil7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHggOiB2LnggKiBuLFxuXHRcdFx0eSA6IHYueSAqIG5cblx0XHR9XG5cdH0sXG5cdG5vcm1hbGl6ZSA6IGZ1bmN0aW9uKHYpe1xuXHRcdGxldCBsZW5ndGggPSBNYXRoLnNxcnQodi54KnYueCArIHYueSp2LnkpXG5cdFx0cmV0dXJuIHtcblx0XHRcdHggOiB2LngvbGVuZ3RoLFxuXHRcdFx0eSA6IHYueS9sZW5ndGhcblx0XHR9XG5cdH0sXG5cdG1hZyA6IGZ1bmN0aW9uKHYpe1xuXHRcdHJldHVybiBNYXRoLnNxcnQodi54KnYueCArIHYueSp2LnkpXG5cdH0sXG5cdGhlYWRpbmcgOiBmdW5jdGlvbih2KXtcblx0XHRyZXR1cm4gTWF0aC5hdGFuMih2Lnksdi54KVxuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZlY3RvcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL3ZlY3Rvci5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgTm9pc2UgZnJvbSBcIi4vcGVybGluLmpzXCI7XG5pbXBvcnQgVmVoaWNsZSBmcm9tIFwiLi92ZWhpY2xlLmpzXCI7XG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZmllbGQuanNcIlxuXG5sZXQgb3V0dGVyV2lkdGggPSAxMjAwLFxuICAgIG91dHRlckhlaWdodCA9IDgwMCxcbiAgICBtYXJnaW4gPSB7XG4gICAgXHR0b3A6MTAwLFxuICAgIFx0Ym90dG9tOjEwMCxcbiAgICBcdGxlZnQ6MTAwLFxuICAgIFx0cmlnaHQ6MTAwLFxuICAgIH0sXG4gICAgaW5uZXJXaWR0aCA9IG91dHRlcldpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXG4gICAgaW5uZXJIZWlnaHQgPSBvdXR0ZXJIZWlnaHQgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcblxubGV0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG5zdmcuc2V0QXR0cmlidXRlKFwid2lkdGhcIixvdXR0ZXJXaWR0aCk7XG5zdmcuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsb3V0dGVySGVpZ2h0KTtcbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hcHBlbmRDaGlsZChzdmcpO1xuXG5sZXQgZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnZycpO1xuZy5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBtYXJnaW4ubGVmdCArIFwiLFwiICsgbWFyZ2luLnRvcCArIFwiKVwiKTtcbnN2Zy5hcHBlbmRDaGlsZChnKVxuXG5cblxubGV0IG1vdXNlUG9zaXRpb24gPSB7XG5cdHg6MTAwLFxuXHR5OjEwMFxufTtcbnN2Zy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgbW91c2VQb3NpdGlvbi54ID0gZS5wYWdlWCAtIG1hcmdpbi5sZWZ0O1xuICAgIG1vdXNlUG9zaXRpb24ueSA9IGUucGFnZVkgLSBtYXJnaW4udG9wO1xufSwgZmFsc2UpO1xuXG5cbmxldCB2ID0gW11cbmZvciAodmFyIGkgPSAwOyBpIDw9IDMwMCA7IGkrKykge1xuIFx0di5wdXNoKG5ldyBWZWhpY2xlKE1hdGgucmFuZG9tKCkqaW5uZXJXaWR0aCxNYXRoLnJhbmRvbSgpKmlubmVySGVpZ2h0LE1hdGgucmFuZG9tKCkqNSszLGcsaW5uZXJXaWR0aCxpbm5lckhlaWdodCkpXG4gfTtcblxubGV0IGZpZWxkID0gbmV3IEZpZWxkKDMwLGcsaW5uZXJXaWR0aCxpbm5lckhlaWdodClcblxuOyhmdW5jdGlvbiBhbmltYXRlKCl7XG4gIGZvciAodmFyIGkgPSB2Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dltpXS5mb2xsb3dGZWlsZChmaWVsZCk7XG5cdFx0dltpXS51cGRhdGUoKTtcblx0fVxuICBmaWVsZC51cGRhdGUoKVxuXG5cdHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbn0pKCk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9zY3JpcHQuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFZlY3RvciBmcm9tIFwiLi92ZWN0b3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVoaWNsZSB7XG4gIGNvbnN0cnVjdG9yKHgseSxtLGNhbnZhcyxpbm5lcldpZHRoLGlubmVySGVpZ2h0KSB7XG4gICAgdGhpcy5sb2NhdGlvbiA9IHtcblx0XHRcdHg6eCxcblx0XHRcdHk6eVxuXHRcdH07XG5cblx0XHR0aGlzLnZlbG9jaXR5ID0ge1xuXHRcdFx0eDowLFxuXHRcdFx0eTowXG5cdFx0fTtcblxuXHRcdHRoaXMuYWNjZWxlcmF0aW9uID0ge1xuXHRcdFx0eDowLFxuXHRcdFx0eTowXG5cdFx0fTtcblxuICAgIHRoaXMuaW5uZXJXaWR0aCA9IGlubmVyV2lkdGg7XG4gICAgdGhpcy5pbm5lckhlaWdodCA9IGlubmVySGVpZ2h0O1xuXG5cdFx0dGhpcy5tYXhzcGVlZCA9IDIwO1xuXHRcdHRoaXMuciA9IG07XG5cdFx0dGhpcy5tYXNzID0gMTtcblxuICAgIHRoaXMuYm9keSA9IChmdW5jdGlvbihyKXtcbiAgICAgIGxldCBib2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdnJyk7XG4gICAgICBib2R5LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXCJ2ZWhpY2xlXCIpO1xuXG4gICAgICBsZXQgdmVoaWNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xuICAgICAgdmVoaWNsZS5zZXRBdHRyaWJ1dGUoXCJkXCIsXCJNMCAtXCIgKyByKjIgKyBcIiBMLVwiKyByICsgXCIgXCIgKyByKjIgKyBcIiBMXCIgKyByICsgXCIgXCIgKyByKjIgKyBcIiBaXCIpO1xuICAgICAgdmVoaWNsZS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsXCJibGFja1wiKTtcblxuICAgICAgdmVoaWNsZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsZnVuY3Rpb24oZSkge1xuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcImZpbGxcIixcInJveWFsYmx1ZVwiKVxuICAgICAgICB0aGlzLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLFwib3JhbmdlXCIpXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsMSlcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoXCJzdHJva2UtbGluZWNhcFwiLFwicm91bmRcIilcbiAgICAgIH0pO1xuICAgICAgdmVoaWNsZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIixmdW5jdGlvbihlKSB7XG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiZmlsbFwiLFwiYmxhY2tcIilcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJzdHJva2VcIilcbiAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJzdHJva2UtbGluZWNhcFwiKVxuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiKVxuICAgICAgfSk7XG5cbiAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodmVoaWNsZSk7XG4gICAgICByZXR1cm4gYm9keTtcbiAgICB9KHRoaXMucikpO1xuXG4gICAgY2FudmFzLmFwcGVuZENoaWxkKHRoaXMuYm9keSk7XG4gIH1cblxuICB1cGRhdGUoKXtcbiAgICB0aGlzLmxvY2F0aW9uID0gVmVjdG9yLmFkZCh0aGlzLmxvY2F0aW9uLHRoaXMudmVsb2NpdHkpO1xuICAgIHRoaXMudmVsb2NpdHkgPSBWZWN0b3IuYWRkKHRoaXMudmVsb2NpdHksdGhpcy5hY2NlbGVyYXRpb24pO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gVmVjdG9yLm11bHQodGhpcy5hY2NlbGVyYXRpb24sMCk7XG5cbiAgICBsZXQgdGhldGEgPSBWZWN0b3IuaGVhZGluZyh0aGlzLnZlbG9jaXR5KSoxODAvTWF0aC5QSSs5MDtcbiAgICB0aGlzLmJvZHkuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgdGhpcy5sb2NhdGlvbi54ICsgXCIsXCIgKyB0aGlzLmxvY2F0aW9uLnkgKyBcIilyb3RhdGUoXCIgKyB0aGV0YSArIFwiKVwiKTtcblxuICAgIGlmKHRoaXMubG9jYXRpb24ueCA8IDApe1xuXHRcdFx0dGhpcy5sb2NhdGlvbi54ID0gdGhpcy5pbm5lcldpZHRoO1xuXHRcdH1lbHNlIGlmKHRoaXMubG9jYXRpb24ueCA+IHRoaXMuaW5uZXJXaWR0aCl7XG5cdFx0XHR0aGlzLmxvY2F0aW9uLnggPSAwO1xuXHRcdH1cblx0XHRpZih0aGlzLmxvY2F0aW9uLnkgPCAwKXtcblx0XHRcdHRoaXMubG9jYXRpb24ueSA9IHRoaXMuaW5uZXJIZWlnaHQ7XG5cdFx0fWVsc2UgaWYodGhpcy5sb2NhdGlvbi55ID4gdGhpcy5pbm5lckhlaWdodCl7XG5cdFx0XHR0aGlzLmxvY2F0aW9uLnkgPSAwO1xuXHRcdH1cbiAgfVxuXG4gIGFwcGx5Rm9yY2UoZm9yY2Upe1xuXHRcdHRoaXMuYWNjZWxlcmF0aW9uID0gVmVjdG9yLm11bHQoVmVjdG9yLmFkZCh0aGlzLmFjY2VsZXJhdGlvbixmb3JjZSksMS90aGlzLm1hc3MpO1xuXHR9XG5cbiAgc2Vlayh0YXJnZXQpe1xuXHRcdHRoaXMuZGVzaXJlZCA9IFZlY3Rvci5zdWIodGFyZ2V0LHRoaXMubG9jYXRpb24pO1xuXHRcdGxldCBkID0gVmVjdG9yLm1hZyh0aGlzLmRlc2lyZWQpO1xuXHRcdHRoaXMuZGVzaXJlZCA9IFZlY3Rvci5ub3JtYWxpemUodGhpcy5kZXNpcmVkKTtcblx0XHRpZiAoZCA8IDEwMCkge1xuXHRcdFx0bGV0IG0gPSBkLzEwMCp0aGlzLm1heHNwZWVkO1xuXHRcdFx0dGhpcy5kZXNpcmVkID0gVmVjdG9yLm11bHQodGhpcy5kZXNpcmVkLG0pO1xuXHRcdH1lbHNle1xuXHRcdFx0dGhpcy5kZXNpcmVkID0gVmVjdG9yLm11bHQodGhpcy5kZXNpcmVkLHRoaXMubWF4c3BlZWQpO1xuXHRcdH1cblxuXHRcdGxldCBzdGVlciA9IFZlY3Rvci5zdWIodGhpcy5kZXNpcmVkLHRoaXMudmVsb2NpdHkpO1xuXHRcdHN0ZWVyID0gVmVjdG9yLm11bHQoc3RlZXIsMC4xKTtcblx0XHR0aGlzLmFwcGx5Rm9yY2Uoc3RlZXIpO1xuXHR9XG5cbiAgZm9sbG93RmVpbGQoRmVpbGQpe1xuICAgIHRoaXMuZGVzaXJlZCA9IHtcbiAgICAgIHg6IE1hdGguY29zKEZlaWxkLmxvb2tVcCh0aGlzLmxvY2F0aW9uKSksXG4gICAgICB5OiBNYXRoLnNpbihGZWlsZC5sb29rVXAodGhpcy5sb2NhdGlvbikpXG4gICAgfVxuXG4gICAgdGhpcy5kZXNpcmVkID0gVmVjdG9yLm11bHQodGhpcy5kZXNpcmVkLDEwKTtcbiAgICAvLyBjb25zb2xlLmxvZyhGZWlsZC5sb29rVXAodGhpcy5sb2NhdGlvbikpO1xuICAgIGxldCBzdGVlciA9IFZlY3Rvci5zdWIodGhpcy5kZXNpcmVkLHRoaXMudmVsb2NpdHkpO1xuICAgIHN0ZWVyID0gVmVjdG9yLm11bHQoc3RlZXIsMC4xKTtcbiAgICB0aGlzLmFwcGx5Rm9yY2Uoc3RlZXIpO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy92ZWhpY2xlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBWZWN0b3IgZnJvbSBcIi4vdmVjdG9yLmpzXCI7XG5pbXBvcnQgTm9pc2UgZnJvbSBcIi4vcGVybGluLmpzXCI7XG5cbk51bWJlci5wcm90b3R5cGUuY2xhbXAgPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodGhpcywgbWluKSwgbWF4KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpZWxkIHtcbiAgY29uc3RydWN0b3IocnNsLGNhbnZhcyxpbm5lcldpZHRoLGlubmVySGVpZ2h0KXtcbiAgICB0aGlzLmNvdW50ZXIgPSAwO1xuICAgIHRoaXMudHVyYnVsZW5jZSA9IDQ7XG4gICAgdGhpcy5yZXNvbHV0aW9uID0gcnNsO1xuICAgIHRoaXMuZmllbGQgPSBbXTtcbiAgICB0aGlzLmNvbHMgPSBNYXRoLnJvdW5kKGlubmVyV2lkdGgvdGhpcy5yZXNvbHV0aW9uKTtcbiAgICB0aGlzLnJvd3MgPSBNYXRoLnJvdW5kKGlubmVySGVpZ2h0L3RoaXMucmVzb2x1dGlvbik7XG4gICAgdGhpcy5maWVsZEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdnJyk7XG5cdFx0dGhpcy5maWVsZEdyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXCJmaWVsZFwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpPD0gdGhpcy5jb2xzOyBpKyspIHtcbiAgICAgIHRoaXMuZmllbGQucHVzaChbXSlcbiAgICAgIGZvciAodmFyIGogPSAwOyBqPD0gdGhpcy5yb3dzOyBqKyspIHtcbiAgICAgICAgbGV0IGZpZWxkVmVjdG9yID0ge1xuICAgICAgICAgIHggOiBqLFxuICAgICAgICAgIHkgOiBpLFxuICAgICAgICAgIHRoZXRhOiBOb2lzZShpL3RoaXMudHVyYnVsZW5jZSxqL3RoaXMudHVyYnVsZW5jZSkqTWF0aC5QSSoyIC0gMy8yKk1hdGguUEksXG4gICAgICAgICAgLy8gdGhldGE6IE1hdGguUEksXG4gICAgICAgICAgYm9keTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdwb2x5bGluZScpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGZpZWxkVmVjdG9yLmJvZHkuc2V0QXR0cmlidXRlKFwicG9pbnRzXCIsXCItMTAsMCAxMCwwIDcsLTIgMTAsMCA3LDJcIilcbiAgICAgICAgZmllbGRWZWN0b3IuYm9keS5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIixcInJnYmEoMCwwLDAsLjUpXCIpO1xuICAgICAgICBmaWVsZFZlY3Rvci5ib2R5LnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLFwiMVwiKTtcbiAgICAgICAgZmllbGRWZWN0b3IuYm9keS5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsXCJub25lXCIpO1xuXG4gICAgICAgIHRoaXMuZmllbGRbaV0ucHVzaChmaWVsZFZlY3RvcilcbiAgICAgICAgZmllbGRWZWN0b3IuYm9keS5zZXRBdHRyaWJ1dGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIrIGZpZWxkVmVjdG9yLnkqdGhpcy5yZXNvbHV0aW9uICtcIixcIisgZmllbGRWZWN0b3IueCp0aGlzLnJlc29sdXRpb24gK1wiKXJvdGF0ZShcIiArIChmaWVsZFZlY3Rvci50aGV0YS8oTWF0aC5QSSoyKSozNjApICsgXCIpXCIpO1xuICAgICAgICB0aGlzLmZpZWxkR3JvdXAuYXBwZW5kQ2hpbGQoZmllbGRWZWN0b3IuYm9keSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FudmFzLmFwcGVuZENoaWxkKHRoaXMuZmllbGRHcm91cCk7XG4gIH1cblxuICB1cGRhdGUoKXtcbiAgICB0aGlzLmNvdW50ZXIrPTAuMDg7XG4gICAgZm9yICh2YXIgaSA9IDA7IGk8PSB0aGlzLmNvbHM7IGkrKykge1xuICAgICAgZm9yICh2YXIgaiA9IDA7IGo8PSB0aGlzLnJvd3M7IGorKykge1xuICAgICAgICB0aGlzLmZpZWxkW2ldW2pdLnRoZXRhID0gTm9pc2UoKGkrdGhpcy5jb3VudGVyKS90aGlzLnR1cmJ1bGVuY2UsKGordGhpcy5jb3VudGVyKS90aGlzLnR1cmJ1bGVuY2UpKk1hdGguUEkqMixcbiAgICAgICAgdGhpcy5maWVsZFtpXVtqXS5ib2R5LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIisgdGhpcy5maWVsZFtpXVtqXS55KnRoaXMucmVzb2x1dGlvbiArXCIsXCIrIHRoaXMuZmllbGRbaV1bal0ueCp0aGlzLnJlc29sdXRpb24gK1wiKXJvdGF0ZShcIiArICh0aGlzLmZpZWxkW2ldW2pdLnRoZXRhLyhNYXRoLlBJKjIpKjM2MCkgKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9va1VwKHBvc2l0aW9uKXtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLmZpZWxkW01hdGgucm91bmQocG9zaXRpb24ueC90aGlzLnJlc29sdXRpb24pXVtNYXRoLnJvdW5kKHBvc2l0aW9uLnkvdGhpcy5yZXNvbHV0aW9uKV0udGhldGEpO1xuICAgIHJldHVybiB0aGlzLmZpZWxkW01hdGgucm91bmQocG9zaXRpb24ueC90aGlzLnJlc29sdXRpb24pLmNsYW1wKDAsdGhpcy5jb2xzKV1bTWF0aC5yb3VuZChwb3NpdGlvbi55L3RoaXMucmVzb2x1dGlvbikuY2xhbXAoMCx0aGlzLnJvd3MpXS50aGV0YTtcbiAgfVxuXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9maWVsZC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9