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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTQ0ZmNhNTEzZDJhYjU0ZDkxZGIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL3Blcmxpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQzdEQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2Qiw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQTs7QUFFQSxXQUFXOztBQUVYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsaUJBQWlCLG9CQUFvQjtBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixZQUFZO0FBQ2hDLHNCQUFzQixlQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLGlCQUFpQixxQkFBcUI7QUFDdEM7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6InBlcmxpbi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxNDRmY2E1MTNkMmFiNTRkOTFkYiIsIid1c2Ugc3RyaWN0JztcblxudmFyIFBFUkxJTl9ZV1JBUEIgPSA0O1xudmFyIFBFUkxJTl9ZV1JBUCA9IDEgPDwgUEVSTElOX1lXUkFQQjtcbnZhciBQRVJMSU5fWldSQVBCID0gODtcbnZhciBQRVJMSU5fWldSQVAgPSAxIDw8IFBFUkxJTl9aV1JBUEI7XG52YXIgUEVSTElOX1NJWkUgPSA0MDk1O1xuXG52YXIgcGVybGluX29jdGF2ZXMgPSA0OyAvLyBkZWZhdWx0IHRvIG1lZGl1bSBzbW9vdGhcbnZhciBwZXJsaW5fYW1wX2ZhbGxvZmYgPSAwLjU7IC8vIDUwJSByZWR1Y3Rpb24vb2N0YXZlXG5cbnZhciBzY2FsZWRfY29zaW5lID0gZnVuY3Rpb24oaSkge1xuICByZXR1cm4gMC41ICogKDEuMCAtIE1hdGguY29zKGkgKiBNYXRoLlBJKSk7XG59O1xuXG52YXIgcGVybGluOyAvLyB3aWxsIGJlIGluaXRpYWxpemVkIGxhemlseSBieSBub2lzZSgpIG9yIG5vaXNlU2VlZCgpXG5cbnZhciBub2lzZSA9IGZ1bmN0aW9uKHgsIHksIHopIHtcbiAgeSA9IHkgfHwgMDtcbiAgeiA9IHogfHwgMDtcblxuICBpZiAocGVybGluID09IG51bGwpIHtcbiAgICBwZXJsaW4gPSBuZXcgQXJyYXkoUEVSTElOX1NJWkUgKyAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IFBFUkxJTl9TSVpFICsgMTsgaSsrKSB7XG4gICAgICBwZXJsaW5baV0gPSBNYXRoLnJhbmRvbSgpO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgMCkge1xuICAgIHggPSAteDtcbiAgfVxuICBpZiAoeSA8IDApIHtcbiAgICB5ID0gLXk7XG4gIH1cbiAgaWYgKHogPCAwKSB7XG4gICAgeiA9IC16O1xuICB9XG5cbiAgdmFyIHhpID0gTWF0aC5mbG9vcih4KSxcbiAgICB5aSA9IE1hdGguZmxvb3IoeSksXG4gICAgemkgPSBNYXRoLmZsb29yKHopO1xuICB2YXIgeGYgPSB4IC0geGk7XG4gIHZhciB5ZiA9IHkgLSB5aTtcbiAgdmFyIHpmID0geiAtIHppO1xuICB2YXIgcnhmLCByeWY7XG5cbiAgdmFyIHIgPSAwO1xuICB2YXIgYW1wbCA9IDAuNTtcblxuICB2YXIgbjEsIG4yLCBuMztcblxuICBmb3IgKHZhciBvID0gMDsgbyA8IHBlcmxpbl9vY3RhdmVzOyBvKyspIHtcbiAgICB2YXIgb2YgPSB4aSArICh5aSA8PCBQRVJMSU5fWVdSQVBCKSArICh6aSA8PCBQRVJMSU5fWldSQVBCKTtcblxuICAgIHJ4ZiA9IHNjYWxlZF9jb3NpbmUoeGYpO1xuICAgIHJ5ZiA9IHNjYWxlZF9jb3NpbmUoeWYpO1xuXG4gICAgbjEgPSBwZXJsaW5bb2YgJiBQRVJMSU5fU0laRV07XG4gICAgbjEgKz0gcnhmICogKHBlcmxpblsob2YgKyAxKSAmIFBFUkxJTl9TSVpFXSAtIG4xKTtcbiAgICBuMiA9IHBlcmxpblsob2YgKyBQRVJMSU5fWVdSQVApICYgUEVSTElOX1NJWkVdO1xuICAgIG4yICs9IHJ4ZiAqIChwZXJsaW5bKG9mICsgUEVSTElOX1lXUkFQICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMik7XG4gICAgbjEgKz0gcnlmICogKG4yIC0gbjEpO1xuXG4gICAgb2YgKz0gUEVSTElOX1pXUkFQO1xuICAgIG4yID0gcGVybGluW29mICYgUEVSTElOX1NJWkVdO1xuICAgIG4yICs9IHJ4ZiAqIChwZXJsaW5bKG9mICsgMSkgJiBQRVJMSU5fU0laRV0gLSBuMik7XG4gICAgbjMgPSBwZXJsaW5bKG9mICsgUEVSTElOX1lXUkFQKSAmIFBFUkxJTl9TSVpFXTtcbiAgICBuMyArPSByeGYgKiAocGVybGluWyhvZiArIFBFUkxJTl9ZV1JBUCArIDEpICYgUEVSTElOX1NJWkVdIC0gbjMpO1xuICAgIG4yICs9IHJ5ZiAqIChuMyAtIG4yKTtcblxuICAgIG4xICs9IHNjYWxlZF9jb3NpbmUoemYpICogKG4yIC0gbjEpO1xuXG4gICAgciArPSBuMSAqIGFtcGw7XG4gICAgYW1wbCAqPSBwZXJsaW5fYW1wX2ZhbGxvZmY7XG4gICAgeGkgPDw9IDE7XG4gICAgeGYgKj0gMjtcbiAgICB5aSA8PD0gMTtcbiAgICB5ZiAqPSAyO1xuICAgIHppIDw8PSAxO1xuICAgIHpmICo9IDI7XG5cbiAgICBpZiAoeGYgPj0gMS4wKSB7XG4gICAgICB4aSsrO1xuICAgICAgeGYtLTtcbiAgICB9XG4gICAgaWYgKHlmID49IDEuMCkge1xuICAgICAgeWkrKztcbiAgICAgIHlmLS07XG4gICAgfVxuICAgIGlmICh6ZiA+PSAxLjApIHtcbiAgICAgIHppKys7XG4gICAgICB6Zi0tO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn07XG5cbi8qKlxuICpcbiAqIEFkanVzdHMgdGhlIGNoYXJhY3RlciBhbmQgbGV2ZWwgb2YgZGV0YWlsIHByb2R1Y2VkIGJ5IHRoZSBQZXJsaW4gbm9pc2VcbiAqIGZ1bmN0aW9uLiBTaW1pbGFyIHRvIGhhcm1vbmljcyBpbiBwaHlzaWNzLCBub2lzZSBpcyBjb21wdXRlZCBvdmVyXG4gKiBzZXZlcmFsIG9jdGF2ZXMuIExvd2VyIG9jdGF2ZXMgY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBvdXRwdXQgc2lnbmFsIGFuZFxuICogYXMgc3VjaCBkZWZpbmUgdGhlIG92ZXJhbGwgaW50ZW5zaXR5IG9mIHRoZSBub2lzZSwgd2hlcmVhcyBoaWdoZXIgb2N0YXZlc1xuICogY3JlYXRlIGZpbmVyIGdyYWluZWQgZGV0YWlscyBpbiB0aGUgbm9pc2Ugc2VxdWVuY2UuXG4gKiA8YnI+PGJyPlxuICogQnkgZGVmYXVsdCwgbm9pc2UgaXMgY29tcHV0ZWQgb3ZlciA0IG9jdGF2ZXMgd2l0aCBlYWNoIG9jdGF2ZSBjb250cmlidXRpbmdcbiAqIGV4YWN0bHkgaGFsZiB0aGFuIGl0cyBwcmVkZWNlc3Nvciwgc3RhcnRpbmcgYXQgNTAlIHN0cmVuZ3RoIGZvciB0aGUgMXN0XG4gKiBvY3RhdmUuIFRoaXMgZmFsbG9mZiBhbW91bnQgY2FuIGJlIGNoYW5nZWQgYnkgYWRkaW5nIGFuIGFkZGl0aW9uYWwgZnVuY3Rpb25cbiAqIHBhcmFtZXRlci4gRWcuIGEgZmFsbG9mZiBmYWN0b3Igb2YgMC43NSBtZWFucyBlYWNoIG9jdGF2ZSB3aWxsIG5vdyBoYXZlXG4gKiA3NSUgaW1wYWN0ICgyNSUgbGVzcykgb2YgdGhlIHByZXZpb3VzIGxvd2VyIG9jdGF2ZS4gQW55IHZhbHVlIGJldHdlZW5cbiAqIDAuMCBhbmQgMS4wIGlzIHZhbGlkLCBob3dldmVyIG5vdGUgdGhhdCB2YWx1ZXMgZ3JlYXRlciB0aGFuIDAuNSBtaWdodFxuICogcmVzdWx0IGluIGdyZWF0ZXIgdGhhbiAxLjAgdmFsdWVzIHJldHVybmVkIGJ5IDxiPm5vaXNlKCk8L2I+LlxuICogPGJyPjxicj5cbiAqIEJ5IGNoYW5naW5nIHRoZXNlIHBhcmFtZXRlcnMsIHRoZSBzaWduYWwgY3JlYXRlZCBieSB0aGUgPGI+bm9pc2UoKTwvYj5cbiAqIGZ1bmN0aW9uIGNhbiBiZSBhZGFwdGVkIHRvIGZpdCB2ZXJ5IHNwZWNpZmljIG5lZWRzIGFuZCBjaGFyYWN0ZXJpc3RpY3MuXG4gKlxuICogQG1ldGhvZCBub2lzZURldGFpbFxuICogQHBhcmFtIHtOdW1iZXJ9IGxvZCBudW1iZXIgb2Ygb2N0YXZlcyB0byBiZSB1c2VkIGJ5IHRoZSBub2lzZVxuICogQHBhcmFtIHtOdW1iZXJ9IGZhbGxvZmYgZmFsbG9mZiBmYWN0b3IgZm9yIGVhY2ggb2N0YXZlXG4gKiBAZXhhbXBsZVxuICogPGRpdj5cbiAqIDxjb2RlPlxuICogdmFyIG5vaXNlVmFsO1xuICogdmFyIG5vaXNlU2NhbGUgPSAwLjAyO1xuICpcbiAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICogICBjcmVhdGVDYW52YXMoMTAwLCAxMDApO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGRyYXcoKSB7XG4gKiAgIGJhY2tncm91bmQoMCk7XG4gKiAgIGZvciAodmFyIHkgPSAwOyB5IDwgaGVpZ2h0OyB5KyspIHtcbiAqICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoIC8gMjsgeCsrKSB7XG4gKiAgICAgICBub2lzZURldGFpbCgyLCAwLjIpO1xuICogICAgICAgbm9pc2VWYWwgPSBub2lzZSgobW91c2VYICsgeCkgKiBub2lzZVNjYWxlLCAobW91c2VZICsgeSkgKiBub2lzZVNjYWxlKTtcbiAqICAgICAgIHN0cm9rZShub2lzZVZhbCAqIDI1NSk7XG4gKiAgICAgICBwb2ludCh4LCB5KTtcbiAqICAgICAgIG5vaXNlRGV0YWlsKDgsIDAuNjUpO1xuICogICAgICAgbm9pc2VWYWwgPSBub2lzZShcbiAqICAgICAgICAgKG1vdXNlWCArIHggKyB3aWR0aCAvIDIpICogbm9pc2VTY2FsZSxcbiAqICAgICAgICAgKG1vdXNlWSArIHkpICogbm9pc2VTY2FsZVxuICogICAgICAgKTtcbiAqICAgICAgIHN0cm9rZShub2lzZVZhbCAqIDI1NSk7XG4gKiAgICAgICBwb2ludCh4ICsgd2lkdGggLyAyLCB5KTtcbiAqICAgICB9XG4gKiAgIH1cbiAqIH1cbiAqIDwvY29kZT5cbiAqIDwvZGl2PlxuICpcbiAqIEBhbHRcbiAqIDIgdmVydGljYWwgZ3JleSBzbW9rZXkgcGF0dGVybnMgYWZmZWN0ZWQgbXkgbW91c2UgeC1wb3NpdGlvbiBhbmQgbm9pc2UuXG4gKlxuICovXG52YXIgbm9pc2VEZXRhaWwgPSBmdW5jdGlvbihsb2QsIGZhbGxvZmYpIHtcbiAgaWYgKGxvZCA+IDApIHtcbiAgICBwZXJsaW5fb2N0YXZlcyA9IGxvZDtcbiAgfVxuICBpZiAoZmFsbG9mZiA+IDApIHtcbiAgICBwZXJsaW5fYW1wX2ZhbGxvZmYgPSBmYWxsb2ZmO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHNlZWQgdmFsdWUgZm9yIDxiPm5vaXNlKCk8L2I+LiBCeSBkZWZhdWx0LCA8Yj5ub2lzZSgpPC9iPlxuICogcHJvZHVjZXMgZGlmZmVyZW50IHJlc3VsdHMgZWFjaCB0aW1lIHRoZSBwcm9ncmFtIGlzIHJ1bi4gU2V0IHRoZVxuICogPGI+dmFsdWU8L2I+IHBhcmFtZXRlciB0byBhIGNvbnN0YW50IHRvIHJldHVybiB0aGUgc2FtZSBwc2V1ZG8tcmFuZG9tXG4gKiBudW1iZXJzIGVhY2ggdGltZSB0aGUgc29mdHdhcmUgaXMgcnVuLlxuICpcbiAqIEBtZXRob2Qgbm9pc2VTZWVkXG4gKiBAcGFyYW0ge051bWJlcn0gc2VlZCAgIHRoZSBzZWVkIHZhbHVlXG4gKiBAZXhhbXBsZVxuICogPGRpdj5cbiAqIDxjb2RlPnZhciB4b2ZmID0gMC4wO1xuICpcbiAqIGZ1bmN0aW9uIHNldHVwKCkge1xuICogICBub2lzZVNlZWQoOTkpO1xuICogICBzdHJva2UoMCwgMTApO1xuICogfVxuICpcbiAqIGZ1bmN0aW9uIGRyYXcoKSB7XG4gKiAgIHhvZmYgPSB4b2ZmICsgLjAxO1xuICogICB2YXIgbiA9IG5vaXNlKHhvZmYpICogd2lkdGg7XG4gKiAgIGxpbmUobiwgMCwgbiwgaGVpZ2h0KTtcbiAqIH1cbiAqIDwvY29kZT5cbiAqIDwvZGl2PlxuICpcbiAqIEBhbHRcbiAqIHZlcnRpY2FsIGdyZXkgbGluZXMgZHJhd2luZyBpbiBwYXR0ZXJuIGFmZmVjdGVkIGJ5IG5vaXNlLlxuICpcbiAqL1xudmFyIG5vaXNlU2VlZCA9IGZ1bmN0aW9uKHNlZWQpIHtcbiAgLy8gTGluZWFyIENvbmdydWVudGlhbCBHZW5lcmF0b3JcbiAgLy8gVmFyaWFudCBvZiBhIExlaG1hbiBHZW5lcmF0b3JcbiAgdmFyIGxjZyA9IChmdW5jdGlvbigpIHtcbiAgICAvLyBTZXQgdG8gdmFsdWVzIGZyb20gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OdW1lcmljYWxfUmVjaXBlc1xuICAgIC8vIG0gaXMgYmFzaWNhbGx5IGNob3NlbiB0byBiZSBsYXJnZSAoYXMgaXQgaXMgdGhlIG1heCBwZXJpb2QpXG4gICAgLy8gYW5kIGZvciBpdHMgcmVsYXRpb25zaGlwcyB0byBhIGFuZCBjXG4gICAgdmFyIG0gPSA0Mjk0OTY3Mjk2O1xuICAgIC8vIGEgLSAxIHNob3VsZCBiZSBkaXZpc2libGUgYnkgbSdzIHByaW1lIGZhY3RvcnNcbiAgICB2YXIgYSA9IDE2NjQ1MjU7XG4gICAgLy8gYyBhbmQgbSBzaG91bGQgYmUgY28tcHJpbWVcbiAgICB2YXIgYyA9IDEwMTM5MDQyMjM7XG4gICAgdmFyIHNlZWQsIHo7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNldFNlZWQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAvLyBwaWNrIGEgcmFuZG9tIHNlZWQgaWYgdmFsIGlzIHVuZGVmaW5lZCBvciBudWxsXG4gICAgICAgIC8vIHRoZSA+Pj4gMCBjYXN0cyB0aGUgc2VlZCB0byBhbiB1bnNpZ25lZCAzMi1iaXQgaW50ZWdlclxuICAgICAgICB6ID0gc2VlZCA9ICh2YWwgPT0gbnVsbCA/IE1hdGgucmFuZG9tKCkgKiBtIDogdmFsKSA+Pj4gMDtcbiAgICAgIH0sXG4gICAgICBnZXRTZWVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNlZWQ7XG4gICAgICB9LFxuICAgICAgcmFuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGRlZmluZSB0aGUgcmVjdXJyZW5jZSByZWxhdGlvbnNoaXBcbiAgICAgICAgeiA9IChhICogeiArIGMpICUgbTtcbiAgICAgICAgLy8gcmV0dXJuIGEgZmxvYXQgaW4gWzAsIDEpXG4gICAgICAgIC8vIGlmIHogPSBtIHRoZW4geiAvIG0gPSAwIHRoZXJlZm9yZSAoeiAlIG0pIC8gbSA8IDEgYWx3YXlzXG4gICAgICAgIHJldHVybiB6IC8gbTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xuXG4gIGxjZy5zZXRTZWVkKHNlZWQpO1xuICBwZXJsaW4gPSBuZXcgQXJyYXkoUEVSTElOX1NJWkUgKyAxKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBQRVJMSU5fU0laRSArIDE7IGkrKykge1xuICAgIHBlcmxpbltpXSA9IGxjZy5yYW5kKCk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IG5vaXNlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvcGVybGluLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIl0sInNvdXJjZVJvb3QiOiIifQ==