import kaboom from "kaboom";
import LEVELS from './config/level';
import mario from './utils/mario';
import bump from './utils/bump';
import enemy from './utils/enimes';
import patrol from './utils/patrol';
const instance =kaboom({
  background: [134, 135, 247],
  // width: 400,
  // height: 230,
  scale: 2,
  
});

instance.fullscreen(true);

loadRoot("assets/");
loadAseprite("mario", "mario.png", "mario.json");
loadAseprite("enemies", "enemies.png", "enemies.json");
loadSprite("titles", "titles.png");
loadSprite("ground", "ground.png");
loadSprite("questionBox", "questionBox.png");
loadSprite("emptyBox", "emptyBox.png");
loadSprite("brick", "brick.png");
loadSprite("coin", "coin.png");
loadSprite("bigMushy", "bigMushy.png");
loadSprite("pipeTop", "pipeTop.png");
loadSprite("pipeBottom", "pipeBottom.png");
loadSprite("shrubbery", "shrubbery.png");
loadSprite("hill", "hill.png");
loadSprite("cloud", "cloud.png");
loadSprite("castle", "castle.png");
loadSound("game_sound", "audio/music_game.ogg");
loadSound("bump_sound", "audio/bump.ogg");
loadSound("jump_sound", "audio/small.ogg");

const levelConf = {
  // grid size
  width: 16,
  height: 16,
  
  // define each object as a list of components
  "=": () => [
    sprite("ground"),
    area(),
    solid(),
    origin("bot"),
    "ground"
  ],
  "-": () => [
    sprite("brick"),
    area(),
    solid(),
    origin("bot"),
    "brick"
  ],
  "H": () => [
    sprite("castle"),
    area({ width: 1, height: 240 }),
    origin("bot"),
    "castle"
  ],
  "?": () => [
    sprite("questionBox"),
    area(),
    solid(),
    origin("bot"),
    'questionBox',
    'coinBox'
  ],
  "b": () => [
    sprite("questionBox"),
    area(),
    solid(),
    origin("bot"),
    'questionBox',
    'mushyBox'
  ],
  "!": () => [
    sprite("emptyBox"),
    area(),
    solid(),
    bump(),
    origin("bot"),
    'emptyBox'
  ],
  "c": () => [
    sprite("coin"),
    area(),
    solid(),
    bump(64, 8),
    cleanup(),
    lifespan(0.4, { fade: 0.01 }),
    origin("bot"),
    "coin"
  ],
  "M": () => [
    sprite("bigMushy"),
    area(),
    solid(),
    patrol(10000),
    body(),
    cleanup(),
    origin("bot"),
    "bigMushy"
  ],
  "|": () => [
    sprite("pipeBottom"),
    area(),
    solid(),
    origin("bot"),
    "pipe"
  ],
  "_": () => [
    sprite("pipeTop"),
    area(),
    solid(),
    origin("bot"),
    "pipe"
  ],
  "E": () => [
    sprite("enemies", { anim: 'Walking' }),
    area({ width: 16, height: 16 }),
    solid(),
    body(),
    patrol(50),
    enemy(),
    origin("bot"),
    "badGuy"
  ],
  "P": () => [
    sprite("enemies", { anim: 'Walk' }),
    area({ width: 16, height: 16 }),
    solid(),
    body(),
    patrol(400, 400,-1,'y'),
    enemy(),
    origin("top"),
    "Walk"
  ],
  "p": () => [
    sprite("mario", { frame: 0 }),
    area({ width: 16, height: 16 }),
    body(),
    mario(),
    bump(150, 20, false),
    origin("bot"),
    "player"
  ]
};

scene("start", () => {


  add([
    text("Click enter to start the game", { size: 24}),
    pos(center()),
    origin("center"),
    layer('ui'),
    color(255,255,255)
  ])
  onKeyRelease('enter', () => {
    go("game");
  })
})

scene("game", (levelNumber = 0) => {
  const gameSound = play("game_sound", { loop: true});
  

  gameSound.play();
  layers([
    "bg",
    "game",
    "ui",
  ], "game");


  const level = addLevel(LEVELS[levelNumber], levelConf);

  add([
    sprite("cloud"),
    pos(20, height() - 200),
    layer("bg")
  ]);
  add([
    sprite("cloud"),
    pos(70, height() - 140),
    layer("bg")
  ]);
  add([
    sprite("cloud"),
    pos(width() / 3, height() - 220),
    
    layer("bg")
  ]);
  add([
    sprite("titles"),
    pos(width()/2, height() / 4),
    area({ width: 80, height: 80}),
    layer("bg")
  ]);

  add([
    sprite("hill"),
    pos(32, height() - 20),
    layer("bg"),
    origin("bot")
  ])

  add([
    sprite("shrubbery"),
    pos(200, height() - 22),
    layer("bg"),
    origin("bot")
  ])

  const player = level.spawn("p", 1, 10)

  const SPEED = 120;

  onKeyDown("right", () => {
    if (player.isFrozen) return;
    player.flipX(false);
    player.move(SPEED, 0);
  });

  onKeyDown("left", () => {
    if (player.isFrozen) return;
    player.flipX(true);
    if (toScreen(player.pos).x > 20) {
      player.move(-SPEED, 0);
    }
  });

  onKeyPress("space", () => {
    const jumpSound = play("jump_sound");
    if (player.isAlive && player.grounded()) {
      jumpSound.play();
      player.jump();
      canSquash = true;
    }else {
      jumpSound.stop();
    }
  });


  player.onUpdate(() => {
    var currCam = camPos();
    if (currCam.x < player.pos.x) {
      camPos(player.pos.x, currCam.y);
    }

    if (player.isAlive && player.grounded()) {
      canSquash = false;
    }

    if (player.pos.y > height() - 20){
      gameSound.stop();
      killed();
    }
   
  });

  let canSquash = false;

  player.collides("badGuy", (baddy) => {   
    if (baddy.isAlive == false) return;
    if (player.isAlive == false) return;
    if (canSquash) {
      baddy.squash();
    } else {
      if (player.isBig) {
        player.smaller();
      } else {
        gameSound.stop()
        killed();
      }
    }
  });

  function killed() {
    if (player.isAlive == false) return;
    player.die();
    add([
      text("Game Over :(", { size: 24 }),
      pos(toWorld(vec2(160, 120))),
      color(255, 255, 255),
      origin("center"),
      layer('ui'),
    ]);
    wait(2, () => {
      go("game");
    })
  }


  player.on("headbutt", (obj) => {
    if (obj.is("questionBox")) {
      if (obj.is("coinBox")) {
        let coin = level.spawn("c", obj.gridPos.sub(0, 1));
        coin.bump();
      } else
      if (obj.is("mushyBox")) {
        level.spawn("M", obj.gridPos.sub(0, 1));
      }
      var pos = obj.gridPos;
      destroy(obj);
      var box = level.spawn("!", pos);
      box.bump();
    }
  });

  player.collides("bigMushy", (mushy) => {
    destroy(mushy);
    player.bigger();
  });


  player.collides("castle", (castle, side) => {
    player.freeze();
    add([
      text("Well Done!", { size: 24 }),
      pos(toWorld(vec2(160, 120))),
      color(255, 255, 255),
      origin("center"),
      layer('ui'),
    ]);
    wait(1, () => {
      let nextLevel = levelNumber + 1;

      if (nextLevel >= LEVELS.length) {
      } else {

        go("game", nextLevel);
      }
    })
  });


});

go("start")