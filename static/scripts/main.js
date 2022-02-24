let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let scaleW = (canvas.width) / 1000
let scaleH = (canvas.height) / 500
let ballRadius = 10 * scaleW;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 5 * scaleW;
let dy = -5 * scaleH;
let paddleHeight = 10 * scaleH;
let paddleWidth = 125 * scaleW;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 4;
let brickColumnCount = 5;
let brickHeight = 20 * scaleH;
let brickWidth = 75 * scaleW;
let brickPadding = 10 * scaleW;
let brickOffsetTop = 30 * scaleH;
let brickOffsetLeft = 30 * scaleW;
let score = 0;
let lives = 5;
let scoreFormVisible = false;
let isCheating = false;
let my_gradient = ctx.createLinearGradient(0, 0, 0, 170);
my_gradient.addColorStop(0, "#141414");
my_gradient.addColorStop(1, "red");


function getCookie(name) {
let cookieValue = null;
if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
}
return cookieValue;
}
const csrftoken = getCookie('csrftoken');


const scoreURL = "/api/score/new"
let scoreForm = document.querySelector("#score-form")

scoreForm.addEventListener("submit", function (event) {
    event.preventDefault()
    console.log(event.target)
    formData = new FormData(scoreForm)
    formData.append("score", score)
    fetch(scoreURL, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Accept": "application/json",
            "X-Request-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
        },
        body: formData,
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            console.log(data)
        })
        document.location.reload()
})




let bricks = [];
function buildBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}
buildBricks()

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    // if (relativeX > 0 && relativeX < canvas.width)
    if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        scoreFormVisible = true
                        scoreForm.classList.remove("is-hidden")
                        console.log(score);
                        alert("Didn't Expect You To Win! So I Guess Congrats");
                        // document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#b400dd";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    brickWidth = ((1000 * scaleW) - (brickOffsetLeft * 2) - (brickPadding * (brickColumnCount - 1))) / brickColumnCount
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
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
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#d11111";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if (!lives) {
                scoreFormVisible = true
                scoreForm.classList.remove("is-hidden")
                console.log(score)
                alert("Looks Like You Failed Me");
                // document.location.reload();
            }
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 5 * scaleW;
                dy = -5 * scaleH;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (isCheating){
        paddleX = x-paddleWidth/2
    }


    x += dx;
    y += dy;

    if(!scoreFormVisible){
        requestAnimationFrame(draw);
    } else{
        console.log("paused")
    }
}
//================================================================================================================================================
// Level Difficulty Setup
function levelOne() {
    brickRowCount = 4;
    brickColumnCount = 4;
    paddleWidth = 125 * scaleW;
    buildBricks()
    resetGame()
    lives = 5;
}

function levelTwo() {

    brickRowCount = 7;
    brickColumnCount = 10;
    paddleWidth = 95 * scaleW;
    buildBricks()
    resetGame()
    lives = 4;
}

function levelThree() {
    brickRowCount = 8;
    brickColumnCount = 15;
    paddleWidth = 65 * scaleW;
    buildBricks()
    resetGame()
    lives = 3;
}

function levelFour() {
    brickRowCount = 9;
    brickColumnCount = 20;
    paddleWidth = 55 * scaleW;

    buildBricks()
    resetGame()
    lives = 2;
}

function levelFive() {
    brickRowCount = 10;
    brickColumnCount = 25;
    paddleWidth = 55 * scaleW;

    buildBricks()
    resetGame()
    lives = 2;
}

function resetGame() {
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    lives = 5;
    x = canvas.width / 2;
    y = canvas.height - 30;
}
//========================================================================================================================================================================
// Cheats
function cheatCode() {
    isCheating = true
}
let listen = event => {
    document.getElementById("cheat");
    document.getElementById("cheat1");
    cheat.classList.remove("is-hidden");
    cheat1.classList.remove("is-hidden");
}

//========================================================================================================================================================================
// Modal Setup
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        console.log($target);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});
//========================================================================================================================================================================

let leaderBoard = document.querySelector("#leader-board")
let leaderURL = "api/leaderboard"

fetch(leaderURL, {
    method: "GET",
    credentials: "same-origin", 
    headers: {
        "Accept": "application/json",
        "X-Request-With": "XMLHttpRequest",
        "X-CSRFToken": csrftoken,
    },
})
    .then(response => {
        return response.json()
    })
    .then(leaderArray => {
        for (let score of leaderArray){
            let playerScore = document.createElement("li")
            console.log(score)
            console.log(leaderBoard)    
            playerScore.innerText = `${score.fields.player} | ${score.fields.points}`
            leaderBoard.appendChild(playerScore)
        }
    })






   
draw();   