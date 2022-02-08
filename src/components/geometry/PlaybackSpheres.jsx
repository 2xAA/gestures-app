import React, { useRef, useState, useLayoutEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { splitarray, transposeArray } from "utils/helpers"

function Spheres({ coordinates, children, envMap, singlePointZRotation }) {
  const pos = new THREE.Vector3()
  let frame = 0
  const ref = useRef()
  const childRef = useRef()

  useFrame(() => {
    frame = frame + 0.33
    pos.set(coordinates[frame])

    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(
        ref.current.position.x,
        coordinates[Math.floor(frame) % coordinates.length][0],
        0.1
      )
      ref.current.position.y = THREE.MathUtils.lerp(
        ref.current.position.y,
        coordinates[Math.floor(frame) % coordinates.length][1],
        0.1
      )
      ref.current.position.z = THREE.MathUtils.lerp(
        ref.current.position.z,
        coordinates[Math.floor(frame) % coordinates.length][2],
        0.1
      )

      if (singlePointZRotation.length) {
        ref.current.rotation.z = THREE.MathUtils.lerp(
          ref.current.rotation.z,
          singlePointZRotation[Math.floor(frame) % coordinates.length],
          0.1
        )
      }

      if (childRef.current) {
        childRef.current.material.map = envMap
      }
    }
  }, 0)

  return (
    <>
      {React.Children.map(children, (child) => (
        <group position={coordinates[0]} ref={ref}>
          <child.type {...child.props} ref={childRef} />
        </group>
      ))}
    </>
  )
}

function PlaybackSpheres({ children, envMap, points, singlePoint = false }) {
  const [handArr, set] = useState([])
  const [zRotation, setZRotation] = useState([])

  useLayoutEffect(() => {
    const formatted = transposeArray(
      splitarray(splitarray(points, 3), 21),
      21
    ).filter((v) => v.length !== 0)

    if (singlePoint && formatted.length) {
      const rotation = []
      for (let i = 0; i < formatted[0].length; i += 1) {
        const [x1, y1] = formatted[0][i] // wrist
        const [x2, y2] = formatted[9][i] // middle finger mcp

        const angleRadians = Math.atan2(y2 - y1, x2 - x1) + 1.5708
        rotation.push(angleRadians)
      }

      setZRotation(rotation)
      set([formatted[9]])
    } else {
      setZRotation([])
      set(formatted)
    }
  }, [points, singlePoint])

  return (
    <group position={[5, 4, 0]} scale={-8}>
      {handArr &&
        handArr?.map((v, i) => (
          <Spheres
            key={i}
            coordinates={v}
            singlePointZRotation={zRotation}
            envMap={envMap}
          >
            {children}
          </Spheres>
        ))}
    </group>
  )
}

export default PlaybackSpheres
