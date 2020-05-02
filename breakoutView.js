"use strict";

function BreakoutView() {
	var canvas = document.getElementById("gameCanvas");
	var ctx = canvas.getContext("2d");
	var paddleWidth = 100,
		paddleHeight = 25,
		ballRadius = 25;
	var	blockHeight = 50; //this is in pixels


    this.drawPaddle = function(x) {
    	ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.fillRect(x-paddleWidth/2, canvas.height-(paddleHeight+10), paddleWidth, paddleHeight);
    };

    this.drawBall = function(x, y) {
    	ctx.beginPath();
		ctx.fillStyle = "#000000";
		ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
		ctx.fill();
    };

    this.drawBlock = function(x, y, blockWidth) {
		ctx.beginPath();
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(x, y, blockWidth, blockHeight);
		ctx.strokeStyle = "#000000";
		ctx.rect(x, y, blockWidth, blockHeight);
		ctx.stroke();
	};

    this.getPaddleWidth = function() {
		return paddleWidth;
	};

	this.getPaddleHeight = function() {
		return paddleHeight;
	};

	this.getPaddleFloat = function() {
		return canvas.height-(paddleHeight+10);
	};

	this.getBallRadius = function() {
		return ballRadius;
	};

    this.clearCanvas = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	};
}