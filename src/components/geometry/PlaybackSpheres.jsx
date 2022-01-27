import React, { useRef, useState, useLayoutEffect } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useStore } from "state/store"
import { splitarray, transposeArray } from "utils/helpers"

function Spheres({ coordinates, children }) {
  const pos = new THREE.Vector3()
  let frame = 0
  const ref = useRef()

  useFrame(({ clock }) => {
    frame = frame + 0.33
    pos.set(coordinates[frame])

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
  })

  return (
    <>
      {React.Children.map(children.children, (child) => (
        <child.type {...child.props} position={coordinates[0]} ref={ref} />
      ))}
    </>
  )
}

function PlaybackSpheres(children) {
  const [handArr, set] = useState([])
  const points = useStore((state) => state.points)

  useLayoutEffect(() => {
    set(
      transposeArray(splitarray(splitarray(points, 3), 21), 21).filter(
        (v) => v.length !== 0
      )
    )
  }, [points])

  return (
    <group position={[5, 4, 0]} scale={-8}>
      {handArr &&
        handArr?.map((v, i) => (
          <Spheres key={i} coordinates={v}>
            {children}
          </Spheres>
        ))}
    </group>
  )
}

export default PlaybackSpheres
