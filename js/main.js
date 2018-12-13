var progress = 0; // Use to calculate the timing of animation
var endOfLine = false; // When the enemy reah end of the line, it will move to next row
var targetFound = false; // if the bullet hits the enemy, targetFound = true
var keyIsPress = false; // if the left or right key is press, it will continue to move when shot button is press too
var prevKeyCode = 0; // hold previous key code presses for left and right movement
var enemyVelocity = 1; // no use to calculate how fast to move the enemy. Will increment when enemy is move to next row.
var start = Date.now(); // get start time to use for timing calculation
var endGame = false; // if end Game, exit
// Control key
var leftKey = document.getElementById("left"); // left key button on the screen for touch screen device
var shootKey = document.getElementById("shoot"); // shoot button on the screen for touch screen device
var rightKey = document.getElementById("right"); // right key button on the screen for touch screen device
// Animation function
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// Shooting sound
var shootingSound = new Audio("audio/shoot.wav");
var explodeSound = new Audio("audio/explosion.wav");
var explosionImg = new Image;

// Explosion sound
explosionImg.src = 'images/explosion.png'





// var audio = new Audio("audio/ufo_lowpitch.wav" );

// audio.play();

// initialize the default system info

var initiateSystem = function () {
    progress = 0;
    endOfLine = false;
    targetFound = false;
    keyIsPress = false;
    prevKeyCode = 0;
    enemyVelocity = 1;
}

initiateSystem();

// imgDetail prepare various image lists for display later
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
        "images/invader05.png"
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

// Main game board for displaying the game canvas

var Gameboard = (function () {
    var game = {
        width: window.visualViewport.width,
        height: window.visualViewport.height * 0.85,
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
        noOfRowOfEnemy: 3,
        direction: -1,
        verocity: 0
    }

    var ctx = "";

    // Reset game board data

    function resetGameBoard() {
        game.xBuffer = imgDetail.imgWidth + imgDetail.imgWidth * 0.5;
        game.yBuffer = imgDetail.imgHeight + imgDetail.imgWidth * 0.5;
        game.xOffSet = 0;
        game.noOfRowOfEnemy = 3;
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

    // Clear game screen

    function clearGameBoard() {
        ctx.clearRect(0, 0, game.width, game.height);
    }

    // Setup Game board background image
    function showBackground() {
        
        clearGameBoard();
        var background = new Image();
        background.src = 'images/background05.png';
        ctx.drawImage(background, 0, 0, game.width, game.height)
    }

    // getting and setting the game screen for user display
    function initializeGameBoard() {

        var gameBody = document.getElementById("canvas");
    
        gameBody.width = game.width;
        gameBody.height = game.height;
        gameBody.className = "canvas";
    
        ctx = gameBody.getContext("2d");
    }

    initializeGameBoard();

    // exporting variable and functions

    return {
        ctx,
        game,
        clearGameBoard,
        resetGameBoard,
        showBackground
    }

})();

// Random number generator function
// Not being use at the moment

function generateRandomNumber(x) {
    return Math.floor(Math.random() * x)
}

// Enemy object - add, delete, show objects

var Enemy = (function () {
    var enemyList = [];
    var masterEnemyList = [];
    var enemyObj = {
        img: "",
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        points: 12,
        disable: false
    };

    var maxY = 0;

    // use to calculate the remaining enemy to determine whether the user has won.

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

            enemyList[i].x1 = enemyList[i].x1 + xoffSetAmt * enemyVelocity;
            enemyList[i].x2 = enemyList[i].x2 + xoffSetAmt * enemyVelocity;

        }
    }

    function showEnemy() {

        for (var i = enemyList.length - 1; i >= 0; i--) {

            if (!enemyList[i].disable) {
                var x = enemyList[i].x1; //+ Gameboard.game.xOffSet;
                var y = enemyList[i].y1;
                var img = enemyList[i].img;
                Gameboard.ctx.drawImage(img, x, y, imgDetail.imgWidth, imgDetail.imgHeight);
            }
        }
    }

    function resetEnemy() {
        enemyList = masterEnemyList.splice(0);
    }

    function createEnemy() {

        var x = Gameboard.game.startX;
        var y = Gameboard.game.startY;
        var numRow = Gameboard.game.totalNoOfRow;

        enemyList = [];

        Gameboard.game.noOfRowOfEnemy = 3;

        var points = 12;

        for (var i = 0; i < numRow; i++) {

            var disable = false;

            if (i >= Gameboard.game.noOfRowOfEnemy) {
                disable = true;
            }

            addRowOfEnemy(x, y, disable, points);

            points += 10;

            y = y - Gameboard.game.yBuffer;

            maxY = maxY <= y ? y : maxY;

        }
    }

    createEnemy();

    masterEnemyList = enemyList.slice(0);

    function moveEnemyDown() {

        enemyVelocity = enemyVelocity + enemyVelocity * progress / 450;

        for (var i = 0; i < enemyList.length; i++) {
            enemyList[i].y1 = enemyList[i].y1 + Gameboard.game.yBuffer;
            enemyList[i].y2 = enemyList[i].y2 + Gameboard.game.yBuffer;
            enemyList[i].points -= 1;
            maxY = maxY <= enemyList[i].y1 ? enemyList[i].y1 : maxY;
        }

    }

    function addRowOfEnemy(xPos, yPos, disableEnemy, points) {

        var x = xPos;

        var img = imgDetail.getEnemyImage();

        for (var i = 0; i < Gameboard.game.noOfEnemyPerRow; i++) {

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

            x = x + Gameboard.game.xBuffer;

            if (x > Gameboard.game.width) {
                x = Gameboard.x1;
            }
        }

    }

    function activateNewEnemy() {

        var noOfRow = Gameboard.game.noOfRowOfEnemy;
        var noOfColumn = Gameboard.game.noOfEnemyPerRow;
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
                    Player.updateScore(enemyList[i].points);
                    targetFound = true;
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
        var noOfEnemy = 0

        var x = Player.currentPlayer.x;
        var y = Player.currentPlayer.y;

        for (var i = 0; i < enemyList.length; i++) {
            if (!enemyList[i].disable) {
                if (Player.currentPlayer.y <= enemyList[i].y2) {
                    done = true;
                    break
                }
                noOfEnemy++
            }

        }

        // if (Enemy.remainingEnemy() === 0) {
        //     done = true;      
        // }
    

        if (done || noOfEnemy <= 0) {
            return true
        } else {
            return false
        }
    }

    function moveEnemy() {

        var rightBorder = Gameboard.game.width - 10;
        var leftBorder = Gameboard.game.x1 + 10;

        if (endOfLine) {

            if (Enemy.gameOver()) {
                endGame = true;
                stopGame();
            } else {
                if (Gameboard.game.noOfRowOfEnemy < Gameboard.game.totalNoOfRow) {
                    Enemy.activateNewEnemy();
                    Gameboard.game.noOfRowOfEnemy += 1;

                };

                Enemy.moveEnemyDown();
                endOfLine = false;

            }
        } else {
            var offSetAmt = (progress / 50) * imgDetail.imgWidth / 4;

            // Use the 1st enemy in the 1st column to determine the movement
            var firstEnemy = Enemy.enemyList[0];
            // Use the last enemy in the 1st column to determine the movement
            var lastEnemy = Enemy.enemyList[Gameboard.game.noOfEnemyPerRow - 1];
            // 

            if (Gameboard.game.direction === 1) {

                if ((lastEnemy.x2 + offSetAmt) > rightBorder) {
                    Gameboard.game.xOffSet -= offSetAmt;
                    Enemy.updateEnemy(-1 * offSetAmt);
                    Gameboard.game.direction = -1;

                } else {
                    Gameboard.game.xOffSet += offSetAmt;
                    Enemy.updateEnemy(offSetAmt);
                }

            } else {
                if ((firstEnemy.x1 - offSetAmt) <= leftBorder) {
                    Gameboard.game.xOffSet += offSetAmt;
                    Gameboard.game.direction = 1;
                    endOfLine = true;
                    Enemy.updateEnemy(offSetAmt);
                } else {
                    Gameboard.game.xOffSet -= offSetAmt;
                    Enemy.updateEnemy(-offSetAmt);
                }

            }
        }


    }

    return {
        resetEnemy,
        remainingEnemy,
        showEnemy,
        activateNewEnemy,
        moveEnemyDown,
        moveEnemy,
        updateEnemy,
        gameOver,
        enemyList,
        checkCollision
    }
})();

var Player = (function () {

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
        var x = Player.currentPlayer.x - mOffSet;

        if (x < Gameboard.game.x1) {
            Player.currentPlayer.x = Gameboard.game.x1
        } else {
            Player.currentPlayer.x = x
        }

    }

    function moveRight() {
        var mOffSet = imgDetail.imgWidth;
        var xRightBorder = Gameboard.game.width - 40;

        var x = Player.currentPlayer.x + mOffSet;

        if (x >= xRightBorder) {
            Player.currentPlayer.x = xRightBorder;
        } else {
            Player.currentPlayer.x = x;
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

        Gameboard.ctx.font = 'italic 12pt Calibri';
        Gameboard.ctx.fillStyle = "white";
        Gameboard.ctx.fillText(scoreCard, 20, 20);
    }

    function showPlayer(x, y) {

        Gameboard.ctx.drawImage(imgDetail.playerImage, currentPlayer.x, currentPlayer.y, imgDetail.imgWidth * 2, imgDetail.imgHeight * 2);
    }

    return {
        updateScore,
        updateScoreCard,
        currentPlayer,
        showPlayer,
        playerAlive,
        moveLeft,
        moveRight
    }
})();

leftKey.addEventListener('click', function (e) {
    prevKeyCode = e.keyCode;
    keyIsPress = true;
    Player.moveLeft();
});

rightKey.addEventListener('click', function (e) {
    prevKeyCode = e.keyCode;
    keyIsPress = true;
    Player.moveRight();
});

shootKey.addEventListener('click', function (e) {
    targetFound = false;
    if (keyIsPress) {

        if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
            Player.moveLeft();
        } else if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
            Player.moveRight();
        }
    }

    Bullets.shoot();
});

window.addEventListener('keydown', keyDown);

function keyDown(e) {

    if ((e.keyCode === 37) || (e.keyCode === 65)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        Player.moveLeft();
    } else if ((e.keyCode === 39) || (e.keyCode === 68)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        Player.moveRight();
    } else if (e.keyCode === 27) {
        stopGame()
    }

}

window.addEventListener('keypress', function (e) {

    if (e.keyCode === 32 || e.keyCode === 38) {
        targetFound = false;
        if (keyIsPress) {

            if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
                Player.moveLeft();
            } else if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
                Player.moveRight();
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
                Gameboard.ctx.drawImage(missile, bulletList[i].x, bulletList[i].y, bulletList[i].width, bulletList[i].height);

                // Gameboard.ctx.beginPath();
                // Gameboard.ctx.arc(bulletObj.x, bulletObj.y, 10, 0, 20); //Math.PI * 2);
                // Gameboard.ctx.rect(bulletList[i].x, bulletList[i].y, bulletList[i].width, bulletList[i].height)
                // Gameboard.ctx.fillStyle = bulletList[i].color;
                // Gameboard.ctx.fill();
                // Gameboard.ctx.closePath();
                // Gameboard.ctx.fillStyle = bulletObj.color;
                // Gameboard.ctx.fillRect(bulletObj.x, bulletObj.y, bulletObj.width, bulletObj.height);

                if (Enemy.checkCollision(bulletList[i].x, bulletList[i].y, bulletList[i].x + bulletList[i].width, bulletList[i].y + bulletList[i].height)) {

                    // var collisionImg = new Image();
                    // collisionImg.src = 'images/background05.png';
                    // Gameboard.ctx.drawImage(collisionImg, 0, 0, Gameboard.game.width, Gameboard.game.height)

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
                if (bulletList[i].y <= Gameboard.game.startY) {
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
            x: Player.currentPlayer.x + imgDetail.imgWidth - bulletObj.width / 2,
            y: Player.currentPlayer.y,
            startX: bulletObj.startX,
            startY: bulletObj.startY,
            color: bulletObj.color,
            width: bulletObj.width,
            height: bulletObj.height,
            velocity: (progress / 80) * Gameboard.game.yBuffer,
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




function render() {

    var ct = Date.now();

    progress = ct - start;


    // Gameboard.clearGameBoard();

    Gameboard.showBackground();

    
    Enemy.showEnemy();
    Player.showPlayer(Player.currentPlayer.x, Player.currentPlayer.y);
    Bullets.drawBullet();
    Player.updateScoreCard(Player.currentPlayer.playerNo);
    Enemy.moveEnemy();

    
    if (!endGame) {
        requestAnimationFrame(render);
    }

    start = ct;
}

Gameboard.resetGameBoard();
Bullets.resetBulletList();

// Setting current player location
Player.currentPlayer.playerNo = 1;
Player.currentPlayer.x = Gameboard.game.x2 / 2;
Player.currentPlayer.y = Gameboard.game.y2 - Gameboard.game.yBuffer;

requestAnimationFrame(render);

// Gameboard.resetGameBoard();
// Enemy.resetEnemy();
// Bullets.resetBulletList();

// requestAnimationFrame(render);