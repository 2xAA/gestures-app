import { Points, Point, useTexture } from "@react-three/drei"
import React, { useRef } from "react"
import { AdditiveBlending } from "three"
import colors from "nice-color-palettes"
import { useFrame } from "@react-three/fiber"

const palette = colors[Math.floor(Math.random() * colors.length)]

export function Particles({
  count = 1000,
  size = 0.5,
  positionFactor = 60,
  rotationSpeed = 0,
}) {
  const particleTexture = useTexture("/textures/1.png")
  const particlesRef = useRef()
  useFrame(
    (state) =>
      (particlesRef.current.rotation.y =
        state.clock.getElapsedTime() * rotationSpeed)
  )
  return (
    <Points ref={particlesRef} limit={10000}>
      <pointsMaterial
        size={size}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
        vertexColors
        map={particleTexture}
        alphaMap={particleTexture}
      />
      {Array.from({ length: count }).map((_, i) => (
        <Point
          key={i}
          position={[
            (0.5 - Math.random()) * positionFactor,
            (0.5 - Math.random()) * positionFactor,
            (0.5 - Math.random()) * positionFactor,
          ]}
          color={palette[Math.floor(Math.random() * palette.length)]}
        />
      ))}
    </Points>
  )
}
