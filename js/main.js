var progress = 0;
var endOfLine = false;
var targetFound = false;
var keyIsPress = false;
var prevKeyCode = 0;

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
        // width: document.body.clientWidth,
        // height: document.body.clientHeight,
        // width: 600,
        // height: 600,
        width: window.innerWidth,
        height: window.innerHeight,
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

    game.xBuffer = imgDetail.imgWidth + 10;
    game.yBuffer = imgDetail.imgHeight + 10

    // game.x1 = game.xBuffer * 2;
    // game.y1 = game.yBuffer * 2;

    game.x2 = game.width - 10;
    game.y2 = game.height - 10;
    game.maxOffSet = Math.floor(game.xBuffer * 2);
    game.startX = game.x1 + game.xBuffer * 2;
    game.startY = game.y1 + game.xBuffer * 4;
    game.noOfEnemyPerRow = Math.floor((game.width - 4 * game.xBuffer) / game.xBuffer);
    // game.noOfRow = Math.floor((game.height - game.yBuffer) / game.yBuffer);
    // game.lastEnemyRow = Math.floor(game.noOfRow * 0.3);
    game.direction = 1;
    game.verocity = Math.floor(imgDetail.width / 2);
    // game.rowOfEnemy = game.noOfRow - 2;
    // game.lastRow = Math.floor(game.height / game.yBuffer);

    var ctx = "";


    function clearGameBoard() {
        ctx.clearRect(0, 0, game.width, game.height);
    }

    function initializeGameBoard() {

        //create the canvas element
        var gameBoard = document.createElement("canvas");
        // var scoreCard = document.createElement("p");

        // Set the game board width and height

        gameBoard.width = game.width;
        gameBoard.height = game.height;
        // gameBoard.margin = "0 30px 0 30px";
        // gameBoard.padding = "30px";
        // gameBoard.border = "10px";
        // Get the Game Board context
        ctx = gameBoard.getContext("2d");

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
        clearGameBoard
    }

})();

function generateRandomNumber(x) {
    return Math.floor(Math.random() * x)
}

var enemy = (function () {
    var enemyList = [];
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

    function updateEnemy(xoffSetAmt) {
        for (var i = enemyList.length - 1; i >= 0; i--) {

            enemyList[i].x1 = enemyList[i].x1 + xoffSetAmt;
            enemyList[i].x2 = enemyList[i].x2 + xoffSetAmt;

        }
    }

    function displayEnemy() {

        // updateEnemy();

        // for (var i = 0; i < enemyList.length; i++) {
        for (var i = enemyList.length - 1; i >= 0; i--) {

            // console.log(enemyList[i].x1);
            if (!enemyList[i].disable) {
                var x = enemyList[i].x1; //+ gameBoard.game.xOffSet;
                var y = enemyList[i].y1;
                var img = enemyList[i].img;
                gameBoard.ctx.drawImage(img, x, y, imgDetail.imgWidth, imgDetail.imgHeight);
            }
        }
    }

    function createEnemy() {

        var x = gameBoard.game.startX;
        var y = gameBoard.game.startY; //+ gameBoard.game.totalNoOfRow * gameBoard.game.yBuffer;
        var numRow = gameBoard.game.totalNoOfRow;

        enemyList = [];

        gameBoard.game.noOfRowOfEnemy = 3;

        for (var i = 0; i < numRow; i++) {

            var disable = false;

            if (i >= gameBoard.game.noOfRowOfEnemy) {
                disable = true;
            }

            addRowOfEnemy(x, y, disable);
            y = y - gameBoard.game.yBuffer;

            maxY = maxY <= y ? y : maxY;

        }
    }

    createEnemy();

    function moveEnemyDown() {
        for (var i = 0; i < enemyList.length; i++) {
            enemyList[i].y1 = enemyList[i].y1 + gameBoard.game.yBuffer;
            enemyList[i].y2 = enemyList[i].y2 + gameBoard.game.yBuffer;
            maxY = maxY <= enemyList[i].y1 ? enemyList[i].y1 : maxY;
        }

    }

    function addRowOfEnemy(xPos, yPos, disableEnemy) {

        var x = xPos;

        var img = imgDetail.getEnemyImage();

        for (var i = 0; i < gameBoard.game.noOfEnemyPerRow; i++) {

            var enemyObj = {
                img: img,
                x1: x,
                x2: x + imgDetail.imgWidth,
                y1: yPos,
                y2: yPos + imgDetail.imgHeight,
                points: 10,
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

        if (targetFound) {
            return 0
        }

        for (var i = 0; i < enemyList.length; i++) {
            if (!enemyList[i].disable) {

                if (((x1 >= enemyList[i].x1 && x1 <= enemyList[i].x2) ||
                        (x2 >= enemyList[i].x1 && x2 <= enemyList[i].x2)) &&
                    (y1 <= enemyList[i].y2)) {
                    enemyList[i].disable = true;
                    player.updateScore(enemyList[i].points);
                    targetFound = true;
                    break
                }
            }

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

    return {
        displayEnemy,
        activateNewEnemy,
        moveEnemyDown,
        updateEnemy,
        gameOver,
        enemyList,
        checkCollision
    }
})();

var player = (function () {

    var playerInfo = {
        player1: {
            score: 0
        },
        player2: {
            score: 0
        }
    }

    var currentPlayer = {
        playerNo: 1,
        x: 0,
        y: 0
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
        var xRightBorder = gameBoard.game.width - gameBoard.game.maxOffSet;
        var x = player.currentPlayer.x + mOffSet;
        if (x >= xRightBorder) {
            player.currentPlayer.x = xRightBorder;
        } else {
            var x = player.currentPlayer.x + mOffSet;
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
        moveLeft,
        moveRight
    }
})();

window.addEventListener('keydown', keyDown);

function keyDown(e) {


    console.log(e.keyCode);
    if ((e.keyCode === 37) || (e.keyCode === 65)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        player.moveLeft();
    }

    if ((e.keyCode === 39) || (e.keyCode === 68)) {
        prevKeyCode = e.keyCode;
        keyIsPress = true;
        player.moveRight();
    }

    if (e.keyCode === 27) {
        stopGame()
    }

    if (e.keyCode === 32 || e.keyCode === 38) {
        targetFound = false;
        Bullets.shoot();

        if (keyIsPress) {
            if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
               
                player.moveLeft();
            }

            if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
                console.log("I mean 39");
                player.moveRight();
            }
        }

    }

    // if (e.keyCode === 32 || e.keyCode === 38) {
    //     targetFound = false;
    //     Bullets.shoot();
    // }
}

window.addEventListener('keyup', keyUp);

function keyUp(e) {

 
    if (e.keyCode === 32 || e.keyCode === 38) {
        targetFound = false;
        Bullets.shoot();

        if (keyIsPress) {
            if ((prevKeyCode === 37) || (prevKeyCode === 65)) {
               
                player.moveLeft();
            }

            if ((prevKeyCode === 39) || (prevKeyCode === 68)) {
                console.log("I mean 39");
                player.moveRight();
            }
        }

    }

    if (keyIsPress && e.keyCode === 37) {
        // keyIsPress = false;
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveLeft();
    }

    if (keyIsPress && prevKeyCode === 39) {
        // keyIsPress = false;
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveRight();
    }
    // if ((prevKeyCode === 37) || (prevKeyCode === 39)) {
    //     keyIsPress = false;
    // }
};



window.addEventListener('keypress', function (e) {

    if (e.keyCode === 37) {
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveLeft();
    }

    if (e.keyCode === 39) {
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveRight();
    }

    if (e.keyCode === 65) {
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveLeft();
    }

    if (e.keyCode === 68) {
        keyIsPress = true;
        prevKeyCode = e.keyCode;
        player.moveRight();
    }

});

var Bullets = (function () {

    bulletObj = {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        color: "#FFFFFF", // '#000000',
        width: 10,
        height: 4,
        velocity: 0,
        active: false
    };

    function drawBullet() {

        if (bulletObj.active) {
            gameBoard.ctx.fillStyle = bulletObj.color;
            gameBoard.ctx.fillRect(bulletObj.x, bulletObj.y, bulletObj.width, bulletObj.height);
            updateBullet();
        }

    };

    function updateBullet() {
        if (targetFound) {
            bulletObj.active = false;
        }

        if (bulletObj.active) {

            if (bulletObj.y <= gameBoard.game.startY) {
                bulletObj.active = false;
            } else {
                bulletObj.y = bulletObj.y - bulletObj.velocity;
                enemy.checkCollision(bulletObj.x, bulletObj.y, bulletObj.x + bulletObj.width, bulletObj.y + bulletObj.height);
            }
        }
    };

    function shoot() {

        if (!bulletObj.active) {
            targetFound = false;
            bulletObj.active = true;
            bulletObj.velocity = (progress / 30) * gameBoard.game.yBuffer;
            bulletObj.x = player.currentPlayer.x + imgDetail.imgWidth / 2 - bulletObj.width / 2;
            bulletObj.y = player.currentPlayer.y;
        }

    }

    return {
        updateBullet,
        drawBullet,
        shoot
    }


})();

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

    Bullets.drawBullet();
    // debugger;
    player.updateScoreCard(player.currentPlayer.playerNo);
    player.displayPlayer(player.currentPlayer.x, player.currentPlayer.y);
    moveEnemy();
    enemy.displayEnemy();


    if (!endGame) {
        requestAnimationFrame(render);
    }

    start = ct;
}


requestAnimationFrame(render);