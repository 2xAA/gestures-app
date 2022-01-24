import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import React from "react"
import PlaybackSpheres from "./PlaybackSpheres"

function Scene() {
  return (
    <Canvas dpr={2}>
      <PlaybackSpheres />
      <OrbitControls />
    </Canvas>
  )
}

export default Scene
