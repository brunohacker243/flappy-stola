let start, startImg;
let bird, birdAnimation;
let START = 0, PLAY = 1, END = 2;
let gameState = START;
let gravity = 10;
let jumpHeight = 5;
let pipes = [];

/*
  use
    .\send (nesse diretorio, por que tem o .bat, se for usar tem que copiar)
    (apagar quando pronto)
  para enviar o projeto para o github
*/

function preload() {
  startImg = loadImage("./assets/start.png");
  birdAnimation = loadAnimation("./assets/bird1.png","./assets/bird2.png","./assets/bird3.png","./assets/bird4.png");
}

function setup() {
  createCanvas(1600,800);
  bird = createSprite(200, 400, 50, 50);
  bird.addAnimation("bird",birdAnimation);
  bird.scale = 3;
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
          gameState = END;
          alert("die placeholder");
      }
    }
    if(bird.y >= 800) {
      gameState = END;
      alert("die placeholder");
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
}

function startGame() {
  gameState = PLAY;
  start.remove();
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
    let height = random(0,400);
    let pipe = createSprite(1600,0,70,height);
    pipe.shapeColor = "lime";
    pipes.push(pipe);
    delete pipe;
    pipe = createSprite(1600,800,70,height + 500);
    pipe.shapeColor = "lime";
    pipes.push(pipe);
  }
}