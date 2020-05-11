/* t: current time
* b: start value
* c: change in value
* d: duration
*/

export const Tween = {}

Tween.linear = (t,b,c,d) => {
  return c*t/d + b;
}

Tween.easeInQuad = (t,b,c,d) => {
  t /= d;
  return c * t * t + b;
}

Tween.easeOutQuad = (t,b,c,d) => {
  t /=d;
  return -c * t * (t -2) + b;
}

Tween.easeInOutQuad = (t, b, c, d) => {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Tween.easeInCubic = (t, b, c, d) => {
	t /= d;
	return c*t*t*t + b;
};

Tween.easeOutCubic =  (t, b, c, d) => {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
};

Tween.easeInOutCubic = (t, b, c, d) => {
	t /= d/2;
	if (t < 1) return c/2*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t + 2) + b;
};

Tween.easeInQuart = (t, b, c, d) => {
	t /= d;
	return c*t*t*t*t + b;
};

Tween.easeOutQuart = (t, b, c, d) => {
	t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Tween.easeInOutQuart =  (t, b, c, d) => {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Tween.easeInQuint = (t, b, c, d) => {
	t /= d;
	return c*t*t*t*t*t + b;
};

Tween.easeOutQuint =  (t, b, c, d) => {
	t /= d;
	t--;
	return c*(t*t*t*t*t + 1) + b;
};

Tween.easeInOutQuint = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t*t + b;
	t -= 2;
	return c/2*(t*t*t*t*t + 2) + b;
};

Tween.easeInSine = function (t, b, c, d) {
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
};

Tween.easeOutSine = function (t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
};

Tween.easeInOutSine = function (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};

Tween.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

Tween.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

Tween.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};

Tween.easeInCirc = function (t, b, c, d) {
	t /= d;
	return -c * (Math.sqrt(1 - t*t) - 1) + b;
};

Tween.easeOutCirc = function (t, b, c, d) {
	t /= d;
	t--;
	return c * Math.sqrt(1 - t*t) + b;
};

Tween.easeInOutCirc = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	t -= 2;
	return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
};

Tween.easeInBounce = function (t, b, c, d) {
		return c - Tween.easeOutBounce (d-t, 0, c, d) + b;
};

Tween.easeOutBounce = function (t, b, c, d) {
  if ((t/=d) < (1/2.75)) {
    return c*(7.5625*t*t) + b;
  } else if (t < (2/2.75)) {
    return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  } else if (t < (2.5/2.75)) {
    return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  } else {
    return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  }
};

Tween.easeInOutBounce = function (t, b, c, d) {
  if (t < d/2) return Tween.easeInBounce (t*2, 0, c, d) * .5 + b;
  return Tween.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
};

Tween.easeInElastic = function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	};

Tween.easeOutElastic = function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	};

Tween.easeInOutElastic = function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	};
