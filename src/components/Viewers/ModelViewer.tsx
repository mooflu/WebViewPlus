/* eslint-disable react/no-unknown-property */
import React from 'react';
import { Group } from 'three';

import { OrbitControls, Sky } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import { FBXLoader } from 'three-stdlib/loaders/FBXLoader';
import { OBJLoader } from 'three-stdlib/loaders/OBJLoader';
import { GLTFLoader, GLTF } from 'three-stdlib/loaders/GLTFLoader';

import NormalizedScene from '@components/Viewers/NormalizedScene';
import useStore from '@hooks/useStore';
import { log } from '@utils/log';

// more threejs loaders:
// https://github.com/pmndrs/three-stdlib/tree/main/src/loaders

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logProgress = (p: ProgressEvent) => {
    const percent = (p.loaded * 100 / p.total).toFixed(1);
    log(`Progress: ${percent}%`);
};

const GLTFScene: React.FC = () => {
    const fileName = useStore(state => state.fileName);
    const fileUrl = useStore(state => state.fileUrl);
    const [scene, setScene] = React.useState<Group | null>(null);

    React.useEffect(() => {
        if (fileName && fileUrl) {
            const loader = new GLTFLoader();
            loader.load(
                fileUrl,
                (gltf: GLTF) => { setScene(gltf.scene); },
                undefined, // logProgress,
                (e: ErrorEvent) => { log(`Failed to model: ${fileName}`); },
            );
        }
    }, [fileName, fileUrl]);

    return (
        <React.Suspense fallback={null}>
            {!!scene && <NormalizedScene scene={scene} />}
        </React.Suspense>
    );
};

const FBXScene: React.FC = () => {
    const fileName = useStore(state => state.fileName);
    const fileUrl = useStore(state => state.fileUrl);
    const [scene, setScene] = React.useState<Group | null>(null);

    React.useEffect(() => {
        if (fileName && fileUrl) {
            const loader = new FBXLoader();
            loader.load(
                fileUrl,
                (s: Group) => { setScene(s); },
                undefined, // logProgress,
                (e: ErrorEvent) => { log(`Failed to model: ${fileName}`); },
            );
        }
    }, [fileName, fileUrl]);

    return (
        <React.Suspense fallback={null}>
            {!!scene && <NormalizedScene scene={scene} />}
        </React.Suspense>
    );
};

const OBJScene: React.FC = () => {
    const fileName = useStore(state => state.fileName);
    const fileUrl = useStore(state => state.fileUrl);
    const [scene, setScene] = React.useState<Group | null>(null);

    React.useEffect(() => {
        if (fileName && fileUrl) {
            const loader = new OBJLoader();
            loader.load(
                fileUrl,
                (s: Group) => { setScene(s); },
                undefined, // logProgress,
                (e: ErrorEvent) => { log(`Failed to model: ${fileName}`); },
            );
        }
    }, [fileName, fileUrl]);

    return (
        <React.Suspense fallback={null}>
            {!!scene && <NormalizedScene scene={scene} />}
        </React.Suspense>
    );
};

const ModelViewer: React.FC = () => {
    const fileExt = useStore(state => state.fileExt);

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
