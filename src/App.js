import styled from "styled-components"
// import Home from "./pages/home/Home"
import background from "assets/images/background.jpg"
import Recording from "components/recording/Recording"
import { useStore } from "state/store"

import Scene from "components/geometry/Scene"
import { handData } from "resources/dummy-data"

function App() {
  const points = useStore((state) => state.points)

  const galleryExamplePoints = handData

  return (
    <Holder>
      <Recording />
      <DisplayHolder style={{ width: "100%" }}>
        <Scene points={points} />
      </DisplayHolder>

      <Gallery>
        {[...galleryExamplePoints, ...galleryExamplePoints].map((data, i) => (
          <DisplayHolder key={i}>
            <Scene useMouseDetection={true} points={data} />
          </DisplayHolder>
        ))}
      </Gallery>
    </Holder>
  )
}

const Holder = styled.div`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;

  padding: 4rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`

const DisplayHolder = styled.div`
  border: white solid 2px;
  max-width: 640px;
  max-height: 480px;
  width: calc(50% - 4px);
  aspect-ratio: 4/3;
`

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 2em;
`

export default App
