// ----------------------- GLOBAL CONST -------------------
const offsetXpos = -600;
const offsetYpos = -3200;
const aspectRatioGlobal = 30; // Aspect ratio modified origianl
let speed = 3;
let blinkSpeed = 5;
let lastKey = "w";
const collisionsMap = [];
const boundariesArray = [];

let moving = true;

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
    ctx.fillStyle = "rgba(255,50,0,0.5)"; // color&opacity of boundaries if drawn

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
class Sprite {
  constructor(x, y, image, frames) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.ctx;
    this.frames = frames; // max different sprites in case there is an animation
    this.elapsed = 0;
    this.frameLoop = 0; // initial sprite
    this.image.onload = () => {
      this.width = this.image.width / this.frames;
      this.height = this.image.height;
    };
  }
  draw(ctx) {
    if (this.frames == 1) ctx.drawImage(this.image, this.x, this.y);
    else {
      ctx.drawImage(
        this.image,
        this.frameLoop * this.width,
        0,
        this.image.width / this.frames,
        this.image.height,
        this.x,
        this.y,
        (this.image.width / this.frames) * 2,
        this.image.height * 2
      );
      //console.log(this.frameLoop);
      if (this.frames > 1) this.elapsed++;
      if (this.elapsed % 10 === 0) {
        if (this.frameLoop < this.frames - 1) this.frameLoop++;
        else this.frameLoop = 0;
      }
    }
  }
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
    }
  });
});

function rectangularCollisionTest(rectangle1, rectangle2, rect2x, rect2y) {
  return (
    rectangle1.x + rectangle1.width + rectangle1.width / 3 >= rect2x &&
    rectangle1.x + rectangle1.width / 1.5 <= rect2x + rectangle2.width &&
    rectangle1.y <= rect2y + rectangle2.height &&
    rectangle1.y + rectangle1.height * 2 >= rect2y
  );
}
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
window.addEventListener("click", (event) => {
  mousePosX = event.clientX;
  mousePosY = event.clientY;
  console.log(" Mouse : (" + mousePosX + "," + mousePosY + ")");
});
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
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
  const playerImageMoving = new Image();

  backgroundImage.src = "Tiles/finalMapTile.png";
  playerImage.src = "img/character/playerIdle.png";
  playerImage.sry = "img/character/playerRunning.png";
  const background = new Sprite(offsetXpos, offsetYpos, backgroundImage, 1);
  const movables = [background, ...boundariesArray];

  const player = new Sprite(
    myCanvas.width / 2 - 288 / 12, // 288 and 240 is the size of the player's image
    myCanvas.height / 2 - 240 / 2,
    playerImage,
    6
  );

  function animationLoop() {
    window.requestAnimationFrame(animationLoop);

    background.draw(ctx);
    //----------------- UNCOMMENT TO DRAW COLLISION WALLS  --------------

    // boundariesArray.forEach((boundary) => {
    //   if (rectangularCollisionTest(player, boundary, boundary.x, boundary.y)) {
    //     console.log("colliding");
    //   }
    //   boundary.draw(ctx);
    // });

    //----------------- UNCOMMENT TO DRAW COLLISION WALLS  --------------

    player.draw(ctx);

    // ----------------------- CHARACTER MOVEMENT -------------------

    if (keys.w.pressed == true) {
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x,
            boundary.y + speed // we add speed so we can check the future position, if there is collision
          )
        ) {
          moving = false;
          break;
        } // check if future position is valid
      }
      if (moving == true) {
        // if valid, we let our player move
        movables.forEach((movable) => {
          movable.y += speed;
        });
      } else moving = true;
    }

    if (keys.s.pressed == true) {
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x,
            boundary.y - speed
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.y -= speed;
        });
      } else moving = true;
    }

    if (keys.a.pressed == true) {
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x + speed,
            boundary.y
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.x += speed;
        });
      } else moving = true;
    }

    if (keys.d.pressed == true) {
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];
        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x - speed,
            boundary.y
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.x -= speed;
        });
      } else moving = true;
    }
    if (keys.space.pressed == true) {
      switch (lastKey.key) {
        case "w":
          movables.forEach((movable) => {
            movable.y += speed * blinkSpeed;
          });

          break;
        case "s":
          movables.forEach((movable) => {
            movable.y -= speed * blinkSpeed;
          });
          break;
        case "a":
          movables.forEach((movable) => {
            movable.x += speed * blinkSpeed;
          });
          break;
        case "d":
          movables.forEach((movable) => {
            movable.x -= speed * blinkSpeed;
          });
          break;

        default:
          break;
      }
    }
  }

  animationLoop();
};
