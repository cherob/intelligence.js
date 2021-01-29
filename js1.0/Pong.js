const THREE = require('three');

module.exports = class Game {
    // "constants"... 
    constructor() {
        this.WIDTH = 700
        this.HEIGHT = 500
        this.VIEW_ANGLE = 45
        this.ASPECT = this.WIDTH / this.HEIGHT
        this.NEAR = 0.1
        this.FAR = 10000
        this.FIELD_WIDTH = 1200
        this.FIELD_LENGTH = 3000
        this.BALL_RADIUS = 20
        this.PADDLE_WIDTH = 200
        this.PADDLE_HEIGHT = 30

        //get the scoreboard element.
        this.scoreBoard = document.getElementById('scoreBoard')

        this.score = {
            player1: 0,
            player2: 0
        };
        
        
        this.container = document.getElementById('container-pong');

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(0x9999BB, 1);
        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
        this.camera.position.set(0, 100, this.FIELD_LENGTH / 2 + 500);

        this.scene = new THREE.Scene();
        this.scene.add(this.camera);

        this.fieldGeometry = new THREE.CubeGeometry(this.FIELD_WIDTH, 5, this.FIELD_LENGTH, 1, 1, 1),
            this.fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x003300 });
        this.field = new THREE.Mesh(this.fieldGeometry, this.fieldMaterial);
        this.field.position.set(0, -50, 0);

        this.scene.add(this.field);
        this.paddle1 = this.addPaddle();
        this.paddle1.position.z = this.FIELD_LENGTH / 2;
        this.paddle2 = this.addPaddle();
        this.paddle2.position.z = -this.FIELD_LENGTH / 2;

        this.ballGeometry = new THREE.SphereGeometry(this.BALL_RADIUS, 16, 16)
        this.ballMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
        this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
        this.scene.add(this.ball);

        this.camera.lookAt(this.ball.position);

        this.mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
        this.scene.add(this.mainLight);

        this.camera.lookAt(this.ball.position);

        this.updateScoreBoard();
        this.startRender();

    }



    startBallMovement() {
        var direction = Math.random() > 0.5 ? -1 : 1;
        this.ball.$velocity = {
            x: 0,
            z: direction * 20
        };
        this.ball.$stopped = false;
    }

    processCpuPaddle() {
        this.ballPos = this.ball.position
        this.cpuPos = this.paddle2.position;

        if (this.cpuPos.x - 100 > this.ballPos.x) {
            this.cpuPos.x -= Math.min(this.cpuPos.x - this.ballPos.x, 6);
        } else if (this.cpuPos.x - 100 < this.ballPos.x) {
            this.cpuPos.x += Math.min(this.ballPos.x - this.cpuPos.x, 6);
        }
    }

    processBallMovement() {
        if (!this.ball.$velocity) {
            this.startBallMovement();
        }

        if (this.ball.$stopped) {
            return;
        }

        this.updateBallPosition();

        if (this.isSideCollision()) {
            this.ball.$velocity.x *= -1;
        }

        if (this.isPaddle1Collision()) {
            this.hitBallBack(this.paddle1);
        }

        if (this.isPaddle2Collision()) {
            this.hitBallBack(this.paddle2);
        }

        if (this.isPastPaddle1()) {
            this.scoreBy('player2');
        }

        if (this.isPastPaddle2()) {
            this.scoreBy('player1');
        }
    }

    isPastPaddle1() {
        return this.ball.position.z > this.paddle1.position.z + 100;
    }

    isPastPaddle2() {
        return this.ball.position.z < this.paddle2.position.z - 100;
    }

    updateBallPosition() {
        this.ballPos = this.ball.position;

        //update the ball's position.
        this.ballPos.x += this.ball.$velocity.x;
        this.ballPos.z += this.ball.$velocity.z;

        // add an arc to the ball's flight. Comment this out for boring, flat pong.
        this.ballPos.y = -((this.ballPos.z - 1) * (this.ballPos.z - 1) / 5000) + 435;
    }

    isSideCollision() {
        var ballX = this.ball.position.x,
            halfFieldWidth = this.FIELD_WIDTH / 2;
        return ballX - this.BALL_RADIUS < -halfFieldWidth || ballX + this.BALL_RADIUS > halfFieldWidth;
    }

    hitBallBack(paddle) {
        this.ball.$velocity.x = (this.ball.position.x - paddle.position.x) / 5;
        this.ball.$velocity.z *= -1;
    }

    isPaddle2Collision() {
        return this.ball.position.z - this.BALL_RADIUS <= this.paddle2.position.z &&
            this.isBallAlignedWithPaddle(this.paddle2);
    }

    isPaddle1Collision() {
        return this.ball.position.z + this.BALL_RADIUS >= this.paddle1.position.z &&
            this.isBallAlignedWithPaddle(this.paddle1);
    }

    isBallAlignedWithPaddle(paddle) {
        var halfPaddleWidth = this.PADDLE_WIDTH / 2,
            paddleX = paddle.position.x,
            ballX = this.ball.position.x;
        return ballX > paddleX - halfPaddleWidth &&
            ballX < paddleX + halfPaddleWidth;
    }

    scoreBy(playerName) {
        this.addPoint(playerName);
        this.updateScoreBoard();
        this.stopBall();
        this.setTimeout(this.reset, 2000);
    }

    updateScoreBoard() {
        this.scoreBoard.innerHTML = 'Player 1: ' + this.score.player1 + ' Player 2: ' +
            this.score.player2;
    }

    stopBall() {
        this.ball.$stopped = true;
    }

    addPoint(playerName) {
        this.score[playerName]++;
    }

    startRender() {
        this.running = true;
        this.render();
    }

    stopRender() {
        running = false;
    }

    render() {
        this.requestAnimationFrame(this.render);

        this.renderer.render(this.scene, this.camera);
    }

    render() {
        setInterval(() => {
            if (this.running) {
                this.processBallMovement();
                this.processCpuPaddle();
                this.renderer.render(this.scene, this.camera)
            }
        }, 1000 / 60);
    }

    reset() {
        this.ball.position.set(0, 0, 0);
        this.ball.$velocity = null;
    }

    addPaddle() {
        this.paddleGeometry = new THREE.CubeGeometry(this.PADDLE_WIDTH, this.PADDLE_HEIGHT, 10, 1, 1, 1);
        this.paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xCCCCCC });
        this.paddle = new THREE.Mesh(this.paddleGeometry, this.paddleMaterial);
        this.scene.add(this.paddle);
        return this.paddle;
    }

    pushBallMovement(velocity) {
        this.paddle1.position.x += velocity / this.FIELD_WIDTH
        this.camera.position.x = this.paddle1.position.x 
    }

}