/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { degToRad } from "three/src/math/MathUtils"

export default function Model({ ...props }) {
  const group = useRef()
  const { nodes } = useGLTF("/suzie.glb")
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Suzanne.geometry}
        material={nodes.Suzanne.material}
        rotation={[degToRad(180), 0, 0]}
      />
    </group>
  )
}

useGLTF.preload("/suzie.glb")
