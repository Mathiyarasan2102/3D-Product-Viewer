import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, Bounds, Html } from '@react-three/drei';
import { Loader2, UploadCloud } from 'lucide-react';

import * as THREE from 'three';

function Model({ url, materialProps, wireframeMode, isAddingHotspot, onAddHotspot, setCursor }) {
    const { scene } = useGLTF(url);

    useEffect(() => {
        return () => {
            // Cleanup to free memory on unmount or url change
            scene.traverse((object) => {
                if (object.isMesh) {
                    object.geometry.dispose();
                    if (object.material.isMaterial) {
                        object.material.dispose();
                    } else {
                        for (const material of object.material) material.dispose();
                    }
                }
            });
        };
    }, [scene]);

    // Apply materials
    useEffect(() => {
        if (!materialProps && wireframeMode === undefined) return;
        scene.traverse((child) => {
            if (child.isMesh && child.material) {
                if (materialProps && materialProps.materialColor) {
                    if (!child.material.color) child.material.color = new THREE.Color();
                    child.material.color.set(materialProps.materialColor);
                }
                if (materialProps && materialProps.metalness !== undefined) {
                    child.material.metalness = materialProps.metalness;
                }
                if (materialProps && materialProps.roughness !== undefined) {
                    child.material.roughness = materialProps.roughness;
                }
                if (wireframeMode !== undefined) {
                    child.material.wireframe = wireframeMode;
                }
                child.material.needsUpdate = true;
            }
        });
    }, [scene, materialProps]);

    // Added a simple fade-in effect to the model
    return (
        <group>
            <primitive
                object={scene}
                onClick={(e) => {
                    if (isAddingHotspot) {
                        e.stopPropagation();
                        // Get coordinates of the click relative to the parent group
                        onAddHotspot(e.point);
                    }
                }}
                onPointerOver={() => {
                    if (isAddingHotspot) setCursor('crosshair');
                }}
                onPointerOut={() => {
                    if (isAddingHotspot) setCursor('auto');
                }}
            />
        </group>
    );
}

function Loader() {
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center space-y-3 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="text-sm font-medium text-white/80 whitespace-nowrap">Loading Model...</span>
            </div>
        </Html>
    );
}

export default function Viewer3D({
    modelUrl,
    backgroundColor,
    wireframeMode,
    environment = 'city',
    materialProps,
    hotspots = [],
    isAddingHotspot,
    onAddHotspot
}) {
    const [cursor, setCursor] = React.useState('auto');

    return (
        <div
            className="w-full h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl p-2 transition-all duration-300"
            style={{ cursor: isAddingHotspot ? cursor : 'auto' }}
        >
            <div className="w-full h-full rounded-xl overflow-hidden relative">
                <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                    <color attach="background" args={[backgroundColor]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                    <Suspense fallback={<Loader />}>
                        <Bounds fit clip observe margin={1.2}>
                            <Center>
                                {modelUrl ? (
                                    <Model
                                        url={modelUrl}
                                        materialProps={materialProps}
                                        wireframeMode={wireframeMode}
                                        isAddingHotspot={isAddingHotspot}
                                        onAddHotspot={onAddHotspot}
                                        setCursor={setCursor}
                                    />
                                ) : (
                                    <group>
                                        <mesh>
                                            <boxGeometry args={[1, 1, 1]} />
                                            <meshStandardMaterial color={wireframeMode ? "white" : "#3b82f6"} wireframe={wireframeMode} transparent opacity={0.2} />
                                        </mesh>
                                        <Html center>
                                            <div className="flex flex-col items-center justify-center space-y-4 text-center pointer-events-none w-64 select-none">
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                                                    <UploadCloud className="w-8 h-8 text-white/40" />
                                                </div>
                                                <p className="text-white/60 font-medium">Upload a GLB/GLTF model to begin</p>
                                            </div>
                                        </Html>
                                    </group>
                                )}
                            </Center>
                        </Bounds>

                        {/* Render Hotspots outside Bounds but precisely placed via e.point absolute positions */}
                        {hotspots && hotspots.map((spot, index) => (
                            <Html key={index} position={[spot.position.x, spot.position.y, spot.position.z]} center>
                                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group pointer-events-auto">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.9)] border-2 border-white animate-pulse"></div>
                                    <div className="absolute top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs px-3 py-1.5 rounded whitespace-nowrap pointer-events-none mt-2 shadow-2xl">
                                        {spot.text}
                                    </div>
                                </div>
                            </Html>
                        ))}

                        <Environment preset={environment} />
                    </Suspense>

                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate={!modelUrl} autoRotateSpeed={1} />
                </Canvas>
            </div>
        </div>
    );
}
