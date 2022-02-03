import {
  OrbitControls,
  CubeCamera,
  Sphere,
  Environment,
} from "@react-three/drei"
import { extend, Canvas, useThree, useFrame } from "@react-three/fiber"
import React, { useEffect, useRef, useState, useMemo, Suspense } from "react"
import { WebGL1Renderer, Vector2, MeshStandardMaterial } from "three"
import PlaybackSpheres from "./PlaybackSpheres"
import { Particles } from "./Particles"
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
    ({ gl }) => void ((gl.autoClear = false), composer.current.render()),
    1
  )

  const aspect = useMemo(() => new Vector2(size.width, size.height), [size])

  return (
    <>
      <pointLight position={[2, 3, 10]} color={"purple"} intensity={1.9} />
      <pointLight position={[-5, 0, 0]} color={"cyan"} intensity={1.8} />
      <ambientLight color={"white"} intensity={0.2} />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        {/* <waterPass attachArray="passes" factor={2} /> */}
        {/* <shaderPass
          attachArray="passes"
          args={[resources.ChromaticAberrationShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          material-uniforms-power-value={0.02}
        /> */}
        {/* <opticalFlowDistortionPass attachArray="passes" factor={0.92} /> */}
        {/* <afterimagePass attachArray="passes" factor={0.42} /> */}
        <unrealBloomPass attachArray="passes" args={[aspect, 0.9, 0.2, 0]} />
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

function EffectFour() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )
  useFrame(
    ({ gl }) => void ((gl.autoClear = false), composer.current.render()),
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
        {/* <shaderPass
          attachArray="passes"
          args={[resources.ChromaticAberrationShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          material-uniforms-power-value={0.02}
        /> */}
        <opticalFlowDistortionPass attachArray="passes" factor={0.92} />
        {/* <unrealBloomPass attachArray="passes" args={[aspect, 1.1, 0.2, 0]} /> */}
        {/* <afterimagePass attachArray="passes" factor={0.92} /> */}
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

function EffectFive() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  )
  useFrame(
    ({ gl }) => void ((gl.autoClear = false), composer.current.render()),
    1
  )

  return (
    <>
      <pointLight position={[2, 3, 10]} color={"purple"} intensity={0.9} />
      <pointLight position={[-5, 0, 0]} color={"cyan"} intensity={0.8} />
      <ambientLight color={"white"} intensity={0.2} />
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" scene={scene} camera={camera} />
        {/* <shaderPass
          attachArray="passes"
          args={[resources.ChromaticAberrationShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          material-uniforms-power-value={0.02}
        /> */}
        <opticalFlowDistortionPass attachArray="passes" factor={0.92} />
        {/* <unrealBloomPass attachArray="passes" args={[aspect, 1.1, 0.2, 0]} /> */}
        {/* <afterimagePass attachArray="passes" factor={0.92} /> */}
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
  thickness: 5,
  roughness: 0,
  clearcoat: 1,
  clearcoatRoughness: 0,
  transmission: 1,
  ior: 1.25,
  envMapIntensity: 25,
  color: "#ffffff",
  attenuationTint: "#ffe79e",
  attenuationDistance: 0,
}

const particles = <Particles position={[0, 0, -2000]} />

const smallGlassSphere = (
  <Sphere scale={0.02}>
    <meshPhysicalMaterial attach="material" {...glassMaterialProps} />
  </Sphere>
)

const smallWhiteSphere = <Sphere material={material} scale={0.02} />

const largeGlassSphere = (
  <Sphere scale={0.03}>
    <meshPhysicalMaterial attach="material" {...glassMaterialProps} />
  </Sphere>
)

const largeReflectiveSphere = (
  <Sphere scale={0.03}>
    <meshStandardMaterial
      attach="material"
      metalness={1}
      roughness={0}
      color={"white"}
    />
  </Sphere>
)

function Scene() {
  let [effectId, setEffectId] = useState(0)
  const maxEffects = 5
  let effectElement
  let geometryElement

  function cycleEffects() {
    if (effectId < maxEffects - 1) {
      setEffectId(effectId + 1)
    } else {
      setEffectId(0)
    }
  }

  if (effectId === 0) {
    effectElement = EffectOne
    geometryElement = largeReflectiveSphere
  } else if (effectId === 1) {
    effectElement = EffectTwo
    geometryElement = smallWhiteSphere
  } else if (effectId === 2) {
    effectElement = EffectThree
    geometryElement = smallGlassSphere
  } else if (effectId === 3) {
    effectElement = EffectFour
    geometryElement = largeGlassSphere
  } else if (effectId === 4) {
    effectElement = EffectFive
    geometryElement = smallWhiteSphere
  }

  console.log(geometryElement)

  return (
    <>
      <button onClick={cycleEffects}>
        Cycle Effect ({effectId + 1}/{maxEffects})
      </button>
      <Canvas
        dpr={2}
        gl={(canvas) => new WebGL1Renderer({ canvas, alpha: false })}
      >
        <Suspense fallback={null}>
          {effectId === 0 || effectId === 4 ? particles : null}
          <Environment background={false} files="adams_place_bridge_1k.hdr" />
        </Suspense>

        <CubeCamera
          position={[0, 0, 0]}
          resolution={256}
          frames={Infinity}
          near={1}
          far={1000}
        >
          {(texture) => (
            <PlaybackSpheres
              key={effectId}
              envMap={effectId === 0 || effectId === 4 ? texture : null}
            >
              {geometryElement}
            </PlaybackSpheres>
          )}
        </CubeCamera>

        {effectElement ? React.createElement(effectElement) : null}
        <OrbitControls />
      </Canvas>
    </>
  )
}

export default Scene
