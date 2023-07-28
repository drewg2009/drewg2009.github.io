const characterX = 20;
let characterY;
let gameStarted = false;
let score = 0;
let enemyDataObjects = []
let characterWidth = 90;
let characterHeight = 90;
let enemyHeight = 75;
let characterImage;
let gameOver = false;
let gameLoop, enemyInterval
let level = 1
let idForEnemy = 1;
let startButton;

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

    document.addEventListener('touchmove', function (event) {
        handleOnTouch(event)
    }, false)
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
        document.body.appendChild(newEnemy)
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

const setupLevel = () => {
    document.querySelector("#level").textContent = level

    if (level < 10) {
        enemyCount = 3
    }
    else if (level > 10 && level < 20) {
        enemyCount = getRandomInt(3) + 4
    }

    for (let i = 0; i < enemyCount; i++) {
        let speedX = getRandomInt(20) + 5
        let newEnemyY = getRandomInt(500) + 20
        let newEnemyX = 600
        loadNewEnemy(newEnemyX, newEnemyY, speedX)
    }
}

const handleMove = (event) => {
    if (characterImage && event.clientY > 20 && event.clientY <= 500) {
        characterY = event.clientY
        characterImage.style.top = characterY + "px"
    }
};

const handleOnTouch = (event) => {
    const touches = event.touches
    for (const touch of touches) {
        if (characterImage && touch.clientY > 20 && touch.clientY <= 500) {
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

const startGame = () => {

    // gameAudio.play()
    document.querySelector("#score").textContent = score
    document.querySelector("#level").textContent = setupLevel
    enemyDataObjects = []
    document.querySelectorAll(".enemy").forEach(enemy => enemy.remove())
    startButton.disabled = true
    startButton.className = 'disabledButton'

    setupLevel()

    if (!gameStarted) {
        gameStarted = true;
        gameLoop = setInterval(() => {
            if (isColliding()) {
                clearInterval(gameLoop)
                clearInterval(enemyInterval)
                gameAudio.pause()
                gameAudio.currentTime = 0
                $('#myModal').modal('show')
                $("#gameOverScore").text(score)
                resetGame()

            }
        }, 34);

        enemyInterval = setInterval(() => {

            // filter out the enemies off screen
            const filteredEnemyObjects = enemyDataObjects.filter((enemy) => {
                if (enemy.x > 0) {
                    return true
                }

                let currentEnemy = document.querySelector("#enemy" + enemy.id)
                currentEnemy.remove();
            })

            enemyDataObjects = [...filteredEnemyObjects]

            enemyDataObjects.map(enemyDataObject => {
                enemyDataObject.x -= enemyDataObject.speedX
            })

            if (enemyDataObjects.length === 0) {
                level++
                score += 10
                document.querySelector("#score").textContent = score
                setupLevel()
            }
            else {
                enemyDataObjects.map((enemyDataObject, index) => {
                    let currentEnemy = document.querySelector("#enemy" + enemyDataObject.id)
                    currentEnemy.style.left = enemyDataObject.x + "px"
                })
            }

        }, 34);

    }
};