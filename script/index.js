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
        this.minY = 38;
        this.maxY = 50;

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

// ======================= \\
//        Tutorial
// ======================= \\

const tutorialBox = document.getElementById("tutorialBox");

let tutorialStep = 1;
// 1 = mover
// 2 = atacar 
// 3 = interactuar
// 4 = tutorial terminado

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

        // Posición de inicio del enemigo
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

        // Cuando muere el enemigo, mostrar E (si estamos en tutorial de matar/interactuar)
        if (tutorialStep === 3) {
            tutorialStep = 4; // ahora toca interactuar
            if (tutorialBox) {
                tutorialBox.style.display = "block";
                tutorialBox.innerHTML = "Con la tecla E puedes interactuar con el entorno (pasar por portales, recoger monedas, etc.)";
            }
        }
    }
}

const enemyElement = document.getElementById("enemy");
const enemy = new Enemy(enemyElement, 46, 38);

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

// ======================= \\
//  Funcionalidad player
// ======================= \\

document.addEventListener("keydown", (e) => {
    // Movimiento + marcar direcciones para el tutorial
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

    // Pasar del paso 1 al 2 cuando se haya movido en todas direcciones
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

    // Ataque player
    else if (e.code === "KeyC") {
        player.attack();

        // Pasar al siguiente paso de ltutorial
        if (tutorialStep === 2) {
            tutorialStep = 3;
            tutorialBox.innerHTML = "Aprovecha que el enemigo está distraido y acaba con el!";

            setTimeout(() => {
                tutorialBox.style.display = "none";
            }, 1500);
        }

        if (!enemy.isAlive) return;

        // Comprobar que el enemigo está en el área de ataque
        if (checkCollision(characterElement, enemyElement)) {
            enemy.takeDamage(20);
        }
    }

    if (e.code === "KeyE") {
        if (tutorialStep === 4) {
            tutorialStep = 5;

            tutorialBox.style.display = "block";

            setTimeout(() => {
                tutorialBox.style.display = "none";
            }, 1500);
        }
    }
});




