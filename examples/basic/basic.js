
var canvas, ctx, car, enemies, walls;

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

  car = new Car({ x: 10, y: 20 }, 2);
  car.position.x = 100;
  car.position.y = 100;

  enemies = [];
  enemies.push(new Car({ x: 12, y: 16}, 2));
  enemies[enemies.length - 1].position.x = 400;
  enemies[enemies.length - 1].position.y = 100;

  walls = [];

  walls.push(new RigidBody({ x: 40, y: 40 }, 10000, true));
	walls[walls.length - 1].position.x = 300;
	walls[walls.length - 1].position.y = 300;
  walls[walls.length - 1].calculateBoundaries();

  walls.push(new RigidBody({ x: 400, y: 40 }, 10000, true));
	walls[walls.length - 1].position.x = 500;
	walls[walls.length - 1].position.y = 500;
  walls[walls.length - 1].calculateBoundaries();

  requestAnimationFrame(step);
}

function step() {

	var steering = 0;
	var throttle = 0;
	if (!car.dead) {
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
	car.setSteering(steering);
	car.setThrottle(throttle);

  car.update(20 / 1000);
  for (var e = 0; e < enemies.length; e++) {
    enemies[e].update(20 / 1000);
  }

  var collided, normalVec;

  for (e = 0; e < enemies.length; e++) {
    collided = checkCollision3(car.currChassisPoints, enemies[e].currChassisPoints);
    if (collided) {
      normalVec = new Vec(collided.normal.x, collided.normal.y);
      normalVec.normalize();
      impact = applyCollision(
        car,
        enemies[e],
        normalVec,
        Vec.multiply(normalVec, collided.overlap),
        car.currChassisPoints
      );
    }

  }

  for (var w = 0; w < walls.length; w++) {
    collided = checkCollision3(car.currChassisPoints, walls[w].boundaries);
    if (collided) {
      normalVec = new Vec(collided.normal.x, collided.normal.y);
      normalVec.normalize();
      impact = applyCollision(
        car,
        walls[w],
        normalVec,
        Vec.multiply(normalVec, collided.overlap),
        car.currChassisPoints
      );
    }
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


  // clear rect
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw walls
  for (var i = 0; i < walls.length; i++) {
    ctx.fillStyle = '#933';
    ctx.fillRect(
      walls[i].position.x - walls[i].halfSize.x,
      walls[i].position.y - walls[i].halfSize.y,
      2 * walls[i].halfSize.x,
      2 * walls[i].halfSize.y
    );
  }

  // draw other cars
  for (var e = 0; e < enemies.length; e++) {
    enemies[e].drawBody(ctx, '#339');
  }

  // draw cars
  car.drawBody(ctx);

  // fps
  ctx.font = "14px Courier";
  ctx.fillText(fps.toFixed(1) + "fps", canvas.width - 100, 14);

}
