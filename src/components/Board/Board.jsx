import { useEffect, useState, useRef } from "react"
import Snake from "../Snake/Snake"
import gsap from "gsap"
import s from "./Board.module.scss"
import Item from "../Item/Item"
import {
  defaultControls,
  flashUser,
  generateRandomCoordinates,
  rickRoll,
  reversedControls,
  shake,
  triggerMode,
} from "../../utils/utils"
import GameOver from "../GameOver/GameOver"
import useStore from "../../utils/store"
import Submit from "../Submit/Submit"
import Scoreboard from "../Scoreboard/Scoreboard"

const starSound = new Audio("/audio/star.mp3")

const Board = () => {
  const { mode, isRickRoll, removeMode } = useStore()
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ])

  const [trapArray, setTrapArray] = useState([])
  const [starArray, setStarArray] = useState([])
  const [foodArray, setFoodArray] = useState([])
  const [hasEnteredResults, setHasEnteredResults] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(0.2)
  const [score, setScore] = useState(0)
  const [death, setDeath] = useState(0)

  const timer = useRef(0)
  const foodTimer = useRef(0)
  const trapTimer = useRef(0)
  const starTimer = useRef(0)
  const direction = useRef("RIGHT")
  const canChangeDirection = useRef(true)
  const isInStar = useRef(false)

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop)

    setDeath(death + 1)

    const video = document.getElementById("die-video")
    video.style.display = "block"

    video.currentTime = 0
    video.play()

    setGameOver(true)
  }

  const isOutOfBorder = (head) => {

    if (head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0) {
      return true
    } else {
      return false
    }
  }

  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1]

    const item = getter.find(
      (_item) => _item.x === head[0] && _item.y === head[1]
    )

    if (item) {
      const newItemArray = getter.filter((_item) => _item !== item)

      setter(newItemArray)

      return true
    } else {
      return false
    }
  }

  const moveSnake = () => {
    let newSnakeData = [...snakeData]
    let head = [...newSnakeData[newSnakeData.length - 1]]

    switch (direction.current) {
      case "RIGHT":
        head[0] += 10

        break
      case "LEFT":
        head[0] -= 10

        break
      case "DOWN":
        head[1] += 10

        break
      case "UP":
        head[1] -= 10
        break

      default:
        break
    }

    const snakeCollapsed = hasCollapsed(head)
    const outOfBorder = isOutOfBorder(head)
    const snakeAteFood = hasEatenItem({getter: foodArray, setter: setFoodArray})
    const snakeAteTrap = hasEatenItem({getter: trapArray, setter: setTrapArray})
    const snakeAteStar = hasEatenItem({getter: starArray, setter: setStarArray})

    newSnakeData.push(head)

    if ((outOfBorder || snakeCollapsed) && !isInStar.current) {
      gameIsOver()
    } else {
      if (!snakeAteFood) {
        newSnakeData.shift()

        if (snakeAteTrap && !isInStar.current) {
          const effects = [flashUser, triggerMode, shake, rickRoll]

          const selectedEffect = effects[Math.floor(Math.random() * effects.length)]

          selectedEffect()
        }
        if (snakeAteStar) {
          isInStar.current = true
          starSound.currentTime = 0
          starSound.play()

          starSound.addEventListener("ended", () => {
            isInStar.current = false
          })
        }
      } else {
        setScore(score + 10)

        if (speed > 0.05) {
          setSpeed(speed - 0.02)
        }
      }
      if ((!outOfBorder && isInStar.current) || !isInStar.current) setSnakeData(newSnakeData)
    }
  }

  const hasCollapsed = (head) => {
    let snake = [...snakeData]

    snake.pop()

    for (let dot of snake) {
      if (dot[0] === head[0] && dot[1] === head[1]) {
        return true
      }
    }

    return false
  }

  const onKeyDown = (e) => {
    if (canChangeDirection.current === false) return
    canChangeDirection.current = false

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction)
  }

  const addItem = ({getter, setter}) => {
    const coordinates = generateRandomCoordinates(mode)

    const array = [...foodArray, ...trapArray, ...starArray]

    if (array.some((item) => item.x === coordinates.x && item.y === coordinates.y)) {
      addItem({getter, setter})
      return
    }
    setter((oldArray) => [...oldArray, coordinates])
  }

  const gameLoop = (time, deltaTime, frame) => {
    timer.current += deltaTime * 0.001
    foodTimer.current += deltaTime * 0.001
    trapTimer.current += deltaTime * 0.001
    starTimer.current += deltaTime * 0.001

    if (foodTimer.current > 3 && foodArray.length < 5) {
      foodTimer.current = 0
      addItem({getter: foodArray, setter: setFoodArray})
    }

    if (trapTimer.current > 5 && trapArray.length < 3) {
      trapTimer.current = 0
      addItem({getter: trapArray, setter: setTrapArray})
    }

    if (starTimer.current > 5 && starArray.length < 1 && !isInStar.current) {
      starTimer.current = 0
      if (Math.random() > 0.9) {
        addItem({getter: starArray, setter: setStarArray})
      } 
    }

    if (timer.current > (mode.includes("impossible") ? 0.02 : speed)) {
      timer.current = 0
      moveSnake()
      canChangeDirection.current = true
    }
  }

  const replay = () => {
    removeMode("corner")
    removeMode("impossible")
    removeMode("reversed")

    const video = document.getElementById("die-video")
    video.style.display = "none"
    video.pause()

    setGameOver(false)
    setHasEnteredResults(false)
    setSpeed(0.2)
    setScore(0)

    setSnakeData([
      [0, 0],
      [10, 0],
    ])

    setStarArray([])
    setTrapArray([])
    setFoodArray([])

    direction.current = "RIGHT"

    timer.current = 0

    foodTimer.current = 0
    trapTimer.current = 0
    starTimer.current = 0

    isInStar.current = false
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    gsap.ticker.add(gameLoop)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      gsap.ticker.remove(gameLoop)
    }
  }, [snakeData])

  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}

      <div id="board" className={`${s.board} ${isRickRoll ? s.rickRoll : ""}`}>
        <Snake data={snakeData} star={isInStar.current} />

        <span className={s.score}>Score: {score}</span>
        <span className={s.death}>Death: {death}</span>

        {gameOver && <GameOver replay={replay} />}

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" />
        ))}

        {starArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="star" />
        ))}


      </div>
    </>
  )
}

export default Board
