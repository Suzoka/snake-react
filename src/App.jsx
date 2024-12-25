import Board from "./components/Board/Board"
import Toggle from "./components/Toggle/Toggle"

function App() {
  return (
    <div>
      <video src="/video/you-died.mp4" id="die-video" className="die-video"></video>
      <div className="flashbang"></div>
      <Board />
      <div className="toggle-wrapper">
        <Toggle mode={"corner"} />
        <Toggle mode={"impossible"} />
        <Toggle mode={"reversed"} />
      </div>
    </div>
  )
}

export default App
