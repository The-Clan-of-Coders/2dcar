/**
 * Created by jonas on 2017-07-03
 *
 * ported from tutorial by bzroom on http://www.gamedev.net/topic/470497-2d-car-physics-tutorial/
 */

function Wheel(position, radius) {

	this.forwardAxis = new Vec(0, 1);
	this.sideAxis = new Vec(-1, 0);
	this.steeringAngle = 0;

	this.wheelTorque = 0;
	this.position = position;
	this.setSteeringAngle(0);
	this.wheelSpeed = 0;
	this.wheelRadius = radius;
	this.wheelInertia = radius * radius; //fake value

}

Wheel.prototype.setSteeringAngle = function(newAngle) {
	this.steeringAngle = newAngle;

	//foward vector
	this.forwardAxis.x = 0;
	this.forwardAxis.y = 1;
	//side vector
	this.sideAxis.x = -1;
	this.sideAxis.y = 0;

	this.forwardAxis.rotate(newAngle);
	this.sideAxis.rotate(newAngle);
};

Wheel.prototype.addTransmissionTorque = function(newValue) {
	this.wheelTorque += newValue;
};

Wheel.prototype.getWheelSpeed = function() {
	return this.wheelSpeed;
};

Wheel.prototype.getAttachPoint = function() {
	return this.position;
};

Wheel.prototype.calculateForce = function(relativeGroundSpeed, timeStep) {
	//calculate speed of tire patch at ground
	var patchSpeed = Vec.multiply(Vec.reverse(this.forwardAxis), this.wheelSpeed * this.wheelRadius);

	//get velocity difference between ground and patch
	var velDifference = Vec.add(relativeGroundSpeed, patchSpeed);

	//project ground speed onto side axis
	var sideVel = velDifference.project(this.sideAxis);
	var projForward = velDifference.project(this.forwardAxis);
	var forwardMag = projForward.mag;
	var forwardVel = projForward.vec;

	//calculate super fake friction forces
	//calculate response force
	var responseForce = Vec.multiply(Vec.reverse(sideVel.vec), 4);
	responseForce = Vec.subtract(responseForce, forwardVel);

	//calculate torque on wheel
	this.wheelTorque += forwardMag * this.wheelRadius;

	//integrate total torque into wheel
	this.wheelSpeed += (this.wheelTorque / this.wheelInertia) * timeStep;

	//clear our transmission torque accumulator
	this.wheelTorque = 0;

	//return force acting on body
	return responseForce;
};
