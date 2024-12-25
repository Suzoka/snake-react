import s from "./Snake.module.scss"

const Snake = ({ data, star }) => {

  const getStyle = (dot, i) => {
    let style = {
      transform: `translate(${dot[0]}px, ${dot[1]}px)`,
      background: `url("${star ? "/img/star-sprite.png" : "/img/skin.jpg"}") ${-10 * i}px 0`
    }

    return style
  }

  return (
    <>
      {data.map((dot, i) => (
        <div
          key={i}
          className={`${s.snakeDot} ${star ? s.star : ""}`}
          style={getStyle(dot, i)}
        ></div>
      ))}
    </>
  )
}

export default Snake
