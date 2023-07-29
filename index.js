const characterX = 20;
let characterY;
let gameStarted = false;
let score = 0;
let enemyDataObjects = []
let powerUps
let characterWidth = 90;
let characterHeight = 90;
let enemyHeight = 75;
let characterImage;
let gameOver = false;
let gameLoop;
let level = 1
let idForEnemy = 1;
let idForPowerup = 1;
let startButton;
let gameContainerHeight;
let header;
let startButtonY;

/**
 * Audio credit 
 * 
 * Stepping Along The Sky by TeknoAXE | http://teknoaxe.com
Music promoted by https://www.free-stock-music.com
Creative Commons / Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/
 */
let gameAudio = new Audio('./assets/teknoaxe-stepping-along-the-sky.mp3')
gameAudio.onended = function () {
    this.currentTime = 0;
    this.play()
}

window.onload = function () {
    characterImage = document.querySelector("#character")
    startButton = document.querySelector("#startButton")
    header = document.querySelector("#header")

    startButtonY = startButton.getBoundingClientRect().top

    gameContainerHeight = window.innerHeight - startButton.clientHeight - header.clientHeight

    document.addEventListener('mousemove', function(event) {
        handleMove(event)
    })

    document.addEventListener('touchmove', function (event) {
        event.preventDefault()
        handleOnTouch(event)
    },  { passive: false })

}

const loadPowerUp = (x, y, speedX) => {
    const newPowerUpData = {
        x,
        y,
        speedX,
        id: idForEnemy
    }
    enemyDataObjects.push(newEnemyData)
    const newEnemy = new Image()
    newEnemy.className = "enemy"
    newEnemy.id = "enemy" + idForEnemy
    newEnemy.style.top = newEnemyData.y + "px"
    newEnemy.style.left = newEnemyData.x + "px"
    newEnemy.onload = function () {
        document.body.appendChild(newEnemy)
    }
    newEnemy.src = 'assets/zookeeper.gif'
}

const loadNewEnemy = (x, y, speedX) => {
    const newEnemyData = {
        x,
        y,
        speedX,
        id: idForEnemy
    }
    enemyDataObjects.push(newEnemyData)
    const newEnemy = new Image()
    newEnemy.className = "enemy"
    newEnemy.id = "enemy" + idForEnemy
    newEnemy.style.top = newEnemyData.y + "px"
    newEnemy.style.left = newEnemyData.x + "px"
    newEnemy.onload = function () {
        document.querySelector("#gameContainer").appendChild(newEnemy)
    }
    newEnemy.src = 'assets/zookeeper.gif'
    idForEnemy++
}

/**
 * Returns if any enemies are colliding with player
 * 
 * We are checking for collisions using bounding boxes of the image tags
 * 
 * If the enemy is within the x bounds of the character and either 
 * colliding from the top or bottom of the character, it's a collision
 * and we return true. 
 * 
 * This also includes a buffer because the images have extra margins so it doesn't appear as a collision.
 * 
 * Otherwise return false.
 * 
 * @returns boolean 
 */
const isColliding = () => {
    const xBuffer = 30
    const yBuffer = 20
    for (const enemyDataObject of enemyDataObjects) {
        if (enemyDataObject.x <= characterX + characterWidth - xBuffer
            && enemyDataObject.x >= characterX
            && ((enemyDataObject.y + enemyHeight >= characterY + yBuffer && enemyDataObject.y + enemyHeight <= characterY + characterHeight)
                || (enemyDataObject.y <= characterY + characterHeight - yBuffer && enemyDataObject.y >= characterY + yBuffer))
        ) {
            return true
        }
    }
    return false
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function setEnemyCount () {
    if (level < 10) {
        enemyCount = 5
    }
    else if (level > 5) {
        enemyCount = getRandomInt(5) + 4
    }
    else if(level > 10) {
        enemyCount = getRandomInt(7) + 5
    }
}

const setupLevel = () => {
    document.querySelector("#level").textContent = level
    document.querySelector("#score").textContent = score

    setEnemyCount()

    for (let i = 0; i < enemyCount; i++) {
        let speedX = getRandomInt(20) + 10
        let newEnemyY = getRandomInt(gameContainerHeight - enemyHeight) + 50
        let newEnemyX = screen.width
        loadNewEnemy(newEnemyX, newEnemyY, speedX)
    }
}

const handleMove = (event) => {
    if (characterImage && event.clientY > header.clientHeight && event.clientY + characterHeight < startButtonY) {
        characterY = event.clientY
        characterImage.style.top = characterY + "px"
    }
};

const handleOnTouch = (event) => {
    const touches = event.touches
    for (const touch of touches) {
        if (characterImage && touch.clientY > 20 && touch.clientY + characterHeight <= gameContainerHeight) {
            characterY = touch.clientY
            characterImage.style.top = characterY + "px"
        }
    }
}

const resetGame = () => {
    gameOver = false
    gameStarted = false
    score = 0
    level = 1
    startButton.disabled = false
    startButton.className = ''
}

const filterOffscreenEnemies = () => {
    // filter out the enemies off screen
    const filteredEnemyObjects = enemyDataObjects.filter((enemy) => {
        if (enemy.x > 0) {
            return true
        }

        let currentEnemy = document.querySelector("#enemy" + enemy.id)
        currentEnemy.remove();
    })

    enemyDataObjects = [...filteredEnemyObjects]

}

function moveEnemies() {

    enemyDataObjects.map(enemyDataObject => {
        let currentEnemy = document.querySelector("#enemy" + enemyDataObject.id)
        currentEnemy.style.left = enemyDataObject.x + "px"
        enemyDataObject.x -= enemyDataObject.speedX
    })

}

const handleGameOver = () => {
    clearInterval(gameLoop)
    gameAudio.pause()
    gameAudio.currentTime = 0
    $('#myModal').modal('show')
    $("#gameOverScore").text(score)
    resetGame()
}

const startGame = () => {

    // gameAudio.play()
    document.querySelector("#score").textContent = score
    enemyDataObjects = []
    document.querySelectorAll(".enemy").forEach(enemy => enemy.remove())
    startButton.disabled = true
    startButton.className = 'disabledButton'

    setupLevel()

    if (!gameStarted) {
        gameStarted = true;

        gameLoop = setInterval(() => {
            if (isColliding()) {
                handleGameOver()
            }

            filterOffscreenEnemies()

            if (enemyDataObjects.length === 0) {
                level++
                score += 10
                setupLevel()
            }
            else {
                moveEnemies()
            }

        }, 34);

    }
};