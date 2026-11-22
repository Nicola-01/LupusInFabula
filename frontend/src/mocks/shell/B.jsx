import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { session } from '@/mocks/fixtures';
import {
  Footer, MessageBox, Navbar, PageTitle, Panel, Stage, TableButton, ThemeToggle, Token,
} from './kit/B.jsx';

// Demo only: each state is shown stacked with a label. Sections get bottom margin so open menus don't cover the next label.
function Section({ label, children, className = '' }) {
  return (
    <section className={`mb-40 ${className}`}>
      <p className="mb-2 font-bold uppercase tracking-widest text-xs text-[var(--b-text)] opacity-80">{label}</p>
      {children}
    </section>
  );
}

export default function MockShellB() {
  const username = session.user.username;

  return (
    <Stage>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <PageTitle>Shell · variant B</PageTitle>

        <Section label="1. Navbar, logged in (user menu open)">
          <Navbar user={username} menuDefaultOpen />
        </Section>

        <Section label="2. Navbar, logged out">
          <Navbar user={null} />
        </Section>

        <Section label="3. Player search, results open">
          <Navbar user={username} searchDefaultOpen />
        </Section>

        <Section label="4. Popups: error, info, warning, success">
          <div className="grid gap-6 md:grid-cols-2">
            <MessageBox kind="error" title="Invalid game" code="EGME9" details="The game code does not match any village." />
            <MessageBox kind="info" title="Village created" details="Share the code with your players so they can join." />
            <MessageBox kind="warning" title="Night is ending" details="Two players have not voted yet." />
            <MessageBox kind="success" title="Settings saved" details="The new roles will apply from the next game." />
          </div>
        </Section>

        <Section label="5. Dialog (open on click)">
          <div className="flex flex-wrap items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <TableButton>Open dialog</TableButton>
              </DialogTrigger>
              <DialogContent className="variant-B vb-paper max-w-md p-6">
                <DialogHeader>
                  <DialogTitle className="vb-display text-xl">Leave the village?</DialogTitle>
                  <DialogDescription className="text-base text-[var(--b-ink)]">
                    You will lose your seat at the table. You can join again while the game is in setup.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <TableButton variant="ghost">Cancel</TableButton>
                  <TableButton>Leave</TableButton>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Section>

        <Section label="5b. Dialog (static look)">
          <div className="vb-paper max-w-md p-6">
            <p className="vb-display text-xl">Leave the village?</p>
            <p className="mt-2 text-base">You will lose your seat at the table. You can join again while the game is in setup.</p>
            <div className="mt-6 flex justify-end gap-2">
              <TableButton variant="ghost" className="text-[var(--b-ink)]">Cancel</TableButton>
              <TableButton>Leave</TableButton>
            </div>
          </div>
        </Section>

        <Section label="6. Toast (sonner)">
          <Toaster />
          <TableButton onClick={() => toast.success('Vote recorded')}>Show toast</TableButton>
        </Section>

        <Section label="7. Theme toggle and tokens">
          <div className="flex items-center gap-4">
            <ThemeToggle className="border-2 border-[var(--b-brass)] rounded-full" />
            <Token>W</Token>
            <Token tone="pin">!</Token>
            <Token tone="brass">D</Token>
            <Panel rotate="rotate-1" className="max-w-xs">
              <p className="text-base">Pinned parchment: the content container.</p>
            </Panel>
          </div>
        </Section>
      </main>

      <Footer />
    </Stage>
  );
}
