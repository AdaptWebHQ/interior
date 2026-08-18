"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Color swatches mapping
export const MATERIAL_THEMES = {
  walnut: {
    wall: "#F5F2EB", // Warm cream
    floor: "#7D5C43", // Warm Walnut wood
    sofa: "#E3DAC9", // Bouclé fabric beige
    accent: "#D39E82", // Terracotta
    metal: "#1C1C1C", // Charcoal metal
  },
  concrete: {
    wall: "#9CA3AF", // Raw grey concrete
    floor: "#4B5563", // Dark concrete
    sofa: "#E5E7EB", // Light grey linen
    accent: "#6B7280", // Slate grey
    metal: "#030712", // Matte black steel
  },
  obsidian: {
    wall: "#1A1A1A", // Near black stucco
    floor: "#0D0D0D", // Obsidian polished stone
    sofa: "#2E3033", // Charcoal velvet
    accent: "#D39E82", // Rose gold / Ochre copper highlights
    metal: "#FF6600", // Neon glowing trace
  },
};

interface InteriorModelProps {
  theme: keyof typeof MATERIAL_THEMES;
  scrollProgress: number;
}

export default function InteriorModel({ theme, scrollProgress }: InteriorModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Selected material theme colors for procedural Japandi layout
  const selectedTheme = MATERIAL_THEMES[theme];

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Slow idle rotation + scroll driven Y-rotation
    const targetY = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);

    // Parallax sway
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (state.pointer.y * Math.PI) / 20,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      (state.pointer.x * Math.PI) / 30,
      0.05
    );
  });

  // Calculate separate dynamic explosion positions for layers
  const ceilingOffset = scrollProgress > 0.4 ? (scrollProgress - 0.4) * 5 : 0;
  const furnitureOffset = scrollProgress > 0.4 ? (scrollProgress - 0.4) * 2.5 : 0;
  const decorOffset = scrollProgress > 0.4 ? (scrollProgress - 0.4) * 4 : 0;

  return (
    <group ref={groupRef}>
      {/* Lights inside the scene */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={1} color={selectedTheme.accent} />

      {/* FLOOR PLAN (Base Foundation) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color={selectedTheme.floor} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* BACK WALL */}
      <mesh position={[0, 1, -6]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color={selectedTheme.wall} roughness={0.8} />
      </mesh>

      {/* LEFT WALL */}
      <mesh position={[-6, 1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 0.4]} />
        <meshStandardMaterial color={selectedTheme.wall} roughness={0.8} />
      </mesh>

      {/* EXPLODING CEILING SLAB */}
      <group position={[0, 4 + ceilingOffset, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[12, 0.3, 12]} />
          <meshStandardMaterial color={selectedTheme.wall} roughness={0.9} />
        </mesh>
        {/* Designer Pendant Light */}
        <mesh position={[0, -1, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2]} />
          <meshStandardMaterial color={selectedTheme.metal} />
        </mesh>
        <mesh position={[0, -2, 0]} castShadow>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={selectedTheme.accent} emissive={selectedTheme.accent} emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* SOPHISTICATED FURNITURE LAYER (Exploding) */}
      <group position={[0, furnitureOffset, 0]}>
        {/* Minimalist Low-Profile Sofa Base */}
        <mesh position={[0, -1.6, -1]} castShadow receiveShadow>
          <boxGeometry args={[6, 0.6, 2.2]} />
          <meshStandardMaterial color={selectedTheme.metal} roughness={0.9} />
        </mesh>
        {/* Sofa Cushions */}
        <mesh position={[0, -1.1, -1.1]} castShadow>
          <boxGeometry args={[5.6, 0.5, 1.8]} />
          <meshStandardMaterial color={selectedTheme.sofa} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, -2]} castShadow>
          <boxGeometry args={[5.6, 0.8, 0.4]} />
          <meshStandardMaterial color={selectedTheme.sofa} roughness={0.7} />
        </mesh>

        {/* Minimalist Low Lounge Chair */}
        <group position={[-3, -1.5, 2]} rotation={[0, Math.PI / 4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.4, 1.5]} />
            <meshStandardMaterial color={selectedTheme.sofa} roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 0.4, 0]} castShadow>
            <boxGeometry args={[0.2, 0.8, 1.5]} />
            <meshStandardMaterial color={selectedTheme.metal} />
          </mesh>
        </group>
      </group>

      {/* COFFEE TABLE & DECOR LAYER (Exploding) */}
      <group position={[0, decorOffset, 0]}>
        {/* Coffee Table */}
        <mesh position={[1, -1.6, 1.5]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
          <meshStandardMaterial color={selectedTheme.wall} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Designer Vase */}
        <mesh position={[0.8, -1.3, 1.3]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 0.6, 16]} />
          <meshStandardMaterial color={selectedTheme.accent} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// Preload standard glb room loader helper just in case
try {
  useGLTF.preload("/public/models/interior.glb");
} catch {}
