import { useRef, useState, useLayoutEffect } from "react"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useStore } from "state/store"
import { splitarray, transposeArray } from "utils/helpers"

const material = new THREE.MeshStandardMaterial({ color: "white" })

function Spheres({ coordinates }) {
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
    <Sphere
      material={material}
      ref={ref}
      scale={0.01}
      position={coordinates[0]}
    />
  )
}

function PlaybackSpheres() {
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
    <>
      <pointLight position={[2, 3, 10]} color={"red"} intensity={0.3} />
      <pointLight position={[-5, 0, 0]} color={"blue"} intensity={0.3} />
      <ambientLight color={"white"} intensity={0.2} />
      <group position={[5, 4, 0]} scale={-8}>
        {handArr && handArr?.map((v, i) => <Spheres key={i} coordinates={v} />)}
      </group>
    </>
  )
}

export default PlaybackSpheres
