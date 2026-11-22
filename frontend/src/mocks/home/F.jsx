import { useState } from 'react';
import { BookOpen, Castle, History, LogOut, Play, Plus, Users, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { session, gameList } from '@/mocks/fixtures';
import backgroundHtml from '@/components/home/villageBackground.html?raw';
import { Layout, MessageBox, Ornament, Panel, dangerBtn, outlineBtn, primaryBtn, useBodyTheme } from '../shell/kit/F.jsx';

// The campfire iframe is the real page background (same srcDoc as pages/Home.jsx).
// Its colours are CSS vars scoped to [data-bs-theme] inside the iframe document, which the real page
// never sets: the scene renders as black silhouettes and no sky. The mock sets the attribute on the
// iframe's <html> from the body theme, so the scene is coloured and follows light/dark.
// Global `a` rules would override the button colours on dark, so the link buttons get a scoped rule.
const CSS = `
[data-bs-theme] a.vf-btn { text-decoration: none; }
[data-bs-theme] a.vf-btn-primary { color: var(--f-on-felt); }
[data-bs-theme] a.vf-btn-outline { color: var(--f-ink); }
[data-bs-theme] a.vf-btn-danger { color: var(--f-wax-text); }
`;

const LINK = 'inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-base';

function Block({ title, icon: Icon, children }) {
  return (
    <Panel className="flex flex-col gap-4 p-6">
      <h2 className="vf-title flex items-center gap-2 text-xl vf-rubric">
        <Icon className="size-5 vf-brass-text" aria-hidden="true" />
        {title}
      </h2>
      <Ornament />
      <div className="flex flex-col gap-3">{children}</div>
    </Panel>
  );
}

export default function MockHomeF() {
  const username = session.user.username;
  const game = gameList.game;
  // Local switcher to show both notice states.
  const [playing, setPlaying] = useState(true);
  const theme = useBodyTheme();
  const html = backgroundHtml.replace('<html lang="en">', `<html lang="en" data-bs-theme="${theme}">`);

  return (
    <Layout user={username} transparent>
      <style>{CSS}</style>
      <iframe
        id="background"
        title="background"
        srcDoc={html}
        className="fixed inset-0 z-[-1] h-full w-full border-none"
      />

      <div className="flex flex-col gap-8 md:pt-6">
        <Panel className="flex flex-col gap-4 p-6">
          <h1 className="vf-display text-2xl sm:text-3xl">
            Welcome back, <span className="vf-rubric">{username}</span>
          </h1>

          <div role="group" aria-label="Preview state" className="flex flex-wrap gap-2 text-sm">
            <button
              type="button"
              aria-pressed={playing}
              onClick={() => setPlaying(true)}
              className={cn(playing ? primaryBtn : outlineBtn, 'px-3 py-1.5 text-sm')}
            >
              Playing
            </button>
            <button
              type="button"
              aria-pressed={!playing}
              onClick={() => setPlaying(false)}
              className={cn(!playing ? primaryBtn : outlineBtn, 'px-3 py-1.5 text-sm')}
            >
              Not playing
            </button>
          </div>

          {playing ? (
            <MessageBox
              kind="info"
              title="You are currently playing a match"
              details={
                <span className="flex flex-col gap-3">
                  <span>
                    Game <strong className="font-bold">{game.public_ID}</strong>
                  </span>
                  <span className="text-[15px] vf-ink2">Round {game.rounds} · phase {game.phase}</span>
                  <a href={`/village/${game.public_ID}`} className={cn(primaryBtn, LINK, 'sm:w-auto')}>
                    <Play className="size-4" aria-hidden="true" />
                    Join your village
                  </a>
                </span>
              }
            />
          ) : (
            <MessageBox kind="warning" title="You are not currently playing in any game" />
          )}
        </Panel>

        {/* md+: the two blocks flank the campfire, which sits in the middle of the fixed background (single column on mobile ignores the gap). */}
        <section className="grid gap-6 md:grid-cols-2" style={{ columnGap: "min(32vw, 480px)" }}>
          <Block title="Habitant" icon={UserRound}>
            <a href="/habitant/me" className={cn(primaryBtn, LINK)}>
              <UserRound className="size-4" aria-hidden="true" />
              Personal Area
            </a>
            <a href="/habitant/" className={cn(primaryBtn, LINK)}>
              <History className="size-4" aria-hidden="true" />
              Statistics and History
            </a>
            <a href="/logout" className={cn(dangerBtn, LINK)}>
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </a>
          </Block>

          <Block title="Village" icon={Castle}>
            <a href="/rules" className={cn(primaryBtn, LINK)}>
              <BookOpen className="size-4" aria-hidden="true" />
              Rulebook
            </a>
            <a href="/newVillage" className={cn(primaryBtn, LINK)}>
              <Plus className="size-4" aria-hidden="true" />
              Create a village
            </a>
            <a href="/village" className={cn(outlineBtn, LINK)}>
              <Users className="size-4" aria-hidden="true" />
              Join your village
            </a>
          </Block>
        </section>
      </div>
    </Layout>
  );
}
