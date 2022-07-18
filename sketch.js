let start;
let bird, birdAnimation;
let START = 0, PLAY = 1, END = 2;
let gameState = START;
let gravity = 10;
let jumpHeight = 5;
let pipes = [];
let title;
let bullets = [];
let canShoot = true;
let spamAmount = 0;
let clicktoofast;

/*
  use
    .\send (nesse diretorio, por que tem o .bat, se for usar tem que copiar)
    (apagar quando pronto)
  para enviar o projeto para o github
*/

function preload() {
  birdAnimation = loadAnimation("./assets/bird1.png","./assets/bird2.png","./assets/bird3.png","./assets/bird4.png");
}

function setup() {
  createCanvas(1600,800);
  bird = createSprite(200, 400, 50, 50);
  bird.addAnimation("bird",birdAnimation);
  bird.scale = 3;
  clicktoofast = createImg("./assets/clicktoofast.png");
  clicktoofast.position(700,700);
  clicktoofast.style("opacity",0);
  load();
}

function draw() {
  background("cyan");
  if(gameState === PLAY) {
    bird.y += gravity;
    summonPipes();
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= 10;
      if(pipes[i].isTouching(bird)) {
          gameOver();
      }
      for (let j = 0; j < bullets.length; j++) {
        if(pipes[i].isTouching(bullets[j])) {
          pipes[i].remove();
          bullets[j].remove();
          pipes.splice(i,1);
          bullets.splice(j,1);
        }
      }
    }
    if(bird.y >= 800 || bird.y <= 0) {
      gameOver();
    }
  }
  drawSprites();
}

function load() {
  alert("loading placeholder");
  start = createImg("./assets/start.png");
  start.position(700,600);
  start.mousePressed(startGame);
  // como adicionar fontes em textos :)
  // let title = createElement("h1","Flappy Stola");
  // title.position(700,400);
  // title.class("FlappyStolaTitle");
  title = createImg("./assets/flappystola.png");
  title.position(300,200);
}

function startGame() {
  document.body.onmousedown = () => {
    summonBullets();
  };
  gameState = PLAY;
  start.remove();
  title.remove();
}

function keyPressed() {
  if(gameState === PLAY) {
    if(keyCode === 32) {
      jump(bird,20,jumpHeight,10);
    }
  }
}

function jump(sprite,times,height,timeDifference) {
  let oldGravity = gravity;
  gravity = 0;
  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      sprite.y -= height;
    }, timeDifference*i);
  }
  gravity = oldGravity;
}

function summonPipes() {
  if(frameCount % 80 === 0) {
    // let height = random(0,400);
    // let pipe = createSprite(1600,0,70,height);
    for (let i = 0; i < 20; i++) {
      let pipe = createSprite(1600,i*50,70,50);
      pipe.shapeColor = "lime";
      pipe.lifetime = 1600;
      pipes.push(pipe);
      delete pipe;
    }
      // pipe.shapeColor = "lime";
      // pipes.push(pipe);
      // delete pipe;
    // pipe = createSprite(1600,800,70,height + 500);
    // pipe.shapeColor = "lime";
    // pipes.push(pipe);
  }
}

function summonBullets() {
  if(gameState === PLAY) {
    if(canShoot === true) {
      canShoot = false;
      spamAmount = 0;
      let bullet = createSprite(bird.x,bird.y,20,10);
      bullet.shapeColor = "white";
      bullet.lifetime = 1600;
      bullet.velocityX = 10;
      bullets.push(bullet);
      delete bullet;
      setTimeout(() => {
        canShoot = true;
      }, 250)
    } else {
      spamAmount += 1;
      if(spamAmount >= 2) {
        fadeImg(clicktoofast,"both",1,20,5000);
      }
    }
}
}

function gameOver() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].velocityX = 0;
  }
  gameState = END;
  alert("die placeholder");
}

function fadeImg(img,inOrOut,speed,timeFade,timeAlive) {
  if (inOrOut === "both") {
    for (let i = 0; i < 1 / speed * 10; i++) {
      setTimeout(() => {
        img.style("opacity",i / 10);
      }, i * timeFade)
    }
    setTimeout(() => {
      for (let i = 0; i < 1 / speed * 10 + 1; i++) {
        setTimeout(() => {
          img.style("opacity",1 - (i / 10));
        }, i * timeFade)
      }
    }, timeAlive);
  }
}