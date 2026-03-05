

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

        this.walk1Sprite = "img/assets/character/character-walk1.png";
        this.walk2Sprite = "img/assets/character/character-walk2.png";

        this.isWalking = false;
        this.walkFrame = 0;
        this.walkTimer = null;

        this.isAttacking = false;

        this.move();

        this.maxHealth = 100;
        this.health = 100;
        this.canTakeDamage = true;
        this.updateHealthUI();
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

    startWalkAnim() {
        if (this.isAttacking) return;
        if (this.walkTimer) return;

        this.walkTimer = setInterval(() => {
            if (this.isAttacking) return;

            this.walkFrame = 1 - this.walkFrame;
            this.el.src = (this.walkFrame === 0) ? this.walk1Sprite : this.walk2Sprite;
        }, 140);
    }

    stopWalkAnim() {
        if (this.walkTimer) {
            clearInterval(this.walkTimer);
            this.walkTimer = null;
        }
        if (!this.isAttacking) {
            this.el.src = this.idleSprite;
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

    updateHealthUI() {
        const bar = document.getElementById("hp-bar");
        if (!bar) return;
        const pct = Math.max(0, (this.health / this.maxHealth) * 100);
        bar.style.width = pct + "%";
    }

    takeDamage(amount) {
        if (!this.canTakeDamage) return;

        this.health -= amount;
        this.updateHealthUI();

        this.canTakeDamage = false;
        this.el.classList.add("damage");

        setTimeout(() => {
            this.canTakeDamage = true;
            this.el.classList.remove("damage");
        }, 400);

        if (this.health <= 0) {
            location.reload();
        }
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
    player.positionY = 30;

    // Límites del mapa escena 2
    player.minX = 27;
    player.maxX = 70;
    player.minY = 30;
    player.maxY = 100;
}

if (scene === "scene3") {

    // Posición inicial escena 3
    player.positionX = 48.5;
    player.positionY = 10;

    // Límites del mapa escena 3
    player.minX = 48;
    player.maxX = 49;
    player.minY = 10;
    player.maxY = 73;
}

if (scene === "boss-scene") {

    // Posición inicial escena 3
    player.positionX = 48.5;
    player.positionY = 70;

    // Límites del mapa escena 3
    player.minX = 30;
    player.maxX = 70;
    player.minY = 25;
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
    tutorialBox.innerHTML = "Use WASD or the arrow keys to move.";
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

        this.speed = 0.15;
        this.aggroRange = 10;
        this.attackRange = 2.2;
        this.attackDamage = 10;
        this.attackCooldown = 900;
        this.lastAttack = 0;

        this.idleSprite = "img/assets/enemies/eskeleto.png";
        this.attackSprite = "img/assets/enemies/eskeleto-attack.png";
        this.el.src = this.idleSprite;
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
                    "Press E to interact with the environment. Try entering the portal.";
            }
        }
    }

    update(player) {
        if (!this.isAlive) return;

        const dx = player.positionX - this.positionX;
        const dy = player.positionY - this.positionY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Si el enemigo está suficientemente lejos, deja de perseguir
        if (dist > this.aggroRange) return;

        const now = Date.now();
        if (dist <= this.attackRange) {
            if (now - this.lastAttack >= this.attackCooldown) {
                this.lastAttack = now;

                this.playAttackAnim();
                player.takeDamage(this.attackDamage);
            }
            return;
        }

        // Comprobar si está en rango para pegar
        const nx = dx / dist;
        const ny = dy / dist;

        this.positionX += nx * this.speed;
        this.positionY += ny * this.speed;

        this.move();
    }

    playAttackAnim() {
        this.el.src = this.attackSprite;
        setTimeout(() => {
            this.el.src = this.idleSprite;
        }, 200);
    }
}

const enemyElements = document.querySelectorAll(".enemy");
const enemies = [];

enemyElements.forEach((el) => {
    const x = parseFloat(el.dataset.x);
    const y = parseFloat(el.dataset.y);
    enemies.push(new Enemy(el, x, y));
});

setInterval(() => {

    enemies.forEach(enemy => {

        if (enemy.isAlive) {
            enemy.update(player);
        }

    });

}, 50);

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

let isChangingScene = false;

function autoSceneChange(targetPage) {
    if (isChangingScene) return;

    const trigger = document.getElementById("scene-trigger");
    if (!trigger) return;

    if (checkCollisionElements(characterElement, trigger)) {
        isChangingScene = true;

        const fade = document.getElementById("fade-screen");
        if (fade) fade.style.opacity = "1";

        setTimeout(() => {
            window.location.href = targetPage;
        }, 800);
    }
}

// ======================= \\
//  Mensaje interacción
// ======================= \\

let canJump = false;

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

function updateJumpPrompt() {
    const hitbox = document.getElementById("jump-hitbox");
    const msg = document.getElementById("jump-message");
    if (!hitbox || !msg) return;

    canJump = checkCollisionElements(characterElement, hitbox);
    msg.style.display = canJump ? "block" : "none";
}

function doJump(targetPage) {
    if (!canJump) return;

    isChangingScene = true;

    const fade = document.getElementById("fade-screen");
    if (fade) fade.style.opacity = "1";

    setTimeout(() => {
        window.location.href = targetPage;
    }, 800);
}


// ======================= \\
//  Funcionalidad player
// ======================= \\

document.addEventListener("keydown", (e) => {

    // Movimiento
    if (e.code === "KeyW" || e.code === "ArrowUp") {
        player.startWalkAnim();
        player.moveUp();
        moved.up = true;
    } else if (e.code === "KeyS" || e.code === "ArrowDown") {
        player.startWalkAnim();
        player.moveDown();
        moved.down = true;
    } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
        player.startWalkAnim();
        player.moveLeft();
        moved.left = true;
    } else if (e.code === "KeyD" || e.code === "ArrowRight") {
        player.startWalkAnim();
        player.moveRight();
        moved.right = true;
    }

    updateJumpPrompt();

    if (scene === "scene2") {
        autoSceneChange("game-3.html");
    }

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
        tutorialBox.innerHTML = "Press C to attack";
    }

    // Ataque
    else if (e.code === "KeyC") {
        player.attack();

        if (tutorialStep === 2) {
            tutorialStep = 3;
            tutorialBox.innerHTML =
                "The enemy is distracted — finish him off!";

            setTimeout(() => {
                tutorialBox.style.display = "none";
            }, 1500);
        }

        enemies.forEach(enemy => {

            if (!enemy.isAlive) return;

            if (checkCollision(characterElement, enemy.el)) {
                enemy.takeDamage(20);
            }

        });
    }

    // Interactuar
    if (e.code === "KeyE") {
        console.log("E pressed | canJump:", canJump, "| isChangingScene:", isChangingScene);

        if (canJump) {
            doJump("boss-scene.html");
            return;
        }
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

document.addEventListener("keyup", (e) => {
    const moveKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"];
    if (moveKeys.includes(e.code)) {
        player.stopWalkAnim();
    }
});