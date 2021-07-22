let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let bg = new Image();
let dino = new Image();
let start = new Image();
let asteroid = new Image();
let end = new Image();
let over = new Image();
let enemyimg = new Image();
let go = new Image();

let aster = [];
let timer = 0;
let pause = false;


let person = { //параметры персонажа
  recharge : 0,
  flag_y : 432,
  x_abs : 0,
  x_padding: 0,
  tick_count: 0,
  x_pos: 50,
  y_pos: 432,
  y_padding: 0
}

let bg_x = 0;

let enemy = { //параметры противника
  abs : 0,
  health : 100,
  x_padding: 0,
  tick_count: 0,
  x: 290,
  y: 470,
  y_padding: 0,
  step : -15
}

let enemys = [Object.assign({}, enemy), Object.assign({}, enemy)]; //массив из двух противников
enemys[0].abs = 2900;
enemys[1].abs = 6450;

let fires = []; //массив из огней

let fire = { //fireball
  image : new Image(),
  x : -20,
  y : 0,
  speed : 40,
}

bg.src = 'img/bg4.png'; //загрузка изображений
dino.src = 'img/dino5.png';
start.src = 'img/start.png';
asteroid.src = 'img/asteroid.png';
end.src = 'img/finish.png';
over.src = 'img/gameover.png';
enemyimg.src = 'img/enemy.png';
fire.image.src = 'img/fireball.png';
go.src = 'img/go.png';

bg.onload = function(){
  bgChange();
  tick();
  requestAnimationFrame(tick);
};

function gameOver() {  //окончание игры
  pause = true;
}

function finish(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(end, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '60px Times New Roman';
  ctx.fillText ('FINISH', canvas.width / 2.6, canvas.height / 2);
  window.cancelAnimationFrame();
}

function bgChange(){ 
  ctx.drawImage(bg, bg_x, 0);

  if ((person.x_pos + 100 > 1870 + bg_x && person.x_pos < 2200 + bg_x) && person.y_pos + 200 > 615){
    gameOver();
  }
  if ((person.x_pos + 100 > 4760 + bg_x && person.x_pos < 5150 + bg_x) && person.y_pos + 200 > 615){
    gameOver();
  }
  if ((person.x_pos + 100 > 5650 + bg_x && person.x_pos < 5980 + bg_x) && person.y_pos + 200 > 615){
    gameOver();
  }
  if ((person.x_pos + 100 > 7660 + bg_x && person.x_pos < 7870 + bg_x) && person.y_pos + 200 > 615){
    gameOver();
  }
  if ((person.x_pos + 100 > 9015 + bg_x && person.x_pos < 9330 + bg_x) && person.y_pos + 200 > 615){
    gameOver();
  }
  if (person.x_pos + 100 > 10500 + bg_x && person.x_pos + 200 < 11176 + bg_x){
    finish();
  }
}

function tick(){ //замедление анимации
  if (person.tick_count > 1000){
    render();
    person.tick_count = 0;
  }
  person.tick_count+=1;
  requestAnimationFrame(tick);
}

function grav(){
  if (person.y_pos < person.flag_y){ //гравитация
    person.y_pos += 12;
  }
}

function actHit(){
  fires.push(Object.assign({}, fire)); //добавили в массив fires копию объекта fire
  fires[fires.length - 1].x = person.x_pos + 220;  
  fires[fires.length - 1].y = person.y_pos + 100;  
}

function flyBall(){
  for (let i = 0; i< fires.length; i++){
    fires[i].x += fires[i].speed;
  }
  for (let i = 0; i< fires.length; i++){
    if (fires[i].x > 1400){
      fires.splice(i, 1);
      i--;
    }
    break;
  }
}

function actEnemy(){
  if (enemys.length == 2) {
    if (enemys[0].abs > 4400 || enemys[0].abs < 2900 ){
      enemys[0].step = -enemys[0].step;
  
      if (enemys[0].step == -15 ) enemys[0].y_padding = 150;
      else enemys[0].y_padding = 0;
    }
  }
  if (enemys.length == 2) {
    if (enemys[1].abs > 7450 || enemys[1].abs < 6450 ){
      enemys[1].step = -enemys[1].step;

      if (enemys[1].step == -15 ) enemys[1].y_padding = 150;
      else enemys[1].y_padding = 0;
    }
  }
  if (enemys.length == 1) {
    if (enemys[0].abs > 7450 || enemys[0].abs < 6450 ){
      enemys[0].step = -enemys[0].step;

      if (enemys[0].step == -15 ) enemys[0].y_padding = 150;
      else enemys[0].y_padding = 0;
    }
  }
  for (let i = 0; i < enemys.length; i++){
    enemys[i].abs += enemys[i].step;
    enemys[i].x = bg_x + enemys[i].abs ;
  }
}

function deadEnemy() {
  for (let i = 0; i < enemys.length; i++) {
    for (let j = 0; j < fires.length; j++) {
      if (fires[j].x > enemys[i].x) {
        fires.splice(j, 1); //удаление со смещением 
        enemys.splice(i, 1);
        i -= 1;
        j -= 1;
        break;
      }   
    }
    break;
  }
}

function fight(){
  for (let i = 0; i < enemys.length; i++){
    if (Math.abs (enemys[i].x - person.x_pos) < 200){
      gameOver();
    }
  }
}

function render() { //отрисовка спрайта и очистка экрана
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  person.x_padding = (person.x_padding === 258 ? 0 : person.x_padding + 86); 
  bgChange();
  ctx.drawImage(dino, person.x_padding, person.y_padding, 86, 86, person.x_pos, person.y_pos, 200, 200); //отрисовка персонажа

  ctx.drawImage(start, bg_x, 0, 697, 739);

  for (let i = 0; i < fires.length; i++){
    ctx.drawImage(fires[i].image, fires[i].x, fires[i].y, 200, 60);
  }

  for (let i = 0; i < enemys.length; i++){
    enemys[i].x_padding = (enemys[i].x_padding == 300 ? 0 : enemys[i].x_padding + 150);
    ctx.drawImage(enemyimg,  enemys[i].x_padding, enemys[i].y_padding, 150, 150, enemys[i].x, enemys[i].y, 200, 200);
    if (pause == true){
      ctx.drawImage(go, 0, 0, canvas.width, canvas.height);
    }
  }

  changeAct();
  grav();
  enem();
  flyBall();
  actEnemy();
  deadEnemy();
  fight();
  person.recharge = (person.recharge + 1) % 7;
}

let right = false;
let space = false; 
let jump = 0;

keyMap = {
  "KeyA": false,
  "KeyD": false,
  "Space": false,
  "Enter" : false,
};
window.addEventListener("keydown", function(e) {
  checkKey(e.code, true);
});
window.addEventListener("keyup", function(e) {
  checkKey(e.code, false);
});

function checkKey(code, flag)
{
  switch(code)
  {
    case "KeyA": //Влево
    keyMap.KeyA = flag;
    break;

    case "Enter": //Удар
    keyMap.Enter = flag;
    break;

    case "KeyD": //Вправо
    keyMap.KeyD = flag;
    break;

    case "Space": //Вверх
    keyMap.Space = flag;
    break;
  }
}

let step = 14;

function changeAct()
{
  actNon();
  if (keyMap.Space == true) {
    actUp();
  }

  if ((keyMap.KeyD == true ) && (keyMap.KeyA != true) && (keyMap.Enter != true)) {
    actRight();
  }

  if ((keyMap.KeyA == true) && (keyMap.KeyD != true) && (keyMap.Enter != true)) {
    actLeft();
  }

  if (keyMap.Enter == true) {
    if(person.recharge == 0) actHit();
  }
}


function actNon(){ 
  if (person.y_padding == 172){
    person.y_padding = 0;
  }
  if (person.y_padding == 86){
    person.y_padding = 258;
  }
}

function actUp(){ //прыжок
  if (person.y_pos == 432){
    person.y_pos -= 360;
    space = true;
  }
}

function actRight(){ //вправо
  
  if (person.x_pos < 650){
    person.x_pos += step;
  }
  person.y_padding = 172;

  right = true;

  if (bg_x > -11146 + canvas.width){
    bg_x -= 20;
  }

}

function actLeft(){//влево
  if (person.x_pos > 150){
    person.x_pos-=step;
  }

  person.y_padding = 86;
   
  if (bg_x < 0 && bg_x < 11176 - canvas.width) {
    bg_x += 20;
  }
  // person.x_abs -= step;
}


function enem(){
  enemy.x_pos += enemy.speed;

  if (enemy.x_pos + enemy.speed <= 4300 + bg_x){
    enemy.y_padding = 0;
    
    enemy.speed += enemy.speed;
  }
    
  if (enemy.x_pos + enemy.speed >= 2900 + bg_x){
    enemy.y_padding = 150;

    enemy.speed -= enemy.speed;
  }
}

setInterval(render, 1000/15);

