// ----------------------- GLOBAL CONST -------------------
const offsetXpos = 0;
const offsetYpos = 0;
const aspectRatioGlobal = 30; // Aspect ratio modified origianl
let speed = 1;
let blinkSpeed = 5;
let lastKey = "w";
const collisionsMap = [];
const boundariesArray = [];

// ----------------------- CLASSES -------------------
class Boundary {
  constructor(x, y) {
    this.aspectRatio = aspectRatioGlobal; // size of each tile
    this.x = x;
    this.y = y;
    this.width = this.aspectRatio;
    this.height = this.aspectRatio;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Sprite {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.ctx;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
  }
}
class MainChar {
  constructor(level, hp, attack, isGodModeEnabled) {
    this.level = level;
    this.hp = hp;
    this.attack = attack;
    this.isGodModeEnabled = isGodModeEnabled;
  }
  baseAttack() {}
  blink(distance) {}
}

// ----------------------- COLLISIONS -------------------

//collisions is an array declared at collisions.js . Created thanks to Tiled map tool
//100 tiles of width, so we create an array of 100 tiles per row

for (i = 0; i < collisions.length; i += 100) {
  collisionsMap.push(collisions.slice(i, 100 + i));
}
collisionsMap.forEach((collisionsRow, k) => {
  collisionsRow.forEach((collisionBlock, j) => {
    if (collisionBlock === 1025) {
      boundariesArray.push(
        new Boundary(
          j * aspectRatioGlobal + offsetXpos,
          k * aspectRatioGlobal + offsetYpos
        )
      );
      console.log("Peta?");
    }
  });
});
// ----------------------- EVENTS -------------------

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
  r: {
    pressed: false,
  },
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      console.log("W is pressed");
      keys.w.pressed = true;
      lastKey = e;
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = e;
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = e;
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = e;
      break;
    case " ":
      keys.space.pressed = true;

      break;
    case "f":
      keys.f.pressed = true;
      lastKey = e;
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;

      break;
    case "f":
      keys.f.pressed = false;
      break;

    default:
      break;
  }
});

// ----------------------- ANIMATION LOOP -------------------

window.onload = () => {
  const myCanvas = document.querySelector("canvas");
  const ctx = myCanvas.getContext("2d");

  const backgroundImage = new Image();
  const playerImage = new Image();

  backgroundImage.src = "Tiles/finalMapTile.png";
  playerImage.src = "img/character/playerIdle.png";
  const background = new Sprite(offsetXpos, offsetYpos, backgroundImage);

  function animationLoop() {
    window.requestAnimationFrame(animationLoop);

    background.draw(ctx);
    boundariesArray.forEach((boundary) => {
      boundary.draw(ctx);
    });

    // ctx.drawImage(backgroundImage, -400, -1200); //-350, -250

    ctx.drawImage(
      playerImage,
      0,
      0,
      playerImage.width / 6,
      playerImage.height,
      myCanvas.width / 2 - playerImage.width / 12,
      myCanvas.height / 2 - playerImage.height / 2,
      (playerImage.width / 6) * 2,
      playerImage.height * 2
    );
    // ----------------------- CHARACTER MOVEMENT -------------------
    if (keys.w.pressed == true) background.y += speed;

    if (keys.s.pressed == true) background.y -= speed;

    if (keys.a.pressed == true) background.x += speed;

    if (keys.d.pressed == true) background.x -= speed;

    if (keys.space.pressed == true) {
      console.log(lastKey);
      switch (lastKey.key) {
        case "w":
          background.y += speed * blinkSpeed;
          break;
        case "s":
          background.y -= speed * blinkSpeed;
          break;
        case "a":
          background.x += speed * blinkSpeed;
          break;
        case "d":
          background.x -= speed * blinkSpeed;
          break;

        default:
          break;
      }
    }
    console.log("Char/BG Pos : (" + background.y + "," + background.x + ")");
  }

  animationLoop();
};
