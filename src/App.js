import React, { useState, useEffect, useRef } from "react"
import './App.css';

function App() {
  const [image, setImage] = useState(null)
  const canvas = useRef(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')

  useEffect(() => {
    const xiBookImageTemplate = new Image();
    xiBookImageTemplate.src = "/images/XiBook_Template.jpg"
    xiBookImageTemplate.onload = () => setImage(xiBookImageTemplate)
  }, [])

  useEffect(() => {
    if (image && canvas) {
      const ctx = canvas.current.getContext("2d")
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, 400, 256 + 80)
      // ctx.drawImage(image, (400 - 256) / 2, 40)
      ctx.drawImage(image,0,0)

      ctx.font = "20px Comic Sans MS"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"

      ctx.fillText(topText, (400 / 2), 25)
      ctx.fillText(bottomText, (400 / 2), 256 + 40 + 25)

    }
  }, [image, canvas, topText, bottomText])

  return (
    <div>
      <h1>Cat Meme!</h1>

      <div>
        <canvas
          ref={canvas}
          width={800}
          height={256 + 80}
        />
      </div>

      <div>
        <input type="text"
          value={topText}
          onChange={e => setTopText(e.target.value)}
        />
        <br />
        <input type="text"
          value={bottomText}
          onChange={e => setBottomText(e.target.value)}
        />
      </div>

    </div>
  )
}

export default App;
