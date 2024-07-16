const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // c = context

// 16x9 ratio
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background/background_layer_1.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./assets/decorations/shop_anim.png",
  scale: 2.75,
  framesMax: 6
});

// player instantiation
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: { 
    x: 0,
    y: 0,
  }, 
  imageSrc: "./assets/sprites/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imgSrc: "./assets/sprites/Idle.png", 
      framesMax: 8
    },
    run: {
      imgSrc: "./assets/sprites/Run.png",
      framesMax: 8
    },
    jump: {
      imgSrc: "./assets/sprites/Jump.png",
      framesMax: 2
    }
  }
});

// enemy instantiation
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

// keys
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

// animation loop
function animate() {
  window.requestAnimationFrame(animate); // infinite loop
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  // enemy.update(); // comment out until imgSrc associated

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  player.image = player.sprites.idle.image;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5; // -5px per frame
    player.image = player.sprites.run.image; // breaks game when trying to switch from idle/run sprites
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5; // 5px per frame
    player.image = player.sprites.run.image; // breaks game when trying to switch from idle/run sprites
  }

  if (player.velocity.y < 0) {
    player.image = player.sprites.jump.image;
    player.framesMax = player.sprites.jump.framesMax;
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // detect for collision
  // player
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // enemy
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// animate :P
animate();

window.addEventListener("keydown", (event) => {
  // console.log(event.key);
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -18; // negates gravity causing jump effect
      break;
    case " ":
      player.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -18; // negates gravity causing jump effect
      break;
    case "ArrowDown":
      // enemy.isAttacking = true; //hides sword
      enemy.attack();
      break;
  }
  // console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  // console.log(event.key);
});
