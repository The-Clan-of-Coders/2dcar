
var canvas, ctx, playerCar, enemies, walls;

var lastCalledTime, fps;

function initGame() {

  initSteering();

  canvas = document.getElementById('myCanvas');
  ctx = document.getElementById('myCanvas').getContext('2d');

  function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	resizeCanvas();

  playerCar = new Car({ x: 10, y: 20 }, 2);
  playerCar.position.x = 100;
  playerCar.position.y = 100;
  playerCar.angle = -Math.PI/2;

  enemies = [];
  enemies.push(new Car({ x: 12, y: 16}, 2));
  enemies[enemies.length - 1].position.x = 400;
  enemies[enemies.length - 1].position.y = 100;

  walls = [];

  walls.push(new RigidBody({ x: 20, y: 1400 }, 1000, true));
	walls[walls.length - 1].position.x = 10;
	walls[walls.length - 1].position.y = 700;
  walls[walls.length - 1].calculateBoundaries();

  walls.push(new RigidBody({ x: 1400, y: 20 }, 1000, true));
	walls[walls.length - 1].position.x = 700;
	walls[walls.length - 1].position.y = 10;
  walls[walls.length - 1].calculateBoundaries();

  walls.push(new RigidBody({ x: 40, y: 40 }, 1000, true));
	walls[walls.length - 1].position.x = 300;
	walls[walls.length - 1].position.y = 300;
  walls[walls.length - 1].calculateBoundaries();

  walls.push(new RigidBody({ x: 400, y: 40 }, 1000, true));
	walls[walls.length - 1].position.x = 500;
	walls[walls.length - 1].position.y = 500;
  walls[walls.length - 1].calculateBoundaries();

  requestAnimationFrame(step);
}

function initObjects() {
  playerCar.initStep();
  for (var e = 0; e < enemies.length; e++) {
    enemies[e].initStep();
  }
}

function step() {

  initObjects();

	var steering = 0;
	var throttle = 0;
	if (!playerCar.dead) {
		if (KEY_LEFT) {
			steering += 1;
		}
		if (KEY_RIGHT) {
			steering -= 1;
		}
		if (KEY_UP) {
			throttle += 1;
		}
		if (KEY_DOWN) {
			throttle -= 1;
		}
	}
	playerCar.setSteering(steering);
	playerCar.setThrottle(throttle);


  // check collisions for all entities
  var collided, normalVec;

  var e;
  for (e = 0; e < enemies.length; e++) {
    checkCollision3(playerCar, enemies[e], true);
  }

  for (var w = 0; w < walls.length; w++) {
    checkCollision3(playerCar, walls[w], true);
    for (e = 0; e < enemies.length; e++) {
      checkCollision3(enemies[e], walls[w], true);
    }
  }

  // run step for all entities
  playerCar.update(20 / 1000);
  for (e = 0; e < enemies.length; e++) {
    enemies[e].update(20 / 1000);
  }

  render();

  requestAnimationFrame(step);
}

function render() {

  if (!lastCalledTime) {
     lastCalledTime = Date.now();
     fps = 0;
     return;
  }
  var delta = (Date.now() - lastCalledTime)/1000;
  lastCalledTime = Date.now();
  fps = 1/delta;

  ctx.translate(-playerCar.position.x + canvas.width/2, -playerCar.position.y + canvas.height/2);

  // clear rect
	ctx.clearRect(playerCar.position.x - canvas.width/2, playerCar.position.y - canvas.height/2, canvas.width, canvas.height);

  // draw walls
  for (var i = 0; i < walls.length; i++) {
    ctx.fillStyle = '#f66';
    ctx.fillRect(
      walls[i].position.x - walls[i].halfSize.x,
      walls[i].position.y - walls[i].halfSize.y,
      2 * walls[i].halfSize.x,
      2 * walls[i].halfSize.y
    );
  }

  // draw other cars
  for (var e = 0; e < enemies.length; e++) {
    enemies[e].drawBody(ctx, '#66f');
  }

  // draw car
  playerCar.drawBody(ctx);

  ctx.translate(playerCar.position.x - canvas.width/2, playerCar.position.y - canvas.height/2);

  // fps
  ctx.font = "14px Courier";
  ctx.fillText(fps.toFixed(1) + "fps", canvas.width - 100, 14);

}
