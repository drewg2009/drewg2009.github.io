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

window.onload = function() {
    characterImage = document.querySelector("#character")
}

const loadFirstEnemies = () => {
    let newEnemyObjects = []
    for (let i = 0; i < 3; i++) {
        const newEnemyData = {
            x: 600,
            y: (i + 1) * 100,
            speedX: 10 * (i + 1),
        }
        newEnemyObjects.push(newEnemyData)
        const newEnemy = new Image()
        newEnemy.className = "enemy"
        newEnemy.id = "enemy" + i
        newEnemy.style.top = newEnemyData.y + "px"
        newEnemy.style.left = newEnemyData.x + "px"
        newEnemy.onload = function() {
            document.body.appendChild(newEnemy)
        }
        newEnemy.src = 'assets/zookeeper.gif'
    }
    enemyDataObjects = [...newEnemyObjects]
    
};

loadFirstEnemies();

const isColliding = () => {
    for (const enemyDataObject of enemyDataObjects) {
        if (enemyDataObject.x >= x && enemyDataObject.x < x + characterWidth && enemyDataObject.y < y + characterHeight && enemyDataObject.y > y) {
            return true
        }
    }
    return false

}

const handleMove = (event) => {

    if (!gameOver) {
        if (event.clientY > 0 && event.clientY <= 400) {
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
                document.body.append("Game Over!")
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