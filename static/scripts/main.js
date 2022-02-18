let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let scaleW = (canvas.width)/1000
let scaleH = (canvas.height)/500
let ballRadius = 10*scaleW;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 5*scaleW;
let dy = -5*scaleH;
let paddleHeight = 10*scaleH;
let paddleWidth = 125* scaleW;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 4;
let brickColumnCount = 4;
let brickHeight = 20 * scaleH;
let brickWidth = 75 * scaleW;
let brickPadding = 10 * scaleW;
let brickOffsetTop = 30 * scaleH;
let brickOffsetLeft = 30 * scaleW;
let score = 0;
let lives = 5;
let my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
my_gradient.addColorStop(0, "#141414");
my_gradient.addColorStop(1, "red");



let bricks = [];
function buildBricks(){
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}
buildBricks()

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status == 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;
            if(score == brickRowCount*brickColumnCount) {
                alert("Didn't Expect You To Win! So I Guess Congrats");
                document.location.reload();
            }
            }
        }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#b400dd"; 
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    brickWidth = ((1000*scaleW)-(brickOffsetLeft*2)-(brickPadding*(brickColumnCount-1)))/brickColumnCount
for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
    if(bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = my_gradient;
        ctx.fill();
        ctx.closePath();
    }
    }
}
}
function drawScore() {
ctx.font = "16px Arial";
ctx.fillStyle = "#d11111";
ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
ctx.font = "16px Arial";
ctx.fillStyle = "#d11111";
ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();
collisionDetection();

if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
}
if(y + dy < ballRadius) {
    dy = -dy;
}
else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
    dy = -dy;
    }
    else {
    lives--;
    if(!lives) {
        alert("Looks Like You Failed Me");
        document.location.reload();
    }
    else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 5*scaleW;
        dy = -5*scaleH;
        paddleX = (canvas.width-paddleWidth)/2;
    }
    }
}

if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
}
else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
}


x += dx;
y += dy;
requestAnimationFrame(draw);
}

function levelOne(){
    brickRowCount = 4;
    brickColumnCount = 4;
    paddleWidth = 125* scaleW;
    buildBricks()
    resetGame()
    lives = 5;
}

function levelTwo() {
    
    brickRowCount = 7;
    brickColumnCount = 10;
    paddleWidth = 95*scaleW;
    buildBricks()
    resetGame()
    lives = 4;
}

function levelThree(){
    brickRowCount = 8;
    brickColumnCount = 15;
    paddleWidth = 65*scaleW;
    buildBricks()
    resetGame()
    lives = 3;
}

function levelFour(){
    brickRowCount = 9;
    brickColumnCount = 20;
    paddleWidth = 55*scaleW;
    
    buildBricks()
    resetGame()
    lives = 2;
}

function resetGame(){
    paddleX = (canvas.width-paddleWidth)/2;
    score = 0;
    lives = 5;
    x = canvas.width/2;
    y = canvas.height-30;
}

function cheatCode(){
    paddleWidth = 300;
}

const listen = event => {
    const p = document.createElement('p');
    p.innerText = "YOU CHEATER. If you fail you don't deserve to have a cheat";
    document.querySelector('#container').appendChild(p);
  }


        
draw();