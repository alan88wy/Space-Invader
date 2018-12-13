var progress = 0;
var endOfLine = false;
var targetFound = false;
var keyIsPress = false;
var prevKeyCode = 0;
// Control key
var leftKey = document.getElementById("left");
var shootKey = document.getElementById("shoot");
var rightKey = document.getElementById("right");
var shootingSound = new Audio("audio/shoot.wav");
var explodeSound = new Audio("audio/explosion.wav");

// shootingSound.load();



// var audio = new Audio("audio/ufo_lowpitch.wav" );

// audio.play();

var imgDetail = (function () {

    var imgWidth = 24;
    var imgHeight = 24;
    var imgIndex = 0;
    var noOfImages = 0;

    var imageList = [];

    var enemyImageUrl = [
        "images/invader01.png",
        "images/invader02.png",
        "images/invader03.png",
        "images/invader04.png",
        "images/invader06.jpg"
    ];

    noOfImages = enemyImageUrl.length;

    function newImage(imgUrl) {
        var img = new Image;
        img.src = imgUrl;

        return img
    }

    var playerImage = "";

    function loadPlayerImage() {
        playerImage = newImage("images/aircraft.png")

    }

    function loadEnemyImages() {
        for (var i = 0; i < enemyImageUrl.length; i++) {
            imageList.push(newImage(enemyImageUrl[i]));
        }
    }

    loadEnemyImages();
    loadPlayerImage();

    function getEnemyImage() {

        var img = imageList[imgIndex];

        imgIndex++;

        if (imgIndex >= noOfImages) {
            imgIndex = 0;
        }

        return img
    }

    return {
        imgWidth,
        imgHeight,
        // noOfImages,
        imageList,
        playerImage,
        getEnemyImage
    }
})();

var gameBoard = (function () {
    var game = {
        // width: window.screen.availWidth,
        // height: window.screen.availHeight,
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        // width: 600,
        // height: 600,
        // width: window.innerWidth,
        // height: window.innerHeight,
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        xBuffer: 0,
        yBuffer: 0,
        startX: 0,
        startY: 0,
        xOffSet: 0,
        maxOffSet: 0,
        noOfEnemyPerRow: 0,
        totalNoOfRow: 5,
        minRow: 3,
        noOfRowOfEnemy: 0,
        direction: -1,
        verocity: 0
    }

    var ctx = "";

    function resetGameBoard() {
        game.xBuffer = imgDetail.imgWidth + 10;
        game.yBuffer = imgDetail.imgHeight + 10
        game.xOffSet = 0;
        game.noOfRowOfEnemy = 0;
        game.direction = -1;
        game.verocity = 0;
        game.x2 = game.width - 10;
        game.y2 = game.height - 10;
        game.maxOffSet = Math.floor(game.xBuffer * 2);
        game.startX = game.x1 + game.xBuffer * 2;
        game.startY = game.y1 + game.xBuffer * 4;
        game.noOfEnemyPerRow = Math.floor((game.width - 4 * game.xBuffer) / game.xBuffer);
        game.direction = 1;
        game.verocity = Math.floor(imgDetail.width / 2);
    }

    resetGameBoard();

    function clearGameBoard() {
        ctx.clearRect(0, 0, game.width, game.height);
    }

    function displayBackground() {
        // Setup Game board background image
        var background = new Image();
        background.src = 'images/background.jpg';
        ctx.drawImage(background, 0, 0, game.width, game.height)
    }

    function initializeGameBoard() {

        //create the canvas element
        // var gameBody = document.createElement("canvas");
        var gameBody = document.getElementById("canvas");
        // var scoreCard = document.createElement("p");

        // Set the game board width and height

        gameBody.width = game.width;
        gameBody.height = game.height;
        gameBody.className = "canvas";
        // gameBoard.margin = "0 30px 0 30px";
        // gameBoard.padding = "30px";
        // gameBoard.border = "10px";
        // Get the Game Board context
        ctx = gameBody.getContext("2d");

        //first we clear the Game Board
        clearGameBoard();
        // Add canvas to the body
        // document.body.insertAdjacentElement('beforeend', gameBody);


    }

    initializeGameBoard();


    var enemyZone = {
        x1: 30,
        y1: 30,
        x2: 0,
        y2: 0
    }

    return {
        ctx,
        game,
        enemyZone,
        clearGameBoard,
        resetGameBoard,
        displayBackground
    }

})();

function generateRandomNumber(x) {
    return Math.floor(Math.random() * x)
}

var enemy = (function () {
    var enemyList = [];
    var masterEnemyList = [];
    var enemyObj = {
        img: "",
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        points: 10,
        disable: false
    };

    var maxY = 0;

    function remainingEnemy() {

        var noOfEnemy = 0;

        for (var i = 0; i < enemyList.length; i++) {
            if (enemyList[i].active) {
                noOfEnemy++;
            }
        }

        return noOfEnemy
    }

    function updateEnemy(xoffSetAmt) {
        for (var i = enemyList.length - 1; i >= 0; i--) {

            enemyList[i].x1 = enemyList[i].x1 + xoffSetAmt;
            enemyList[i].x2 = enemyList[i].x2 + xoffSetAmt;

        }
    }

    function displayEnemy() {

        for (var i = enemyList.length - 1; i >= 0; i--) {

            if (!enemyList[i].disable) {
                var x = enemyList[i].x1; //+ gameBoard.game.xOffSet;
                var y = enemyList[i].y1;
                var img = enemyList[i].img;
                gameBoard.ctx.drawImage(img, x, y, imgDetail.imgWidth, imgDetail.imgHeight);
            }
        }
    }

    function resetEnemy() {
        enemyList = masterEnemyList.splice(0);
    }

    function createEnemy() {

        var x = gameBoard.game.startX;
        var y = gameBoard.game.startY;
        var numRow = gameBoard.game.totalNoOfRow;

        enemyList = [];

        gameBoard.game.noOfRowOfEnemy = 3;

        var points = 10;

        for (var i = 0; i < numRow; i++) {

            var disable = false;

            if (i >= gameBoard.game.noOfRowOfEnemy) {
                disable = true;
            }

            addRowOfEnemy(x, y, disable, points);

            points += 10;

            y = y - gameBoard.game.yBuffer;

            maxY = maxY <= y ? y : maxY;

        }
    }

    createEnemy();

    masterEnemyList = enemyList.slice(0);

    function moveEnemyDown() {
        for (var i = 0; i < enemyList.length; i++) {
            enemyList[i].y1 = enemyList[i].y1 + gameBoard.game.yBuffer;
            enemyList[i].y2 = enemyList[i].y2 + gameBoard.game.yBuffer;
            maxY = maxY <= enemyList[i].y1 ? enemyList[i].y1 : maxY;
        }

    }

    function addRowOfEnemy(xPos, yPos, disableEnemy, points) {

        var x = xPos;

        var img = imgDetail.getEnemyImage();

        for (var i = 0; i < gameBoard.game.noOfEnemyPerRow; i++) {

            var enemyObj = {
                img: img,
                x1: x,
                x2: x + imgDetail.imgWidth,
                y1: yPos,
                y2: yPos + imgDetail.imgHeight,
                points: points,
                disable: disableEnemy
            }

            enemyList.push(enemyObj);

            x = x + gameBoard.game.xBuffer;

            if (x > gameBoard.game.width) {
                x = gameBoard.x1;
            }
        }

    }

    function activateNewEnemy() {

        var noOfRow = gameBoard.game.noOfRowOfEnemy;
        var noOfColumn = gameBoard.game.noOfEnemyPerRow;
        var startIndex = noOfRow * noOfColumn;

        for (var i = startIndex; i < (startIndex + noOfColumn); i++) {
            enemyList[i].disable = false;
        }

    }

    function checkCollision(x1, y1, x2, y2) {

        // if (targetFound) {
        //     return 0

        // }

        for (var i = 0; i < enemyList.length; i++) {
            if (!enemyList[i].disable) {

                if (((x1 >= enemyList[i].x1 && x1 <= enemyList[i].x2) ||
                        (x2 >= enemyList[i].x1 && x2 <= enemyList[i].x2)) &&
                    (y1 <= enemyList[i].y2)) {
                    // if ((x1 >= enemyList[i].x1 && x1 <= enemyList[i].x2) ||
                    //     (x2 >= enemyList[i].x1 && x2 <= enemyList[i].x2)) {
                    //     if (y1 <= enemyList[i].y2) {

                    enemyList[i].disable = true;
                    player.updateScore(enemyList[i].points);
                    targetFound = true;
                    // var img = new Image;
                    // img.src = 'images/explosion.png'
                    // gameBoard.ctx.drawImage(img, enemyList[i].x1, enemyList[i].y1, imgDetail.imgWidth, imgDetail.imgHeight);

                    break

                    // }

                }
            }

        }

        if (targetFound) {
            return true
        } else {
            return false
        }

    }

    function gameOver() {

        var done = false;

        var x = player.currentPlayer.x;
        var y = player.currentPlayer.y;

        for (var i = 0; i < enemyList.length; i++) {
            if (!enemyList[i].disable) {
                if (player.currentPlayer.y <= enemyList[i].y2) {
                    done = true;
                    break
                }
            }

        }

        if (done) {
            return true
        } else {
            return false
        }
    }

    function moveEnemy() {

        var rightBorder = gameBoard.game.width - 10;
        var leftBorder = gameBoard.game.x1 + 10;

        if (endOfLine) {

            if (enemy.gameOver()) {
                endGame = true;
                stopGame();
            } else {
                enemy.moveEnemyDown();
                endOfLine = false;

                if (gameBoard.game.noOfRowOfEnemy < gameBoard.game.totalNoOfRow) {
                    enemy.activateNewEnemy();
                    gameBoard.game.noOfRowOfEnemy += 1;

                };

            }
        } else {
            var offSetAmt = (progress / 50) * imgDetail.imgWidth / 4;

            // Use the 1st enemy in the 1st column to determine the movement
            var firstEnemy = enemy.enemyList[0];
            // Use the last enemy in the 1st column to determine the movement
            var lastEnemy = enemy.enemyList[gameBoard.game.noOfEnemyPerRow - 1];
            // 

            if (gameBoard.game.direction === 1) {

                if ((lastEnemy.x2 + offSetAmt) > rightBorder) {
                    gameBoard.game.xOffSet -= offSetAmt;
                    enemy.updateEnemy(-1 * offSetAmt);
                    gameBoard.game.direction = -1;

                } else {
                    gameBoard.game.xOffSet += offSetAmt;
                    enemy.updateEnemy(offSetAmt);
                }

            } else {
                if ((firstEnemy.x1 - offSetAmt) < leftBorder) {
                    gameBoard.game.xOffSet += offSetAmt;
                    gameBoard.game.direction = 1;
                    endOfLine = true;
                    enemy.updateEnemy(offSetAmt);
                } else {
                    gameBoard.game.xOffSet -= offSetAmt;
                    enemy.updateEnemy(-offSetAmt);
                }

            }
        }


    }

    return {
        resetEnemy,
        displayEnemy,
        activateNewEnemy,
        moveEnemyDown,
        moveEnemy,
        updateEnemy,
        gameOver,
        enemyList,
        checkCollision
    }
})();

var player = (function () {

    var playerInfo = {
        player1: {
            score: 0,
            noOfLives: 0
        },
        player2: {
            score: 0,
            noOfLives: 0
        }
    }

    var MaxLive = 3;

    var currentPlayer = {
        playerNo: 1,
        noOfLives: 3,
        x: 0,
        y: 0
    }

    function playerAlive() {
        if (currentPlayer.noOfLives < MaxLive) {
            return false
        } else {
            return true;
        }
    }

    function moveLeft() {

        var mOffSet = imgDetail.imgWidth;
        var x = player.currentPlayer.x - mOffSet;

        if (x < gameBoard.game.x1) {
            player.currentPlayer.x = gameBoard.game.x1
        } else {
            player.currentPlayer.x = x
        }

    }

    function moveRight() {
        var mOffSet = imgDetail.imgWidth;
        var xRightBorder = gameBoard.game.width - 40;

        var x = player.currentPlayer.x + mOffSet;

        if (x >= xRightBorder) {
            player.currentPlayer.x = xRightBorder;
        } else {
            player.currentPlayer.x = x;
        }
    }

    function updateScore(points) {
        if (currentPlayer.playerNo = 1) {
            playerInfo.player1.score += points
        } else {
            playerInfo.player2.score += points
        }
    }

    function updateScoreCard(currentPlayer) {

        var score = 0;

        if (currentPlayer.playerNo = 1) {
            score = playerInfo.player1.score;
        } else {
            score = playerInfo.player2.score;
        }

        var scoreCard = "Player : " + (currentPlayer - 1) + "  Scores : " + score;

        gameBoard.ctx.font = 'italic 12pt Calibri';
        gameBoard.ctx.fillStyle = "white";
        gameBoard.ctx.fillText(scoreCard, 20, 20);
    }

    function displayPlayer(x, y) {

        gameBoard.ctx.drawImage(imgDetail.playerImage, currentPlayer.x, currentPlayer.y, imgDetail.imgWidth * 2, imgDetail.imgHeight * 2);
    }

    return {
        updateScore,
        updateScoreCard,
        currentPlayer,
        displayPlayer,
        playerAlive,
        moveLeft,
        moveRight
    }
})();

leftKey.addEventListener('click', function (e) {
    prevKeyCode = e.keyCode;
    keyIsPress = true;
    player.moveLeft();
});

rightKey.addEventListener('click', function (e) {
    prevKeyCode = e.keyCode;
    keyIsPress = true;
    player.moveRight();
});

shootKey.addEventListener('click', function (e) {
    targetFound = false;
    if (keyIsPress) {

        if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
            player.moveLeft();
        } else if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
            player.moveRight();
        }
    }

    Bullets.shoot();
});

window.addEventListener('keydown', keyDown);

function keyDown(e) {

    if ((e.keyCode === 37) || (e.keyCode === 65)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        player.moveLeft();
    } else if ((e.keyCode === 39) || (e.keyCode === 68)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        player.moveRight();
    } else if (e.keyCode === 27) {
        stopGame()
    }

}

window.addEventListener('keypress', function (e) {

    if (e.keyCode === 32 || e.keyCode === 38) {
        targetFound = false;
        if (keyIsPress) {

            if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
                player.moveLeft();
            } else if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
                player.moveRight();
            }
        }

        Bullets.shoot();

    }
});

var Bullets = (function () {

    bulletObj = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        color: "#FFFFFF", // '#000000',
        width: 24,
        height: 24,
        velocity: 0,
        active: false
    };

    var bulletList = [];

    function resetBulletList() {
        bulletList = []
    }

    function drawBullet() {


        for (var i = 0; i < bulletList.length; i++) {
            if (bulletList[i].active) {

                var missile = new Image();
                missile.src = 'images/missile.png';
                gameBoard.ctx.drawImage(missile, bulletList[i].x, bulletList[i].y, bulletList[i].width, bulletList[i].height);

                // gameBoard.ctx.beginPath();
                // gameBoard.ctx.arc(bulletObj.x, bulletObj.y, 10, 0, 20); //Math.PI * 2);
                // gameBoard.ctx.rect(bulletList[i].x, bulletList[i].y, bulletList[i].width, bulletList[i].height)
                // gameBoard.ctx.fillStyle = bulletList[i].color;
                // gameBoard.ctx.fill();
                // gameBoard.ctx.closePath();
                // gameBoard.ctx.fillStyle = bulletObj.color;
                // gameBoard.ctx.fillRect(bulletObj.x, bulletObj.y, bulletObj.width, bulletObj.height);

                if (enemy.checkCollision(bulletList[i].x, bulletList[i].y, bulletList[i].x + bulletList[i].width, bulletList[i].y + bulletList[i].height)) {
                    
                    explodeSound.currentTime = 0;
                    explodeSound.play();
                    bulletList[i].active = false;
                    targetFound = false;
                    // bulletList.slice(i,i);
                }
            }
        }

        updateBullet();
    };

    function updateBullet() {
        // if (targetFound) {
        //     bulletObj.active = false;
        // }

        // if (bulletObj.active) {

        for (var i = 0; i < bulletList.length; i++) {
            if (bulletList[i].active) {
                if (bulletList[i].y <= gameBoard.game.startY) {
                    bulletList[i].active = false;
                    // bulletList.slice(i,i);
                } else {
                    bulletList[i].y = bulletList[i].y - bulletList[i].velocity;
                    // bulletObj.y = bulletObj.y + dy;
                    // bulletObj.x = bulletObj.y + dx;

                }
            }
        }
    };

    function shoot() {

        var bulletData = {
            x: player.currentPlayer.x + imgDetail.imgWidth - bulletObj.width / 2,
            y: player.currentPlayer.y,
            startX: bulletObj.startX,
            startY: bulletObj.startY,
            color: bulletObj.color,
            width: bulletObj.width,
            height: bulletObj.height,
            velocity: (progress / 80) * gameBoard.game.yBuffer,
            active: true
        }

        targetFound = false;

        // soundSystem.addShootingSound();

        var shootingSound = new Audio("audio/shoot.wav");

        // shootingSound.load();
        shootingSound.currentTime = 0;
        shootingSound.play();
        

        bulletList.push(bulletData);

    }

    return {
        updateBullet,
        drawBullet,
        resetBulletList,
        shoot
    }


})();



function stopGame() {
    // clearInterval(Movement);
    cancelAnimationFrame(render);
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var start = Date.now();

gameBoard.clearGameBoard();
player.currentPlayer.playerNo = 1;
player.currentPlayer.x = gameBoard.game.x2 / 2;
player.currentPlayer.y = gameBoard.game.y2 - gameBoard.game.yBuffer;
var endGame = false;



function render() {

    var ct = Date.now();

    progress = ct - start;


    gameBoard.clearGameBoard();

    gameBoard.displayBackground();

    enemy.displayEnemy();
    player.displayPlayer(player.currentPlayer.x, player.currentPlayer.y);
    Bullets.drawBullet();

    player.updateScoreCard(player.currentPlayer.playerNo);

    enemy.moveEnemy();



    if (!endGame) {
        requestAnimationFrame(render);
    }

    start = ct;
}

gameBoard.resetGameBoard();
Bullets.resetBulletList();

requestAnimationFrame(render);

// gameBoard.resetGameBoard();
// enemy.resetEnemy();
// Bullets.resetBulletList();

// requestAnimationFrame(render);