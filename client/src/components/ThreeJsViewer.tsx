import React, { useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeJsViewerProps {
  step: number;
}

export function ThreeJsViewer({ step }: ThreeJsViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const coldRoomRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe1e5ea);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting (Lab style)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Cold room construction
    const L = 2.74, H = 2.00, W = 1.83;
    const thickness = 0.08; // 80mm
    
    const coldRoom = new THREE.Group();
    coldRoomRef.current = coldRoom;

    const panelMat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x999999 });

    // Helper function to create walls with edges
    function createWall(width: number, height: number, depth: number, x: number, y: number, z: number) {
      const geo = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geo, panelMat);
      mesh.position.set(x, y, z);
      coldRoom.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, edgeMat);
      line.position.set(x, y, z);
      coldRoom.add(line);
    }

    // Floor
    createWall(L, thickness, W, 0, 0, 0);
    
    // Left wall (visible starting from step 1)
    createWall(thickness, H, W, -L / 2, H / 2, 0);
    
    // Back wall (visible starting from step 1)
    createWall(L, H, thickness, 0, H / 2, -W / 2);

    // Right wall (visible starting from step 1)
    createWall(thickness, H, W, L / 2, H / 2, 0);

    // Ceiling/Roof (visible starting from step 2)
    const roofGeo = new THREE.BoxGeometry(L, thickness, W);
    const roof = new THREE.Mesh(roofGeo, panelMat);
    roof.position.set(0, H + 0.5, 0);
    roof.userData.showFromStep = 2;
    coldRoom.add(roof);

    const roofEdges = new THREE.EdgesGeometry(roofGeo);
    const roofLine = new THREE.LineSegments(roofEdges, edgeMat);
    roofLine.position.set(0, H + 0.5, 0);
    roofLine.userData.showFromStep = 2;
    coldRoom.add(roofLine);

    // Motor/Unit (visible starting from step 4)
    const motorGeo = new THREE.BoxGeometry(0.6, 0.5, 0.4);
    const motorMat = new THREE.MeshPhongMaterial({ color: 0xdddddd });
    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.position.set(0, H + 0.8, 0);
    motor.userData.showFromStep = 4;
    coldRoom.add(motor);

    scene.add(coldRoom);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controlsRef.current = controls;

    // Update visibility based on step
    const updateVisibility = (currentStep: number) => {
      coldRoom.children.forEach((child: any) => {
        const showFromStep = child.userData?.showFromStep;
        if (showFromStep !== undefined) {
          child.visible = currentStep >= showFromStep;
        }
      });
    };

    updateVisibility(step);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update visibility when step changes
  useEffect(() => {
    if (coldRoomRef.current) {
      coldRoomRef.current.children.forEach((child: any) => {
        const showFromStep = child.userData?.showFromStep;
        if (showFromStep !== undefined) {
          child.visible = step >= showFromStep;
        }
      });
    }
  }, [step]);

  return <div ref={containerRef} className="w-full h-full" />;
}
