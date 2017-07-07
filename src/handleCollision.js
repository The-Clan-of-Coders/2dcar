
function applyCollision(car1, car2, collisionV, overlapV) {

	// separate cars
	if (car2.immovable) {
		car1.position.x -= overlapV.x * 1.1;
		car1.position.y -= overlapV.y * 1.1;
	}
	else {
		car1.position.x -= overlapV.x;
		car1.position.y -= overlapV.y;
		car2.position.x += overlapV.x;
		car2.position.y += overlapV.y;
	}
	// Calculate relative velocity
	var rv = car2.velocity.subtract(car1.velocity);

	// Calculate relative velocity in terms of the normal direction
	//collisionV.normalize();
	var velAlongNormal = rv.dotProduct(collisionV);

	// Calculate restitution
	var e = 0.2;//min( A.restitution, B.restitution)

	// Calculate impulse scalar
	var j = (-(1 + e) * velAlongNormal) / (1 / car1.mass + 1 / car2.mass);

	//console.log(j);
	if (Math.abs(j) < 20) {
		// too small to worry about
		return j;
	}

	// Apply impulse
	var impulse = Vec.multiply(collisionV, j);
  // point of collision
	var cp = { x: (car1.position.x - car2.position.x) / 2, y: (car1.position.y - car2.position.y) / 2 };

	if (car2.immovable) {
		// TODO: better calculation
		// wall
    cp.x = car1.position.x;
    cp.y = car1.position.y;

		/*if (cp.x > cp.y) {
			cp.x = car1.position.x;
		}
		else {
			cp.y = car1.position.y;
		}*/
	}

	car1.velocity = car1.velocity.subtract(Vec.multiply(impulse, 1 / car1.mass));
	car1.angularVelocity = (cp.x * rv.y - cp.y * rv.x) / (cp.x * cp.x + cp.y * cp.y);
  //car1.addForce(Vec.multiply(impulse, 1 / car1.mass), cp);
	car1.handleCollision();


	if (!car2.immovable) {
		car2.velocity = car2.velocity.add(Vec.multiply(impulse, 1 / car2.mass));
		car2.angularVelocity = (cp.x * -rv.y - cp.y * -rv.x) / (cp.x * cp.x + cp.y * cp.y);
    //car2.addForce(Vec.multiply(impulse, 1 / car2.mass), cp);
		car2.handleCollision();
	}

	return j;

}
