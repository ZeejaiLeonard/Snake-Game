function JSVector(x, y){
  this.x = x;
  this.y = y;
}

//magnitude
JSVector.prototype.setMag = function(m){
  var a = this.getDirection();
  this.x = Math.cos(a) * m;
  this.y = Math.sin(a) * m;
}
JSVector.prototype.getMag = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
}
JSVector.prototype.rotate = function(a){
  this.x = (this.x * Math.cos(a)) - (this.y * Math.sin(a));
  this.y = (this.x * Math.sin(a)) + (this.y * Math.cos(a));
}
//direction
JSVector.prototype.setDirection = function(a){
  var m = this.getMag();
  this.x = Math.cos(a) * m;
  this.y = Math.sin(a) * m;
}
JSVector.prototype.getDirection = function(){
  return Math.atan2(this.y, this.x);
}
//add
JSVector.prototype.add = function(v){
  this.x += v.x;
  this.y += v.y;
}
JSVector.addGetNew = function(v1, v2){
  return new JSVector(v1.x + v2.x, v1.y + v2.y);
}
//sub
JSVector.prototype.sub = function(v){
  this.x -= v.x;
  this.y -= v.y;
}
JSVector.subGetNew = function(v1, v2){
  return new JSVector(v1.x - v2.x, v1.y - v2.y);
}
//mult
JSVector.prototype.mult = function(s){
  this.x *= s;
  this.y *= s;
}
//div
JSVector.prototype.div = function(s){
  this.x /= s;
  this.y /= s;
}
//extra
JSVector.prototype.normalize = function(){
  this.setMag(1);
}
JSVector.prototype.limit = function(l){
  if(this.x > l){
    this.x = l;
  }
  if(this.y > l){
    this.y = l;
  }
}
//JSVector.prototype.lerp(){}
JSVector.prototype.distance = function(v){
  var vx = this.x - v.x;
  var vy = this.y - v.y;
  return Math.sqrt((vx * vx) + (vy * vy));
}
