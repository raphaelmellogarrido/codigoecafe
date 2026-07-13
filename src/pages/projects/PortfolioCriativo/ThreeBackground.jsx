// src/pages/projects/PortfolioCriativo/ThreeBackground.jsx
// Cena Three.js "crua" (sem @react-three/fiber), montada via useRef/useEffect.
// Demonstra a integração imperativa de uma lib externa dentro do ciclo de vida do React:
// tudo o que é criado no efeito (renderer, geometrias, materiais, listeners) é
// destruído na cleanup function, para não vazar memória ao trocar de página.

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Campo de partículas de fundo
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Forma central em wireframe
    const icoGeometry = new THREE.IcosahedronGeometry(2.2, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    scene.add(ico);

    let animationId;
    const animate = () => {
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;
      ico.rotation.y += 0.0018;
      ico.rotation.x += 0.001;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" />;
}
