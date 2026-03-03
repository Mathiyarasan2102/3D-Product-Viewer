import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment, Bounds, Html } from '@react-three/drei';
import { Loader2, UploadCloud } from 'lucide-react';

function Model({ url }) {
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

    // Added a simple fade-in effect to the model
    return (
        <group>
            <primitive object={scene} />
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

export default function Viewer3D({ modelUrl, backgroundColor, wireframeMode }) {
    return (
        <div className="w-full h-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm shadow-2xl p-2 transition-all duration-300">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
                <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                    <color attach="background" args={[backgroundColor]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

                    <Suspense fallback={<Loader />}>
                        <Bounds fit clip observe margin={1.2}>
                            <Center>
                                {modelUrl ? (
                                    <Model url={modelUrl} />
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
                        <Environment preset="city" />
                    </Suspense>

                    <OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate={!modelUrl} autoRotateSpeed={1} />
                </Canvas>
            </div>
        </div>
    );
}
