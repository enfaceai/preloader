import React, {useEffect, useRef} from 'react';
import {LogoIcon} from './LogoIcon';
import './preloader.css';

const offsetCalc = (line, offsetX, offsetLine, dotHorizontalOffset) => {
    if (Math.abs(line) < offsetLine) {
        const horizontalLine = 1 - Math.abs(line) / offsetLine;
        const offsetOnHover = horizontalLine * offsetX * dotHorizontalOffset;
        if (offsetX < 0) {
            return `${Math.abs(offsetOnHover)}px`;
        }
        return `-${offsetOnHover}px`;
    }
    return '0px';
};

const heightOffsetCalc = (line, dotScaleSize, offsetLine) => {
    if (Math.abs(line) < offsetLine) {
    const horizontalLine = 1 - Math.abs(line) / offsetLine;
    const calc = horizontalLine * (dotScaleSize - 1);
    const dotSize = (calc + '').split ('.') [1];
    return `1.${dotSize}`
    }
    return 1;
};

const calculateColor = (n, list1, list2) => {
    return list2.map((x, i) => {
        if (x === list1[i]) return x;
        return x + (list1[i] - x) * n;
    });
};

const getColor = (line, cycle, offsetLine, fillStyle) => {
    const horizontalLine = 1 - Math.abs(line) / offsetLine;
    if (horizontalLine > 0) {
        const currentColor = fillStyle[cycle % 2 ? 'first' : 'second'].replace(/[^\d,]/g, '').split(',');
        const secondColor = fillStyle[cycle % 2 ? 'second' : 'first'].replace(/[^\d,]/g, '').split(',');
        const color = calculateColor(horizontalLine, currentColor.map(Number), secondColor.map(Number));
        return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
};

const Preloader = ({
                      duration = 1500,
                      offsetLine = 50,
                      dotScaleSize = 1.4,
                      dotHorizontalOffset = 0.05,
                      restartDelay = 0,
                      fillStyle = {
                          first: 'rgb(55, 164, 255)',
                          second: 'rgb(255,255,255',
                      }
                  }) => {
    let startTime = new Date().getTime();
    const svgRef = React.createRef();
    const lineRef = useRef(null);
    const heightLineRef = useRef(null);
    const pathOffsets = [];
    let cycle = 1;
    let customDuration = duration < 1000 ? 1000 : duration
    let endPos = null

    useEffect(() => {
        endPos = document.getElementById('enface-preloader')?.clientHeight 
    }, [])

    const stopAnimation = async () => {
        startTime = null;
        cycle++;
        await new Promise(resolve => setTimeout(resolve, restartDelay));
        startTime = new Date().getTime();
    };

    const render = (time) => {
        if (startTime === null || !lineRef.current || !endPos) return;
        const lineTopOffset = lineRef.current.getBoundingClientRect().top + window.scrollY;
        pathOffsets.forEach((dot) => {
            const differenceSize = lineTopOffset - dot.offsetY;
            dot.path.style.transform = `scale(${heightOffsetCalc(differenceSize, dotScaleSize, offsetLine, dot.offsetY)}) translateX(${dot.offsetX > 8 || dot.offsetX < -8 ? offsetCalc(differenceSize, dot.offsetX, offsetLine, dotHorizontalOffset) : 0})`;
            if (lineTopOffset >= dot.offsetY && differenceSize < offsetLine) {
                dot.path.style.fill = getColor(differenceSize, cycle, offsetLine, fillStyle);
                //  lineTopOffset >= dot.offsetY && differenceSize < offsetLine * 2 - bottom line
            }
        });
        const newOffset = (((new Date().getTime() - startTime) / customDuration) * endPos) % endPos;
        if ((new Date().getTime() - startTime) / customDuration > 1) {
            return stopAnimation();
        }
        lineRef.current.style.bottom = `${newOffset}px`;
    };
    const animationLoop = () => {
        render();
        requestAnimationFrame(animationLoop);
    };
    useEffect(() => {
        const heightOffset = heightLineRef.current.getBoundingClientRect().left;
        svgRef.current.childNodes.forEach(path => {
            pathOffsets.push({
                offsetY: path.getBoundingClientRect().top + window.scrollY,
                offsetX: heightOffset - path.getBoundingClientRect().left,
                path,
            });
        });
        animationLoop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="widget-animation" id='enface-preloader'>
            <div style={{padding: `${offsetLine}px 0`}}>
            <LogoIcon ref={svgRef} />
            </div>
            <div ref={lineRef} className="widget-stroke"/>
            <div ref={heightLineRef} className="widget-stroke-top"/>
        </div>
    );
};

export default Preloader;
