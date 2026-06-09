'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

const DivineOrb = ({ color, size, speed, distort }: { color: string, size: number, speed: number, distort: number }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * (speed / 2);
      mesh.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={mesh} args={[size, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const SacredGeometry3D = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const x = Math.cos(angle) * 10;
      const y = Math.sin(angle) * 10;
      p.push(new THREE.Vector3(x, y, 0));
    }
    return p;
  }, []);

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <DivineOrb color="#D4AF37" size={2} speed={1} distort={0.4} />
      <DivineOrb color="#C9A86A" size={1.2} speed={2} distort={0.2} />

      {/* Sacred Rings */}
      {[5, 8, 12].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.05, 64]} />
          <meshBasicMaterial color="#D4AF37" transparent opacity={0.1 - i * 0.02} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const SacredSpace3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#D4AF37" intensity={2} />
        <pointLight position={[-10, -10, -10]} color="#E6CF9B" intensity={1} />
        <SacredGeometry3D />
      </Canvas>
    </div>
  );
};

export default SacredSpace3D;
