/* t: current time
* b: start value
* c: chance in value
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
