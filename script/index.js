
// ======================= \\
//         Player
// ======================= \\

class Player {
    constructor(element, startX, startY) {

        this.el = element;

        // Posición inicio 

        this.positionX = startX;
        this.positionY = startY;
        this.step = 0.5;

        // Sprites

        this.idleSprite = "img/assets/character/character-idle.png";
        this.attackSprite = "img/assets/character/character-attack.png";
        this.el.src = this.idleSprite;

        // Límites del mapa

        this.minX = 40;
        this.maxX = 60;
        this.minY = 35;
        this.maxY = 45;

        this.isAttacking = false;

        this.move();
    }

    moveUp() {
        if (this.positionY > this.minY) {
            this.positionY -= this.step;
            this.move();
        }
    }
    moveDown() {
        if (this.positionY < this.maxY) {
            this.positionY += this.step;
            this.move();
        }
    }
    moveLeft() {
        if (this.positionX > this.minX) {
            this.positionX -= this.step;
            this.move();
        }
    }
    moveRight() {
        if (this.positionX < this.maxX) {
            this.positionX += this.step;
            this.move();
        }
    }

    attack() {
        if (this.isAttacking) {
            return;
        }

        this.isAttacking = true;
        this.el.src = this.attackSprite;
        this.el.classList.add("attack");

        setTimeout(() => {
            this.el.src = this.idleSprite;
            this.isAttacking = false;
            this.el.classList.remove("attack");
        }, 500);
    }

    move() {
        this.el.style.left = this.positionX + "vw";
        this.el.style.top = this.positionY + "vh";
    }
}

const characterElement = document.getElementById("character");
const player = new Player(characterElement, 56, 38);


// ======================= \\
//  Funcionalidad player
// ======================= \\

document.addEventListener("keydown", (e) => {

    if (e.code === "KeyW" || e.code === "ArrowUp") {
        player.moveUp();
    }
    else if (e.code === "KeyS" || e.code === "ArrowDown") {
        player.moveDown();
    }
    else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        player.moveLeft();
    }
    else if (e.code === "KeyD" || e.code === "ArrowRight") {
        player.moveRight();
    }

    // Ataque player

    else if (e.code === "KeyC") {
        player.attack();

        // Comprobar que el enemigo está en el área de ataque

        if (checkCollision(characterElement, enemyElement)) {
            console.log("hit");
        }
    }
});




// ======================= \\
//        Enemies
// ======================= \\

class Enemy {
    constructor(element, startX, startY) {

        this.el = element;

        // Posición de inicio del enemigo

        this.positionX = startX;
        this.positionY = startY;

        this.move();
    }

    move() {
        this.el.style.left = this.positionX + "vw";
        this.el.style.top = this.positionY + "vh";
    }
}

const enemyElement = document.getElementById("enemy");
const enemy = new Enemy(enemyElement, 50, 40);

// Detectar colisión con enemies

function checkCollision(playerElement, enemyElement) {

    const p = playerElement.getBoundingClientRect();
    const e = enemyElement.getBoundingClientRect();

    return (
        p.left < e.right &&
        p.right > e.left &&
        p.top < e.bottom &&
        p.bottom > e.top
    );

}



