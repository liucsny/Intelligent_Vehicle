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

export default Vector;
