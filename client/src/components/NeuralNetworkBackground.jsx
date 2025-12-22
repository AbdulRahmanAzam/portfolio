import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export function NeuralNetworkBackground({ className = "" }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

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

    // Read theme color from CSS variables
    const readThemeColor = () => {
      const hsl = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));
      return new THREE.Color().setHSL((h || 0) / 360, (s || 0) / 100, (l || 0) / 100);
    };

    // Create neural network nodes - optimized count
    const nodeCount = 40;
    const nodes = [];
    const nodeGeometry = new THREE.SphereGeometry(0.3, 20, 20);
    
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
    const lines = [];
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

    // Store refs
    const sceneData = {
      scene,
      camera,
      renderer,
      nodes,
      lines,
      animationId: null,
    };
    sceneRef.current = sceneData;

    // Animation - only runs when visible
    let time = 0;
    let lastTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Only animate when element is visible AND tab is visible
      if (!isVisibleRef.current || !isTabVisibleRef.current) {
        sceneRef.current.animationId = requestAnimationFrame(animate);
        return;
      }

      time += deltaTime * 0.5; // Slower animation for smoothness

      // Gentle rotation and floating animation
      nodes.forEach((node, i) => {
        node.position.y += Math.sin(time * 2 + i * 0.1) * 0.008;
        node.rotation.x += 0.0008;
        node.rotation.y += 0.0008;
      });

      // Update line positions
      lines.forEach((line) => {
        const positions = line.geometry.attributes.position;
        positions.needsUpdate = true;
      });

      // Gentle camera rotation
      camera.position.x = Math.sin(time * 0.15) * 2;
      camera.position.y = Math.cos(time * 0.2) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      if (sceneRef.current) {
        sceneRef.current.animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Pause animation when tab is hidden (performance optimization)
    const handleVisibility = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // IntersectionObserver to pause when not in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Observe theme changes
    const themeObserver = new MutationObserver(() => {
      const newColor = readThemeColor();
      nodeMaterial.color.set(newColor);
      lineMaterial.color.set(newColor);
      renderer.render(scene, camera);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Handle resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();
      themeObserver.disconnect();
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      
      // Dispose geometries and materials
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      lines.forEach(line => line.geometry.dispose());
      
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 bg-transparent ${className}`}
      aria-hidden="true"
    />
  );
}
