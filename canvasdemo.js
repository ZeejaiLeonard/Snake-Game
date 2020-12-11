window.onload = init;
var canvas, ctx, snake, apple, cns, score, go, alive, button, fpsInterval, level;
var mouse = new JSVector(0, 0);
var origin = new JSVector(0, 0);
var stop = false;
var fps = 5;
var scale = 20;

function init(){
  canvas = document.getElementById('cnv');
  canvas.width = 800;
  canvas.height = 800;
  canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
  ctx = canvas.getContext('2d');
  canvas.addEventListener("mousemove", handleMouseMoved);
  canvas.addEventListener("click", handleMouseClicked);
  cns = new JSVector(canvas.width, canvas.height);
  origin = new JSVector(0, 0);
  start();
}

function start(){
  snake = new Snake();
  apple = new Fruit("rgba(255, 0, 0, 1)");
  orange = new Fruit("rgba(200, 100, 0, 1)");
  lemon = new Fruit("rgba(255, 255, 0, 1)");
  grape = new Fruit("rgba(175, 0, 245, 1)");
  level = 1;
  score = 0;
  go = false;
  alive = true;
  button = new Button(cns.x / 2 - 30, cns.y / 2 - 30, 115, 20);
  button.render();
  startAnimating();
}

function startAgain(){
  snake = new Snake();
  apple = new Fruit("rgba(255, 0, 0, 1)");
  orange = new Fruit("rgba(200, 100, 0, 1)");
  lemon = new Fruit("rgba(255, 255, 0, 1)");
  grape = new Fruit("rgba(175, 0, 245, 1)");
  score = 0;
  go = false;
  alive = true;
  button = new Button(cns.x / 2 - 30, cns.y / 2 - 30, 115, 20);
  button.render();
}

function play(){
  ctx.clearRect(0, 0, cns.x, cns.y);
  snake.die();
  if(score >= 400){
    lemon.render();
  }
  if(score >= 800){
    grape.render();
    level = 2;
  }
  if(score >= 1200){
    orange.render();
    level = 3;
  }
  checkAddBody();
  apple.render();
  score -= level;
  if(score >= -100){
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = '14px serif';
    ctx.fillText("score = " + score, cns.x / 2, scale);
  }else{
    end();
  }
}

function end(){
  alive = false;
  var tempScore = score;
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = '14px serif';
  ctx.fillText("Your score was " + tempScore, cns.x / 2 - 30, cns.y / 4);
  startAgain();
}

function startAnimating() {
  fpsInterval = 500 / fps;
  window.setInterval(animate, fpsInterval);
}

function animate(){
  if(go == true && alive == true){
    play();
  }
}

function handleMouseMoved(evt){
  mouse.x = evt.offsetX;
  mouse.y = evt.offsetY;
  if((mouse.x > button.loc.x) && (mouse.x < (button.loc.x + button.h)) && (mouse.y > button.loc.y) && (mouse.y < (button.loc.y + button.w))){
      button.colour = "rgba(100, 150, 50, 1)";
      button.render();
  }else{
    button.colour = "rgba(0, 255, 0, 1)";
    button.render();
  }
}

function handleMouseClicked(evt){
  if((mouse.x > button.loc.x) && (mouse.x < (button.loc.x + button.h)) && (mouse.y > button.loc.y) && (mouse.y < (button.loc.y + button.w))){
    button.colour = "rgba(100, 150, 100, 1)";
    button.render();
    go = true;
  }
}

function randomColour(){
  return 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
}

function checkAddBody(){
  if(snake.eat(apple.location)){
    snake.total++;
    score += 50;
    apple.move();
  }
  if(snake.eat(orange.location)){
    snake.total += 3;
    score += 150;
    orange.move();
  }
  if(snake.eat(lemon.location)){
    snake.total += 5;
    score += 200;
    lemon.move();
  }
  if(snake.eat(grape.location)){
    snake.total += 7;
    score += 250;
    grape.move();
  }
}

function Snake(){
  this.location = new JSVector(cns.x / 2, cns.y / 2);
  this.velocity = new JSVector(0, 0);
  this.acceleration = new JSVector(0, 0);
  this.radius = scale;
  this.colour = 'rgba(0, 0, 255, 1)';
  this.total = 0;
  this.tail = [];

  this.direction = function(x, y){
    this.velocity.x = x;
    this.velocity.y = y;
  }

  this.eat = function(position){
    if(this.location.distance(position) < 1){
      return true;
    }
    return false;
  }

  this.die = function(){
    for(var i = 0; i < this.tail.length; i++){
      var d = this.location.distance(this.tail[i]);
      if(d < 1){
        this.total = 0;
        this.tail = [];
        end();
      }
    }
    var e = this.location.distance(cns);
    var f = this.location.distance(origin);
    if(e < 1 || f < 1){
      this.total = 0;
      this.tail = [];
      end();
    }
    this.update();
  }

  this.update = function(){
    if(this.total >= this.tail.length){
      for(var i = this.tail.length; i < this.total; i++){
        this.tail[i] = new JSVector(this.tail[this.tail.length - 1].x, this.tail[this.tail.length - 1].y);
      }
    }
    if(this.total == this.tail.length){
      for(var i = 0; i < this.tail.length - 1; i++){
        this.tail[i] = this.tail[i + 1];
      }
    }

    this.tail[this.total - 1] = new JSVector(this.location.x, this.location.y);

    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);

    if(this.location.x < 0){
      this.location.x = 0;
      end();
    }
    if(this.location.y < 0){
      this.location.y = 0;
      end();
    }
    if(this.location.x > cns.x){
      this.location.x = cns.x - this.radius;
      end();
    }
    if(this.location.y > cns.y){
      this.location.y = cns.y - this.radius;
      end();
    }

    this.render();
  }

  this.render = function(){
    ctx.beginPath();
    for(var i = 0; i < this.tail.length; i++){
      ctx.rect(this.tail[i].x, this.tail[i].y, this.radius, this.radius);
    }
    ctx.rect(this.location.x, this.location.y, this.radius, this.radius);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }
}

window.addEventListener("keydown", function(event){
  if (event.defaultPrevented) {
    return;
  }
  switch(event.key){
    case "ArrowDown":
      snake.direction(0, snake.radius);
      break;
    case "ArrowUp":
      snake.direction(0, -snake.radius);
      break;
    case "ArrowLeft":
      snake.direction(-snake.radius, 0);
      break;
    case "ArrowRight":
      snake.direction(snake.radius, 0);
      break;
    default:
      return;
  }
  event.preventDefault();
}, true);

function Fruit(c){
  this.location = new JSVector(Math.floor(Math.random() * Math.round(cns.x / scale)) * scale, Math.floor(Math.random() * Math.round(cns.y / scale)) * scale);
  this.colour = c;
  this.radius = scale;

  this.move = function(){
    this.location = new JSVector(Math.floor(Math.random() * Math.round(cns.x / scale)) * scale, Math.floor(Math.random() * Math.round(cns.y / scale)) * scale);
    for(var i = 0; i < snake.tail.length; i++){
      if(this.location === snake.tail[i].location || this.location === snake.location){
        this.location = new JSVector(Math.floor(Math.random() * Math.round(cns.x / scale)) * scale, Math.floor(Math.random() * Math.round(cns.y / scale)) * scale);
      }
    }
  }

  this.render = function(){
    ctx.beginPath();
    ctx.rect(this.location.x, this.location.y, this.radius, this.radius);
    ctx.fillStyle = this.colour;
    ctx.fill();
  }
}

function Button(x, y, h, w){
  this.loc = new JSVector(x, y);
  this.h = h;
  this.w = w;
  this.colour = "rgba(0, 255, 0, 1)";
  this.textColour = "rgba(0, 0, 0, 1)";

  this.update = function(){
    this.render();
  }

  this.render = function(){
    if(go != true){
      ctx.beginPath();
      ctx.rect(this.loc.x, this.loc.y, this.h, this.w);
      ctx.fillStyle = this.colour;
      ctx.fill();
      ctx.fillStyle = this.textColour;
      ctx.font = '16px serif';
      ctx.fillText("click me to play", this.loc.x + 5, this.loc.y + 15);
    }
  }
}
