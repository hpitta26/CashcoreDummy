import React from 'react';
import { animated, useSpring } from '@react-spring/web';

export default function PulsatingCircle({ win_width, win_height }) {
    const cir_size = getCirSize(win_width, win_height);
    const opacity = usePulsatingGradient();

    return (
        <animated.div style={{ opacity }} className="absolute w-full h-full justify-center">
            <svg className="w-full h-full">
                <defs>
                    <radialGradient id="grad" c="50%" r="50%" f="50%">
                        <stop offset="0%" stopColor="#307D55"/>
                        <stop offset="100%" stopColor="#181818"/>
                    </radialGradient>
                </defs>
                <circle cx="50%" cy="50%" r={cir_size} fill="url(#grad)" />
                
            </svg>
        </animated.div>
    );
}

function getCirSize(ww, wh) {
    if ((wh * 0.8) > (ww * 0.4)) {
        return (ww * 0.4)/2;
    } else {
        return (wh * 0.8)/2;
    }
}

function usePulsatingGradient() {
    const [{ opacity }] = useSpring(() => ({
        from: { opacity: 0 },
        to: { opacity: 0.45 },
        config: { 
            duration: 2560,
        },
        loop: {
            reverse: true,
        }
    }));

    return opacity;
}