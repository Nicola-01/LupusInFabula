import { TreePine } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { Button } from '@/components/ui/button';
import { Ornament, Panel, Seal } from '@/components/lupus';
import { useEffect } from 'react';
import '../styles/pageNotFound.css';

// Scene in SVG viewBox units; the tree/cross/lantern positions are the approved mock F.
const STARS = [[90, 40], [160, 90], [260, 30], [330, 110], [520, 50], [600, 20], [660, 70], [860, 30], [940, 80], [1060, 40], [1120, 120], [480, 120], [230, 150], [1000, 170]];

// Pine silhouette, base at (x, y), tiers via a sawtooth polygon.
function Pine({ x, y, h, className = 'nf-pine' }) {
  const w = h * 0.3;
  const pts = [
    [x, y - h],
    [x + w * 0.45, y - h * 0.6], [x + w * 0.2, y - h * 0.6],
    [x + w * 0.8, y - h * 0.3], [x + w * 0.35, y - h * 0.3],
    [x + w, y],
    [x - w, y],
    [x - w * 0.35, y - h * 0.3], [x - w * 0.8, y - h * 0.3],
    [x - w * 0.2, y - h * 0.6], [x - w * 0.45, y - h * 0.6],
  ];
  return (
    <g>
      <rect x={x - h * 0.035} y={y - 2} width={h * 0.07} height={h * 0.1} className="nf-wood2" />
      <polygon points={pts.map((p) => p.join(',')).join(' ')} className={className} />
    </g>
  );
}

// Leaning grave cross standing on y.
function Cross({ x, y, s, rot = 0 }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <rect x={x - 3} y={y - s} width={6} height={s} className="nf-stone" />
      <rect x={x - s * 0.3} y={y - s * 0.72} width={s * 0.6} height={6} className="nf-stone" />
    </g>
  );
}

function Scene() {
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
      {STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} className="nf-star" />)}
      <circle cx={860} cy={90} r={80} className="nf-glow" />
      <circle cx={860} cy={90} r={46} className="nf-moon" />

      <path d="M0 300 C160 250 300 280 470 300 S820 250 1000 290 S1150 270 1200 280 V420 H0Z" className="nf-hill" />
      <Pine x={90} y={340} h={180} className="nf-pine2" />
      <Pine x={190} y={342} h={150} className="nf-pine2" />
      <Pine x={700} y={336} h={160} className="nf-pine2" />
      <Pine x={930} y={338} h={190} className="nf-pine2" />
      <Pine x={1060} y={340} h={150} className="nf-pine2" />

      <path d="M0 352 C200 336 420 350 600 344 S980 334 1200 350 V420 H0Z" className="nf-ground" />
      <Cross x={640} y={360} s={40} rot={-5} />
      <Cross x={200} y={362} s={46} rot={4} />

      <Pine x={40} y={352} h={260} />
      <Pine x={140} y={356} h={200} />
      <Pine x={230} y={360} h={150} />
      <Pine x={850} y={352} h={230} />
      <Pine x={960} y={356} h={280} />
      <Pine x={1120} y={354} h={250} />

      {/* broken signpost: left board intact, right board hanging loose, pointing nowhere */}
      <rect x={428} y={170} width={12} height={190} className="nf-wood2" />
      <path d="M440 184 H350 L330 196 L350 208 H440 Z" className="nf-wood" />
      <g transform="rotate(16 440 236)">
        <path d="M440 226 H530 L552 238 L530 250 H440 Z" className="nf-wood" />
      </g>
      <line x1={396} y1={208} x2={396} y2={230} stroke="var(--nf-wood2)" strokeWidth={2} />
      <circle cx={396} cy={244} r={38} className="nf-lamp-glow motion-safe:animate-[nf-flicker_2.6s_ease-in-out_infinite]" />
      <rect x={388} y={232} width={16} height={20} rx={2} className="nf-lantern" />

      <Cross x={880} y={356} s={44} rot={6} />

      {/* wolf eyes in a bush, blinking */}
      <path d="M770 362 Q780 330 806 332 Q830 326 842 362 Z" className="nf-pine2" />
      <circle cx={802} cy={344} r={2.6} className="nf-eye motion-safe:animate-[nf-blink_6s_ease-in-out_infinite]" />
      <circle cx={814} cy={344} r={2.6} className="nf-eye motion-safe:animate-[nf-blink_6s_ease-in-out_infinite]" />

      <ellipse cx={600} cy={352} rx={520} ry={22} className="nf-fog" />
    </svg>
  );
}

// Link buttons: plain <a> with full page loads (backend redirects/filters still run). ! overrides the global a style.
const LINK_BTN = '!no-underline inline-flex w-full sm:w-auto';

/**
 * 404 page (React port of the approved mock F). Also rendered by CurrentGame and UserStatistics
 * for a not-found state, so it takes no props. Keep id="pageNotFound": Navbar forces the dark theme on it.
 */
export default function PageNotFound() {
  useEffect(() => { document.title = 'Lupus - Page not found'; }, []);

  return (
    <div className="lf-page min-h-screen">
      <Navbar />
      <main id="pageNotFound" className="lf-nf mx-auto w-full max-w-4xl px-4 pt-6 pb-12">
        <div className="relative h-72 overflow-hidden rounded-sm border-[3px] border-double border-lf-brass bg-[linear-gradient(to_bottom,var(--nf-top),var(--nf-mid)_60%,var(--nf-hor))] shadow-[0_6px_14px_rgba(60,40,20,.18)] sm:h-[26rem]">
          <Scene />
          <p aria-hidden="true" className="nf-404 absolute inset-x-0 top-4 text-center font-lf-title text-[clamp(5.5rem,24vw,11rem)] leading-none">
            404
          </p>
        </div>

        <Panel className="nf-torn relative z-10 mx-auto -mt-12 max-w-xl !border-t-0 px-6 pt-10 pb-8 text-center sm:-mt-16">
          <div className="flex justify-center">
            <Seal><TreePine className="size-5" aria-hidden="true" /></Seal>
          </div>
          <h1 className="mt-4 font-lf-title text-2xl font-bold sm:text-3xl">Folio CDIV not found</h1>
          <p className="mt-3 text-[17px] italic text-lf-ink2">
            This path leads deep into the woods… the wolves got here first.
          </p>
          <Ornament className="mx-auto mt-5 max-w-xs" />
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="felt" size="touch" className={`${LINK_BTN} !text-lf-on-felt`}>
              <a href="/home">Back to the village</a>
            </Button>
            <Button asChild variant="brass" size="touch" className={`${LINK_BTN} !text-lf-ink`}>
              <a href="/rules">Read the rulebook</a>
            </Button>
          </div>
        </Panel>
      </main>
    </div>
  );
}
