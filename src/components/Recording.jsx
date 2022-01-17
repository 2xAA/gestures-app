import React, { useRef, useEffect } from "react"
import { Hands } from "@mediapipe/hands"
import * as cam from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import Webcam from "react-webcam"
import { useStore } from "../state/store"
import useMeasure from "react-use-measure"

//make a routing for hand capturing
//fake record for a few minutes and collect data
//send output coordinates to the backend

function Recording() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [ref, bounds] = useMeasure()

  useEffect(() => {
    console.log(bounds)
  }, [])
  // const saving = useRef()

  const setCanRecord = useStore((state) => state.setCanRecord)
  const setClientsArr = useStore((state) => state.setClientsArr)

  const arrRef = useRef()

  // const handleClick = () => {
  //   saving.current = !saving.current
  // }

  useEffect(() => {
    arrRef.current = []
  }, [arrRef])

  var camera = null
  var clients = []

  function onResults(results) {
    // const video = webcamRef.current.video
    const videoWidth = webcamRef.current.video.videoWidth
    const videoHeight = webcamRef.current.video.videoHeight
    // const videoWidth = webcamRef.current.video.videoWidth
    // const videoHeight = webcamRef.current.video.videoHeight

    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight

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
        landmarks.map((lm) => clients.push(lm.x, lm.y, lm.z))

        setClientsArr(clients)

        drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, {
          color: "#FFFFFF",
        })
        drawLandmarks(canvasCtx, landmarks, { color: "#1E39D4", lineWidth: 2 })
      }
    } else {
      setCanRecord(false)
    }

    canvasCtx.restore()
  }

  useEffect(() => {
    const hands = new Hands({
      locateFile: (e) => {
        return "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635986972/".concat(
          e
        )
        // return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1635986972/${file}`
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
        width: bounds.width,
        height: bounds.height,
        width: bounds.width,
        height: bounds.height,
      })
      camera.start()
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        // border: "orange solid 2px",
        position: "absolute",
        width: "100%",
        height: "50%",
      }}
    >
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",

          width: "100%",
          height: "100%",
          // position: "absolute",
          // marginLeft: "auto",
          // marginRight: "auto",
          // top: 0,
          // left: 0,
          // right: 0,
          textAlign: "center",
          zindex: 9,
          // width: "100%"
          // height: 480
        }}
      />
      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",

          // position: "absolute",
          // marginLeft: "auto",
          // marginRight: "auto",
          // top: 0,
          // left: 0,
          // right: 0,
          textAlign: "center",
          zindex: 9,
          // width: 640,
          // height: 480
        }}
      ></canvas>
    </div>
  )
}

export default Recording
