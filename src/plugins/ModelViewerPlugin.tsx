import React from 'react';
import { useLoader, Canvas } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib/loaders/FBXLoader';
import { OBJLoader } from 'three-stdlib/loaders/OBJLoader';
import { GLTFLoader } from 'three-stdlib/loaders/GLTFLoader';
import { OrbitControls, Sky, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

import { IPlugin } from './PluginInterface';
import useStore from '@hooks/useStore';

// more threejs loaders:
// https://github.com/pmndrs/three-stdlib/tree/main/src/loaders

interface NormalizedSceneProps {
    scene: THREE.Group;
}

const NormalizedScene: React.FC<NormalizedSceneProps> = (props) => {
    const [center, setCenter] = React.useState<THREE.Vector3>(new THREE.Vector3());
    const [scale, setScale] = React.useState<number>(1);

    React.useEffect(() => {
        if (props.scene) {
            const box = new THREE.BoxHelper(props.scene);
            box.geometry.computeBoundingBox();

            const bb = box.geometry.boundingBox || new THREE.Box3();
            console.log(`Scene bounding box: ${JSON.stringify(bb, null, 2)}`);

            bb.getCenter(center);
            setCenter(center);
            console.log(`Scene center: ${JSON.stringify(center, null, 2)}`);

            const size = new THREE.Vector3();
            bb.getSize(size);
            const s = 10.0 / Math.max(size.x, size.y, size.z);
            setScale(s);
        }
    }, [props.scene]);

    return (
        <>
            <group scale={scale}>
                <group position={[-center.x, -center.y, -center.z]}>
                    <boxHelper args={[props.scene, '#00ff00']} />
                    <primitive object={props.scene} />
                </group>
            </group>
        </>
    )
};

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

const ModelViewerViewer: React.FC = () => {
    const fileExt = useStore((state) => state.fileExt);

    return (
        <Canvas camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 8] }}>
            <Sky sunPosition={[100, 20, 100]} />

            <ambientLight intensity={0.5} />
            <directionalLight castShadow position={[2.5, 5, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]}>
                <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 1, 50]} />
            </directionalLight>

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

export class ModelViewerPlugin implements IPlugin {
    public shortName = 'ModelViewer';
    public name = '3D model viewer';
    public extensions = new Set<string>();
    public viewer = (<ModelViewerViewer />);

    constructor() {
        this.extensions.add('gltf');
        this.extensions.add('glb');
        this.extensions.add('obj');
        this.extensions.add('fbx');
    }
}
