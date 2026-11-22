import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import '../styles/pageNotFound.css';

/*
 * Random decorations, same formulas as js/pageNotFound.js. The old code positioned elements with jQuery
 * `.each` + `:nth-child(i)` with a 0-based i: the first 24 trees and the first 149 stars were styled,
 * the last tree and the last star were left unstyled. Kept as is.
 */
function randomTree() {
    const treeHeight = Math.floor(Math.random() * 2 + 3);
    const nNodes = treeHeight * 4 + 1;
    const posNodesH = new Array(nNodes);
    const posNodesW = new Array(nNodes);
    const nodeH = 100 / treeHeight;
    const internalNodeH = Math.floor(Math.random() * 4 + 25 / treeHeight);
    const nodeW = 50 / treeHeight;
    const internalNodeW = Math.floor(Math.random() * 3 + 27 / treeHeight);

    posNodesH[0] = 0;
    posNodesW[0] = 50;
    for (let j = 1; j <= treeHeight * 2; j++) {
        if (j % 2 === 1) {
            posNodesH[j] = posNodesH[j - 1] + nodeH;
            posNodesW[j] = posNodesW[j - 1] - nodeW;
        } else {
            posNodesH[j] = posNodesH[j - 1] - internalNodeH;
            posNodesW[j] = posNodesW[j - 1] + internalNodeW;
        }
        posNodesH[nNodes - j] = posNodesH[j];
        posNodesW[nNodes - j] = 100 - posNodesW[j];
    }
    const scaleH = 100 / Math.max(...posNodesH);
    const scaleW = 50 / (Math.max(...posNodesW) - 50);
    posNodesH[treeHeight * 2] = 100 / scaleH;
    posNodesW[treeHeight * 2] = 50;
    posNodesH[treeHeight * 2 + 1] = 100 / scaleH;
    posNodesW[treeHeight * 2 + 1] = 50;

    let points = '50% 0%,';
    for (let k = 1; k < nNodes; k++) {
        const posW = 50 + (posNodesW[k] - 50) * scaleW;
        points += posW + '% ' + posNodesH[k] * scaleH + '%, ';
    }
    points = points.substring(0, points.length - 2);

    const rX = Math.floor(Math.random() * 110 - 5);
    const rH = Math.random() * 10 + 15;
    const rW = Math.random() * 2 + 14;
    const rR = Math.floor(Math.random() * 3) * Math.cos(Math.PI * Math.round(Math.random()));
    return {
        style: {
            left: rX + 'vw',
            height: rH + 'em',
            width: rW + 'em',
            bottom: '3dvw',
            transform: `rotateZ(${rR}deg)`,
            clipPath: `polygon(${points})`,
        },
        className: 'tree' + (3 - (Math.floor(Math.random() * 5 + 1) % 3)),
    };
}

function buildScene() {
    const patches = Array.from({ length: 100 }, (_, i) => {
        const rX = Math.floor(Math.random() * 50);
        const rH = Math.floor(Math.random() * 10) + 15;
        return {
            left: i - 1 + 'vw',
            height: rH + 'vh',
            clipPath: `polygon(${rX}% ${rX}%, 0% 100%, 100% 100%)`,
        };
    });
    const trees = Array.from({ length: 25 }, (_, k) => (k < 24 ? randomTree() : null));
    const crosses = Array.from({ length: 3 }, () => {
        const rR = Math.floor(Math.random() * 15) * Math.cos(Math.PI * Math.round(Math.random()));
        return { transform: `rotateZ(${rR}deg)` };
    });
    const cryptR = Math.floor(Math.random() * 5) * Math.cos(Math.PI * Math.round(Math.random()));
    return { patches, trees, crosses, cryptTransform: `translateX(-50%) rotateZ(${cryptR}deg)` };
}

/**
 * 404 page (port of jsp/pageNotFound.jsp + js/pageNotFound.js + css/pageNotFound.css).
 * Also rendered by other pages for a not-found state. Export default.
 */
export default function PageNotFound() {
    const scene = useMemo(buildScene, []);
    const [stars, setStars] = useState([]);
    const [raised, setRaised] = useState(false); // title slides up (old $(".title").animate top 25%)
    const [life, setLife] = useState(false);     // old addClass("life") after the slide
    const [msgShown, setMsgShown] = useState(false); // old $(".msg").fadeIn(1000)

    useEffect(() => { document.title = 'Lupus - Page not found'; }, []);

    // Old css: body gradient (propagates to the canvas, so it also shows below the scene when the page is taller).
    useEffect(() => {
        const old = document.body.style.background;
        document.body.style.background = 'linear-gradient(0deg, #050514, #30336b)';
        return () => { document.body.style.background = old; };
    }, []);

    useEffect(() => {
        const H = document.documentElement.scrollHeight;
        const W = document.documentElement.scrollWidth;
        setStars(Array.from({ length: 150 }, (_, k) => (k < 149
            ? { top: Math.random() * H - H / 4, left: Math.random() * W }
            : null)));
        // two frames so the title's start position is painted before it moves
        const id = requestAnimationFrame(() => requestAnimationFrame(() => setRaised(true)));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <div className="lupus-not-found relative min-h-screen">
            <Navbar />
            <main id="pageNotFound">
                <div className="stars">
                    {Array.from({ length: 150 }, (_, i) => (
                        <div key={i} className="star" style={stars[i] || undefined} />
                    ))}
                </div>

                <div
                    className={`title${life ? ' life' : ''}`}
                    style={{ top: raised ? '25%' : '125vh' }}
                    onTransitionEnd={(e) => {
                        if (e.propertyName === 'top' && !life) {
                            setLife(true);
                            setMsgShown(true);
                        }
                    }}
                >404</div>
                <div className="gravestones">
                    {scene.crosses.map((style, i) => <div key={i} className="cross" style={style} />)}
                </div>
                <div className="bottompatch">
                    {scene.patches.map((style, i) => <div key={i} className="patch" style={style} />)}
                </div>

                <div className="trees">
                    {scene.trees.map((tree, i) => (
                        <div key={i} className={`tree ${tree ? tree.className : ''}`} style={tree ? tree.style : undefined} />
                    ))}
                </div>

                <div className={`msg${msgShown ? ' pnf-fade-in' : ''}`} style={{ display: msgShown ? 'block' : 'none' }}>
                    This page doesn't exist.
                </div>
                <div className="crypt" style={{ transform: scene.cryptTransform }}>
                    <div className="roof" />
                    <div className="body">
                        <div className="door" />
                    </div>
                </div>
                <div className="fogRed" />
                <div className="fogOrange" />
                <div className="moon" />
            </main>
        </div>
    );
}
