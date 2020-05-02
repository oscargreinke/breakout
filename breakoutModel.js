"use strict";

function BreakoutModel() {
    var paddlePosition = 250;
    var ballPosition = [250, 400]; //x, y
    var ballSpeed = [1, -1]; //x, y
	var initialSpeed = [1, -1];
	var speedMult = 4;
	var blocks1 = [true, true, true, true, true, true, true],
		blocks2 = [true, true, true, true, true, true, true],
		blocks3 = [true, true, true, true, true, true, true],
		blocks4 = [true, true, true, true, true, true, true];

    this.getPaddlePosition = function() {
        return paddlePosition;
    };

    this.setPaddlePosition = function(x) {
        paddlePosition = x;
    };

    this.getBallPosition = function() {
        return ballPosition;
    };

    this.setBallPosition = function(x, y) {
        ballPosition[0] = x;
		ballPosition[1] = y;
    };

    this.setBallSpeed = function(x, y) {
		ballSpeed = [x, y];
	};

    this.getBallSpeed = function() {
		return ballSpeed;
	};

    this.applySpeedMult = function() {
		ballSpeed[0] = initialSpeed[0] * speedMult;
		ballSpeed[1] = initialSpeed[1] * speedMult;
	};

    this.setSpeedMult = function(value) {
    	speedMult = value;
	};

    this.getSpeedMult = function(){
    	return speedMult;
	};

    this.moveBall = function() {
		ballPosition[0] += ballSpeed[0];
		ballPosition[1] += ballSpeed[1];
	};

    this.getBlocks = function() {
		return [blocks1, blocks2, blocks3, blocks4];
	};

    this.setBlock = function(row, col) {
		if(row === 1){
			blocks1[col] = false;
		}
		else if(row === 2){
			blocks2[col] = false;
		}
		else if(row === 3){
			blocks3[col] = false;
		}
		else if(row === 4){
			blocks4[col] = false;
		}
	};
}