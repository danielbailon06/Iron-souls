// Movimiento personaje
const character = document.getElementById("character");

let positionX = 56;
let positionY = 38;
const step = 1;

document.addEventListener("keydown", (e) => {

  if (e.code === "ArrowUp") {
    positionY -= step;
  }
  else if (e.code === "ArrowDown") {
    positionY += step;
  }
  else if (e.code === "ArrowLeft") {
    positionX -= step;
  }
  else if (e.code === "ArrowRight") {
    positionX += step;
  }

  character.style.left = positionX + "vw";
  character.style.top  = positionY + "vh";
});