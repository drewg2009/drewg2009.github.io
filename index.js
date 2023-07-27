const x = 20;
let y;
let gameStarted = false;
let score = 0;
let enemyDataObjects = []
let characterWidth = 100;
let characterHeight = 100;
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
gameAudio.onended = function() {
    this.currentTime = 0;
    this.play()
}

window.onload = function () {
    characterImage = document.querySelector("#character")
    startButton = document.querySelector("#startButton")
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

const isColliding = () => {
    for (const enemyDataObject of enemyDataObjects) {
        if (enemyDataObject.x <= x + characterWidth && enemyDataObject.x >= x && enemyDataObject.y <= y + characterHeight && enemyDataObject.y >= y) {
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

    let enemyCount;
    if (level < 10) {
        enemyCount = 3
    }
    else if (level > 10 && level < 20) {
        enemyCount = getRandomInt(3) + 4

    }

    for (let i = 0; i < enemyCount; i++) {
        let speedX = getRandomInt(20) + 5
        let y = getRandomInt(500) + 20
        let x = 600
        loadNewEnemy(x, y, speedX)
    }
}

const handleMove = (event) => {
    if (!gameOver) {
        if (event.clientY > 0 && event.clientY <= 500) {
            y = event.clientY
            characterImage.style.top = event.clientY + "px"
        }
    }
};

const resetGame = () => {
    gameOver = true
    gameStarted = false
    score = 0
    level = 1
    startButton.disabled = false
    startButton.className = ''
}

const startGame = () => {

    gameAudio.play()
    document.querySelector("#score").textContent = score
    document.querySelector("#level").textContent = setupLevel
    enemyDataObjects = []
    document.querySelectorAll(".enemy").forEach(enemy => enemy.remove())
    gameOver = false
    startButton.disabled = true
    startButton.className = 'disabledButton'

    setupLevel()

    if (!gameStarted) {
        gameStarted = true;
        gameLoop = setInterval(() => {
            if (isColliding()) {
                alert('Game over!')
                resetGame()
                clearInterval(gameLoop)
                clearInterval(enemyInterval)
                gameAudio.pause()
                gameAudio.currentTime = 0
            }
        }, 30);

        enemyInterval = setInterval(() => {

            // filter out the enemies off screen
            const filteredEnemyObjects = enemyDataObjects.filter((enemy) => {
                if (enemy.x > 0) {
                    return true
                }

                let currentEnemy = document.querySelector("#enemy" + enemy.id)
                // if (currentEnemy) {
                currentEnemy.remove();
                // }
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
                    // if (currentEnemy) {
                    currentEnemy.style.left = enemyDataObject.x + "px"
                    // }
                })
            }

        }, 34);

    }
};