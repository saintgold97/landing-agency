/* "use client"

import { useRef, JSX } from "react"
import { useFrame } from "@react-three/fiber"
import {
    Environment,
    Float,
    Sparkles,
    MeshTransmissionMaterial,
} from "@react-three/drei"
import * as THREE from "three"

interface Cinematic3DBackgroundProps {
    scrollProgress: React.RefObject<number>
}

// 🚪 Componente Porta 3D con cerniera
function Door3D({ side, progress, ...props }: { side: 'left' | 'right'; progress: number } & JSX.IntrinsicElements['group']) {
    const doorRef = useRef<THREE.Group>(null)

    useFrame(() => {
        if (!doorRef.current) return
        // Apertura: 0 = chiuso, 1 = aperto a 110°
        const openAngle = side === 'left' ? -1.92 : 1.92 // ~110 gradi in radianti
        doorRef.current.rotation.y = THREE.MathUtils.lerp(0, openAngle, progress)
    })

    return (
        <group ref={doorRef} {...props}>
            
            <mesh position={[0, 0, 0.05]} castShadow receiveShadow>
                <boxGeometry args={[1.8, 3.2, 0.1]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.4}
                    metalness={0.3}
                />
            </mesh>

            
            {[-0.6, 0, 0.6].map((y, i) => (
                <mesh key={i} position={[0, y, 0.06]}>
                    <boxGeometry args={[1.4, 0.6, 0.02]} />
                    <meshStandardMaterial color="#0f0f0f" roughness={0.3} metalness={0.5} />
                </mesh>
            ))}


            <mesh position={[side === 'left' ? 0.7 : -0.7, 0, 0.11]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#c9a961" metalness={1} roughness={0.2} />
            </mesh>
        </group>
    )
}

// 🏗️ Facciata casa con aperture per le porte
function HouseFacade() {
    return (
        <group position={[0, -0.5, 0]}>

            <mesh receiveShadow>
                <boxGeometry args={[6, 4.5, 0.3]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
            </mesh>

            <mesh position={[0, 0, 0.16]}>
                <boxGeometry args={[3.8, 3.4, 0.05]} />
                <meshStandardMaterial color="#111" roughness={0.5} metalness={0.2} />
            </mesh>

            {[-2.4, 2.4].map((x, i) => (
                <group key={i} position={[x, 0, 0.16]}>
                    <mesh>
                        <boxGeometry args={[0.8, 2.8, 0.05]} />
                        <MeshTransmissionMaterial
                            thickness={0.5}
                            roughness={0.1}
                            transmission={0.9}
                            ior={1.5}
                            color="#1a1a1a"
                        />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

// 🛋️ Interno casa (visibile dopo apertura porte)
function HouseInterior({ visible }: { visible: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    // Opzione A: Fade semplice iterando sui Mesh figli
    useFrame(() => {
        if (!groupRef.current) return

        const targetOpacity = visible ? 1 : 0
        groupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.Material | THREE.Material[]
                const materials = Array.isArray(material) ? material : [material]

                materials.forEach((mat) => {
                    if ('opacity' in mat) {
                        mat.transparent = true
                        mat.opacity = THREE.MathUtils.lerp(mat.opacity || 0, targetOpacity, 0.05)
                    }
                })
            }
        })
    })

    if (!visible) return null

    return (
        <group ref={groupRef} position={[0, -0.5, -1.5]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[8, 10]} />
                <meshStandardMaterial color="#3d3426" roughness={0.9} />
            </mesh>

            <mesh position={[0, 1.5, -4]}>
                <boxGeometry args={[7, 3, 0.2]} />
                <meshStandardMaterial color="#2a2620" roughness={0.8} />
            </mesh>

            <pointLight
                position={[0, 2, -2]}
                intensity={2}
                color="#ffcc99"
                distance={8}
                castShadow
            />

            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh position={[-1.5, 0.8, -3.8]}>
                    <boxGeometry args={[0.8, 1.2, 0.3]} />
                    <meshStandardMaterial color="#c9a961" metalness={0.6} roughness={0.3} />
                </mesh>
            </Float>
        </group>
    )
} */

// export function Cinematic3DBackground({ scrollProgress }: Cinematic3DBackgroundProps) {
//     const facadeRef = useRef<THREE.Group>(null)
//     const mainLightRef = useRef<THREE.PointLight>(null)

//     const interiorVisible = scrollProgress.current > 0.5

//     useFrame((state) => {
//         const p = scrollProgress.current

//         // ✅ Usa state.camera invece di camera da useThree
//         state.camera.position.z = THREE.MathUtils.lerp(8, 4, p)
//         state.camera.position.y = THREE.MathUtils.lerp(0.5, 0, p)
//         state.camera.lookAt(0, -0.3, -2)

//         // ... resto del codice invariato
//         if (facadeRef.current) {
//             const scale = THREE.MathUtils.lerp(1, 1.05, p)
//             facadeRef.current.scale.set(scale, scale, scale)
//         }

//         if (mainLightRef.current) {
//             const targetIntensity = p > 0.4 ? THREE.MathUtils.lerp(0, 4, (p - 0.4) / 0.6) : 0
//             mainLightRef.current.intensity = THREE.MathUtils.lerp(
//                 mainLightRef.current.intensity,
//                 targetIntensity,
//                 0.1
//             )
//             mainLightRef.current.color.setHSL(0.08, 0.9, 0.6)
//         }
//     })

//     return (
//         <group>
//             {/* --- AMBIENTE --- */}
//             <Environment preset="apartment" background={false} blur={0.7} />
//             <fog attach="fog" args={['#080808', 6, 15]} />

//             {/* --- FACCIATA CASA --- */}
//             <group ref={facadeRef} position={[0, 0, 0]}>
//                 <HouseFacade />

//                 {/* --- PORTE 3D --- */}
//                 {/* Porta sinistra (cerniera a sinistra, ruota verso -Y) */}
//                 <Door3D
//                     side="left"
//                     progress={scrollProgress.current}
//                     position={[-0.95, 0, 0.16]}
//                 />
//                 {/* Porta destra (cerniera a destra, ruota verso +Y) */}
//                 <Door3D
//                     side="right"
//                     progress={scrollProgress.current}
//                     position={[0.95, 0, 0.16]}
//                 />
//             </group>

//             {/* --- INTERNO (visibile dopo apertura) --- */}
//             <HouseInterior visible={interiorVisible} />

//             {/* --- ILLUMINAZIONE --- */}
//             {/* Luce interna che si accende con l'apertura */}
//             <pointLight
//                 ref={mainLightRef}
//                 position={[0, 1.5, -1]}
//                 intensity={0}
//                 distance={10}
//                 decay={2}
//                 color="#ffcc99"
//                 castShadow
//             />

//             {/* Luce di contorno per evidenziare i bordi */}
//             <spotLight
//                 position={[5, 8, 5]}
//                 angle={0.4}
//                 penumbra={0.8}
//                 intensity={1.5}
//                 color="#ffffff"
//                 castShadow
//             />

//             {/* --- PARTICELLE ATMOSFERICHE --- */}
//             <Sparkles
//                 count={80}
//                 scale={[6, 4, 3]}
//                 size={1.5}
//                 speed={0.3}
//                 opacity={0.5}
//                 color="#d4af37"
//                 position={[0, 0, -1]}
//             />

//             {/* --- OGGETTO DECORATIVO CENTRALE (opzionale) --- */}
//             {/* Se vuoi un elemento "luxury" che fluttua nell'ingresso */}
//             <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
//                 <mesh position={[0, 1.2, -2.5]} scale={0.6}>
//                     <torusKnotGeometry args={[0.4, 0.12, 64, 16]} />
//                     <MeshTransmissionMaterial
//                         thickness={1}
//                         roughness={0.2}
//                         transmission={0.85}
//                         ior={1.4}
//                         chromaticAberration={0.03}
//                         color="#1a1a1a"
//                     />
//                 </mesh>
//             </Float>
//         </group>
//     )
// }

// export function Cinematic3DBackground({ scrollProgress }: Cinematic3DBackgroundProps) {
//     const mainLightRef = useRef<THREE.PointLight>(null)
  
//     useFrame((state) => {
//       const p = scrollProgress.current // 0 -> 1
      
//       // Camera: leggero push-in per dare profondità
//       state.camera.position.z = THREE.MathUtils.lerp(10, 7, p)
//       state.camera.position.y = THREE.MathUtils.lerp(0.5, 0, p)
//       state.camera.lookAt(0, -0.2, -3)
  
//       // Luci: transizione da freddo a caldo
//       if (mainLightRef.current) {
//         const targetIntensity = p > 0.4 ? THREE.MathUtils.lerp(0, 3, (p - 0.4) / 0.6) : 0
//         mainLightRef.current.intensity = THREE.MathUtils.lerp(
//           mainLightRef.current.intensity,
//           targetIntensity,
//           0.05
//         )
//         mainLightRef.current.color.setHSL(0.08, 0.9, 0.6) // Oro caldo
//       }
//     })
  
//     return (
//       <group>
//         {/* Ambiente HDR per riflessi realistici */}
//         <Environment preset="apartment" background={false} blur={0.8} />
        
//         {/* Nebbia per fondere gli elementi */}
//         <fog attach="fog" args={['#080808', 8, 18]} />
  
//         {/* Particelle atmosferiche (sostituiscono quelle CSS se vuoi) */}
//         <Sparkles
//           count={60}
//           scale={[8, 6, 4]}
//           size={2}
//           speed={0.25}
//           opacity={0.4}
//           color="#d4af37"
//           position={[0, -1, -2]}
//         />
  
//         {/* Elemento decorativo centrale (vetro/luxury) - posizionato dietro le porte */}
//         <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
//           <mesh position={[0, 0.5, -4]} scale={0.8}>
//             <icosahedronGeometry args={[0.5, 0]} />
//             <MeshTransmissionMaterial
//               thickness={1.2}
//               roughness={0.15}
//               transmission={0.9}
//               ior={1.45}
//               chromaticAberration={0.04}
//               color="#1a1a1a"
//             />
//           </mesh>
//         </Float>
  
//         {/* Luce interna che si accende con l'apertura */}
//         <pointLight
//           ref={mainLightRef}
//           position={[0, 1, -3]}
//           intensity={0}
//           distance={12}
//           decay={2}
//           color="#ffcc99"
//         />
  
//         {/* Luce di contorno per profondità */}
//         <spotLight
//           position={[6, 10, 6]}
//           angle={0.35}
//           penumbra={0.9}
//           intensity={1}
//           color="#ffffff"
//         />
//       </group>
//     )
//   }