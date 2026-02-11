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
            setTimeout(() => {
                setSelectedModel('dinosaur');
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scale, rotationSpeed]);

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

            {/* Social Links */}
            <div className={styles.socialLinks}>
                <a
                    href="https://x.com/ashley_hegy_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Twitter (X)"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                    >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </a>
                <a
                    href="https://www.instagram.com/genkl_kun_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIcon}
                    aria-label="Instagram"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                    >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                </a>
            </div>

            {/* Mobile Social Links (Text) */}
            <div className={styles.mobileSocialLinks}>
                <a
                    href="https://x.com/ashley_hegy_"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Twitter
                </a>
                <span className={styles.separator}>/</span>
                <a
                    href="https://www.instagram.com/genkl_kun_/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Instagram
                </a>
            </div>

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
