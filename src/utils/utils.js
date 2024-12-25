import uniqid from "uniqid"
import gsap from "gsap"
import useStore from "./store"

const flashAudio = new Audio("/audio/csgo-flashbang.mp3")
let flashTween = null

export const flashUser = () => {
  if (flashTween) flashTween.kill()

  flashAudio.currentTime = 0
  flashAudio.play()
  document.querySelector('.flashbang').style.opacity = 1

  flashTween = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  })
}

export const rickRoll = () => {
  useStore.getState().switchRickRoll()

  setTimeout(()=>{
    useStore.getState().switchRickRoll()
  }, 5000)
}

export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed"]
  const selectedMode = modes[Math.floor(Math.random() * modes.length)]

  useStore.getState().addMode(selectedMode)

  setTimeout(()=>{
    useStore.getState().removeMode(selectedMode)
  }, 1000)
}

export const shake = () => {
  gsap.to('#board', {
    duration: 0.1,
    x: "+=20%",
    yoyo: true,
    repeat: 9
  })
}

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
    case 90:
      if (direction.current !== "UP") {
        direction.current = "DOWN"
      }
      break
    case 40:
    case 83:
      if (direction.current !== "DOWN") {
        direction.current = "UP"
      }
      break
    case 37:
    case 81:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT"
      }
      break
    case 39:
    case 68:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT"
      }
      break

    default:
      break
  }
}

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
    case 90:
      if (direction.current !== "DOWN") {
        direction.current = "UP"
      }
      break
    case 40:
    case 83:
      if (direction.current !== "UP") {
        direction.current = "DOWN"
      }
      break
    case 37:
    case 81:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT"
      }
      break
    case 39:
    case 68:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT"
      }
      break

    default:
      break
  }
}

export const generateRandomCoordinates = (mode) => {
  const id = uniqid()
  let min = 0
  let max = 49
  let x, y

  if (mode.includes("corner")) {
    const side = Math.random()

    if (side <= 0.25) {
      x = min
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
      y *= 10
    } else if (side > 0.25 && side <= 0.5) {
      x = max * 10
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
      y *= 10
    } else if (side > 0.5 && side <= 0.75) {
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
      x *= 10

      y = max * 10
    } else if (side > 0.75) {
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
      x *= 10

      y = min
    }
  } else {
    x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2

    x *= 10

    y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2

    y *= 10
  }

  return { x, y, id }
}
