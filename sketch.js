/*
  use
    .\send (nesse diretorio, por que tem o .bat, se for usar tem que copiar)
    (apagar quando pronto)
  para enviar o projeto para o github
*/

function setup() {
  createCanvas(800,400);
  createSprite(400, 200, 50, 50);
}

function draw() {
  background(255,255,255);
  drawSprites();
}