"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function HandTrackingViz() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const points = new Float32Array(63);
  for (let i = 0; i < 21; i++) {
    points[i * 3] = (Math.random() - 0.5) * 2;
    points[i * 3 + 1] = (Math.random() - 0.5) * 2;
    points[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -5, 5]} intensity={0.4} color="#22c55e" />

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color="#38bdf8"
            emissive="#0ea5e9"
            emissiveIntensity={0.2}
            roughness={0.3}
            metalness={0.7}
            distort={0.2}
            speed={2}
          />
        </mesh>
      </Float>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#22c55e" transparent opacity={0.8} />
      </points>

      {/* Connection lines */}
      {[[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6]].map(([a, b], i) => {
        const pa = new THREE.Vector3(points[a * 3], points[a * 3 + 1], points[a * 3 + 2]);
        const pb = new THREE.Vector3(points[b * 3], points[b * 3 + 1], points[b * 3 + 2]);
        const mid = pa.clone().add(pb).multiplyScalar(0.5);
        const length = pa.distanceTo(pb);
        return (
          <mesh key={i} position={[mid.x, mid.y, mid.z]}>
            <cylinderGeometry args={[0.008, 0.008, length, 4]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </>
  );
}

export function ProjectScene() {
  return (
    <div className="w-full h-full min-h-[250px]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <HandTrackingViz />
      </Canvas>
    </div>
  );
}
