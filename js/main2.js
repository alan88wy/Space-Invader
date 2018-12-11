var imgDetail = (function () {

    var imgWidth = 24;
    var imgHeight = 24;

    var imageList = [];

    var enemyImageUrl = [
        "images/invader01.png",
        "images/invader02.png",
        "images/invader03.png",
        "images/invader04.png",
        "images/invader05.jpg",
        "images/invader06.jpg"
    ];

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

    return {
        imgWidth,
        imgHeight,
        imageList,
        playerImage
    }
})();

var gameBoard = (function () {
    var game = {
        // width: window.screen.availWidth,
        // height: window.screen.availHeight,
        width: document.body.clientWidth,
        height: document.body.clientHeight,
        x1: 10,
        x2: 0,
        y1: 10,
        y2: 0,
        xBuffer: 0,
        yBuffer: 0,
        startX: 0,
        startY: 0,
        xOffSet: 0,
        noOfEnemyPerRow: 0,
        noOfRow: 0,
        lastRow: 0,
        lastEnemyRow: 0,
        rowOfEnemy: 0,
        direction: 1,
        verocity: 0
    }

    game.xBuffer = imgDetail.imgWidth + 10;
    game.yBuffer = imgDetail.imgHeight + 10

    // game.x1 = game.xBuffer * 2;
    // game.y1 = game.yBuffer * 2;

    game.x2 = game.width;
    game.y2 = game.height;
    game.startX = game.x1 + game.xBuffer * 2;
    game.startY = game.y1 + game.yBuffer * 2;
    game.noOfEnemyPerRow = Math.floor((game.width - 4 * game.xBuffer) / game.xBuffer);
    game.noOfRow = Math.floor((game.height - game.yBuffer) / game.yBuffer);
    game.lastEnemyRow = Math.floor(game.noOfRow * 0.5);
    game.movingDirection = 1;
    game.movingVeroticy = Math.floor(imgDetail.width / 2);
    game.rowOfEnemy = game.noOfRow - 2;
    game.lastRow = Math.floor(game.height / game.yBuffer);

    //create the canvas element
    var gameBoard = document.createElement("canvas");
    // var scoreCard = document.createElement("p");

    // Get the Game Board context
    var ctx = gameBoard.getContext("2d");

    function clearGameBoard() {
        ctx.clearRect(game.x1, game.y1, game.x2, game.y2);
    }

    function initializeGameBoard() {

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
        disable: false
    }

    function displayEnemy(xPos, yPos, numRow) {

        x = xPos - gameBoard.game.xOffSet;
        y = yPos;
        enemyList = [];

        clearEnemy();

        j = 0;
        for (var i = 0; i < numRow; i++) {
            createEnemy(x, y, imgDetail.imageList[j]);
            y = y + gameBoard.game.yBuffer;

            j++;

            if (j > 5) {
                j = 0;
            }
        }
    }

    function clearEnemy() {

        gameBoard.ctx.clearRect(0, 0, 1024, 1024);

    }


    function createEnemy(xPos, yPos, img) {

        var x = xPos;
        var y = yPos;

        // img.onload = function () {
        for (var i = 0; i <= gameBoard.game.noOfEnemyPerRow; i++) {

            gameBoard.ctx.drawImage(img, x, y, imgDetail.imgWidth, imgDetail.imgHeight);

            enemyObj = {
                img: img,
                x1: x,
                x2: x + imgDetail.imgWidth,
                y1: yPos,
                y2: yPos + imgDetail.imgHeight,
                disable: false
            }

            // console.log(enemyObj);
            enemyList.push(enemyObj);

            x = x + gameBoard.game.xBuffer;

        }

        // }
    }

    return {
        displayEnemy,
        enemyList
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
        currentX: 0,
        currentY: 0
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
        gameBoard.ctx.drawImage(imgDetail.playerImage, x, y, imgDetail.imgWidth * 2, imgDetail.imgHeight * 2);
    }

    var x = gameBoard.game.x1;
    var y = gameBoard.game.height;

    // currentPlayer.currentX = x;
    // currentPlayer.currentY = y;

    displayPlayer(x, y);

    return {
        updateScoreCard,
        currentPlayer,
        displayPlayer
    }
})();

// gameBoard.addEventListener('click', function (e) {
//     // r = gameBoard.getBoundingClientRect();
//     et = e.clientX;

//     console.log("Click value : " + e.clientX + " " + e.clientY);
// })


window.onload = function () {

    // images.loadImages();

    gameBoard.clearGameBoard();
    player.currentPlayer.playerNo = 1;
    player.currentPlayer.currentX = Math.floor(gameBoard.game.x2 / 2);
    player.currentPlayer.currentY = gameBoard.game.y2;

    window.requestAnimationFrame(render)

}

function render() {

    // loadImages();

    gameBoard.clearGameBoard();
    player.updateScoreCard(player.currentPlayer.playerNo);
    enemy.displayEnemy(gameBoard.game.startX, gameBoard.game.startY, gameBoard.game.lastEnemyRow);
    player.displayPlayer(player.currentPlayer.currentX, player.currentPlayer.currentY);
    // player.displayPlayer(Math.floor(gameBoard.game.width/2), gameBoard.game.lastRow);
    // updateEnemy(); // check Collision
    // renderEnemy(); // refresh screen
}

function checkCollision(imgObj) {

}

function startGame() {
    // playerInfo.player1.score = 30;

}

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) {
        var x = Math.floor(player.currentPlayer.currentX - imgDetail.imgWidth / 2);
        if (x < 0) {
            player.currentPlayer.currentX = 0
        } else {
            player.currentPlayer.currentX = x
        }
        render();
    } else if (e.keyCode === 39) {
        var x = Math.floor(player.currentPlayer.currentX + imgDetail.imgWidth / 2);

        if (x > gameBoard.game.x2) {
            player.currentPlayer.currentX = gameBoard.game.x2
        } else {
            player.currentPlayer.currentX = x
        }

        render();
    } else if (e.keycode === 27) {
        stopGame()
    }
}, false);

var noOfSeconds = 0;

var Movement = setInterval(moveEnemy, 300);

function changeOffSet() {

    var offSetAmt = Math.floor(imgDetail.imgWidth / 4);
    var xOffSet = gameBoard.game.xOffSet + offSetAmt;

    if ((gameBoard.game.startX - xOffSet) < gameBoard.game.x1) {
        gameBoard.game.startX = gameBoard.game.x1;
        gameBoard.game.xOffSet = 0;
    } else {
        gameBoard.game.xOffSet -= offSetAmt;
    }
}

function moveEnemy() {

    noOfSeconds += 1;

    if (noOfSeconds > 4) {
        noOfSeconds = 0;
        gameBoard.game.lastEnemyRow += 1;

        if (gameBoard.game.lastEnemyRow >= gameBoard.game.lastRow) {
            stopGame();
            alert("Game Over")
        } else {
            gameBoard.game.xOffSet += gameBoard.game.xBuffer / 4;
            
            render();
        }
    } else {
        changeOffSet();
        render();
    }


}

function stopGame() {
    clearInterval(Movement);
}