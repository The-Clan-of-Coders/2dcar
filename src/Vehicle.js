/**
 * Created by jonas on 2017-07-03
 *
 * ported from tutorial by bzroom on http://www.gamedev.net/topic/470497-2d-car-physics-tutorial/
 */

//our vehicle object
function Vehicle(halfSize, mass) {

	RigidBody.call(this, halfSize, mass);

  this.wheels = [];

	//front wheels
	this.wheels[0] = new Wheel(new Vec(halfSize.x, halfSize.y), 0.5);
	this.wheels[1] = new Wheel(new Vec(-halfSize.x, halfSize.y), 0.5);

	//rear wheels
	this.wheels[2] = new Wheel(new Vec(halfSize.x, -halfSize.y), 0.5);
	this.wheels[3] = new Wheel(new Vec(-halfSize.x, -halfSize.y), 0.5);

}
Vehicle.prototype = Object.create(RigidBody.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.handleCollision = function() {
	for (var i=0; i<this.wheels.length; i++) {
		this.wheels[i].wheelSpeed = 0;
		this.wheels[i].wheelTorque = 0;
	}
	//this.forces = new Vec(0, 0);
};

Vehicle.prototype.setSteering = function(steering) {
	var steeringLock = 0.75;

	//apply steering angle to front wheels
	this.wheels[0].setSteeringAngle(-steering * steeringLock);
	this.wheels[1].setSteeringAngle(-steering * steeringLock);
};

Vehicle.prototype.setThrottle = function(throttle, allWheel) {
	var torque = 80;

	// if opposite of travel, apply braking too
	if (throttle) {
		var relativeGroundSpeed = this.worldToRelative(this.velocity);
		if (relativeGroundSpeed.y > 0 && throttle < 0) {
			// forwards and car is in reverse
			this.velocity = Vec.multiply(this.velocity, 0.97);
		}
		else if (relativeGroundSpeed.y < 0 && throttle > 0) {
			// backwards and car is in gear
			this.velocity = Vec.multiply(this.velocity, 0.97);
		}
	}

	//apply transmission torque to back wheels
	if (allWheel) {
		this.wheels[0].addTransmissionTorque(throttle * torque);
		this.wheels[1].addTransmissionTorque(throttle * torque);
	}

	this.wheels[2].addTransmissionTorque(throttle * torque);
	this.wheels[3].addTransmissionTorque(throttle * torque);

};

Vehicle.prototype.setBrakes = function(brakes) {
	console.log('barkes');
	var brakeTorque = 20;

	//apply brake torque apposing wheel vel
	for (var i=0; i<this.wheels.length; i++) {
		var wheelVel = this.wheels[i].getWheelSpeed();
		this.wheels[i].addTransmissionTorque(-wheelVel * brakeTorque * brakes);
		//if (brakes) {
		//	this.wheels[i].wheelSpeed = 0;
		//}

	}
};

Vehicle.prototype.update = function(timeStep) {
	for (var i=0; i<this.wheels.length; i++) {
		var worldWheelOffset = this.relativeToWorld(this.wheels[i].getAttachPoint());
		var worldGroundVel = this.pointVel(worldWheelOffset);
		var relativeGroundSpeed = this.worldToRelative(worldGroundVel);
		var relativeResponseForce = this.wheels[i].calculateForce(relativeGroundSpeed, timeStep);
		var worldResponseForce = this.relativeToWorld(relativeResponseForce);

		this.addForce(worldResponseForce, worldWheelOffset);

	}

	RigidBody.prototype.update.call(this, timeStep);
};
