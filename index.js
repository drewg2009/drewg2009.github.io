const x = 20;
let y;
let gameStarted = false;
let score = 0;
let enemyDataObjects = []
let characterWidth = 100;
let characterHeight = 100;
let enemyWidth = 100
let characterImage;
let gameOver = false;
let scoreInterval, gameLoop, enemyInterval
let level = 1

window.onload = function() {
    characterImage = document.querySelector("#character")
}

const loadNewEnemy = (x, y, speedX, id) => {
    const newEnemyData = {
        x, 
        y, 
        speedX,
        id: "enemy" + id
    }
    enemyDataObjects.push(newEnemyData)
    const newEnemy = new Image()
    newEnemy.className = "enemy"
    newEnemy.id = newEnemyData.id
    newEnemy.style.top = newEnemyData.y + "px"
    newEnemy.style.left = newEnemyData.x + "px"
    newEnemy.onload = function() {
        document.body.appendChild(newEnemy)
    }
    newEnemy.src = 'assets/zookeeper.gif'
}

const loadFirstEnemies = () => {
    for (let i = 0; i < 3; i++) {
        loadNewEnemy(600, (i+1) * 100, (i + 1) * 10, i)
    }
    
};

loadFirstEnemies();

const isColliding = () => {
    for (const enemyDataObject of enemyDataObjects) {
        if (enemyDataObject.x <= x + characterWidth && enemyDataObject.x >= x && enemyDataObject.y <= y + characterHeight && enemyDataObject.y >= y) {
            return true
        }
    }
    return false

}

const handleMove = (event) => {

    if (!gameOver) {
        if (event.clientY > 0 && event.clientY <= 800) {
            y = event.clientY
            characterImage.style.top = event.clientY + "px"
        }
    }

};

const startGame = () => {
    if (!gameStarted) {
        gameStarted = true;
        scoreInterval = setInterval(() => {
            score++
            document.querySelector("#score").textContent = score
        }, 1000);

        gameLoop = setInterval(() => {
            if (isColliding()) {
                gameOver = true
                alert("Game Over!")
                clearInterval(gameLoop)
                clearInterval(scoreInterval)
                clearInterval(enemyInterval)
            }
        }, 30);

        enemyInterval = setInterval(() => {
            const updatedEnemyObjects = enemyDataObjects.map(enemyDataObject => {
                return {
                    ...enemyDataObject,
                    x: enemyDataObject.x - enemyDataObject.speedX
                }
            })
            // filter out the enemies off screen
            const filteredEnemyObjects = updatedEnemyObjects.filter((enemy, index) => {
                if(enemy.x - enemyWidth > -1 * enemyWidth) {
                    return true
                }
                document.querySelector("#enemy" + index).remove();
            })

            enemyDataObjects = [...filteredEnemyObjects]

            enemyDataObjects.map((enemyDataObject, index)=> {
                document.querySelector("#enemy" + index).style.left = enemyDataObject.x + "px"
            })
        }, 100);

    }
};