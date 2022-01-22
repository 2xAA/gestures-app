import { useEffect, useState } from "react"
import styled from "styled-components"
import { useStore } from "../state/store"
import { animated, useTransition } from "@react-spring/web"
import OutputText from "./outputText/OutputText"

function RecordingUI() {
  const canRecord = useStore((state) => state.canRecord)

  const transition = useTransition(canRecord, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 30,
  })

  return (
    <>
      <Holder>
        <Title>raise hand</Title>
        {transition(
          (style, item) => item && <AnimatedCountdown style={style} />
        )}
        <LogPoints />
        <OutputText />
      </Holder>
    </>
  )
}

const AnimatedCountdown = animated(Countdown)

function LogPoints() {
  // const clientsArr = useStore((state) => state.clientsArr)
  return null
  // <SaveData
  //   onClick={() => console.log(clientsArr)}
  //   style={{ right: 0, backgroundColor: "#D34F2D" }}
  // >
  //   <span>
  //     <p>😃</p>
  //   </span>
  // </SaveData>
}

function Countdown({ style }) {
  const [state, set] = useState(3)

  const recording = useStore((state) => state.recording)
  const setRecording = useStore((state) => state.setRecording)
  // const setCanRecord = useStore((state) => state.setCanRecord)

  useEffect(() => {
    if (recording) {
      setTimeout(() => setRecording(false), 1000)
    }
  }, [])

  // useEffect(() => {
  //   if (state && state > 0) {
  //     setTimeout(() => set(state - 1), 1000)
  //   }
  //   if (state === 0) {
  //     setRecording(true)
  //     console.log("RECORDING")
  //     setTimeout(() => {
  //       set(null)
  //       setCanRecord(false)
  //     }, 2000)
  //   }
  // }, [state])

  return (
    <RecordCountdown
      style={{ ...style, backgroundColor: "#D34F2D" }}
      // style={{ ...style, backgroundColor: state > 0 ? "#fffffcc" : "#D34F2D" }}
    >
      {recording ? "true" : "false"}
      {/* {state > 0 ? (
        <span> Recording in .. {state}</span>
      ) : (
        state !== null && <span>recording gesture</span>
      )} */}
      {/* {state > 0 ? (
        <span> Recording in .. {state}</span>
      ) : (
        state !== null && <span>recording gesture</span>
      )} */}
    </RecordCountdown>
  )
}

const Title = styled.div`
  color: #dcdcdcee;
  font-size: 3em;
`

const SaveData = styled.div`
  position: absolute;
  border: #ccc0c033 solid 2px;
  color: #dcdcdccc;
  text-align: center;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  width: 9em;
  height: 2em;

  background-color: #dcdcdc55;
`
const RecordCountdown = styled.div`
  border: #ccc0c0 33solid 2px;
  color: #dcdcdccc;
  text-align: center;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  width: 9em;
  height: 2em;

  background-color: #dcdcdc55;
`

const Holder = styled.div`
  position: absolute;
  width: 100%;
  height: 30%;
  /* border: orange 2px solid; */
  bottom: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

export default RecordingUI
