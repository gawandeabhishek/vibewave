"use client";

import { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { BufferGeometry, Points as ThreePoints, Material } from "three";

const Stars = () => {
  const ref = useRef<ThreePoints<BufferGeometry, Material>>(null!);

  // Generate random positions for particles
  const sphere = useMemo(() => random.inSphere(new Float32Array(4000), { radius: 1.9 }), []);

  // Function to generate a valid random color, excluding black and white
  const getRandomColor = () => {
    let r, g, b;
    do {
      r = Math.random();
      g = Math.random();
      b = Math.random();
    } while (
      (r === 0 && g === 0 && b === 0) || // Skip pure black
      (r === 1 && g === 1 && b === 1)    // Skip pure white
    );
    return [r, g, b];
  };

  // Generate random colors for each particle
  const colors = useMemo(() => {
    const colorsArray = new Float32Array(sphere.length);
    for (let i = 0; i < sphere.length; i += 3) {
      const [r, g, b] = getRandomColor();
      colorsArray[i] = r;      // Red component
      colorsArray[i + 1] = g;  // Green component
      colorsArray[i + 2] = b;  // Blue component
    }
    return colorsArray;
  }, [sphere]);

  // Update rotation
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} colors={colors} stride={3} frustumCulled>
        <PointMaterial
          vertexColors
          transparent
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]">
      <Canvas camera={{ position: [0, 1, 1] }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
