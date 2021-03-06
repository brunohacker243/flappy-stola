let theme,die,hit,point,swoosh,wing;
let start,options,menu,pleasewait,upgrades,codes;
let bird, birdAnimation;
let START = 0, PLAY = 1, END = 2;
let gameState = START;
let gravity = 10;
let jumpHeight = 5;
let pipes = [],pipeImg;
let title;
let bullets = [];
let canShoot = true;
let spamAmount = 0;
let clicktoofast;
let bg;
let pewSfx,explosionSfx;
let pipeDestroyer,pDImg;
let score = 0,scoreText;

/*
  use
    .\send (nesse diretorio, por que tem o .bat, se for usar tem que copiar)
    (apagar quando pronto)
  para enviar o projeto para o github
*/

/*

  https://www.beepbox.co/#9n41s0k0l00e06t2ma7g0fj07r1i0o4323T0v1u00f0qg113d04w2h0E0T1v1u01f0qwx10n513d08A1F1B4Q50b0Pea3bE2b7628T0v1u00f0qg113d04w1h0E0T5v1u05f0qwx10h513d03H_RIBJAAAzrrrqhh0E1b4T2v0u02f10w4qw123d03w0E0b4h4h800000014h8M0000000h4z000000000ic00000000h8M000000p26OFHZohFGvz5wiCAlcLs3ibgbjnjhVqpEZ9MF5M99JAmGhpF9wAl4QuBBlnBLnAsAki9r8C21jh_8cRUcLF8U8zARfjBUOCLO8hFGvP5wiCAlcK70QyQ2QRQQuo1CzQD3An0ACShqF5CAC2hkNbaGLbuL8V8EAiShc45djQjnWgGqfCywzE8WlcLzUBdjMCnBfjNddvxyfzj5wiCAnzU6AmwmCKCzP0cQuBYyU4ASObl8IQAMiaC9pllVrRV7954ymO9wwFEZpghT6nh0CnnihRkR-c8QRfFyM9jiaCn-1F5E5FHY60pEZ9MV5M99JAmGhpF9wAlciOGHOTHOeia94JAj11jhD2ey0bXieALsQpdknFEO4OA9R8CCF01jqoJNjibE41ibgbjnwkxnpprt8i4x8cR8xd5kmCkyOywlCkX2e_ie0U0
  theme url :)

*/

function preload() {
  birdAnimation = loadAnimation("./assets/bird1.png","./assets/bird2.png","./assets/bird3.png","./assets/bird4.png");
  theme = loadSound("./assets/theme.mp3");
  die = loadSound("./assets/sfx_die.mp3");
  hit = loadSound("./assets/sfx_hit.mp3");
  point = loadSound("./assets/sfx_point.mp3");
  swoosh = loadSound("./assets/sfx_swooshing.mp3");
  wing = loadSound("./assets/sfx_wing.mp3");
  bg = loadImage("./assets/bg.png");
  pipeImg = loadImage("./assets/pipe.png");
  pewSfx = loadSound("./assets/pew.mp3");
  explosionSfx = loadSound("./assets/explosion.mp3");
  pDImg = loadImage("./assets/pipedestroyer.png");
}

function setup() {
  createCanvas(1600,800);
  bird = createSprite(200, 400, 50, 50);
  bird.addAnimation("bird",birdAnimation);
  bird.scale = 3;
  pipeDestroyer = createSprite(bird.x + 20,bird.y + 20,10,10);
  pipeDestroyer.addImage(pDImg);
  pipeDestroyer.scale = 3;
  clicktoofast = createImg("./assets/clicktoofast.png");
  clicktoofast.position(700,600);
  clicktoofast.style("opacity",0);
  load();
}

function draw() {
  background(bg);
  if(gameState === PLAY) {
    score += 1;
    scoreText.remove();
    let scoreShow = score.toString();
    scoreText = createElement("h1",scoreShow);
    scoreText.position(775-scoreShow.length*12.5,60);
    scoreText.class("FlappyStolaScore");
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
          explosionSfx.play();
        }
      }
    }
    if(bird.y >= 800 || bird.y <= 0) {
      gameOver();
    }
    pipeDestroyer.x = bird.x + 20;
    pipeDestroyer.y = bird.y + 20;
  } else {
    scoreText.remove();
  }
  drawSprites();
}

function load() {
  swoosh.play();
  pleasewait = createImg("./assets/pleaseWait.png");
  pleasewait.position(700,100);
  start = createImg("./assets/start.png");
  start.position(700,500);
  start.mousePressed(startGame);
  options = createImg("./assets/options.png");
  options.position(700,600);
  options.mousePressed(optionsMenu);
  title = createImg("./assets/flappystola.png");
  title.position(300,200);
  upgrades = createImg("./assets/upgrades.png");
  upgrades.position(675,700);
  upgrades.mousePressed(upgradesMenu);
  fadeImg(pleasewait,"out",1,10,10);
  pleasewait.remove();
  //como adicionar fontes em textos :)
  let scoreShow = score.toString();
  scoreText = createElement("h1",scoreShow);
  scoreText.position(775-scoreShow.length*100,60);
  scoreText.class("FlappyStolaScore");
}

function startGame() {
  document.body.onmousedown = () => {
    summonBullets();
  };
  gameState = PLAY;
  removeMainMenu([true,true,true,false,true,false]);
  swoosh.play();
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
      if(gameState === PLAY) {
        sprite.y -= height;
      }
    }, timeDifference*i);
  }
  wing.play();
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
      pipe.addImage(pipeImg);
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
      let bullet = createSprite(bird.x + 20,bird.y + 20,20,10);
      bullet.shapeColor = "red";
      bullet.lifetime = 1600;
      bullet.velocityX = 10;
      bullets.push(bullet);
      delete bullet;
      pewSfx.play();
      setTimeout(() => {
        canShoot = true;
      }, 250);
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
  hit.play();
  bird.velocityY = 10;
  pipeDestroyer.velocityY = 15;
  setTimeout(() => {
    die.play();
    menu = createImg("./assets/menu.png");
    menu.position(700,700);
    menu.mousePressed(reset);
  }, 500);
}

function fadeImg(img,inOrOut,speed,timeFade,timeAlive) {
  if (inOrOut === "both") {
    for (let i = 0; i < 1 / speed * 10; i++) {
      setTimeout(() => {
        img.style("opacity",i / 10);
      }, i * timeFade);
    }
    setTimeout(() => {
      for (let i = 0; i < 1 / speed * 10 + 1; i++) {
        setTimeout(() => {
          img.style("opacity",1 - (i / 10));
        }, i * timeFade);
      }
    }, timeAlive);
  } else if(inOrOut === "in") {
    for (let i = 0; i < 1 / speed * 10; i++) {
      setTimeout(() => {
        img.style("opacity",i / 10);
      }, i * timeFade);
    }
  } else if(inOrOut === "out") {
    setTimeout(() => {
      for (let i = 0; i < 1 / speed * 10 + 1; i++) {
        setTimeout(() => {
          img.style("opacity",1 - (i / 10));
        }, i * timeFade);
      }
    }, timeAlive);
  }
}

function removeMainMenu(removeOptions) {
  if(removeOptions[0]){start.remove();}
  if(removeOptions[1]){options.remove();}
  if(removeOptions[2]){title.remove();}
  if(removeOptions[3]){menu.remove();}
  if(removeOptions[4]){upgrades.remove();}
  if(removeOptions[5]){codes.remove();}
}

function codesMenu() {
  alert("coming soon");
  removeMainMenu([false,false,true,true,true,true]);
  load();
}

function optionsMenu() {
  removeMainMenu([true,true,false,false,true,false]);
  title.position(300,50);
  menu = createImg("./assets/menu.png");
  menu.position(700,700);
  menu.mousePressed(()=>{
    removeMainMenu([false,false,true,true,true,true]);
    load();
  });
  codes = createImg("./assets/codes.png");
  codes.position(700,300);
  codes.mousePressed(codesMenu);
}

function upgradesMenu() {
  removeMainMenu([true,true,false,false,true,false]);
  title.position(300,50);
  menu = createImg("./assets/menu.png");
  menu.position(700,700);
  menu.mousePressed(()=>{
    removeMainMenu([false,false,true,true,true,false]);
    load();
  });
  alert("coming soon");
}

function reset() {
  bird.x = 200;
  bird.y = 400;
  bird.velocityY = 0;
  pipeDestroyer.velocityY = 0;
  pipeDestroyer.x = bird.x + 20;
  pipeDestroyer.y = bird.y + 20;
  for (let j = 0; j < 100; j++) {
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].remove();
      pipes.splice(i,1);
    }
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].remove();
      bullets.splice(i,1);
    }
  }
  gameState = START;
  score = 0;
  load();
  menu.remove();
  scoreText.remove();
}