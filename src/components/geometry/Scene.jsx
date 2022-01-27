import { OrbitControls } from "@react-three/drei"
import { extend, Canvas, useThree, useFrame } from "@react-three/fiber"
import { Dodecahedron, Sphere } from "@react-three/drei"
import React, { useEffect, useRef, useState, useMemo } from "react"
import { WebGL1Renderer, Vector2, MeshStandardMaterial } from "three"
import PlaybackSpheres from "./PlaybackSpheres"
import * as resources from "../../resources/index.js"

extend(resources)

function EffectOne() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )
  useFrame(
    ({ gl }) => void ((gl.autoClear = true), composer.current.render()),
    1
  )
  return (
    <>
      <pointLight position={[2, 3, 10]} color={"purple"} intensity={0.9} />
      <pointLight position={[-5, 0, 0]} color={"cyan"} intensity={0.8} />
      <ambientLight color={"white"} intensity={0.2} />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        <waterPass attachArray="passes" factor={2} />
        <afterimagePass attachArray="passes" factor={0.92} />
        <shaderPass
          attachArray="passes"
          args={[resources.FXAAShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer>
    </>
  )
}

function EffectTwo() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )
  useFrame(
    ({ gl }) => void ((gl.autoClear = true), composer.current.render()),
    1
  )

  const aspect = useMemo(() => new Vector2(size.width, size.height), [size])

  return (
    <>
      <pointLight position={[2, 3, 10]} color={"red"} intensity={0.4} />
      <pointLight position={[-5, 0, 0]} color={"blue"} intensity={0.6} />
      <ambientLight color={"white"} intensity={0.2} />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        {/* <afterimagePass attachArray="passes" factor={0.91} /> */}
        <unrealBloomPass attachArray="passes" args={[aspect, 1.5, 1, 0]} />
        <filmPass attachArray="passes" args={[0.5, 0.4, 1500, false]} />
        <shaderPass
          attachArray="passes"
          args={[resources.ChromaticAberrationShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          material-uniforms-power-value={0.02}
        />
        <shaderPass
          attachArray="passes"
          args={[resources.FXAAShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer>
    </>
  )
}

function EffectThree() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )
  useFrame(
    ({ gl }) => void ((gl.autoClear = true), composer.current.render()),
    1
  )

  const aspect = useMemo(() => new Vector2(size.width, size.height), [size])

  return (
    <>
      <ambientLight color={"white"} intensity={0.6} />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />{" "}
        <afterimagePass attachArray="passes" factor={0.96} />
        <waterPass attachArray="passes" factor={2} />
        <unrealBloomPass attachArray="passes" args={[aspect, 1.1, 0.2, 0]} />
        <shaderPass
          attachArray="passes"
          args={[resources.ChromaticAberrationShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          material-uniforms-power-value={0.5}
        />
        <shaderPass
          attachArray="passes"
          args={[resources.FXAAShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </effectComposer>
    </>
  )
}

const material = new MeshStandardMaterial({ color: "white" })

const glassMaterialProps = {
  thickness: { value: 5, min: 0, max: 20 },
  roughness: { value: 0, min: 0, max: 1, step: 0.1 },
  clearcoat: { value: 1, min: 0, max: 1, step: 0.1 },
  clearcoatRoughness: { value: 0, min: 0, max: 1, step: 0.1 },
  transmission: { value: 1, min: 0.9, max: 1, step: 0.01 },
  ior: { value: 1.25, min: 1, max: 2.3, step: 0.05 },
  envMapIntensity: { value: 25, min: 0, max: 100, step: 1 },
  color: "#ffffff",
  attenuationTint: "#ffe79e",
  attenuationDistance: { value: 0, min: 0, max: 1 },
}

function Scene() {
  let [effectId, setEffectId] = useState(0)
  let effectElement
  let geometryElement
  const light = useRef()

  function cycleEffects() {
    if (effectId < 2) {
      setEffectId(effectId + 1)
    } else {
      setEffectId(0)
    }
  }

  if (effectId === 0) {
    effectElement = EffectOne
    geometryElement = <Dodecahedron material={material} scale={0.02} />
  } else if (effectId === 1) {
    effectElement = EffectTwo
    geometryElement = <Dodecahedron material={material} scale={0.02} />
  } else if (effectId === 2) {
    effectElement = EffectThree
    geometryElement = (
      <Sphere scale={0.02}>
        <meshPhysicalMaterial attach="material" {...glassMaterialProps} />
      </Sphere>
    )
  }

  return (
    <>
      <button onClick={cycleEffects}>Cycle Effect ({effectId + 1}/3)</button>
      <Canvas dpr={2} gl={(canvas) => new WebGL1Renderer({ canvas })}>
        <PlaybackSpheres>{geometryElement}</PlaybackSpheres>
        <OrbitControls />

        {effectId === 1 ? (
          <pointLight ref={light} distance={40} intensity={8} color="lightblue">
            <mesh scale={[1, 1, 6]}>
              <dodecahedronBufferGeometry args={[4, 0]} />
              <meshBasicMaterial color="lightblue" transparent />
            </mesh>
          </pointLight>
        ) : null}

        {effectElement ? React.createElement(effectElement) : null}
      </Canvas>
    </>
  )
}

export default Scene
