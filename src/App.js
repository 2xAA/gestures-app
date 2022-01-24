import styled from "styled-components"
// import Home from "./pages/home/Home"
import background from "assets/images/background.jpg"
import Recording from "components/recording/Recording"

import Scene from "components/geometry/Scene"

function App() {
  return (
    <Holder>
      <Recording />
      <DisplayHolder>
        <Scene />
      </DisplayHolder>
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

  overflow: hidden;
`

const DisplayHolder = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 0);
  margin-top: 2em;

  border: white solid 2px;
  position: absolute;
  width: 100%;
  height: 50%;
  max-width: 640px;
  max-height: 500px;
`

export default App
