/* eslint-disable react/no-unknown-property */
import React from 'react';
import * as THREE from 'three';

import { useAnimations } from '@react-three/drei';

import { log } from '@utils/log';

interface NormalizedSceneProps {
    scene: THREE.Group;
    animations?: THREE.AnimationClip[];
}

const NormalizedScene: React.FC<NormalizedSceneProps> = (props) => {
    const modelAnimations = useAnimations(props.animations || [], props.scene);

    React.useEffect(() => {
        if (modelAnimations.names.length === 0) return;

        const anim = modelAnimations.actions[modelAnimations.names[0]];
        if (anim) {
            anim
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(0.5)
                .play();
        }
    }, [modelAnimations]);

    const { center, scale } = React.useMemo(() => {
        if (props.scene) {
            props.scene.updateMatrixWorld(true);

            const box = new THREE.BoxHelper(props.scene);
            box.geometry.computeBoundingBox();

            const bb = box.geometry.boundingBox || new THREE.Box3();
            log(`Scene bounding box: ${JSON.stringify(bb, null, 2)}`);

            const c = new THREE.Vector3();
            bb.getCenter(c);
            log(`Scene center: ${JSON.stringify(c, null, 2)}`);

            const size = new THREE.Vector3();
            bb.getSize(size);
            const s = 10.0 / Math.max(size.x, size.y, size.z);
            return { center: c, scale: s };
        }
        return { center: new THREE.Vector3(), scale: 1 };
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
    );
};

export default NormalizedScene;
