import React from 'react';

import * as THREE from 'three';

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

export default NormalizedScene;
