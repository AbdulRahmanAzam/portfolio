import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NeuralNetworkBackgroundProps {
  className?: string;
}

export function NeuralNetworkBackground({ className = '' }: NeuralNetworkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    nodes: THREE.Mesh[];
    lines: THREE.Line[];
    animationId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Mouse move handler for cursor-based morphing
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / width) * 2 - 1;
      mouseRef.current.y = -(e.clientY / height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Helper to read current theme color (primary) from CSS variables
    const readThemeColor = () => {
      const hsl = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim();
      const [h, s, l] = hsl.split(' ').map((v) => parseFloat(v));
      return new THREE.Color().setHSL((h || 0) / 360, (s || 0) / 100, (l || 0) / 100);
    };

    // Create neural network nodes
    const nodeCount = 40; // Optimized count
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.3, 20, 20);
    
    // Get theme-aware color (blue in light, green in dark per --primary)
    let color = readThemeColor();

    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30
      );
      nodes.push(node);
      scene.add(node);
    }

    // Create connections between nearby nodes
    const lines: THREE.Line[] = [];
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.2,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 15) {
          const points = [nodes[i].position, nodes[j].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMaterial);
          lines.push(line);
          scene.add(line);
        }
      }
    }

    // Store refs first
    const sceneData = {
      scene,
      camera,
      renderer,
      nodes,
      lines,
      animationId: null as number | null,
    };
    sceneRef.current = sceneData;

    // Animation
    let time = 0;
    const mouseInfluence = 3;
    const randomDisplacementRange = 50;
    const animate = () => {
      time += 0.001;

      // Cursor-influenced morphing with Perlin-like noise
      nodes.forEach((node, i) => {
        // Base floating animation
        const baseY = Math.sin(time * 2 + i * 0.1) * 0.01;
        
        // Cursor-based displacement (slowly morphing based on cursor position)
        const distanceX = mouseRef.current.x * mouseInfluence;
        const distanceY = mouseRef.current.y * mouseInfluence;
        
        node.position.x += (distanceX - node.position.x + (Math.random() - 0.5) * randomDisplacementRange) * 0.002;
        node.position.y += baseY + (distanceY - node.position.y) * 0.002;
        
        node.rotation.x += 0.001;
        node.rotation.y += 0.001;
      });

      // Update line positions
      lines.forEach((line) => {
        const positions = line.geometry.attributes.position;
        positions.needsUpdate = true;
      });

      // Camera rotation influenced by cursor
      camera.position.x = Math.sin(time * 0.2) * 2 + mouseRef.current.x * 0.5;
      camera.position.y = Math.cos(time * 0.3) * 2 + mouseRef.current.y * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (sceneRef.current) {
        sceneRef.current.animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Observe theme changes (documentElement class changes)
    const observer = new MutationObserver(() => {
      const newColor = readThemeColor();
      nodeMaterial.color.set(newColor);
      lineMaterial.color.set(newColor);
      renderer.render(scene, camera);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      // Dispose geometries and materials
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach(line => line.geometry.dispose());
      
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 bg-transparent ${className}`}
    />
  );
}