import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Reusable Vanta animated 3D background component with solid dark fallback
const VantaBackground = ({ effect = 'NET', children, style = {} }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadVanta = async () => {
      try {
        let VANTA;
        if (effect === 'NET') {
          const mod = await import('vanta/dist/vanta.net.min');
          VANTA = mod.default;
        } else if (effect === 'WAVES') {
          const mod = await import('vanta/dist/vanta.waves.min');
          VANTA = mod.default;
        } else if (effect === 'GLOBE') {
          const mod = await import('vanta/dist/vanta.globe.min');
          VANTA = mod.default;
        } else if (effect === 'BIRDS') {
          const mod = await import('vanta/dist/vanta.birds.min');
          VANTA = mod.default;
        } else if (effect === 'RINGS') {
          const mod = await import('vanta/dist/vanta.rings.min');
          VANTA = mod.default;
        }

        if (mounted && vantaRef.current && VANTA) {
          const configs = {
            NET: {
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200,
              minWidth: 200,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x6366f1,
              backgroundColor: 0x0f172a,
              points: 14,
              maxDistance: 22,
              spacing: 16,
            },
            WAVES: {
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              color: 0x1e1b4b,
              backgroundColor: 0x0f172a,
              shininess: 40,
              waveHeight: 18,
              waveSpeed: 0.75,
              zoom: 0.85,
            },
            GLOBE: {
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              color: 0x6366f1,
              color2: 0xd97706,
              backgroundColor: 0x0f172a,
              size: 1.2,
            },
            BIRDS: {
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              backgroundColor: 0x0f172a,
              color1: 0x6366f1,
              color2: 0xd97706,
              birdSize: 1.2,
              wingSpan: 25,
              speedLimit: 4,
            },
            RINGS: {
              el: vantaRef.current,
              THREE,
              mouseControls: true,
              touchControls: true,
              backgroundColor: 0x0f172a,
              color: 0x6366f1,
            },
          };

          vantaEffect.current = VANTA(configs[effect] || configs.NET);
        }
      } catch (err) {
        console.warn('Vanta effect failed to load:', err);
      }
    };

    loadVanta();

    return () => {
      mounted = false;
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [effect]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0f172a', // Guaranteed dark background fallback
        color: '#ffffff',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default VantaBackground;
