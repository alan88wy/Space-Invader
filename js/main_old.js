var playerInfo = {
    player1: {
        score: 0
    },
    player2: {
        score: 0
    }
}


var imageList = [];
var enemyList = [];
var currentPlayer = 1;

// gameBoardWidth = window.innerWidth;
// gameBoardHeight = window.innerHeight;
// gameBoardWidth = window.screen.availWidth;
// gameBoardHeight = window.screen.availHeight;


var game = {
    width: window.innerWidth,
    height: window.innerHeight,
    x1: 50,
    x2: 0,
    y1: 50,
    y2: 0
}

game.x2 = game.x1 + game.width;
game.y2 = game.y1 + game.height

var imgSize = {
    width: 24,
    height: 24
}


xBuffer = imgSize.width + 10;
yBuffer = imgSize.height + 10

var startX = xBuffer * 2;
var startY = 150;
var noOfEnemyPerRow = Math.floor((game.width - 6 * xBuffer) / xBuffer);
var noOfRow = Math.floor((game.height * 0.3) / imgSize.yBuffer);
var enemyBottomRow = game.height - (noOfRow * (imgSize.height + 10)) - yBuffer;
var lastRow = Math.floor(noOfEnemyPerRow * 0.3);
var movingDirection = 1;
var movingVeroticy = Math.floor(imgSize.width / 2);

var enemyObj = {
    img: "",
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
}

var enemyZone = {
    x1: xBuffer * 2,
    y1: 150,
    x2: 0,
    y2: 0
}

// enemyZone.x2 = enemyZone.x1 + noOfEnemyPerRow * xBuffer;
// enemyZone.y2 = enemyZone.y1 + noOfRow * yBuffer;

//create the canvas element
var gameBoard = document.createElement("canvas");
// var scoreCard = document.createElement("p");

// Get the Game Board context
var ctx = gameBoard.getContext("2d");

// document.body.insertAdjacentElement('beforeend', scoreCard);

// load Image

img = new Image();
img.src = "images/invader01.png";


gameBoard.addEventListener('click', function (e) {
    // r = gameBoard.getBoundingClientRect();
    et = e.clientX;

    console.log("Click value : " + e.clientX + " " + e.clientY);
})



// function loadImages() {
//     imgSrc = "images/invader01.png";
//     img.src = imgSrc;
// }



window.onload = function () {
    //    loadGame()

    setupGameBoard();
    initEnemy(enemyZone.x1, enemyZone.y1, img);
    window.requestAnimationFrame(main)

}

function main() {

    // loadImages();
    
    updateScoreCard(2);
    // updateEnemy(); // check Collision
    // renderEnemy(); // refresh screen
}

function checkCollision(imgObj) {

}

function startGame() {
    // playerInfo.player1.score = 30;

}

function clearGameBoard() {
    ctx.clearRect(game.x1, game.y1, game.width, game.height);
}

function setupGameBoard() {

    // Set the game board width and height

    gameBoard.width = game.width;
    gameBoard.height = game.height;
    // backroundImageSource = "images/background.jpg";


    //first we clear the Game Board
    clearGameBoard();
    // Add canvas to the body
    document.body.insertAdjacentElement('beforeend', gameBoard);

    // Setup Game board background image
    // var background = new Image();
    // background.src = backroundImageSource;
    // background.onload = function () {
    //     ctx.drawImage(background, 0, 0, game.width, game.height)
    //     updateScoreCard(currentPlayer)
    // }

}

function updateScoreCard(currentPlayer) {

    var score = 0;

    if (currentPlayer = 1) {
        score = playerInfo.player1.score;
    } else {
        score = playerInfo.player2.score;
    }

    // scoreCard.style.font = 'italic 12pt Calibri';
    // scoreCard.style.color = "white";
    // scoreCard.style.padding = "10px";

    var scoreCard = "Player : " + (currentPlayer - 1) + "  Scores : " + score;

    ctx.font = 'italic 12pt Calibri';
    ctx.fillStyle = "white";
    ctx.fillText(scoreCard, game.x1, game.y1);
}

function generateRandomNumber(x) {
    return Math.random() * x
}

function initEnemy(xPos, yPos, img) {

    x = xPos;
    y = yPos;
    enemyList = [];

    for (var i = 0; i <= lastRow; i++) {
        displayEnemy(x, y, img);
        y = y + yBuffer;
    }
}

function clearEnemy() {

    ctx.clearRect(0, 0, 1024, 1024);
    // var scoreCard = "i waz ere";
    // ctx.font = 'italic 12pt Calibri';
    // ctx.fillStyle = "white";
    // ctx.fillText(scoreCard, game.x1, game.y1);

}


function displayEnemy(xPos, yPos, img) {

    var x = xPos;
    var y = yPos;

    // img.onload = function () {
    for (var i = 0; i <= noOfEnemyPerRow; i++) {
        ctx.drawImage(img, x, y, imgSize.width, imgSize.height);

        enemyObj = {
            img: img,
            x1: x,
            x2: x + imgSize.width,
            y1: yPos,
            y2: yPos + imgSize.height
        }

        // console.log(enemyObj);
        enemyList.push(enemyObj);

        // y = y + imgSize.height + 5;
        x = x + xBuffer;

    }

    // }
}