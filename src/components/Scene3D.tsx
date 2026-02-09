'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import styles from './Scene3D.module.css';

interface ModelProps {
    modelPath: string;
    scale: number;
    rotationSpeed: number;
    positionY: number;
    color: string;
}

function Model({ modelPath, scale, rotationSpeed, positionY, color }: ModelProps) {
    const { scene } = useGLTF(modelPath);

    // Clone the scene to avoid modifying the original
    const clonedScene = scene.clone();

    // Apply color tint if needed
    if (color !== '#ffffff') {
        clonedScene.traverse((child: any) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.color.set(color);
            }
        });
    }

    return (
        <primitive
            object={clonedScene}
            scale={scale}
            position={[0, positionY, 0]}
        />
    );
}

export default function Scene3D() {
    const [selectedModel, setSelectedModel] = useState('human');
    const [scale, setScale] = useState(2);
    const [rotationSpeed, setRotationSpeed] = useState(0.5);
    const [positionY, setPositionY] = useState(0);
    const [color, setColor] = useState('#ffffff');
    const [autoRotate, setAutoRotate] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [dinoUnlocked, setDinoUnlocked] = useState(false);

    const models = {
        dinosaur: '/models/dinosaur.glb',
        human: '/models/human.glb'
    };

    // Check for unlock condition: Scale 3x + Speed 2x
    useEffect(() => {
        if (!dinoUnlocked && scale === 3 && rotationSpeed === 2) {
            setDinoUnlocked(true);

            // Play unlock sound
            const audio = new Audio('/sounds/unlock.wav');
            audio.play().catch(err => console.log('Audio play failed:', err));

            // Delay model switch for effect (Sound -> Model Reveal)
            const timer = setTimeout(() => {
                setSelectedModel('dinosaur');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [scale, rotationSpeed, dinoUnlocked]);

    // Handle manual user interaction (not autoRotate)
    const handleManualInteraction = () => {
        if (!hasInteracted) {
            setHasInteracted(true);
            setShowControls(true);
        }
    };

    // Handle double-click on model to toggle (only after unlock)
    const handleModelDoubleClick = () => {
        if (dinoUnlocked) {
            setSelectedModel(prev => prev === 'dinosaur' ? 'human' : 'dinosaur');
        }
    };

    // Reset all controls to default values
    const handleReset = () => {
        setScale(2);
        setRotationSpeed(0.5);
        setPositionY(0);
        setColor('#ffffff');
        setAutoRotate(true);
    };

    const scalePresets = [1, 1.5, 2, 3];
    const speedPresets = [0, 1.5, 2];

    return (
        <div className={styles.container}>
            <Canvas
                camera={{ position: [0, 2.5, 5], fov: 50 }}
                style={{ background: '#f5f5f5' }}
                onDoubleClick={handleModelDoubleClick}
            >
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-10, -10, -5]} intensity={0.8} />
                <pointLight position={[0, 5, 0]} intensity={1} />

                <Suspense fallback={null}>
                    <Model
                        modelPath={models[selectedModel as keyof typeof models]}
                        scale={scale}
                        rotationSpeed={rotationSpeed}
                        positionY={positionY}
                        color={color}
                    />
                </Suspense>

                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={3}
                    maxDistance={10}
                    autoRotate={autoRotate}
                    autoRotateSpeed={rotationSpeed}
                    onStart={handleManualInteraction}
                />
            </Canvas>

            {/* Toggle Button */}
            <button
                onClick={() => setShowControls(!showControls)}
                className={styles.toggleButton}
                aria-label="Toggle controls"
            >
                {showControls ? 'Control off' : 'Control on'}
            </button>

            {/* Control Panel */}
            {showControls && (
                <div className={styles.controls}>
                    {/* First Row: Scale and Speed */}
                    <div className={styles.controlRow}>
                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Scale</label>
                            <div className={styles.buttonGroup}>
                                {scalePresets.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setScale(preset)}
                                        className={`${styles.presetButton} ${scale === preset ? styles.active : ''}`}
                                    >
                                        {preset}x
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Speed</label>
                            <div className={styles.buttonGroup}>
                                {speedPresets.map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => setRotationSpeed(preset)}
                                        className={`${styles.presetButton} ${rotationSpeed === preset ? styles.active : ''}`}
                                    >
                                        {preset}x
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Second Row: Color */}
                    <div className={styles.controlRow}>
                        <div className={styles.controlGroup}>
                            <label className={styles.label}>Color</label>
                            <div className={styles.colorPickerWrapper}>
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className={styles.colorPicker}
                                    id="colorPicker"
                                />
                                <label htmlFor="colorPicker" className={styles.colorPickerLabel}>
                                    <span className={styles.colorPreview} style={{ backgroundColor: color }} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

useGLTF.preload('/models/dinosaur.glb');
useGLTF.preload('/models/human.glb');
