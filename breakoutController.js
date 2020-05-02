"use strict";

var breakoutModel = new BreakoutModel(),
    breakoutView = new BreakoutView(),
    breakoutController = null;
var playGame = true;

function BreakoutController() {

	this.handleOrientation = function(event) {
		if(playGame) {
			//breakoutController.updateDeviceOrientationDebug(event);
			breakoutController.movePaddle(event);
		}
	};

	this.basicGame = function() {
		if(playGame) {
			//breakoutController.updateGameDebug();
			breakoutController.moveBall();
			breakoutController.handleCollision();
			breakoutController.drawComponents();
		}
	};

	this.handleKeypress = function(event) {
		if(event.keyCode === 37){
			breakoutModel.setPaddlePosition(breakoutModel.getPaddlePosition()-10); //updates paddle's position
		}
		if(event.keyCode === 39){
			breakoutModel.setPaddlePosition(breakoutModel.getPaddlePosition()+10);//right
		}
	};

	/*this.updateDeviceOrientationDebug = function(event) {
		var a = event.alpha;
		var b = event.beta;
		var g = event.gamma;
		document.getElementById("orientationDebug").innerText = "roll = "+a.toFixed(0)+", pitch = "+b.toFixed(0)+", yaw = "+g.toFixed(0);

	};

	this.updateGameDebug = function() {
		document.getElementById("positionDebug").innerText = "Paddle Position: "+ breakoutModel.getPaddlePosition().toFixed(0)+
															 ", Ball X: "+breakoutModel.getBallPosition()[0].toFixed(0)+
															 ", Ball Y: "+breakoutModel.getBallPosition()[1].toFixed(0);
	};*/ // RIP Debug text, you were very helpful

	this.movePaddle = function(event) {
		var tilt = event.gamma;

		var newPos = breakoutModel.getPaddlePosition()+tilt;
		if(newPos < breakoutView.getPaddleWidth()/2){
			newPos = breakoutView.getPaddleWidth()/2;
		}
		else if(newPos > document.getElementById("gameCanvas").width - breakoutView.getPaddleWidth()/2){
			newPos = document.getElementById("gameCanvas").width - breakoutView.getPaddleWidth()/2;
		}
		breakoutModel.setPaddlePosition(newPos); //updates paddle's position
	};

	this.moveBall = function() {
		breakoutModel.moveBall();
	};

	this.drawComponents = function() {
		breakoutView.clearCanvas();
		breakoutController.drawWall();
		breakoutView.drawPaddle(breakoutModel.getPaddlePosition());
		breakoutView.drawBall(breakoutModel.getBallPosition()[0], breakoutModel.getBallPosition()[1]);
	};

	this.drawWall = function() {
		var canvas = document.getElementById("gameCanvas");
		var blocks = breakoutModel.getBlocks(); //Returns an array of 4 arrays
		for(var i = 0; i < blocks.length; i++){
			var layer = blocks[i];
			for(var j = 0; j < layer.length; j++){
				var block = layer[j];
				if(block){
					breakoutView.drawBlock(((canvas.width/7)*j)+10, (i*60)+10, (canvas.width-10)/8);
				}
			}
		}
	};

	this.handleCollision = function() {
		var ballX = breakoutModel.getBallPosition()[0],
			ballY = breakoutModel.getBallPosition()[1],
			ballRadius = breakoutView.getBallRadius();
		var canvas = document.getElementById("gameCanvas");
		var blocks = breakoutModel.getBlocks();


		if(ballX <= ballRadius){ // left wall impact
			breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0] *= -1, breakoutModel.getBallSpeed()[1]);
		}
		else if(ballX >= canvas.width-ballRadius){ // right wall impact
			breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0] *= -1, breakoutModel.getBallSpeed()[1]);
		}
		if(ballY <= ballRadius){ // top impact
			breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0], breakoutModel.getBallSpeed()[1] *= -1);
		}
		else if(ballY >= canvas.height-ballRadius+50 && playGame){ // Bottom Impact
			playGame = false;
			if(window.confirm("You lose! Play again?")){
				breakoutController.resetGame();
				playGame = true;
			}
		}
		else if(ballY >= breakoutView.getPaddleFloat()-ballRadius){ // Paddle impact
			var paddleWidth = breakoutView.getPaddleWidth();
			if(ballX >= breakoutModel.getPaddlePosition()-paddleWidth/2 && ballX <= breakoutModel.getPaddlePosition()+paddleWidth/2){
				breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0], breakoutModel.getBallSpeed()[1] *= -1);
			}
		}
		for(var i = 0; i < blocks.length; i++){
			var layer = blocks[i];
			if(ballY >= (i*60)+10-breakoutView.getBallRadius() && ballY <= (i*60)+60+breakoutView.getBallRadius()){
				for(var j = 0; j < layer.length; j++){
					var block = layer[j];
					if(ballX >= (((canvas.width/7)*j)+10) && ballX <= (((canvas.width/7)*j)+10+((canvas.width-10)/8)) && block){
						if(breakoutModel.getBallSpeed()[1] === 1){
							breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0], breakoutModel.getBallSpeed()[1] *= -1);
						}
						else {
							breakoutModel.setBallSpeed(breakoutModel.getBallSpeed()[0], breakoutModel.getBallSpeed()[1] *= -1);
						}
						breakoutModel.getBlocks();
						breakoutModel.setBlock(i+1, j);
						if(breakoutController.checkWin()){
							playGame = false;
							if(window.confirm("You win! Play again?")){
								breakoutController.resetGame();
								breakoutModel.setSpeedMult(breakoutModel.getSpeedMult()+1);
								playGame = true;
							}
						}
					}
				}
			}
		}
	};

	this.init = function() {
		breakoutModel.applySpeedMult();
		console.log("Getting device type");
		if (typeof DeviceOrientationEvent.requestPermission === 'function') {
			console.log("iOS 13+ - Requesting perms");
			DeviceOrientationEvent.requestPermission().then(function(response) {
				if (response === "granted") {
					setInterval(breakoutController.basicGame, 1000/60);
					window.addEventListener("deviceorientation", breakoutController.handleOrientation, true);
				}
				else {
					window.alert("Sorry, you can't play this without giving gyroscope permission :(")
				}
			});
		}
		else {
			console.log("Non iPhone");
			if(DeviceOrientationEvent) {
				console.log("Has gyro - starting game");
				setInterval(breakoutController.basicGame, 1000/60);
				window.addEventListener("deviceorientation", breakoutController.handleOrientation, true);
			}
			else {
				console.log("No gyro - Entering ballsim mode");
				setInterval(breakoutController.basicGame, 1000/60);
			}
		}
	};

	this.invertPlay = function() {
		playGame = !playGame;
	};

	this.resetGame = function() {
		breakoutModel.setBallSpeed(1, 1);
		breakoutModel.applySpeedMult();
		breakoutView.clearCanvas();
		breakoutModel.setBallPosition(document.getElementById("gameCanvas").width/2, document.getElementById("gameCanvas").height/2);
		//breakoutController.updateGameDebug();
		breakoutController.drawComponents();
		console.log("Game Reset");
	};

	this.checkWin = function() {
		for(var i = 0; i < blocks.length; i++){
			var layer = blocks[i];
			for(var j = 0; j < layer.length; j++){
				var block = layer[j];
				if(block){
					return false;
				}
			}
		}
		return true;
	};
}
breakoutController = new BreakoutController();
var permButton = document.getElementById("getPermission");
breakoutController.drawComponents();
permButton.addEventListener("click", breakoutController.init);
document.addEventListener("keydown", breakoutController.handleKeypress);