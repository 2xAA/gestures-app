import { useState } from "react"
import styled from "styled-components"
// import Home from "./pages/home/Home"
import background from "./assets/images/background.jpg"
import RecordingUI from "./components/RecordingUI"
import Recording from "./components/Recording"

function App() {
  return (
    <Holder>
      <RecordingUI />
      <Recording />
      {/* <Home /> */}
    </Holder>
  )
}

const Holder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`

export default App
