import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box, Html, OrbitControls, Sphere } from "@react-three/drei"
import { Hands } from "@mediapipe/hands"
import * as cam from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import Webcam from "react-webcam"
import { useStore } from "state/store"
import styled from "styled-components"

// return "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635986972/".concat(e)

export function LogTest() {
  // console.log("renderLogtest")

  const [length, set] = useState(0)

  const clientsArr = useStore((state) => state.clientsArr)
  const canRecord = useStore((state) => state.canRecord)

  // const clientsArr = useStore.getState().clientsArr

  const ref = useRef()
  const curr = useRef()

  useEffect(() => {
    // console.log("CANRECORD")
    ref.current.innerHTML = `${clientsArr.length} <br/>  ${
      canRecord ? "true" : "false"
    }`
  }, [canRecord])

  // const handleClick = (v) => {
  //   console.log("click")
  //   // console.log(clientsArr)
  //   set(v)
  // }

  // useEffect(() => {
  //   console.log(length)
  //   ref.current.innerText = length

  //   // console.dir("LOG", clientsArr)
  //   // console.dir("TESXT", clientsArr.length)
  //   // // if (clientsArr.isArray)
  // }, [set, clientsArr])

  return (
    <div
      ref={ref}
      // onClick={() => handleClick(clientsArr.length)}
      style={{
        position: "absolute",
        right: "4em",
        fontSize: "2rem",
        color: "blue",
        background: "none",
        border: "1px solid gray",
        height: "80px",
        width: "80px",
      }}
    >
      {/* {Math.round(frameTime)} */}
      <br />
      {/* {clientsArr.length} */}
    </div>
  )
}

function Recording() {
  const [isTrue, setIsTrue] = useState(false)
  const curr = useRef()
  const trueRef = useRef(false)
  console.log("render record")

  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const setCanRecord = useStore((state) => state.setCanRecord)
  const setClientsArr = useStore((state) => state.setClientsArr)

  var camera = null
  var clients = new Array()

  function onResults(results) {
    canvasRef.current.width = webcamRef.current.video.videoWidth
    canvasRef.current.height = webcamRef.current.video.videoHeight

    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement.getContext("2d")

    canvasCtx.save()

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    )

    if (results.multiHandLandmarks.length !== 0) {
      setCanRecord(true)

      for (const landmarks of results.multiHandLandmarks) {
        curr.current = landmarks

        landmarks.map((lm) => clients.push(lm.x, lm.y, lm.z))
        setClientsArr(clients)

        // setClientsArr(clients)
        // trueRef.current === true &&
        //   landmarks.map((lm) => clients.push(lm.x, lm.y, lm.z))
        // trueRef.current === true && setClientsArr(clients)

        // if (trueRef.current === true) {
        //   landmarks.map((lm) => clients.push(lm.x, lm.y, lm.z))
        //   setClientsArr(clients)
        // } else console.log(false)

        drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#FFFFFF",
        })
        drawLandmarks(canvasCtx, landmarks, {
          color: "#1E39D4",
          lineWidth: 2,
        })
      }
    } else {
      setCanRecord(false)
    }

    canvasCtx.restore()
  }

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635986972/${file}`
      },
    })

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    hands.onResults(onResults)

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video })
        },
        width: 640,
        height: 480,
      })
      camera.start()
    }
  }, [])

  return (
    <>
      <TrueFalse
        onClick={() => {
          {
            // console.log(trueRef.current)
            setCanRecord(trueRef.current)
            // useStore.setState({ clientsArr: clients })
            // setClientsArr(clients)
            // console.log(clients)
          }
          // trueRef.current = !trueRef.current
          // setIsTrue(!isTrue)
        }}
      >
        {trueRef.current ? "true" : "false"}
      </TrueFalse>

      <Webcam
        ref={webcamRef}
        style={{
          border: "orange 3px solid",
          position: "absolute",
          width: "640px",
          height: "500px",
          textAlign: "center",
          // opacity: 0,
          zIndex: 1,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid hotpink",
          position: "absolute",
          width: "640px",
          height: "500px",
          textAlign: "center",
          zIndex: 20,
        }}
      ></canvas>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: "2%",
          width: "50%",
          height: "900px",
          border: "hotpink solid 1px",
        }}
      >
        <Canvas dpr={2} camera={camera}>
          <BoxTest landmarks={curr} rr={clients} />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}

function BoxTest({ arr, landmarks }) {
  const ref = useRef()
  const ambientRef = useRef()

  const vec = new THREE.Vector3()
  const thumb = new THREE.Vector3()
  const index = new THREE.Vector3()
  const th = 4
  const ind = 8

  // const clientsArr = useStore((state) => state.clientsArr)
  const canRecord = useStore((state) => state.canRecord)
  let test = 0
  useFrame(() => {
    ambientRef.current.intensity = test += 0.07
    if (canRecord) {
      thumb.set(
        landmarks.current[th].x,
        landmarks.current[th].y,
        landmarks.current[th].z
      )
      index.set(
        landmarks.current[ind].x,
        landmarks.current[ind].y,
        landmarks.current[ind].z
      )

      // vec.set(0, arr[arr.length - 3] * 2, 0)
      // vec.set(0, landmarks.current[0].x * 3, 0)

      // ambientRef.current.intensity =
      //   THREE.MathUtils.lerp(
      //     ambientRef.current.intensity,
      //     Math.abs(landmarks.current[th].z * 0.4),
      //     0.4
      //   ) / 10
      // console.log(ambientRef.current.intensity)
      // console.log(Math.abs(landmarks.current[th].z * 3))
      ambientRef.current.intensity =
        THREE.MathUtils.lerp(
          ref.current.scale.y,
          thumb.distanceTo(index) * 10,
          0.4
        ) / 10

      ref.current.scale.y = THREE.MathUtils.lerp(
        ref.current.scale.y,
        thumb.distanceTo(index) * 10,
        0.4
      )
      vec.set(0, landmarks.current[0].x, 0)

      ref.current.rotation.y = THREE.MathUtils.lerp(
        ref.current.rotation.y,
        landmarks.current[0].x * 14,
        0.09
      )

      // ref.current.position.lerp(vec, 0.05)
    } else {
      vec.set(0, 0, 0)
      ref.current.position.lerp(vec, 0.01)
    }

    // console.log(clientsArr[clientsArr.length % 63])
  })

  return (
    <>
      <Box
        args={[1.5, 1.5, 1.5]}
        material={
          new THREE.MeshStandardMaterial({ wireframe: false, color: "white" })
        }
        // material={new THREE.MeshBasicMaterial({ wireframe: true })}
        ref={ref}
      />
      <pointLight position={[3, 3, 2]} color={"hotpink"} />
      <pointLight position={[-3, 3, 2]} color={"darkblue"} />
      {/* <Sphere position={[10, 3, -7]} /> */}
      <ambientLight ref={ambientRef} color="white" intensity={0.1} />
    </>
  )
}

const TrueFalse = styled.div`
  cursor: pointer;
  z-index: 9999;
  position: absolute;
  width: 50px;
  height: 50px;
  background: hotpink;
`
export default Recording
