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
