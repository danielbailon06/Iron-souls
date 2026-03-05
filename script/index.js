

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

        this.isAttacking = false;

        this.move();
    }

    moveUp() {
        const oldY = this.positionY;

        this.positionY -= this.step;
        this.move();

        if (this.positionY < this.minY) this.positionY = this.minY;

        if (collidesWithWalls(this.el)) {
            this.positionY = oldY;
            this.move();
        }
    }
    moveDown() {
        const oldY = this.positionY;

        this.positionY += this.step;
        this.move();

        if (this.positionY > this.maxY) this.positionY = this.maxY;

        if (collidesWithWalls(this.el)) {
            this.positionY = oldY;
            this.move();
        }
    }
    moveLeft() {
        const oldX = this.positionX;

        this.positionX -= this.step;
        this.move();

        if (this.positionX < this.minX) this.positionX = this.minX;

        if (collidesWithWalls(this.el)) {
            this.positionX = oldX;
            this.move();
        }
    }
    moveRight() {
        const oldX = this.positionX;

        this.positionX += this.step;
        this.move();

        if (this.positionX > this.maxX) this.positionX = this.maxX;

        if (collidesWithWalls(this.el)) {
            this.positionX = oldX;
            this.move();
        }
    }

    attack() {
        if (this.isAttacking) return;

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
const player = new Player(characterElement, 57, 42);

const scene = document.body.dataset.scene;

// Spawn jugador

if (scene === "scene1") {

    // Posición inicial escena 1
    player.positionX = 57;
    player.positionY = 42;

    // Límites del mapa escena 1
    player.minX = 40;
    player.maxX = 60;
    player.minY = 38;
    player.maxY = 50;

}

if (scene === "scene2") {

    // Posición inicial escena 2
    player.positionX = 48.5;
    player.positionY = 20;

    // Límites del mapa escena 2
    player.minX = 27;
    player.maxX = 70;
    player.minY = 30;
    player.maxY = 70;
}

player.move();

// ======================= \\
//        Tutorial
// ======================= \\

const tutorialBox = document.getElementById("tutorialBox");

let tutorialStep = 1;

let moved = { up: false, down: false, left: false, right: false };

if (tutorialBox) {
    tutorialBox.innerHTML = "Muévete con WASD o las flechas";
}

// ======================= \\
//        Enemies
// ======================= \\

class Enemy {
    constructor(element, startX, startY) {
        this.el = element;

        this.positionX = startX;
        this.positionY = startY;

        this.maxHealth = 100;
        this.health = 100;

        this.isAlive = true;
        this.canTakeDamage = true;

        this.move();
    }

    move() {
        this.el.style.left = this.positionX + "vw";
        this.el.style.top = this.positionY + "vh";
    }

    takeDamage(amount) {
        if (!this.isAlive) return;
        if (!this.canTakeDamage) return;

        this.health -= amount;

        this.el.classList.add("hit");

        this.canTakeDamage = false;
        setTimeout(() => {
            this.canTakeDamage = true;
            this.el.classList.remove("hit");
        }, 300);

        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isAlive = false;
        this.el.remove();

        if (tutorialStep === 3) {
            tutorialStep = 4;
            if (tutorialBox) {
                tutorialBox.style.display = "block";
                tutorialBox.innerHTML =
                    "Con la tecla E puedes interactuar con el entorno (pasar por portales, recoger monedas, etc.)";
            }
        }
    }
}

const enemyElement = document.getElementById("enemy");
const enemy = new Enemy(enemyElement, 46, 50);

// ======================= \\
//       Colisiones
// ======================= \\

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

function checkCollisionElements(el1, el2) {
    const a = el1.getBoundingClientRect();
    const b = el2.getBoundingClientRect();

    return (
        a.left < b.right &&
        a.right > b.left &&
        a.top < b.bottom &&
        a.bottom > b.top
    );
}

function collidesWithWalls(playerElement) {
    const walls = document.querySelectorAll(".wall");

    for (let wall of walls) {
        if (checkCollisionElements(playerElement, wall)) {
            return true;
        }
    }

    return false;
}

// ======================= \\
//  Mensaje interacción
// ======================= \\

function updateInteractMessage() {
    const portal = document.getElementById("portal-hitbox");
    const interactMsg = document.getElementById("interact-message");

    if (!portal || !interactMsg) return;

    if (checkCollisionElements(characterElement, portal)) {
        interactMsg.style.display = "block";
    } else {
        interactMsg.style.display = "none";
    }
}

// ======================= \\
//  Funcionalidad player
// ======================= \\

document.addEventListener("keydown", (e) => {

    // Movimiento
    if (e.code === "KeyW" || e.code === "ArrowUp") {
        player.moveUp();
        moved.up = true;
    } else if (e.code === "KeyS" || e.code === "ArrowDown") {
        player.moveDown();
        moved.down = true;
    } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        player.moveLeft();
        moved.left = true;
    } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        player.moveRight();
        moved.right = true;
    }

    // actualizar mensaje de interactuar
    updateInteractMessage();

    // Tutorial movimiento
    if (
        tutorialStep === 1 &&
        moved.up &&
        moved.down &&
        moved.left &&
        moved.right
    ) {
        tutorialStep = 2;
        tutorialBox.innerHTML = "Pulsa C para atacar";
    }

    // Ataque
    else if (e.code === "KeyC") {
        player.attack();

        if (tutorialStep === 2) {
            tutorialStep = 3;
            tutorialBox.innerHTML =
                "Aprovecha que el enemigo está distraido y acaba con el!";

            setTimeout(() => {
                tutorialBox.style.display = "none";
            }, 1500);
        }

        if (!enemy.isAlive) return;

        if (checkCollision(characterElement, enemyElement)) {
            enemy.takeDamage(20);
        }
    }

    // Interactuar
    if (e.code === "KeyE") {
        const portalEl = document.getElementById("portal-hitbox");

        if (portalEl && checkCollisionElements(characterElement, portalEl)) {

            const fade = document.getElementById("fade-screen");

            fade.style.opacity = "1";

            setTimeout(() => {
                window.location.href = "game-2.html";
            }, 800);

            return;
        }

        if (tutorialStep === 4) {
            tutorialStep = 5;

            tutorialBox.style.display = "block";

            setTimeout(() => {
                tutorialBox.style.display = "none";
            }, 1500);
        }
    }
});