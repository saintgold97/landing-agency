/* "use client"

install animation 3D library
npm i @react-three/drei
npm i @react-three/fiber
npm i @types/three
npm i three

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sky } from "@react-three/drei"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Box({ position, ...props }: any) {
  return (
    <mesh position={position} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default function Scene3D() {
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={2} />
        
        <Box position={[-1.5, 0, 0]} />
        <Box position={[1.5, 0, 0]} />
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
} */