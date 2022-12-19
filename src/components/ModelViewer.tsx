import React from 'react';

import { useLoader, Canvas } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib/loaders/FBXLoader';
import { OBJLoader } from 'three-stdlib/loaders/OBJLoader';
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';
import { OrbitControls, Sky } from '@react-three/drei';

import NormalizedScene from '@components/NormalizedScene';

import useStore from '@hooks/useStore';

// more threejs loaders:
// https://github.com/pmndrs/three-stdlib/tree/main/src/loaders

const GLTFScene: React.FC = () => {
    const fileUrl = useStore((state) => state.fileUrl);
    const gltf = useLoader(GLTFLoader, fileUrl)
    return (
        <React.Suspense fallback={null}>
            <NormalizedScene scene={gltf.scene} />
        </React.Suspense>
    )
}

const FBXScene: React.FC = () => {
    const fileUrl = useStore((state) => state.fileUrl);
    const fbx = useLoader(FBXLoader, fileUrl)
    return (
        <React.Suspense fallback={null}>
            <NormalizedScene scene={fbx} />
        </React.Suspense>
    )
}

const OBJScene: React.FC = () => {
    const fileUrl = useStore((state) => state.fileUrl);
    const obj = useLoader(OBJLoader, fileUrl)
    return (
        <React.Suspense fallback={null}>
            <NormalizedScene scene={obj} />
        </React.Suspense>
    )
}

const ModelViewer: React.FC = () => {
    const fileExt = useStore((state) => state.fileExt);

    return (
        <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 8] }}>
            <Sky sunPosition={[100, 20, 100]} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[2.5, 5, 5]} intensity={1.5} />

            {(fileExt === 'gltf' || fileExt === 'glb') && (
                <GLTFScene />
            )}
            {(fileExt === 'fbx') && (
                <FBXScene />
            )}
            {(fileExt === 'obj') && (
                <OBJScene />
            )}

            <OrbitControls makeDefault />
        </Canvas>
    );
};

export default ModelViewer;
