import { useEffect, useState } from "react"
import styled from "styled-components"
import { useStore } from "../state/store"
import { animated, useTransition } from "@react-spring/web"

// let textFile = null

// const makeTextFile = text => {
//   var data = new Blob([text], { type: "text/plain" })

//   if (textFile !== null) {
//     window.URL.revokeObjectURL(textFile)
//   }

//   textFile = window.URL.createObjectURL(data)

//   return textFile
// }

function RecordingUI() {
  const canRecord = useStore(state => state.canRecord)
  // const linkRef = useRef()

  const transition = useTransition(canRecord, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 30
  })

  useEffect(() => {
    console.log("CARECORD", canRecord)
  }, [canRecord])

  // const handleSaveClick = data => {
  //   linkRef.current.href = makeTextFile(data)
  // }

  return (
    <>
      <Holder>
        <Title>Raise Hand</Title>
        {transition(
          (style, item) => item && <AnimatedCountdown style={style} />
        )}
      </Holder>
    </>
  )
}

const AnimatedCountdown = animated(Countdown)

function Countdown({ style }) {
  const [state, set] = useState(3)

  useEffect(() => {
    if (state && state > 0) {
      setTimeout(() => set(state - 1), 1000)
    }

    if (state === 0) {
      console.log("recording")

      setTimeout(() => set(null), 2000)
    }
  }, [state])

  return (
    <RecordCountdown
      style={{ ...style, backgroundColor: state > 0 ? "#fffffcc" : "#D34F2D" }}
    >
      {state > 0 ? (
        <span> Recording in .. {state}</span>
      ) : state !== null ? (
        <span>recording gesture</span>
      ) : (
        <span>play</span>
      )}
    </RecordCountdown>
  )
}

const Title = styled.div`
  color: white;
  font-size: 3em;
`

const RecordCountdown = styled(animated.div)`
  border: white solid 2px;
  color: white;
  text-align: center;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  width: 9em;
  height: 3em;

  background-color: #dcdcdc55;
`

// const SaveButton = styled.a`
//   flex: 1;
//   z-index: 10;
//   background-color: blue;
// `

const Holder = styled.div`
  position: absolute;
  width: 100%;
  height: 20%;
  /* border: orange 2px solid; */
  bottom: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export default RecordingUI