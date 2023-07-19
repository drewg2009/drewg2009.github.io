"use client";

import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from './page.module.css';
import Image from 'next/image'

function Enemy(props) {

  return (
    <div style={{ left: props.x, top: props.y, position: 'absolute' }}>
      enemy
    </div>
  )
}

export default function Home() {

  const [x, setX] = useState(20);
  const [y, setY] = useState();
  const [score, setScore] = useState(0)
  const [enemies, setEnemies] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [enemyDataObjects, setEnemyDataObjects] = useState([])
  const width = 100
  const height = 100

  console.log('gameOver', gameOver)

  // populate the enemies
  useEffect(() => {
    if (enemyDataObjects.length === 0) {
      let newEnemyObjects = []
      for (let i = 0; i < 3; i++) {
        newEnemyObjects.push({
          x: 600,
          y: (i + 1) * 200,
          speedX: 10 * (i+1), 
        })
      }
      setEnemyDataObjects(newEnemyObjects)

    }
  }, [enemyDataObjects.length])

  const isColliding = useCallback(() => {
    for(const enemyDataObject of enemyDataObjects) {
      // console.log('check collision', x, y, enemyDataObject)
      if (enemyDataObject.x >= x && enemyDataObject.x < x + width && enemyDataObject.y < y + height && enemyDataObject.y > y) {
        return true
      }
    }
    return false

  }, [enemyDataObjects, x, y])

  const handleMove = useCallback((event) => {

    if (!gameOver) {
      if (event.clientY > 0 && event.clientY <= 400) {
        setY(event.clientY);
      }
    }

  }, [gameOver])

  // game loop interval

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (isColliding()) {
          console.log('COLLIDED')
          setGameOver(true)
          clearInterval(interval)
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [gameOver, isColliding])

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setScore(currentScore => currentScore + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver, score]);


  useEffect(() => {
    const interval = setInterval(() => {
      setEnemyDataObjects(enemyDataObjects.map(enemyDataObject => {
        return {
          ...enemyDataObject,
          x: enemyDataObject.x - enemyDataObject.speedX
        }
      }))
    }, 100);
    return () => clearInterval(interval);
  }, [enemyDataObjects]);

  return (
    <div >
      Score:
      <div>
        {score}
      </div>
      {
        gameOver && <p>Game Over!</p>
      }
      <div onMouseMove={handleMove} className={styles.container}>
        <Image width={width} height={height} alt='dancing monkey' src='/dancing-monkey.gif' style={{ "top": y }} className={styles.character} />
        {
          !gameOver && enemyDataObjects.map((enemy, i) =>
            <Enemy key={i} x={enemy.x} y={enemy.y}/>
          )
        }
      </div>

    </div>
  )
}
