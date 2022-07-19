let start,options,menu,pleasewait;
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

/*

  https://www.beepbox.co/#9n41s0k0l00e06t2ma7g0fj07r1i0o4323T0v1u00f0qg113d04w2h0E0T1v1u01f0qwx10n513d08A1F1B4Q50b0Pea3bE2b7628T0v1u00f0qg113d04w1h0E0T5v1u05f0qwx10h513d03H_RIBJAAAzrrrqhh0E1b4T2v0u02f10w4qw123d03w0E0b4h4h800000014h8M0000000h4z000000000ic00000000h8M000000p26OFHZohFGvz5wiCAlcLs3ibgbjnjhVqpEZ9MF5M99JAmGhpF9wAl4QuBBlnBLnAsAki9r8C21jh_8cRUcLF8U8zARfjBUOCLO8hFGvP5wiCAlcK70QyQ2QRQQuo1CzQD3An0ACShqF5CAC2hkNbaGLbuL8V8EAiShc45djQjnWgGqfCywzE8WlcLzUBdjMCnBfjNddvxyfzj5wiCAnzU6AmwmCKCzP0cQuBYyU4ASObl8IQAMiaC9pllVrRV7954ymO9wwFEZpghT6nh0CnnihRkR-c8QRfFyM9jiaCn-1F5E5FHY60pEZ9MV5M99JAmGhpF9wAlciOGHOTHOeia94JAj11jhD2ey0bXieALsQpdknFEO4OA9R8CCF01jqoJNjibE41ibgbjnwkxnpprt8i4x8cR8xd5kmCkyOywlCkX2e_ie0U0
  song url :)

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
  clicktoofast.position(700,600);
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
  pleasewait = createImg("./assets/pleaseWait.png");
  pleasewait.position(700,100);
  start = createImg("./assets/start.png");
  start.position(700,500);
  start.mousePressed(startGame);
  options = createImg("./assets/options.png");
  options.position(700,600);
  options.mousePressed(optionsMenu);
  // como adicionar fontes em textos :)
  // let title = createElement("h1","Flappy Stola");
  // title.position(700,400);
  // title.class("FlappyStolaTitle");
  title = createImg("./assets/flappystola.png");
  title.position(300,200);
  fadeImg(pleasewait,"out",1,10,10);
  pleasewait.remove();
}

function startGame() {
  document.body.onmousedown = () => {
    summonBullets();
  };
  gameState = PLAY;
  removeMainMenu([true,true,true,false]);
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
}

function optionsMenu() {
  removeMainMenu([true,true,false,false]);
  title.position(300,50);
  menu = createImg("./assets/menu.png");
  menu.position(700,600);
  menu.mousePressed(backToMenu);
  // alert("coming soon");
  // backToMenu();
}

function backToMenu() {
  removeMainMenu([false,false,true,true]);
  load();
}