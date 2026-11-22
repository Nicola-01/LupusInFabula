import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { buildLog } from './gameLogic.js';

/** One log row: phase label + coloured text (old createActionBlock). */
function Row({ row }) {
    return (
        <li className="flex gap-2 py-1 text-[15px] leading-snug">
            <span className="phase w-20 shrink-0 text-sm text-lf-ink2">{row.label}</span>
            <span className="border-l-2 border-lf-brass pl-2">
                {row.pieces.map((p, i) => <span key={i} style={p.color ? { color: p.color } : undefined}>{p.text}</span>)}
            </span>
        </li>
    );
}

/** Night or day block of a round, summary by default, Expand / Reduce shows every action (old fDay / fNight). */
function PhaseBlock({ round, phase, data }) {
    const [full, setFull] = useState(false);
    if (data.ext.length === 0) return null;
    const rows = full ? data.ext : data.sum;
    return (
        <div className="py-1">
            <div className="flex items-center gap-2">
                <h3 className="font-lf-heading text-base font-bold capitalize">{phase}</h3>
                <span className="h-px flex-1 bg-lf-brass" aria-hidden="true" />
                <Button type="button" variant="brass" size="sm" id={`round-${round}-expand-${phase}`} className="min-h-11 min-w-24"
                        aria-expanded={full} onClick={() => setFull((x) => !x)}>
                    {full ? 'Reduce' : 'Expand'}
                </Button>
            </div>
            {rows.length > 0 && <ul className="m-0 list-none p-0 pt-1">{rows.map((r, i) => <Row key={i} row={r} />)}</ul>}
        </div>
    );
}

/** Village log: one accordion item per round, the last one open (old round tabs). */
export default function GameLog({ logs, master }) {
    const rounds = buildLog(logs, master);
    if (rounds.length === 0) return <p id="gameLog" className="text-[15px] text-lf-ink2">Nothing happened yet.</p>;
    return (
        <Accordion id="gameLog" type="multiple" defaultValue={[`round-${rounds.length}`]} key={rounds.length}>
            {[...rounds].reverse().map((r) => (
                <AccordionItem key={r.round} value={`round-${r.round}`} className="border-lf-brass">
                    <AccordionTrigger id={`round-${r.round}-tab`} className="min-h-11 font-lf-heading text-base">Round {r.round}</AccordionTrigger>
                    <AccordionContent>
                        <PhaseBlock round={r.round} phase="night" data={r.night} />
                        <PhaseBlock round={r.round} phase="day" data={r.day} />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
