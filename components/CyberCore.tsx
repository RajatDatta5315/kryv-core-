"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberCore() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00ff41, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);
    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);
      core.rotation.x += 0.005;
      core.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();
    return () => mountRef.current?.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef} className="w-[300px] h-[300px] mx-auto opacity-60" />;
}
