/**
 * Created by jonas on 2015-08-17.
 */

function Car(halfSize, mass) {

	this.health = 1000;

	Vehicle.call(this, halfSize, mass);

	this.carId = 'car' + ('' + Math.random()).substring(2);

	//this.drawBody(bodyType, halfSize, gradientId);

  this.origChassisPoints = [
    new Vec(this.rect.x + this.rect.width/8,this.rect.y - this.rect.height/8),
    new Vec(this.rect.x,this.rect.y),
    new Vec(this.rect.x, this.rect.y + this.rect.height),
    new Vec(this.rect.x + this.rect.width/4, this.rect.y + 5*this.rect.height/4),
    new Vec(this.rect.x + 3*this.rect.width/4, this.rect.y + 5*this.rect.height/4),
    new Vec(this.rect.x + this.rect.width, this.rect.y + this.rect.height),
    new Vec(this.rect.x + this.rect.width, this.rect.y),
    new Vec(this.rect.x + 7*this.rect.width/8, this.rect.y - this.rect.height/8)
  ];

	this.currChassisPoints = [];
	for (var i = 0; i < this.origChassisPoints.length; i++) {
		this.currChassisPoints.push(new Vec(this.origChassisPoints[i].x, this.origChassisPoints[i].y));
	}

}
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

Car.prototype.drawBody = function(ctx, color) {

	ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.angle);

	// tires
	var w = 7;
	var h = w*2;
	ctx.fillStyle = '#333';

	ctx.fillRect(-this.halfSize.x - w/2, -this.halfSize.y - h/2, w, h);
	ctx.fillRect(this.halfSize.x - w/2, -this.halfSize.y - h/2, w, h);

	var dx = this.halfSize.x;
	var dy = this.halfSize.y;

	ctx.translate(dx, dy);
	ctx.rotate(this.steering);
	ctx.fillRect(-w/2, -h/2, w, h);
	ctx.rotate(-this.steering);
	ctx.translate(-dx, -dy);

	ctx.translate(-dx, dy);
	ctx.rotate(this.steering);
	ctx.fillRect(-w/2, -h/2, w, h);
	ctx.rotate(-this.steering);
	ctx.translate(dx, -dy);

	// chasis
	ctx.fillStyle = color || '#6F6';
  ctx.beginPath();
  ctx.moveTo(this.origChassisPoints[0].x, this.origChassisPoints[0].y);
  for (var i = 1; i < this.origChassisPoints.length; i++) {
    ctx.lineTo(this.origChassisPoints[i].x, this.origChassisPoints[i].y);
  }
  ctx.closePath();
  ctx.fill();


	ctx.restore();

};

Car.prototype.kill = function() {
	var thisCar = document.getElementById(this.carId);
	svg1.removeChild(thisCar);
};

Car.prototype.damagePoint = function(collisionV, j, cp, pts) {

	var rotatedCollisionV = Vec.rotate(collisionV, this.angle);
	// find closest point of contact
	var pt = 0;
	var minDist = 10000;
	for (var i=0; i<pts.length; i++) {
		var dist = Math.sqrt(Math.pow(cp.x - pts[i].x, 2) + Math.pow(cp.y - pts[i].y, 2));
		if (dist < minDist) {
			pt = i;
			minDist = dist;
		}
	}
	var damage = 0;
	if (pt === 3 || pt === 4) {
		// front end
		damage = j*4;
	}
	else if (pt === 2 || pt === 5) {
		// sides
		damage = j*1;
	}
	else {
		// rear
		damage = j/4;
	}

	this.health += damage;
	if (this.health < 0 && !this.dead) {
		this.dead = true;
	}
	return damage;

};

Car.prototype.setThrottle = function(throttle) {

	this.oldThrottle = throttle;
	Vehicle.prototype.setThrottle.call(this, throttle);

};

Car.prototype.init = function(timeStep) {
	Car.prototype.update.call(this, timeStep);
};

Car.prototype.update = function(timeStep) {

	// update points of the chassis
	for (var i = 0; i < this.currChassisPoints.length; i++) {
		// TODO: no new vector here
		this.currChassisPoints[i] = Vec.rotate(this.origChassisPoints[i], this.angle);
		this.currChassisPoints[i].x += this.position.x;
		this.currChassisPoints[i].y += this.position.y;
	}

	Vehicle.prototype.update.call(this, timeStep);

};
